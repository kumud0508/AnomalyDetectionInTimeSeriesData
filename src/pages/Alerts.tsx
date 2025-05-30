import React, { useState } from 'react';
import { Bell, Mail, MessageSquare, Smartphone, Search, XCircle, Pin, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import clsx from 'clsx';

const sampleAlerts = [
  {
    id: 1,
    title: 'High CPU Usage Detected',
    description: 'Server CPU usage exceeded threshold of 90%',
    severity: 'high',
    timestamp: new Date('2024-03-10T14:30:00'),
    status: 'active',
    pinned: false
  },
  {
    id: 2,
    title: 'Unusual Network Traffic',
    description: 'Spike in network traffic detected on port 443',
    severity: 'medium',
    timestamp: new Date('2024-03-10T13:15:00'),
    status: 'resolved',
    pinned: false
  },
  {
    id: 3,
    title: 'Memory Usage Anomaly',
    description: 'Unexpected memory usage pattern detected',
    severity: 'low',
    timestamp: new Date('2024-03-10T12:45:00'),
    status: 'active',
    pinned: false
  }
];

const notificationChannels = [
  {
    id: 'email',
    name: 'Email Notifications',
    icon: Mail,
    enabled: true,
    description: 'Receive alerts via email'
  },
  {
    id: 'sms',
    name: 'SMS Alerts',
    icon: Smartphone,
    enabled: false,
    description: 'Get instant SMS notifications'
  },
  {
    id: 'slack',
    name: 'Slack Integration',
    icon: MessageSquare,
    enabled: true,
    description: 'Post alerts to Slack channel'
  }
];

function Alerts() {
  const [alerts, setAlerts] = useState(sampleAlerts);
  const [channels, setChannels] = useState(notificationChannels);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAlerts = alerts
    .filter(alert =>
      alert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  const toggleChannel = (id: string) => {
    setChannels(prev =>
      prev.map(channel =>
        channel.id === id ? { ...channel, enabled: !channel.enabled } : channel
      )
    );
  };

  const dismissAlert = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const pinAlert = (id: number) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === id ? { ...alert, pinned: !alert.pinned } : alert
      )
    );
  };

  return (
    <div className="space-y-8 p-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Bell className="w-6 h-6 text-blue-600" />
          Alerts Dashboard
        </h1>
        <p className="mt-2 text-gray-600">Monitor, manage, and configure your alerts with ease.</p>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search alerts..."
          className="border border-gray-300 rounded px-3 py-2 w-full max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alert List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold">Recent Alerts</h2>
            </div>
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {filteredAlerts.length > 0 ? (
                filteredAlerts.map((alert) => (
                  <div key={alert.id} className="p-6 group hover:bg-gray-50 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className={clsx("mt-1 w-3 h-3 rounded-full", {
                          'bg-red-500': alert.severity === 'high',
                          'bg-yellow-500': alert.severity === 'medium',
                          'bg-blue-500': alert.severity === 'low'
                        })} />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            {alert.severity === 'high' && '🔥'}
                            {alert.severity === 'medium' && '⚠️'}
                            {alert.severity === 'low' && '🧊'}
                            {alert.title}
                            {alert.pinned && <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">Pinned</span>}
                          </h3>
                          <p className="mt-1 text-sm text-gray-500">{alert.description}</p>
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                            <span>{formatDistanceToNow(alert.timestamp, { addSuffix: true })}</span>
                            <span className={clsx(
                              "px-2 py-1 text-xs font-semibold rounded-full",
                              alert.status === 'active'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-green-100 text-green-800'
                            )}>
                              {alert.status}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => pinAlert(alert.id)} title="Pin/unpin alert">
                          <Pin className={clsx("w-4 h-4", alert.pinned ? "text-blue-600" : "text-gray-400")} />
                        </button>
                        <button onClick={() => dismissAlert(alert.id)} title="Dismiss alert">
                          <XCircle className="w-4 h-4 text-red-500 hover:text-red-700" />
                        </button>
                        <button title="Snooze (disabled)">
                          <Clock className="w-4 h-4 text-gray-400 cursor-not-allowed" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500">No alerts match your search.</div>
              )}
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div>
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Notification Settings</h2>
            </div>
            <div className="p-6 space-y-6">
              {channels.map((channel) => (
                <div key={channel.id} className="flex items-start space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <channel.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{channel.name}</h3>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={channel.enabled}
                          onChange={() => toggleChannel(channel.id)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{channel.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Alerts;
