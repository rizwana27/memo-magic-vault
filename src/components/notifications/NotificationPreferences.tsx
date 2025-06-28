
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Bell, Mail, MessageSquare, Smartphone, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NotificationPreference {
  id: string;
  name: string;
  description: string;
  category: 'project' | 'resource' | 'financial' | 'client' | 'system';
  enabled: boolean;
  channels: {
    inApp: boolean;
    email: boolean;
    sms: boolean;
    slack: boolean;
  };
  priority: 'high' | 'medium' | 'low';
}

const NotificationPreferences: React.FC = () => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: 'budget-alerts',
      name: 'Budget Alerts',
      description: 'Notifications when project budgets reach thresholds',
      category: 'project',
      enabled: true,
      channels: { inApp: true, email: true, sms: false, slack: true },
      priority: 'high'
    },
    {
      id: 'resource-allocation',
      name: 'Resource Allocation',
      description: 'Alerts for overallocation and capacity issues',
      category: 'resource',
      enabled: true,
      channels: { inApp: true, email: false, sms: false, slack: true },
      priority: 'medium'
    },
    {
      id: 'invoice-overdue',
      name: 'Overdue Invoices',
      description: 'Notifications for overdue payments',
      category: 'financial',
      enabled: true,
      channels: { inApp: true, email: true, sms: true, slack: false },
      priority: 'high'
    },
    {
      id: 'deadline-reminders',
      name: 'Deadline Reminders',
      description: 'Reminders for approaching project deadlines',
      category: 'project',
      enabled: true,
      channels: { inApp: true, email: true, sms: false, slack: true },
      priority: 'medium'
    },
    {
      id: 'client-communications',
      name: 'Client Communications',
      description: 'Updates on client interactions and meetings',
      category: 'client',
      enabled: false,
      channels: { inApp: true, email: false, sms: false, slack: false },
      priority: 'low'
    }
  ]);

  const [globalSettings, setGlobalSettings] = useState({
    quietHours: { enabled: false, start: '18:00', end: '08:00' },
    batchNotifications: true,
    soundEnabled: true,
    desktopNotifications: true
  });

  const updatePreference = (id: string, updates: Partial<NotificationPreference>) => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.id === id ? { ...pref, ...updates } : pref
      )
    );
  };

  const updateChannel = (prefId: string, channel: keyof NotificationPreference['channels'], enabled: boolean) => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.id === prefId
          ? { ...pref, channels: { ...pref.channels, [channel]: enabled } }
          : pref
      )
    );
  };

  const savePreferences = () => {
    // Here you would save to backend/localStorage
    toast({
      title: "Preferences Saved",
      description: "Your notification preferences have been updated",
    });
  };

  const getCategoryIcon = (category: NotificationPreference['category']) => {
    switch (category) {
      case 'project': return '📋';
      case 'resource': return '👥';
      case 'financial': return '💰';
      case 'client': return '🤝';
      case 'system': return '⚙️';
      default: return '🔔';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">Notification Preferences</h1>
      </div>

      {/* Global Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Global Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
              <Switch
                id="desktop-notifications"
                checked={globalSettings.desktopNotifications}
                onCheckedChange={(checked) =>
                  setGlobalSettings(prev => ({ ...prev, desktopNotifications: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-enabled">Sound Notifications</Label>
              <Switch
                id="sound-enabled"
                checked={globalSettings.soundEnabled}
                onCheckedChange={(checked) =>
                  setGlobalSettings(prev => ({ ...prev, soundEnabled: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="batch-notifications">Batch Similar Notifications</Label>
              <Switch
                id="batch-notifications"
                checked={globalSettings.batchNotifications}
                onCheckedChange={(checked) =>
                  setGlobalSettings(prev => ({ ...prev, batchNotifications: checked }))
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
              <Switch
                id="quiet-hours"
                checked={globalSettings.quietHours.enabled}
                onCheckedChange={(checked) =>
                  setGlobalSettings(prev => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, enabled: checked }
                  }))
                }
              />
            </div>
          </div>

          {globalSettings.quietHours.enabled && (
            <div className="flex gap-4 items-center pt-2">
              <Label className="text-sm text-gray-600">Quiet hours:</Label>
              <Select
                value={globalSettings.quietHours.start}
                onValueChange={(value) =>
                  setGlobalSettings(prev => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, start: value }
                  }))
                }
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                      {`${i.toString().padStart(2, '0')}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">to</span>
              <Select
                value={globalSettings.quietHours.end}
                onValueChange={(value) =>
                  setGlobalSettings(prev => ({
                    ...prev,
                    quietHours: { ...prev.quietHours, end: value }
                  }))
                }
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }, (_, i) => (
                    <SelectItem key={i} value={`${i.toString().padStart(2, '0')}:00`}>
                      {`${i.toString().padStart(2, '0')}:00`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Types */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Types</CardTitle>
          <p className="text-sm text-gray-600">
            Configure which notifications you want to receive and how you want to receive them
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {preferences.map((pref, index) => (
              <div key={pref.id}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getCategoryIcon(pref.category)}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900">{pref.name}</h3>
                        <span className={`text-xs font-medium ${getPriorityColor(pref.priority)}`}>
                          {pref.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{pref.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={pref.enabled}
                    onCheckedChange={(checked) => updatePreference(pref.id, { enabled: checked })}
                  />
                </div>

                {pref.enabled && (
                  <div className="ml-12 grid grid-cols-4 gap-4">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-gray-500" />
                      <Label className="text-sm">In-App</Label>
                      <Switch
                        checked={pref.channels.inApp}
                        onCheckedChange={(checked) => updateChannel(pref.id, 'inApp', checked)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <Label className="text-sm">Email</Label>
                      <Switch
                        checked={pref.channels.email}
                        onCheckedChange={(checked) => updateChannel(pref.id, 'email', checked)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-gray-500" />
                      <Label className="text-sm">SMS</Label>
                      <Switch
                        checked={pref.channels.sms}
                        onCheckedChange={(checked) => updateChannel(pref.id, 'sms', checked)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-gray-500" />
                      <Label className="text-sm">Slack</Label>
                      <Switch
                        checked={pref.channels.slack}
                        onCheckedChange={(checked) => updateChannel(pref.id, 'slack', checked)}
                      />
                    </div>
                  </div>
                )}

                {index < preferences.length - 1 && <Separator className="mt-6" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={savePreferences} className="px-8">
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default NotificationPreferences;
