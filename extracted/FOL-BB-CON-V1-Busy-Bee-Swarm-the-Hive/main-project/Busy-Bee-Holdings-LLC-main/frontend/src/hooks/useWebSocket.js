import { useState, useEffect, useCallback, useRef } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

export function useWebSocket(token) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttempts = useRef(0);

  const connect = useCallback(() => {
    if (!token) return;

    const wsUrl = `${WS_URL}/ws?token=${token}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('🔗 WebSocket connected');
      setIsConnected(true);
      setError(null);
      reconnectAttempts.current = 0;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastMessage(data);

        // Handle different event types
        switch (data.type) {
          case 'connected':
            console.log('✅ WebSocket ready:', data.data.message);
            break;
          case 'new_notification':
            // Dispatch custom event for notification
            window.dispatchEvent(new CustomEvent('ws:notification', { detail: data.data }));
            break;
          case 'goal_update':
            window.dispatchEvent(new CustomEvent('ws:goal', { detail: data.data }));
            break;
          case 'task_update':
            window.dispatchEvent(new CustomEvent('ws:task', { detail: data.data }));
            break;
          case 'finance_update':
            window.dispatchEvent(new CustomEvent('ws:finance', { detail: data.data }));
            break;
          case 'announcement':
            window.dispatchEvent(new CustomEvent('ws:announcement', { detail: data.data }));
            break;
          default:
            break;
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    ws.onerror = (err) => {
      console.error('❌ WebSocket error:', err);
      setError(err);
    };

    ws.onclose = () => {
      console.log('🔌 WebSocket disconnected');
      setIsConnected(false);

      // Auto-reconnect with exponential backoff
      if (reconnectAttempts.current < 5) {
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
        console.log(`🔄 Reconnecting in ${delay}ms...`);
        reconnectTimeoutRef.current = setTimeout(connect, delay);
        reconnectAttempts.current++;
      }
    };
  }, [token]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
  }, []);

  const send = useCallback((data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    } else {
      console.warn('WebSocket not connected');
    }
  }, []);

  const ping = useCallback(() => {
    send({ type: 'ping' });
  }, [send]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    isConnected,
    lastMessage,
    error,
    send,
    ping,
    connect,
    disconnect,
  };
}

// Hook for real-time notifications
export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const handleNotification = (event) => {
      const notification = event.detail;
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    window.addEventListener('ws:notification', handleNotification);
    return () => window.removeEventListener('ws:notification', handleNotification);
  }, []);

  const markAsRead = useCallback((id) => {
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    clearAll,
  };
}

// Hook for real-time goal updates
export function useRealtimeGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleGoalUpdate = (event) => {
      const goalData = event.detail;
      setGoals((prev) => {
        const index = prev.findIndex((g) => g.id === goalData.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = goalData;
          return updated;
        }
        return [goalData, ...prev];
      });
    };

    window.addEventListener('ws:goal', handleGoalUpdate);
    return () => window.removeEventListener('ws:goal', handleGoalUpdate);
  }, []);

  return { goals, setGoals, loading };
}

// Hook for real-time task updates
export function useRealtimeTasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const handleTaskUpdate = (event) => {
      const taskData = event.detail;
      setTasks((prev) => {
        const index = prev.findIndex((t) => t.id === taskData.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = taskData;
          return updated;
        }
        return [taskData, ...prev];
      });
    };

    window.addEventListener('ws:task', handleTaskUpdate);
    return () => window.removeEventListener('ws:task', handleTaskUpdate);
  }, []);

  return { tasks, setTasks };
}
