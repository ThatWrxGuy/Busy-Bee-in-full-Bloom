/**
 * Busy Bee Settings - Design System Implementation
 */

import { useState } from 'react';
import { FiUser, FiBell, FiShield, FiSettings, FiDatabase, FiTrash2 } from 'react-icons/fi';
import {
  PageContainer,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  LoadingOverlay,
} from '../components';

function Settings() {
  const [loading, setLoading] = useState(false);

  return (
    <PageContainer title="Settings" subtitle="Manage your preferences and account">
      <Tabs defaultValue="account">
        <TabsList className="mb-6">
          <TabsTrigger value="account" icon={FiUser}>
            Account
          </TabsTrigger>
          <TabsTrigger value="notifications" icon={FiBell}>
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" icon={FiShield}>
            Security
          </TabsTrigger>
          <TabsTrigger value="appearance" icon={FiSettings}>
            Appearance
          </TabsTrigger>
          <TabsTrigger value="data" icon={FiDatabase}>
            Data
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardHeader title="Account Settings" description="Manage your account information" />
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input type="email" defaultValue="user@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Username</label>
                <Input type="text" defaultValue="johndoe" />
              </div>
              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader
              title="Notification Preferences"
              description="Choose what notifications you receive"
            />
            <CardContent className="space-y-4">
              {[
                { id: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                {
                  id: 'push',
                  label: 'Push Notifications',
                  desc: 'Receive push notifications on mobile',
                },
                {
                  id: 'weekly',
                  label: 'Weekly Digest',
                  desc: 'Get a weekly summary of your progress',
                },
                {
                  id: 'goals',
                  label: 'Goal Reminders',
                  desc: 'Reminders for upcoming goal deadlines',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-sm text-foreground-muted">{item.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-5 w-5" />
                </div>
              ))}
              <Button>Save Preferences</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader title="Security Settings" description="Keep your account secure" />
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Current Password</label>
                <Input type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">New Password</label>
                <Input type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Confirm New Password</label>
                <Input type="password" placeholder="Confirm new password" />
              </div>
              <Button>Update Password</Button>

              <div className="pt-4 border-t border-border">
                <h4 className="font-medium text-foreground mb-3">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <p className="font-medium text-foreground">Enable 2FA</p>
                    <p className="text-sm text-foreground-muted">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline">Enable</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader title="Appearance" description="Customize how the app looks" />
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">Theme</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Light', 'Dark', 'System'].map((theme) => (
                    <button
                      key={theme}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        theme === 'Dark'
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <p className="font-medium text-foreground">{theme}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Accent Color
                </label>
                <div className="flex gap-3">
                  {['#F59E0B', '#3B82F6', '#10B981', '#EF4444', '#8B5CF6'].map((color) => (
                    <button
                      key={color}
                      className={`w-10 h-10 rounded-full border-2 ${
                        color === '#F59E0B' ? 'border-foreground' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <Button>Save Appearance</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data">
          <Card>
            <CardHeader title="Data Management" description="Export or delete your data" />
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg border border-border">
                <h4 className="font-medium text-foreground mb-2">Export Your Data</h4>
                <p className="text-sm text-foreground-muted mb-3">
                  Download all your data in JSON format
                </p>
                <Button variant="outline">Export Data</Button>
              </div>

              <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/5">
                <h4 className="font-medium text-destructive mb-2">Delete Account</h4>
                <p className="text-sm text-foreground-muted mb-3">
                  Permanently delete your account and all associated data. This action cannot be
                  undone.
                </p>
                <Button variant="destructive">
                  <FiTrash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

export default Settings;
