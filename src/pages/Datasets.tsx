import React, { useRef, useState } from 'react';
import { Upload, Trash2, Download, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { parseCSV, parseJSON } from '../utils/dataParsers';
import { toast } from 'sonner';
import { useAnomalyStore } from '../store/anomalyStore';

const sampleDatasets = [
  {
    id: 'server_logs',
    name: 'Server CPU Logs',
    size: '2.4MB',
    records: 15000,
    lastUpdated: new Date('2024-03-10'),
    status: 'active',
  },
  {
    id: 'stock_prices',
    name: 'Stock Prices',
    size: '1.8MB',
    records: 12000,
    lastUpdated: new Date('2024-03-09'),
    status: 'processing',
  },
  {
    id: 'sensor_data',
    name: 'IoT Sensors',
    size: '3.2MB',
    records: 20000,
    lastUpdated: new Date('2024-03-08'),
    status: 'active',
  },
];

function Datasets() {
  const [datasets, setDatasets] = useState(sampleDatasets);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setData } = useAnomalyStore();

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await file.text();
      let parsedData;

      if (file.name.toLowerCase().endsWith('.csv')) {
        parsedData = parseCSV(content);
      } else if (file.name.toLowerCase().endsWith('.json')) {
        parsedData = parseJSON(content);
      } else {
        throw new Error('Unsupported file format. Please upload CSV or JSON files.');
      }

      // Update the global store with the new data
      setData(parsedData);

      // Add the new dataset to the list
      const newDataset = {
        id: `dataset_${Date.now()}`,
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)}MB`,
        records: parsedData.length,
        lastUpdated: new Date(),
        status: 'active',
      };

      setDatasets(prev => [newDataset, ...prev]);

      toast.success('Dataset uploaded successfully!', {
        description: `${parsedData.length} records loaded from ${file.name}`,
      });

    } catch (error) {
      toast.error('Failed to upload dataset', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    }

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = (id: string) => {
    setDatasets(prev => prev.filter(dataset => dataset.id !== id));
    toast.success('Dataset deleted successfully!');
  };

  const handleDownload = (dataset: typeof datasets[0]) => {
    // Implementation for downloading the dataset
    toast.success('Downloading dataset...', {
      description: `Preparing ${dataset.name} for download`,
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Datasets</h1>
        <p className="mt-2 text-gray-600">
          Manage and analyze your time series datasets
        </p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-4">
          <button
            onClick={handleUploadClick}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Dataset</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv,.json"
            onChange={handleFileChange}
          />

          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Name', 'Size', 'Records', 'Last Updated', 'Status', 'Actions'].map((heading) => (
                <th
                  key={heading}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {datasets.map((dataset) => (
              <tr key={dataset.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {dataset.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {dataset.size}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {dataset.records.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(dataset.lastUpdated, 'MMM d, yyyy')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      dataset.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {dataset.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => handleDownload(dataset)}
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(dataset.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Datasets;