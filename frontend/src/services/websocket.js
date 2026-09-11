// WebSocket service with automatic fallback telemetry stream for OptiGrid-AI

class OptiGridWebSocketClient {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
    this.isConnected = false;
    this.reconnectInterval = 5000;
    this.mockTimer = null;
    this.wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';
  }

  connect() {
    try {
      this.ws = new WebSocket(this.wsUrl);

      this.ws.onopen = () => {
        console.log('OptiGrid WebSocket Connected:', this.wsUrl);
        this.isConnected = true;
        this.emit('connection_status', { isConnected: true });
        if (this.mockTimer) clearInterval(this.mockTimer);
      };

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const { type, data } = payload;
          this.emit(type, data);
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      this.ws.onerror = (err) => {
        console.warn('OptiGrid WebSocket error, falling back to simulated event stream');
        this.startFallbackSimulation();
      };

      this.ws.onclose = () => {
        this.isConnected = false;
        this.emit('connection_status', { isConnected: false });
        this.startFallbackSimulation();
      };
    } catch (e) {
      console.warn('OptiGrid WebSocket failed to initialize, running in simulation mode');
      this.startFallbackSimulation();
    }
  }

  startFallbackSimulation() {
    if (this.mockTimer) return;
    this.isConnected = false;
    
    // Emit periodic telemetry events every 6 seconds to simulate real-time bus fluctuations
    this.mockTimer = setInterval(() => {
      const solarVar = Math.round((26.4 + (Math.random() * 2 - 1)) * 10) / 10;
      const windVar = Math.round((15.3 + (Math.random() * 1.5 - 0.75)) * 10) / 10;
      const totalRen = Math.round((solarVar + windVar) * 10) / 10;
      const demandVar = Math.round((48.2 + (Math.random() * 1 - 0.5)) * 10) / 10;
      const batteryPower = Math.round((demandVar - totalRen) * 10) / 10;

      this.emit('SYSTEM_STATUS_UPDATED', {
        metrics: {
          currentDemandKw: demandVar,
          renewableGenKw: totalRen,
          solarGenKw: solarVar,
          windGenKw: windVar,
          batteryPowerKw: batteryPower,
          renewablePercent: Math.round((totalRen / demandVar) * 1000) / 10,
        }
      });

      this.emit('SOLAR_CHANGED', { solarGenKw: solarVar });
      this.emit('WIND_CHANGED', { windGenKw: windVar });
    }, 6000);
  }

  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType).add(callback);

    return () => {
      this.off(eventType, callback);
    };
  }

  off(eventType, callback) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).delete(callback);
    }
  }

  emit(eventType, data) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).forEach((cb) => cb(data));
    }
  }

  disconnect() {
    if (this.ws) this.ws.close();
    if (this.mockTimer) clearInterval(this.mockTimer);
  }
}

export const wsClient = new OptiGridWebSocketClient();
