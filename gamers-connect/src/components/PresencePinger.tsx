'use client';
import { useEffect, useRef, useState } from 'react';

type Status = 'ONLINE' | 'AWAY' | 'OFFLINE';

function broadcastStatus(status: Status) {
  try {
    localStorage.setItem('presence_status', status);
    // custom event for same-tab listeners
    window.dispatchEvent(new CustomEvent('presence-status', { detail: status }));
  } catch {}
}

export default function PresencePinger() {
  const [userId, setUserId] = useState<string | null>(null);
  const tokenRef = useRef<string | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    tokenRef.current = token;
    if (!token) return;

    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
    (async () => {
      try {
        let res = await fetch('/api/auth/verify', { headers, cache: 'no-store' });
        if (!res.ok) res = await fetch('/api/auth/profile', { headers, cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          const id = data?.user?.id ?? data?.id;
          if (id) setUserId(id);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (!userId || startedRef.current) return;
    startedRef.current = true;

    const ping = async (status: Status) => {
      try {
        await fetch('/api/presence', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(tokenRef.current ? { Authorization: `Bearer ${tokenRef.current}` } : {}),
          },
          body: JSON.stringify({ userId, status }),
          cache: 'no-store',
          keepalive: status === 'OFFLINE',
        });
        broadcastStatus(status); // <-- keep UI in sync
      } catch {}
    };

    // initial
    ping(document.hidden ? 'AWAY' : 'ONLINE');

    // keepalive
    const iv = setInterval(() => { if (!document.hidden) ping('ONLINE'); }, 60_000);

    // visibility / focus / page restore
    const onVis = () => ping(document.hidden ? 'AWAY' : 'ONLINE');
    const onFocus = () => ping('ONLINE');
    const onPageShow = () => !document.hidden && ping('ONLINE');

    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', onFocus);
    window.addEventListener('pageshow', onPageShow);

    // OFFLINE on unload
    const onUnload = () => {
      try {
        const blob = new Blob([JSON.stringify({ userId, status: 'OFFLINE' })], { type: 'application/json' });
        navigator.sendBeacon('/api/presence', blob);
      } catch {}
      broadcastStatus('OFFLINE');
    };
    window.addEventListener('pagehide', onUnload);
    window.addEventListener('beforeunload', onUnload);

    return () => {
      clearInterval(iv);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('pageshow', onPageShow);
      window.removeEventListener('pagehide', onUnload);
      window.removeEventListener('beforeunload', onUnload);
      // no explicit OFFLINE here (strict-mode safe)
    };
  }, [userId]);

  return null;
}
