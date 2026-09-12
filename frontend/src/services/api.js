import axios from 'axios';
import {
  initialSystemStatus,
  generate24HourForecast,
  batteryDetailsMock,
  fuelIntelligenceMock,
  loadManagementMock,
  initialAlerts,
  runMockOptimization,
  runMockSimulation,
} from './mockData';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // GET /api/system/status
  getSystemStatus: async () => {
    try {
      const response = await apiClient.get('/system/status');
      return response.data;
    } catch (err) {
      console.warn('API /system/status unreachable, returning mock data:', err.message);
      return initialSystemStatus;
    }
  },

  // GET /api/forecast
  getForecast: async (params) => {
    try {
      const response = await apiClient.get('/forecast', { params });
      return response.data;
    } catch (err) {
      console.warn('API /forecast unreachable, returning mock data:', err.message);
      return generate24HourForecast();
    }
  },

  // GET /api/battery
  getBatteryStatus: async () => {
    try {
      const response = await apiClient.get('/battery');
      return response.data;
    } catch (err) {
      console.warn('API /battery unreachable, returning mock data:', err.message);
      return batteryDetailsMock;
    }
  },

  // POST /api/battery/storm-mode
  toggleStormMode: async (active) => {
    try {
      const response = await apiClient.post('/battery/storm-mode', { active });
      return response.data;
    } catch (err) {
      console.warn('API /battery/storm-mode unreachable:', err.message);
      return { status: 'success', isStormModeActive: active };
    }
  },

  // GET /api/fuel
  getFuelStatus: async () => {
    try {
      const response = await apiClient.get('/fuel');
      return response.data;
    } catch (err) {
      console.warn('API /fuel unreachable, returning mock data:', err.message);
      return fuelIntelligenceMock;
    }
  },

  // GET /api/loads
  getLoadStatus: async () => {
    try {
      const response = await apiClient.get('/loads');
      return response.data;
    } catch (err) {
      console.warn('API /loads unreachable, returning mock data:', err.message);
      return loadManagementMock;
    }
  },

  // GET /api/dispatch/latest
  getLatestDispatch: async () => {
    try {
      const response = await apiClient.get('/dispatch/latest');
      return response.data;
    } catch (err) {
      console.warn('API /dispatch/latest unreachable, returning mock data:', err.message);
      return initialSystemStatus.liveDispatch;
    }
  },

  // GET /api/dispatch/history
  getDispatchHistory: async () => {
    try {
      const response = await apiClient.get('/dispatch/history');
      return response.data;
    } catch (err) {
      console.warn('API /dispatch/history unreachable, returning mock data:', err.message);
      return generate24HourForecast().slice(0, 24);
    }
  },

  // GET /api/alerts
  getAlerts: async () => {
    try {
      const response = await apiClient.get('/alerts');
      return response.data;
    } catch (err) {
      console.warn('API /alerts unreachable, returning mock data:', err.message);
      return initialAlerts;
    }
  },

  // POST /api/optimize
  runOptimization: async (payload) => {
    try {
      const response = await apiClient.post('/optimize', payload);
      return response.data;
    } catch (err) {
      console.warn('API /optimize unreachable, executing client-side mock optimization:', err.message);
      // Simulate network delay for realistic UX feedback
      await new Promise((resolve) => setTimeout(resolve, 800));
      return runMockOptimization(payload);
    }
  },

  // POST /api/simulation/run
  runSimulation: async (payload) => {
    try {
      const response = await apiClient.post('/simulation/run', payload);
      return response.data;
    } catch (err) {
      console.warn('API /simulation/run unreachable, executing client-side mock simulation:', err.message);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return runMockSimulation(payload);
    }
  },

  // POST /api/weather/refresh
  refreshWeather: async () => {
    try {
      const response = await apiClient.post('/weather/refresh');
      return response.data;
    } catch (err) {
      console.warn('API /weather/refresh unreachable, returning updated mock weather:', err.message);
      return {
        status: 'success',
        weather: {
          condition: 'Sunny / Clear',
          temperatureC: 29.2,
          solarIrradianceWm2: 890,
          windSpeedMs: 8.1,
          lastUpdated: new Date().toISOString(),
        }
      };
    }
  },

  // GET /api/location
  getLocation: async () => {
    try {
      const response = await apiClient.get('/location');
      return response.data;
    } catch (err) {
      console.warn('API /location unreachable, returning fallback defaults:', err.message);
      return {
        activeLocation: {
          id: 'baramati',
          name: 'Baramati Rural',
          district: 'Pune District',
          state: 'Maharashtra',
          country: 'India',
          latitude: 18.15,
          longitude: 74.58,
          climate: 'Semi-Arid Agro Basin',
          community: 'Farming & Agro-Processing Microgrid',
        },
        presets: [
          {
            id: 'baramati',
            name: 'Baramati Rural',
            district: 'Pune District',
            state: 'Maharashtra',
            country: 'India',
            latitude: 18.15,
            longitude: 74.58,
            climate: 'Semi-Arid Agro Basin',
            community: 'Farming & Agro-Processing Microgrid',
          },
          {
            id: 'dhordo',
            name: 'Dhordo, Kutch',
            district: 'Kutch District',
            state: 'Gujarat',
            country: 'India',
            latitude: 23.83,
            longitude: 69.57,
            climate: 'Arid Salt Marsh & High Solar Desert',
            community: 'Remote Border Crafts & Tourism Microgrid',
          },
          {
            id: 'rameshwaram',
            name: 'Rameshwaram Coastal',
            district: 'Ramanathapuram District',
            state: 'Tamil Nadu',
            country: 'India',
            latitude: 9.28,
            longitude: 79.31,
            climate: 'Tropical Maritime & High Wind Corridor',
            community: 'Coastal Fishing & Desalination Microgrid',
          },
          {
            id: 'hampi',
            name: 'Hampi Rural',
            district: 'Vijayanagara District',
            state: 'Karnataka',
            country: 'India',
            latitude: 15.33,
            longitude: 76.46,
            climate: 'Hot Semi-Arid Plateau',
            community: 'Heritage Tourism & Agrarian Cluster',
          },
          {
            id: 'pokhran',
            name: 'Pokhran Thar Microgrid',
            district: 'Jaisalmer District',
            state: 'Rajasthan',
            country: 'India',
            latitude: 26.92,
            longitude: 71.91,
            climate: 'Extreme Arid Thar Desert',
            community: 'Off-Grid Pastoral Desert Settlement',
          },
        ],
      };
    }
  },

  // POST /api/location
  updateLocation: async (payload) => {
    try {
      const response = await apiClient.post('/location', payload);
      return response.data;
    } catch (err) {
      console.warn('API /location unreachable, executing client fallback:', err.message);
      return {
        status: 'success',
        activeLocation: payload,
        weatherSource: 'FALLBACK',
      };
    }
  },
};
