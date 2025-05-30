import React from 'react';
import { Brain, Cpu, ScanEye, Code, CheckCircle } from 'lucide-react';
import { useAnomalyStore } from '../store/anomalyStore';

const models = [
  { 
    id: 'isolation_forest',
    name: 'Isolation Forest',
    description: 'Efficient for high-dimensional data',
    icon: Cpu
  },
  {
    id: 'lstm_autoencoder',
    name: 'LSTM Autoencoder',
    description: 'Deep learning for sequential data',
    icon: ScanEye
  },
  {
    id: 'one_class_svm',
    name: 'One-Class SVM',
    description: 'Traditional ML approach',
    icon: Code
  }
];

function ModelSelector() {
  const { selectedModel, setSelectedModel } = useAnomalyStore();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Brain className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Select Model</h2>
      </div>

      <div className="space-y-3">
        {models.map(model => {
          const Icon = model.icon;
          const isSelected = selectedModel === model.id;

          return (
            <button
              key={model.id}
              className={`w-full p-3 flex items-start justify-between rounded-lg border-2 transition-colors relative ${
                isSelected ? 'bg-blue-50 border-blue-200' : 'border-gray-100 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedModel(model.id)}
            >
              <div className="flex items-start space-x-3">
                <Icon className="w-5 h-5 text-blue-600 mt-1" />
                <div className="text-left">
                  <div className="font-medium">{model.name}</div>
                  <div className="text-sm text-gray-600">{model.description}</div>
                </div>
              </div>

              {isSelected && (
                <CheckCircle className="w-5 h-5 text-blue-500 absolute top-3 right-3" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ModelSelector;
