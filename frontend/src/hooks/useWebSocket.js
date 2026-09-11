import { useEffect, useState } from 'react';
import { wsClient } from '../services/websocket';

export const useWebSocket = (eventType, callback) => {
  const [isConnected, setIsConnected] = useState(wsClient.isConnected);

  useEffect(() => {
    // Connect client on mount
    wsClient.connect();

    const unsubscribeConn = wsClient.on('connection_status', (data) => {
      setIsConnected(data.isConnected);
    });

    let unsubscribeEvent = () => {};
    if (eventType && callback) {
      unsubscribeEvent = wsClient.on(eventType, callback);
    }

    return () => {
      unsubscribeConn();
      unsubscribeEvent();
    };
  }, [eventType, callback]);

  return { isConnected };
};
