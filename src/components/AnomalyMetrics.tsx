import React from 'react';
import { AlertTriangle, Clock, Percent, AlertCircle } from 'lucide-react';

const metrics = [
  {
    icon: AlertTriangle,
    label: 'Anomalies Detected',
    value: '24',
    change: '+12%',
    positive: false
  },
  {
    icon: Clock,
    label: 'Avg. Detection Time',
    value: '1.2s',
    change: '-15%',
    positive: true
  },
  {
    icon: Percent,
    label: 'Accuracy',
    value: '97.8%',
    change: '+2.1%',
    positive: true
  },
  {
    icon: AlertCircle,
    label: 'False Positives',
    value: '3',
    change: '-33%',
    positive: true
  }
];

function AnomalyMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map(({ icon: Icon, label, value, change, positive }) => (
        <div key={label} className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Icon className="w-6 h-6 text-blue-600" />
            </div>
            <span className={`text-sm font-medium ${positive ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-600">{label}</h3>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AnomalyMetrics;