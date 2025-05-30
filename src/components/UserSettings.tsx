import React, { useState, useEffect } from 'react';
import { useAnomalyStore } from '../store/anomalyStore';

const UserSettings = () => {
  const { userProfile, updateUserProfile } = useAnomalyStore();

  const [name, setName] = useState('');
  const [threshold, setThreshold] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // 🛡 Ensure values only update after userProfile is loaded
  useEffect(() => {
    if (userProfile && userProfile.preferences) {
      setName(userProfile.name || '');
      setThreshold(userProfile.preferences.alertThreshold || 0);
      setDarkMode(userProfile.preferences.darkMode || false);
    }
  }, [userProfile]);

  // ⛔ If data is not yet loaded, show a loading message
  if (!userProfile || !userProfile.preferences || !userProfile.preferences.notifications) {
    return <div>Loading user profile...</div>;
  }

  const handleSave = () => {
    updateUserProfile({
      name,
      preferences: {
        ...userProfile.preferences,
        alertThreshold: threshold,
        darkMode: darkMode,
        notifications: {
          ...userProfile.preferences.notifications,
        },
      },
    });

    alert('✅ Changes Saved Successfully!');
  };

  return (
    <div style={{ padding: 20, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
      <h2>User Settings</h2>

      <div style={{ marginBottom: 10 }}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginLeft: 10 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Alert Threshold:</label>
        <input
          type="number"
          value={threshold}
          onChange={(e) => setThreshold(Number(e.target.value))}
          style={{ marginLeft: 10 }}
        />
      </div>

      <div style={{ marginBottom: 10 }}>
        <label>Dark Mode:</label>
        <input
          type="checkbox"
          checked={darkMode}
          onChange={(e) => setDarkMode(e.target.checked)}
          style={{ marginLeft: 10 }}
        />
      </div>

      <button
        onClick={handleSave}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '8px 12px',
          border: 'none',
          borderRadius: 4,
        }}
      >
        💾 Save Changes
      </button>
    </div>
  );
};

export default UserSettings;
