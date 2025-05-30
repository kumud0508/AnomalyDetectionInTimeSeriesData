import React, { useState } from 'react';
import { Play, Pause, RefreshCw, Settings, Trash2, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const initialModels = [
  {
    id: 'isolation_forest',
    name: 'Isolation Forest',
    type: 'Machine Learning',
    dataset: 'Server CPU Logs',
    accuracy: 97.8,
    status: 'running',
    lastTrained: new Date('2024-03-10')
  },
  {
    id: 'lstm_autoencoder',
    name: 'LSTM Autoencoder',
    type: 'Deep Learning',
    dataset: 'Stock Prices',
    accuracy: 95.2,
    status: 'stopped',
    lastTrained: new Date('2024-03-09')
  },
  {
    id: 'one_class_svm',
    name: 'One-Class SVM',
    type: 'Machine Learning',
    dataset: 'IoT Sensors',
    accuracy: 94.5,
    status: 'running',
    lastTrained: new Date('2024-03-08')
  },
  {
    id: 'auto_arima',
    name: 'Auto ARIMA',
    type: 'Time Series Forecasting',
    dataset: 'Energy Consumption',
    accuracy: 93.1,
    status: 'stopped',
    lastTrained: new Date('2024-03-07')
  },
  {
    id: 'prophet_model',
    name: 'Facebook Prophet',
    type: 'Time Series Forecasting',
    dataset: 'Web Traffic Logs',
    accuracy: 92.4,
    status: 'running',
    lastTrained: new Date('2024-03-06')
  },
  {
    id: 'vae_detector',
    name: 'Variational Autoencoder',
    type: 'Deep Learning',
    dataset: 'Credit Card Transactions',
    accuracy: 96.3,
    status: 'stopped',
    lastTrained: new Date('2024-03-05')
  },
  {
    id: 'deep_svdd',
    name: 'Deep SVDD',
    type: 'Deep Learning',
    dataset: 'System Logs',
    accuracy: 95.9,
    status: 'running',
    lastTrained: new Date('2024-03-04')
  }
];

function Models() {
  const [models, setModels] = useState(initialModels);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [newModel, setNewModel] = useState({
    name: '',
    type: '',
    dataset: '',
    accuracy: '',
    status: 'running'
  });

  const filteredModels = models.filter(
    (model) =>
      (statusFilter === 'all' || model.status === statusFilter) &&
      model.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (id: string) => {
    setModels((prev) =>
      prev.map((model) =>
        model.id === id
          ? { ...model, status: model.status === 'running' ? 'stopped' : 'running' }
          : model
      )
    );
  };

  const handleDelete = (id: string) => {
    setModels((prev) => prev.filter((model) => model.id !== id));
  };

  const handleAddModel = () => {
    if (!newModel.name || !newModel.type || !newModel.dataset || !newModel.accuracy) return;
    setModels((prev) => [
      ...prev,
      {
        id: newModel.name.toLowerCase().replace(/\s+/g, '_'),
        name: newModel.name,
        type: newModel.type,
        dataset: newModel.dataset,
        accuracy: parseFloat(newModel.accuracy),
        status: newModel.status,
        lastTrained: new Date()
      }
    ]);
    setNewModel({ name: '', type: '', dataset: '', accuracy: '', status: 'running' });
    setShowModal(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Models</h1>
        <p className="mt-2 text-gray-600">Manage and monitor your anomaly detection models</p>
      </div>

      <div className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div className="flex space-x-2">
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => setShowModal(true)}
          >
            <Play className="w-4 h-4" />
            <span>Train New Model</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Search models..."
            className="px-4 py-2 border rounded-lg w-60"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-3 py-2 border rounded-lg"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="running">Running</option>
            <option value="stopped">Stopped</option>
          </select>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowModal(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Train New Model</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Model Name"
                className="w-full border px-3 py-2 rounded-lg"
                value={newModel.name}
                onChange={(e) => setNewModel({ ...newModel, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Type (e.g. ML, DL)"
                className="w-full border px-3 py-2 rounded-lg"
                value={newModel.type}
                onChange={(e) => setNewModel({ ...newModel, type: e.target.value })}
              />
              <input
                type="text"
                placeholder="Dataset"
                className="w-full border px-3 py-2 rounded-lg"
                value={newModel.dataset}
                onChange={(e) => setNewModel({ ...newModel, dataset: e.target.value })}
              />
              <input
                type="number"
                step="0.1"
                placeholder="Accuracy (%)"
                className="w-full border px-3 py-2 rounded-lg"
                value={newModel.accuracy}
                onChange={(e) => setNewModel({ ...newModel, accuracy: e.target.value })}
              />
              <select
                className="w-full border px-3 py-2 rounded-lg"
                value={newModel.status}
                onChange={(e) => setNewModel({ ...newModel, status: e.target.value })}
              >
                <option value="running">Running</option>
                <option value="stopped">Stopped</option>
              </select>
              <button
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={handleAddModel}
              >
                Add Model
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <div key={model.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{model.name}</h3>
                <p className="text-sm text-gray-500">{model.type}</p>
              </div>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  model.status === 'running'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {model.status}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-500">Dataset</div>
                <div className="font-medium">{model.dataset}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Accuracy</div>
                <div className="font-medium">{model.accuracy}%</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Last Trained</div>
                <div className="font-medium">
                  {formatDistanceToNow(model.lastTrained, { addSuffix: true })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
              <button
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                onClick={() => handleToggleStatus(model.id)}
              >
                {model.status === 'running' ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
              <button
                className="p-2 text-red-600 hover:text-red-900 transition-colors"
                onClick={() => handleDelete(model.id)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Models;
