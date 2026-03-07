import { useEffect, useRef, useState } from 'react';
import { tokenStorage } from '@/lib/api';

// ─── Types ────────────────────────────────────────────────────────────────

export interface OrderStatusEvent {
    toStatus: string;
    actorType: string;
    note: string | null;
    createdAt: string;
}

const API_BASE_URL =
    (process.env['EXPO_PUBLIC_API_URL'] ?? 'http://localhost:8080') + '/api/v1';

// ─── Hook ──────────────────────────────────────────────────────────────────

/**
 * Subscribes to real-time order status updates via SSE.
 * Returns the latest status event received, or null if none yet.
 * Automatically cleans up the connection on unmount or when orderId changes.
 */
export function useOrderTracking(orderId: string | null | undefined) {
    const [latestEvent, setLatestEvent] = useState<OrderStatusEvent | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const eventSourceRef = useRef<EventSource | null>(null);

    useEffect(() => {
        if (!orderId) return;

        let active = true;

        async function connect() {
            const accessToken = await tokenStorage.getAccessToken();
            if (!active || !accessToken) return;

            // EventSource does not support custom headers natively — pass token as query param
            const url = `${API_BASE_URL}/orders/${orderId}/track?token=${encodeURIComponent(accessToken)}`;
            const source = new EventSource(url);
            eventSourceRef.current = source;

            source.addEventListener('order-status', (event) => {
                if (!active) return;
                try {
                    const parsed = JSON.parse(event.data) as OrderStatusEvent;
                    setLatestEvent(parsed);
                } catch {
                    // Ignore malformed events
                }
            });

            source.addEventListener('open', () => {
                if (active) setIsConnected(true);
            });

            source.addEventListener('error', () => {
                if (active) setIsConnected(false);
            });
        }

        connect();

        return () => {
            active = false;
            setIsConnected(false);
            eventSourceRef.current?.close();
            eventSourceRef.current = null;
        };
    }, [orderId]);

    return { latestEvent, isConnected };
}
