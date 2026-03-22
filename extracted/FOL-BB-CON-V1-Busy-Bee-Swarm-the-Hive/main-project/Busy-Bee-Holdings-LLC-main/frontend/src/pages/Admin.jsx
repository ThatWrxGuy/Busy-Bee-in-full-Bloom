/**
 * Busy Bee Admin - Design System Implementation
 */

import { useState, useEffect } from 'react';
import { FiUsers, FiSettings, FiShield, FiDatabase, FiActivity } from 'react-icons/fi';
import {
  PageContainer,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Grid,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  LoadingOverlay,
} from '../components';

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active' },
  { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'user', status: 'inactive' },
];

function Admin() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingOverlay message="Loading admin..." />;

  return (
    <PageContainer title="Admin" subtitle="System administration">
      <Tabs defaultValue="users">
        <TabsList className="mb-6">
          <TabsTrigger value="users" icon={FiUsers}>
            Users
          </TabsTrigger>
          <TabsTrigger value="system" icon={FiActivity}>
            System
          </TabsTrigger>
          <TabsTrigger value="security" icon={FiShield}>
            Security
          </TabsTrigger>
          <TabsTrigger value="settings" icon={FiSettings}>
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader title="User Management" action={<Button>Add User</Button>} />
            <CardContent className="p-0">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left p-4 font-medium text-foreground">Name</th>
                    <th className="text-left p-4 font-medium text-foreground">Email</th>
                    <th className="text-left p-4 font-medium text-foreground">Role</th>
                    <th className="text-left p-4 font-medium text-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-secondary/30">
                      <td className="p-4 text-foreground">{user.name}</td>
                      <td className="p-4 text-foreground-muted">{user.email}</td>
                      <td className="p-4">
                        <Badge variant="outline">{user.role}</Badge>
                      </td>
                      <td className="p-4">
                        <Badge variant={user.status === 'active' ? 'success' : 'secondary'}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Grid cols={{ default: 1, md: 2 }} className="gap-6">
            <Card>
              <CardHeader title="System Health" />
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-foreground">CPU Usage</span>
                  <span className="text-success font-medium">23%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground">Memory</span>
                  <span className="text-success font-medium">45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-foreground">Disk</span>
                  <span className="text-warning font-medium">67%</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader title="API Status" />
              <CardContent className="space-y-2">
                {['Auth API', 'Database', 'Cache', 'Storage'].map((service) => (
                  <div key={service} className="flex items-center justify-between p-2">
                    <span className="text-foreground">{service}</span>
                    <Badge variant="success">Operational</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader title="Security Settings" />
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-sm text-foreground-muted">Require 2FA for all admin users</p>
                </div>
                <input type="checkbox" defaultChecked className="h-5 w-5" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                <div>
                  <p className="font-medium text-foreground">IP Whitelist</p>
                  <p className="text-sm text-foreground-muted">Restrict access to specific IPs</p>
                </div>
                <input type="checkbox" className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader title="System Settings" />
            <CardContent>
              <p className="text-foreground-muted">System configuration options...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

export default Admin;
