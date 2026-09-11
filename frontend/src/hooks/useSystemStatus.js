import { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { wsClient } from '../services/websocket';

export const useSystemStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const data = await apiService.getSystemStatus();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load system status');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();

    // Subscribe to WebSocket updates
    const unsubscribeStatus = wsClient.on('SYSTEM_STATUS_UPDATED', (data) => {
      setStatus((prev) => {
        if (!prev) return data;
        return {
          ...prev,
          metrics: {
            ...prev.metrics,
            ...data.metrics,
          }
        };
      });
    });

    const unsubscribeSolar = wsClient.on('SOLAR_CHANGED', (data) => {
      setStatus((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          metrics: {
            ...prev.metrics,
            solarGenKw: data.solarGenKw,
          }
        };
      });
    });

    const unsubscribeWind = wsClient.on('WIND_CHANGED', (data) => {
      setStatus((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          metrics: {
            ...prev.metrics,
            windGenKw: data.windGenKw,
          }
        };
      });
    });

    return () => {
      unsubscribeStatus();
      unsubscribeSolar();
      unsubscribeWind();
    };
  }, []);

  return { status, loading, error, refetch: fetchStatus };
};
