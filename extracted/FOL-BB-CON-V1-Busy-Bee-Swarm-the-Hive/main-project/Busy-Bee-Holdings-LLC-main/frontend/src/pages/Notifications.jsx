/**
 * Busy Bee Notifications - Design System Implementation
 */

import { useState, useEffect } from 'react';
import {
  FiBell,
  FiCheck,
  FiTrash2,
  FiMessageSquare,
  FiCalendar,
  FiAlertCircle,
} from 'react-icons/fi';
import {
  PageContainer,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  LoadingOverlay,
} from '../components';

const mockNotifications = [
  {
    id: 1,
    type: 'goal',
    title: 'Goal deadline approaching',
    desc: 'Run 5K is due in 2 days',
    time: '2h ago',
    read: false,
  },
  {
    id: 2,
    type: 'social',
    title: 'New comment',
    desc: 'Jane commented on your progress',
    time: '5h ago',
    read: false,
  },
  {
    id: 3,
    type: 'system',
    title: 'Weekly summary ready',
    desc: 'Your weekly analytics are available',
    time: '1d ago',
    read: true,
  },
  {
    id: 4,
    type: 'reminder',
    title: 'Daily meditation',
    desc: "Don't forget your morning meditation",
    time: '2d ago',
    read: true,
  },
];

const ICONS = {
  goal: FiCalendar,
  social: FiMessageSquare,
  system: FiAlertCircle,
  reminder: FiBell,
};

function Notifications() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const markAsRead = (id) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => !n.read);

  if (loading) return <LoadingOverlay message="Loading notifications..." />;

  return (
    <PageContainer title="Notifications" subtitle="Stay updated on your progress">
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {['all', 'unread'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f ? 'bg-primary text-white' : 'bg-secondary text-foreground'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <Button variant="ghost" size="sm">
          Mark all read
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {filtered.length > 0 ? (
            filtered.map((notif) => {
              const Icon = ICONS[notif.type];
              return (
                <div
                  key={notif.id}
                  className={`flex items-start gap-4 p-4 border-b border-border last:border-0 ${!notif.read ? 'bg-primary/5' : ''}`}
                >
                  <div className="p-2 rounded-lg bg-secondary">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{notif.title}</p>
                      {!notif.read && (
                        <Badge variant="success" className="text-xs">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-foreground-muted">{notif.desc}</p>
                    <p className="text-xs text-foreground-muted mt-1">{notif.time}</p>
                  </div>
                  {!notif.read && (
                    <Button variant="ghost" size="sm" onClick={() => markAsRead(notif.id)}>
                      <FiCheck className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-foreground-muted">No notifications</div>
          )}
        </CardContent>
      </Card>
    </PageContainer>
  );
}

export default Notifications;
