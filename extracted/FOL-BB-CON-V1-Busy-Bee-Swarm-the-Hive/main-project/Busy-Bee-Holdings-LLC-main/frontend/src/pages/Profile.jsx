/**
 * Busy Bee Profile - Design System Implementation
 */

import { useState, useEffect } from 'react';
import {
  PageContainer,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
  Avatar,
  Badge,
  Grid,
  LoadingOverlay,
} from '../components';

// Mock user data
const mockProfile = {
  full_name: 'John Doe',
  email: 'john@example.com',
  subscription_tier: 'pro',
  member_since: 'January 2024',
  avatar: null,
  phone: '+1 (555) 123-4567',
  timezone: 'America/New_York',
  bio: 'Entrepreneur focused on personal growth and financial independence.',
};

function Profile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(mockProfile);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingOverlay message="Loading profile..." />;
  }

  return (
    <PageContainer title="Profile" subtitle="Manage your account settings">
      {/* Profile Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Avatar size="2xl" name={profile.full_name} className="w-24 h-24" />
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-3 justify-center sm:justify-start mb-1">
                <h2 className="text-2xl font-bold text-foreground">{profile.full_name}</h2>
                <Badge variant="success">{profile.subscription_tier}</Badge>
              </div>
              <p className="text-foreground-muted">{profile.email}</p>
              <p className="text-sm text-foreground-muted">Member since {profile.member_since}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Grid cols={{ default: 1, md: 2 }} className="gap-6">
        {/* Account Info */}
        <Card>
          <CardHeader title="Account Information" />
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <Input defaultValue={profile.full_name} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input type="email" defaultValue={profile.email} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Phone</label>
              <Input type="tel" defaultValue={profile.phone} />
            </div>
            <Button className="w-full">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader title="Preferences" />
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Timezone</label>
              <select className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground">
                <option>America/New_York</option>
                <option>America/Los_Angeles</option>
                <option>Europe/London</option>
                <option>Asia/Tokyo</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Bio</label>
              <textarea
                defaultValue={profile.bio}
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-border bg-card text-foreground resize-none"
              />
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-foreground-muted">Receive updates via email</p>
              </div>
              <input type="checkbox" defaultChecked className="h-5 w-5" />
            </div>
            <Button variant="outline" className="w-full">
              Update Preferences
            </Button>
          </CardContent>
        </Card>
      </Grid>
    </PageContainer>
  );
}

export default Profile;
