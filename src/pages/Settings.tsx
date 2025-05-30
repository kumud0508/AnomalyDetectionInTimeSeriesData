import React, { useState, useEffect } from 'react';
import { Save, Bell, Moon, Sun, Shield, Database, Mail, Globe } from 'lucide-react';
import { useAnomalyStore } from '../store/anomalyStore';
import { useTheme } from '../hooks/useTheme';
import { useTranslation } from 'react-i18next';
import { languages } from '../i18n';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NotificationSettings {
  email: boolean;
  push: boolean;
  slack: boolean;
}

interface SecuritySettings {
  twoFactor: boolean;
  apiKeyExpiry: number;
  ipWhitelist: string[];
}

const Settings = () => {
  const { userSettings, updateSettings } = useAnomalyStore();
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // State for all settings
  const [generalSettings, setGeneralSettings] = useState({
    username: '',
    email: '',
    darkMode: theme === 'dark',
    language: i18n.language,
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    slack: false,
  });

  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactor: false,
    apiKeyExpiry: 30,
    ipWhitelist: [],
  });

  const [dataSettings, setDataSettings] = useState({
    autoBackup: true,
    retentionPeriod: 90,
    compressionEnabled: true,
  });

  // Load settings from store
  useEffect(() => {
    if (userSettings) {
      setGeneralSettings({
        username: userSettings.username || '',
        email: userSettings.email || '',
        darkMode: theme === 'dark',
        language: i18n.language,
      });

      setNotificationSettings({
        email: userSettings.notifications?.email || true,
        push: userSettings.notifications?.push || true,
        slack: userSettings.notifications?.slack || false,
      });

      setSecuritySettings({
        twoFactor: userSettings.security?.twoFactor || false,
        apiKeyExpiry: userSettings.security?.apiKeyExpiry || 30,
        ipWhitelist: userSettings.security?.ipWhitelist || [],
      });

      setDataSettings({
        autoBackup: userSettings.data?.autoBackup || true,
        retentionPeriod: userSettings.data?.retentionPeriod || 90,
        compressionEnabled: userSettings.data?.compressionEnabled || true,
      });
    }
  }, [userSettings, theme, i18n.language]);

  const handleSave = async () => {
    try {
      // Update theme if changed
      if (generalSettings.darkMode !== (theme === 'dark')) {
        toggleTheme();
      }

      // Update language if changed
      if (generalSettings.language !== i18n.language) {
        await i18n.changeLanguage(generalSettings.language);
      }

      // Combine all settings
      const newSettings = {
        ...generalSettings,
        notifications: notificationSettings,
        security: securitySettings,
        data: dataSettings,
      };

      // Update settings in store
      await updateSettings(newSettings);

      toast.success(t('settings.messages.success'), {
        description: t('settings.messages.successDescription'),
        duration: 3000,
      });

      // Redirect to dashboard after successful save
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      toast.error(t('settings.messages.error'), {
        description: t('settings.messages.errorDescription'),
      });
    }
  };

  const addIpToWhitelist = (ip: string) => {
    if (ip && !securitySettings.ipWhitelist.includes(ip)) {
      setSecuritySettings(prev => ({
        ...prev,
        ipWhitelist: [...prev.ipWhitelist, ip],
      }));
    }
  };

  const removeIpFromWhitelist = (ip: string) => {
    setSecuritySettings(prev => ({
      ...prev,
      ipWhitelist: prev.ipWhitelist.filter(item => item !== ip),
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('settings.description')}</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* General Settings */}
        <section className="bg-card rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Sun className="w-5 h-5" />
              {t('settings.sections.general.title')}
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  {t('settings.sections.general.username')}
                </label>
                <input
                  type="text"
                  value={generalSettings.username}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, username: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  {t('settings.sections.general.email')}
                </label>
                <input
                  type="email"
                  value={generalSettings.email}
                  onChange={(e) => setGeneralSettings(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={generalSettings.darkMode}
                  onChange={(e) => {
                    setGeneralSettings(prev => ({ ...prev, darkMode: e.target.checked }));
                    toggleTheme();
                  }}
                  className="rounded border-input bg-background"
                />
                <span className="text-sm">
                  {t('settings.sections.general.darkMode')}
                </span>
              </label>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  {t('settings.sections.general.language')}
                </label>
                <select
                  value={generalSettings.language}
                  onChange={(e) => {
                    setGeneralSettings(prev => ({ ...prev, language: e.target.value }));
                    i18n.changeLanguage(e.target.value);
                  }}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  {Object.entries(languages).map(([code, { name, nativeName }]) => (
                    <option key={code} value={code}>
                      {nativeName} ({name})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="bg-card rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Bell className="w-5 h-5" />
              {t('settings.sections.notifications.title')}
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={notificationSettings.email}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, email: e.target.checked }))}
                  className="rounded border-input bg-background"
                />
                <span className="text-sm">{t('settings.sections.notifications.email')}</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={notificationSettings.push}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, push: e.target.checked }))}
                  className="rounded border-input bg-background"
                />
                <span className="text-sm">{t('settings.sections.notifications.push')}</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={notificationSettings.slack}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, slack: e.target.checked }))}
                  className="rounded border-input bg-background"
                />
                <span className="text-sm">{t('settings.sections.notifications.slack')}</span>
              </label>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="bg-card rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Shield className="w-5 h-5" />
              {t('settings.sections.security.title')}
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={securitySettings.twoFactor}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, twoFactor: e.target.checked }))}
                  className="rounded border-input bg-background"
                />
                <span className="text-sm">{t('settings.sections.security.twoFactor')}</span>
              </label>
              <div>
                <label className="block text-sm font-medium">
                  {t('settings.sections.security.apiKeyExpiry')}
                </label>
                <input
                  type="number"
                  value={securitySettings.apiKeyExpiry}
                  onChange={(e) => setSecuritySettings(prev => ({ ...prev, apiKeyExpiry: parseInt(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  {t('settings.sections.security.ipWhitelist')}
                </label>
                <div className="mt-1 space-y-2">
                  {securitySettings.ipWhitelist.map((ip) => (
                    <div key={ip} className="flex items-center space-x-2">
                      <span className="text-sm">{ip}</span>
                      <button
                        onClick={() => removeIpFromWhitelist(ip)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        {t('settings.sections.security.remove')}
                      </button>
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder={t('settings.sections.security.addIpPlaceholder')}
                      className="flex-1 rounded-md border border-input bg-background px-3 py-2"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addIpToWhitelist((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add IP address"]') as HTMLInputElement;
                        addIpToWhitelist(input.value);
                        input.value = '';
                      }}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                    >
                      {t('settings.sections.security.add')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section className="bg-card rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Database className="w-5 h-5" />
              {t('settings.sections.data.title')}
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="space-y-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dataSettings.autoBackup}
                  onChange={(e) => setDataSettings(prev => ({ ...prev, autoBackup: e.target.checked }))}
                  className="rounded border-input bg-background"
                />
                <span className="text-sm">{t('settings.sections.data.autoBackup')}</span>
              </label>
              <div>
                <label className="block text-sm font-medium">
                  {t('settings.sections.data.retentionPeriod')}
                </label>
                <input
                  type="number"
                  value={dataSettings.retentionPeriod}
                  onChange={(e) => setDataSettings(prev => ({ ...prev, retentionPeriod: parseInt(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2"
                />
              </div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={dataSettings.compressionEnabled}
                  onChange={(e) => setDataSettings(prev => ({ ...prev, compressionEnabled: e.target.checked }))}
                  className="rounded border-input bg-background"
                />
                <span className="text-sm">{t('settings.sections.data.compression')}</span>
              </label>
            </div>
          </div>
        </section>
      </div>

      {/* Save Button */}
      <div className="mt-8 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition duration-200 shadow-sm"
        >
          <Save className="w-5 h-5" />
          <span>{t('settings.actions.save')}</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Settings;