import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DataPoint {
  timestamp: string;
  value: number;
  isAnomaly: boolean;
  id: string;
  feedback?: 'positive' | 'negative';
  explanation?: {
    type: 'spike' | 'drop' | 'seasonality_break';
    confidence: number;
    features: Array<{ name: string; contribution: number }>;
  };
}

interface UserSettings {
  username: string;
  email: string;
  darkMode: boolean;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    slack: boolean;
  };
  security: {
    twoFactor: boolean;
    apiKeyExpiry: number;
    ipWhitelist: string[];
  };
  data: {
    autoBackup: boolean;
    retentionPeriod: number;
    compressionEnabled: boolean;
  };
}

interface SystemMetrics {
  memoryUsage: number;
  inferenceTime: number;
  dataProcessed: number;
  lastUpdated: string;
}

interface AnomalyStore {
  selectedDataset: string;
  selectedModel: string;
  data: DataPoint[];
  isLiveMode: boolean;
  userSettings: UserSettings;
  systemMetrics: SystemMetrics;
  modelComparison: {
    [key: string]: {
      accuracy: number;
      precision: number;
      recall: number;
      f1Score: number;
    };
  };
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setSelectedDataset: (dataset: string) => void;
  setSelectedModel: (model: string) => void;
  toggleLiveMode: () => void;
  addDataPoint: (point: DataPoint) => void;
  setFeedback: (id: string, feedback: 'positive' | 'negative') => void;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  updateSystemMetrics: (metrics: Partial<SystemMetrics>) => void;
  setData: (data: DataPoint[]) => void;
}

const defaultSettings: UserSettings = {
  username: 'Demo User',
  email: 'demo@example.com',
  darkMode: false,
  language: 'en',
  notifications: {
    email: true,
    push: true,
    slack: false,
  },
  security: {
    twoFactor: false,
    apiKeyExpiry: 30,
    ipWhitelist: [],
  },
  data: {
    autoBackup: true,
    retentionPeriod: 90,
    compressionEnabled: true,
  },
};

const generateMockData = (): DataPoint[] => {
  return Array.from({ length: 100 }, (_, i) => ({
    id: `dp-${i}`,
    timestamp: new Date(Date.now() - (100 - i) * 3600000).toISOString(),
    value: Math.sin(i * 0.1) * 10 + Math.random() * 2 + 20,
    isAnomaly: i === 30 || i === 70,
    explanation: i === 30 || i === 70 ? {
      type: Math.random() > 0.5 ? 'spike' : 'drop',
      confidence: 0.85 + Math.random() * 0.1,
      features: [
        { name: 'Price Change', contribution: 60 },
        { name: 'Volume', contribution: 40 },
      ],
    } : undefined,
  }));
};

export const useAnomalyStore = create<AnomalyStore>()(
  persist(
    (set, get) => ({
      selectedDataset: 'server_logs',
      selectedModel: 'isolation_forest',
      data: generateMockData(),
      isLiveMode: false,
      theme: 'light',
      userSettings: defaultSettings,
      systemMetrics: {
        memoryUsage: 45,
        inferenceTime: 0.23,
        dataProcessed: 15000,
        lastUpdated: new Date().toISOString(),
      },
      modelComparison: {
        isolation_forest: {
          accuracy: 97.8,
          precision: 95.2,
          recall: 94.5,
          f1Score: 94.8,
        },
        lstm_autoencoder: {
          accuracy: 96.5,
          precision: 94.8,
          recall: 93.2,
          f1Score: 94.0,
        },
        prophet: {
          accuracy: 95.2,
          precision: 93.5,
          recall: 92.8,
          f1Score: 93.1,
        },
      },

      setSelectedDataset: (dataset) => set({ selectedDataset: dataset }),
      setSelectedModel: (model) => set({ selectedModel: model }),
      toggleLiveMode: () => set((state) => ({ isLiveMode: !state.isLiveMode })),
      addDataPoint: (point) => set((state) => ({
        data: [...state.data.slice(1), point],
      })),
      setFeedback: (id, feedback) => set((state) => ({
        data: state.data.map((point) =>
          point.id === id ? { ...point, feedback } : point
        ),
      })),
      updateSettings: async (settings) => {
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const current = get().userSettings;
          const updated = {
            ...current,
            ...settings,
            notifications: {
              ...current.notifications,
              ...(settings.notifications || {}),
            },
            security: {
              ...current.security,
              ...(settings.security || {}),
            },
            data: {
              ...current.data,
              ...(settings.data || {}),
            },
          };
          
          set({ userSettings: updated });
          
          // Update theme if darkMode changed
          if (settings.darkMode !== undefined && settings.darkMode !== current.darkMode) {
            set({ theme: settings.darkMode ? 'dark' : 'light' });
          }
        } catch (error) {
          console.error('Failed to update settings:', error);
          throw error;
        }
      },
      updateSystemMetrics: (metrics) => set((state) => ({
        systemMetrics: {
          ...state.systemMetrics,
          ...metrics,
        },
      })),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light',
      })),
      setData: (data) => set({ data }),
    }),
    {
      name: 'anomaly-store',
      partialize: (state) => ({
        userSettings: state.userSettings,
        selectedDataset: state.selectedDataset,
        selectedModel: state.selectedModel,
        theme: state.theme,
      }),
    }
  )
);

let interval: number;

export const startLiveUpdates = () => {
  if (interval) return;

  interval = window.setInterval(() => {
    const store = useAnomalyStore.getState();
    if (!store.isLiveMode) return;

    const newPoint: DataPoint = {
      id: `dp-${Date.now()}`,
      timestamp: new Date().toISOString(),
      value: 20 + Math.sin(Date.now() * 0.0001) * 10 + Math.random() * 2,
      isAnomaly: Math.random() > 0.9,
      explanation: Math.random() > 0.9
        ? {
            type: Math.random() > 0.5 ? 'spike' : 'drop',
            confidence: 0.85 + Math.random() * 0.1,
            features: [
              { name: 'Price Change', contribution: 60 },
              { name: 'Volume', contribution: 40 },
            ],
          }
        : undefined,
    };

    store.addDataPoint(newPoint);

    store.updateSystemMetrics({
      memoryUsage: 40 + Math.random() * 20,
      inferenceTime: 0.2 + Math.random() * 0.1,
      dataProcessed: store.systemMetrics.dataProcessed + 1,
      lastUpdated: new Date().toISOString(),
    });
  }, 2000);
};

export const stopLiveUpdates = () => {
  if (interval) {
    clearInterval(interval);
    interval = 0;
  }
};