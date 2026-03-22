/**
 * Busy Bee Travel Dashboard - Design System Implementation
 * Trips, adventures, bucket list, and travel planning
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiTrendingUp, FiTrendingDown, FiMapPin, FiCalendar, FiAnchor, FiMountain, FiCompass, FiClock, FiTarget, FiStar, FiAward, FiCheck, FiGlobe } from 'react-icons/fi';
import {
  PageContainer,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Badge,
  Progress,
  Grid,
  Skeleton,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '../components';

// ─── Configuration ───────────────────────────────────────────────────────────

const TRAVEL_METRICS = {
  color: '#06B6D4',
  emoji: '✈️',
  label: 'Travel',
};

// ─── Mock Data - EXAMPLES ONLY for users to reference ───────────────────────────

const mockStats = [
  { label: 'Countries Visited', value: '12', trend: 2, icon: FiGlobe },
  { label: 'Trips This Year', value: '3', trend: 1, icon: FiGlobe },
  { label: 'Miles Traveled', value: '8.5K', trend: 15, icon: FiMapPin },
  { label: 'Bucket List', value: '24', trend: 5, icon: FiAward },
];

const mockTrips = [
  { id: 1, name: 'Tokyo, Japan', dates: 'Mar 15-22', status: 'planned', type: 'International', budget: '$3,500', image: '🗼' },
  { id: 2, name: 'Grand Canyon', dates: 'Jun 10-14', status: 'planned', type: 'Domestic', budget: '$1,200', image: '🏜️' },
  { id: 3, name: 'Paris, France', dates: 'Sep 5-12', status: 'dreaming', type: 'International', budget: '$4,000', image: '🗼' },
  { id: 4, name: 'Austin, TX', dates: 'Jan 20-23', status: 'completed', type: 'Domestic', budget: '$800', image: '🎸' },
];

const mockGoals = [
  { id: 1, title: 'Visit 15 countries', progress: 80, status: 'active', target: '12/15 countries' },
  { id: 2, title: 'Road trip across US', progress: 30, status: 'active', target: '3/10 states' },
  { id: 3, title: 'Solo adventure', progress: 50, status: 'active', target: '1/2 trips' },
  { id: 4, title: 'Visit all national parks', progress: 15, status: 'active', target: '8/63 parks' },
];

const mockBucketList = [
  { id: 1, name: 'See Northern Lights', location: 'Iceland', completed: false, emoji: '🌌' },
  { id: 2, name: 'Safari in Kenya', location: 'Kenya', completed: false, emoji: '🦁' },
  { id: 3, name: 'Visit Machu Picchu', location: 'Peru', completed: true, emoji: '🏔️' },
  { id: 4, name: 'Cruise Caribbean', location: 'Caribbean', completed: false, emoji: '🏝️' },
  { id: 5, name: 'Japan Cherry Blossoms', location: 'Japan', completed: false, emoji: '🌸' },
  { id: 6, name: 'Australian Outback', location: 'Australia', completed: false, emoji: '🦘' },
];

const mockPlacesVisited = [
  { country: 'Japan', visits: 3, lastVisit: '2023', emoji: '🗾' },
  { country: 'France', visits: 2, lastVisit: '2022', emoji: '🗼' },
  { country: 'Italy', visits: 1, lastVisit: '2021', emoji: '🏛️' },
  { country: 'Mexico', visits: 5, lastVisit: '2024', emoji: '🌮' },
  { country: 'Canada', visits: 2, lastVisit: '2020', emoji: '🍁' },
];

const mockUpcomingEvents = [
  { id: 1, title: 'Flight to Tokyo', date: 'Mar 15', type: 'flight' },
  { id: 2, title: 'Hotel check-in', date: 'Mar 15', type: 'lodging' },
  { id: 3, title: 'Grand Canyon booking', date: 'Apr 1', type: 'booking' },
];

const mockInsights = [
  { label: 'Top destination', value: 'Japan', icon: FiMapPin },
  { label: 'Next trip', value: 'Tokyo (22 days)', icon: FiCalendar },
  { label: 'This year', value: '3 trips planned', icon: FiGlobe },
  { label: 'Total spent', value: '$5,500', icon: FiStar },
];

// ─── Components ───────────────────────────────────────────────────────────────

function StatCardNew({ icon: Icon, label, value, trend, loading }) {
  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="h-4 w-20 mb-3" />
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-24" />
        </CardContent>
      </Card>
    );
  }

  const isPositive = trend > 0;
  const isNegative = trend < 0;

  return (
    <Card hover className="cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="p-2 rounded-lg bg-cyan-500/10">
            <Icon className="w-5 h-5 text-cyan-500" />
          </div>
          {trend != null && (
            <span
              className={`flex items-center gap-1 text-sm font-medium ${
                isPositive ? 'text-cyan-500' : isNegative ? 'text-red-500' : 'text-gray-500'
              }`}
            >
              {isPositive && <FiTrendingUp size={14} />}
              {isNegative && <FiTrendingDown size={14} />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500 mt-1">{label}</p>
      </CardContent>
    </Card>
  );
}

function GoalCard({ goal }) {
  const statusColors = { active: 'success', completed: 'info', paused: 'secondary' };
  return (
    <Card hover className="cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-medium text-gray-900 flex-1 line-clamp-1">{goal.title}</h3>
          <Badge variant={statusColors[goal.status]}>{goal.status}</Badge>
        </div>
        <Progress value={goal.progress} className="h-2 mb-3" />
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">{goal.progress}% complete</span>
          <span className="text-xs text-gray-400">{goal.target}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function TripCard({ trip }) {
  const statusColors = {
    completed: 'success',
    planned: 'warning',
    dreaming: 'secondary',
  };

  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{trip.image}</span>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{trip.name}</h3>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <FiCalendar size={12} /> {trip.dates}
            </p>
          </div>
          <Badge variant={statusColors[trip.status]}>{trip.status}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-700">
            {trip.type}
          </span>
          <span className="text-sm font-medium text-gray-900">{trip.budget}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function BucketListItem({ item }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${item.completed ? 'bg-gray-50' : 'hover:bg-cyan-50'}`}>
      <span className="text-2xl">{item.emoji}</span>
      <div className="flex-1">
        <p className={`font-medium ${item.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
          {item.name}
        </p>
        <p className="text-xs text-gray-500">{item.location}</p>
      </div>
      {item.completed && <FiCheck className="text-cyan-500" />}
    </div>
  );
}

function PlaceCard({ place }) {
  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{place.emoji}</span>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{place.country}</h3>
            <p className="text-sm text-gray-500">{place.visits} visits • {place.lastVisit}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EventCard({ event }) {
  const typeIcons = { flight: '✈️', lodging: '🏨', booking: '📋' };
  return (
    <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
      <span className="text-xl">{typeIcons[event.type]}</span>
      <div className="flex-1">
        <p className="font-medium text-gray-900">{event.title}</p>
      </div>
      <span className="text-sm text-cyan-500">{event.date}</span>
    </div>
  );
}

function InsightCard({ insight }) {
  const Icon = insight.icon;
  return (
    <Card hover>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-100">
            <Icon className="w-4 h-4 text-cyan-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">{insight.label}</p>
            <p className="font-medium text-gray-900">{insight.value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Travel Dashboard ───────────────────────────────────────────────────

function Travel() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageContainer
      title="Travel Dashboard"
      subtitle="Plan adventures and track your journeys"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FiGlobe className="w-4 h-4 mr-2" />
            Plan Trip
          </Button>
          <Button size="sm">
            <FiPlus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        </div>
      }
    >
      {/* Stats Grid */}
      <Grid cols={{ default: 1, sm: 2, lg: 4 }} className="mb-6">
        {mockStats.map((stat, index) => (
          <StatCardNew key={index} {...stat} loading={loading} />
        ))}
      </Grid>

      {/* Main Content */}
      <Tabs defaultValue="trips" className="space-y-6">
        <TabsList>
          <TabsTrigger value="trips">Trips</TabsTrigger>
          <TabsTrigger value="bucketlist">Bucket List</TabsTrigger>
          <TabsTrigger value="visited">Places</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="trips">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader 
                  title="My Trips" 
                  action={
                    <Button size="sm">
                      <FiPlus className="w-4 h-4 mr-2" />
                      Add Trip
                    </Button>
                  }
                />
                <CardContent className="space-y-4">
                  {loading ? (
                    <>
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </>
                  ) : (
                    mockTrips.map((trip) => <TripCard key={trip.id} trip={trip} />)
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader title="Upcoming Events" />
                <CardContent className="space-y-2">
                  {mockUpcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="bucketlist">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader 
                  title="Travel Bucket List" 
                  action={
                    <Button size="sm">
                      <FiPlus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  }
                />
                <CardContent>
                  <Grid cols={{ default: 1, md: 2 }} className="gap-3">
                    {mockBucketList.map((item) => (
                      <BucketListItem key={item.id} item={item} />
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader title="Progress" />
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="#E5E7EB" strokeWidth="12" fill="none" />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="#06B6D4"
                          strokeWidth="12"
                          fill="none"
                          strokeDasharray={`${(mockBucketList.filter(i => i.completed).length / mockBucketList.length) * 352} 352`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold text-gray-900">
                          {mockBucketList.filter(i => i.completed).length}/{mockBucketList.length}
                        </span>
                        <span className="text-xs text-gray-500">completed</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="visited">
          <Card>
            <CardHeader title="Places Visited" />
            <CardContent>
              <Grid cols={{ default: 1, sm: 2, md: 3 }} className="gap-4">
                {mockPlacesVisited.map((place) => (
                  <PlaceCard key={place.country} place={place} />
                ))}
              </Grid>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader 
                  title="Travel Goals" 
                  action={
                    <Link to="/goals" className="text-sm text-cyan-600 hover:underline">
                      View all →
                    </Link>
                  }
                />
                <CardContent className="space-y-4">
                  {mockGoals.map((goal) => (
                    <GoalCard key={goal.id} goal={goal} />
                  ))}
                </CardContent>
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader title="Insights" />
                <CardContent className="space-y-3">
                  {mockInsights.map((insight, idx) => (
                    <InsightCard key={idx} insight={insight} />
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
}

export default Travel;
