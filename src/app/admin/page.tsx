'use client';

import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  Activity,
  Shield,
  Settings,
  BarChart,
  Clock,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const { user } = useAdminAuth();
  const { stats, activity, alerts } = useDashboardData();

  // Show loading state while initial data is loading
  if (!stats.data && stats.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Map icon names to components
  const iconMap = {
    Users,
    Activity,
    Shield,
    BarChart
  };

  // Use real stats data with fallback to empty array
  const statsData = stats.data?.map(stat => ({
    ...stat,
    icon: iconMap[stat.icon as keyof typeof iconMap] || Users
  })) || [];

  const quickActions = [
    {
      title: 'User Management',
      description: 'Manage user accounts and permissions',
      icon: Users,
      href: '/admin/users'
    },
    {
      title: 'Audit Logs',
      description: 'View system activity and security logs',
      icon: Activity,
      href: '/admin/audit'
    },
    {
      title: 'Settings',
      description: 'Configure system settings',
      icon: Settings,
      href: '/admin/settings'
    },
    {
      title: 'Security',
      description: 'Security policies and configurations',
      icon: Shield,
      href: '/admin/security'
    }
  ];

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Welcome back, {user?.user?.email || 'Admin'}
        </p>
      </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.isLoading ? (
            // Loading skeleton for stats
            Array.from({ length: 4 }).map((_, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))
          ) : statsData.length > 0 ? (
            statsData.map((stat, index) => (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className={`text-xs mt-1 ${
                    stat.trend === 'up' ? 'text-green-600' :
                    stat.trend === 'down' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            // Fallback when no data
            <div className="col-span-full text-center text-gray-500 py-8">
              No statistics available
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => router.push(action.href)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <action.icon className="h-5 w-5 text-primary" />
                    {action.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activity.isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex justify-between items-start pb-3 border-b">
                      <div>
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse mb-1" />
                        <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                      </div>
                      <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                  ))
                ) : activity.data && activity.data.length > 0 ? (
                  activity.data.slice(0, 5).map((item, index) => (
                    <div key={index} className="flex justify-between items-start pb-3 border-b last:border-0">
                      <div>
                        <p className="text-sm font-medium">{item.action}</p>
                        <p className="text-xs text-gray-500">{item.user}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {item.time}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No recent activity
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.isLoading ? (
                  // Loading skeleton
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="flex items-start gap-3 pb-3 border-b">
                      <div className="mt-1 h-2 w-2 rounded-full bg-gray-200 animate-pulse" />
                      <div className="flex-1">
                        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-1" />
                        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  ))
                ) : alerts.data && alerts.data.length > 0 ? (
                  alerts.data.map((alert, index) => (
                    <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                      <div className={`mt-1 h-2 w-2 rounded-full ${
                        alert.level === 'warning' ? 'bg-yellow-500' :
                        alert.level === 'success' ? 'bg-green-500' :
                        alert.level === 'error' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-gray-500">{alert.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No active alerts
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
}