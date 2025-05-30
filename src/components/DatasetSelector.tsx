import React from 'react';
import {
  Database,
  Cpu,
  TrendingUp,
  Activity,
  CheckCircle
} from 'lucide-react';
import { useAnomalyStore } from '../store/anomalyStore';

const datasets = [
  {
    id: 'server_logs',
    name: 'Server CPU Logs',
    description: 'Historical server performance data',
    icon: Cpu
  },
  {
    id: 'stock_prices',
    name: 'Stock Prices',
    description: 'Daily stock market data',
    icon: TrendingUp
  },
  {
    id: 'sensor_data',
    name: 'IoT Sensors',
    description: 'Real-time sensor readings',
    icon: Activity
  }
];

function DatasetSelector() {
  const { selectedDataset, setSelectedDataset } = useAnomalyStore();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Database className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Select Dataset</h2>
      </div>

      <div className="space-y-3">
        {datasets.map(dataset => {
          const Icon = dataset.icon;
          const isSelected = selectedDataset === dataset.id;

          return (
            <button
              key={dataset.id}
              className={`relative w-full p-4 text-left rounded-lg transition-all flex items-start border-2 ${
                isSelected
                  ? 'bg-blue-50 border-blue-300'
                  : 'border-gray-100 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedDataset(dataset.id)}
            >
              <div className="flex-shrink-0 mt-1">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>

              <div className="ml-4">
                <div className="font-medium text-gray-800">{dataset.name}</div>
                <div className="text-sm text-gray-600">{dataset.description}</div>
              </div>

              {isSelected && (
                <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-blue-600" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default DatasetSelector;
