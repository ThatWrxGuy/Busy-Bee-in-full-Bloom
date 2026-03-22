// Busy Bee — Push Notification Service
// frontend/src/services/push.js
//
// Uses the Web Push / Service Worker Notification API.
// No third-party SDK — just the browser's native PushManager.
//
// HOW IT WORKS:
//   1. App registers a service worker (public/sw.js)
//   2. On first load, requests notification permission
//   3. Subscribes to push via PushManager with your VAPID public key
//   4. Sends the subscription to your backend (POST /push/subscribe)
//   5. Backend stores it and sends pushes via web-push library
//
// SETUP:
//   npm install web-push          (backend only)
//   npx web-push generate-vapid-keys  → paste into .env

// ─── Permission + Subscription ───────────────────────────────────────────────

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export async function requestPushPermission() {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export async function subscribeToPush() {
  if (!VAPID_PUBLIC_KEY) {
    console.warn('VITE_VAPID_PUBLIC_KEY not set — push disabled');
    return null;
  }

  const granted = await requestPushPermission();
  if (!granted) return null;

  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();

  if (!sub) {
    sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
  }

  // Send to backend
  try {
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(sub.toJSON()),
    });
  } catch (e) {
    console.error('Could not register push subscription', e);
  }

  return sub;
}

export async function unsubscribeFromPush() {
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  if (sub) {
    await sub.unsubscribe();
    await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ endpoint: sub.endpoint }),
    });
  }
}

export async function getPushSubscriptionStatus() {
  if (!('serviceWorker' in navigator)) return { supported: false };
  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.getSubscription();
  return {
    supported: true,
    permission: Notification.permission,
    subscribed: !!sub,
  };
}
