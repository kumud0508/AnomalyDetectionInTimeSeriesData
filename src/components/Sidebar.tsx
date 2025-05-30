import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  BrainCircuit,
  Bell,
  BarChart3,
  Settings,
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Datasets', path: '/datasets', icon: Database },
  { name: 'Models', path: '/models', icon: BrainCircuit },
  { name: 'Alerts', path: '/alerts', icon: Bell },
  { name: 'Analytics', path: '/analytics', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white border-r shadow-sm hidden md:flex flex-col">
      <div className="p-6 text-2xl font-bold text-indigo-600">
        AnomalyAI 🔍
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ name, path, icon: Icon }) => (
          <NavLink
            to={path}
            key={name}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 
              ${
                isActive
                  ? 'bg-indigo-100 text-indigo-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {name}
          </NavLink>
        ))}
      </nav>

      {/* Optional Footer */}
      <div className="p-4 text-xs text-gray-400 text-center border-t">
        © 2025 Kumud's Project
      </div>
    </aside>
  );
};

export default Sidebar;
