
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Plus, MessageSquare, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import DashboardGrid from './DashboardGrid';
import WidgetLibrary from './WidgetLibrary';
import DashboardChat from './DashboardChat';

interface PersonaDashboardProps {
  persona: 'pmo' | 'executive' | 'org_leader' | 'resource';
}

const PersonaDashboard: React.FC<PersonaDashboardProps> = ({ persona }) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Fetch user's dashboard configuration
  const { data: dashboardConfig, isLoading } = useQuery({
    queryKey: ['user-dashboard', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_dashboards')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching dashboard:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch available widgets based on persona
  const { data: availableWidgets } = useQuery({
    queryKey: ['available-widgets', persona],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('widget_definitions')
        .select('*')
        .eq('is_active', true)
        .order('category', { ascending: true });
      
      if (error) {
        console.error('Error fetching widgets:', error);
        throw error;
      }
      
      return data;
    },
  });

  // Create default dashboard if none exists
  const createDefaultDashboard = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('No user ID');
      
      const defaultLayout = getDefaultLayoutForPersona(persona);
      
      const { data, error } = await supabase
        .from('user_dashboards')
        .insert({
          user_id: user.id,
          dashboard_name: 'My Dashboard',
          layout: defaultLayout,
          is_default: true,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-dashboard'] });
      toast({
        title: "Dashboard Created",
        description: "Your personalized dashboard has been set up!",
      });
    },
  });

  // Create dashboard if it doesn't exist
  useEffect(() => {
    if (!isLoading && !dashboardConfig && user?.id) {
      createDefaultDashboard.mutate();
    }
  }, [isLoading, dashboardConfig, user?.id]);

  const handleSignOut = async () => {
    try {
      console.log('User signing out:', user?.email);
      toast({
        title: "Signing out...",
        description: "You've been signed out successfully 👋",
      });
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out completed",
        description: "You've been signed out 👋",
        variant: "default",
      });
    }
  };

  const getPersonaTitle = (persona: string) => {
    switch (persona) {
      case 'pmo': return 'PMO Dashboard';
      case 'executive': return 'Executive Dashboard';
      case 'org_leader': return 'Leadership Dashboard';
      case 'resource': return 'My Dashboard';
      default: return 'Dashboard';
    }
  };

  const getPersonaIcon = (persona: string) => {
    switch (persona) {
      case 'pmo': return '🎯';
      case 'executive': return '📊';
      case 'org_leader': return '👥';
      case 'resource': return '⚡';
      default: return '📋';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      {/* Header */}
      <div className="bg-gray-800/95 backdrop-blur-sm border-b border-gray-700/50 px-6 py-4 shadow-xl">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-lg">
              {getPersonaIcon(persona)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{getPersonaTitle(persona)}</h1>
              <p className="text-gray-300">Welcome back, {user?.user_metadata?.full_name || user?.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowChat(true)}
              variant="outline"
              size="sm"
              className="border-blue-500/50 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Dashboard Assistant
            </Button>
            
            <Button
              onClick={() => setShowWidgetLibrary(true)}
              variant="outline"
              size="sm"
              className="border-green-500/50 bg-green-500/10 text-green-300 hover:bg-green-500/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Widget
            </Button>
            
            <Button
              onClick={handleSignOut}
              variant="outline"
              size="sm"
              className="border-red-500/50 bg-red-500/10 text-red-300 hover:bg-red-500/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {dashboardConfig ? (
            <DashboardGrid
              layout={dashboardConfig.layout}
              dashboardId={dashboardConfig.id}
              persona={persona}
            />
          ) : (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Setting up your dashboard...</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">We're creating your personalized dashboard experience.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Widget Library Modal */}
      {showWidgetLibrary && (
        <WidgetLibrary
          availableWidgets={availableWidgets || []}
          dashboardId={dashboardConfig?.id}
          persona={persona}
          onClose={() => setShowWidgetLibrary(false)}
        />
      )}

      {/* Dashboard Chat Modal */}
      {showChat && (
        <DashboardChat
          persona={persona}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
};

// Helper function to get default layout for each persona
const getDefaultLayoutForPersona = (persona: string) => {
  switch (persona) {
    case 'pmo':
      return [
        { id: 'portfolio-overview', component: 'ProjectPortfolioWidget', x: 0, y: 0, w: 12, h: 6 },
        { id: 'resource-allocation', component: 'ResourceAllocationWidget', x: 0, y: 6, w: 6, h: 4 },
        { id: 'strategic-pipeline', component: 'StrategyPipelineWidget', x: 6, y: 6, w: 6, h: 4 },
      ];
    case 'executive':
      return [
        { id: 'business-kpis', component: 'BusinessKPIWidget', x: 0, y: 0, w: 8, h: 4 },
        { id: 'revenue-forecast', component: 'RevenueForecastWidget', x: 8, y: 0, w: 4, h: 4 },
        { id: 'executive-summary', component: 'ExecutiveSummaryWidget', x: 0, y: 4, w: 12, h: 4 },
      ];
    case 'org_leader':
      return [
        { id: 'team-performance', component: 'TeamPerformanceWidget', x: 0, y: 0, w: 6, h: 4 },
        { id: 'department-budget', component: 'DepartmentBudgetWidget', x: 6, y: 0, w: 6, h: 4 },
        { id: 'staff-utilization', component: 'StaffUtilizationWidget', x: 0, y: 4, w: 12, h: 4 },
      ];
    case 'resource':
    default:
      return [
        { id: 'my-timesheets', component: 'TimesheetWidget', x: 0, y: 0, w: 6, h: 4 },
        { id: 'my-tasks', component: 'TaskWidget', x: 6, y: 0, w: 6, h: 4 },
        { id: 'my-goals', component: 'GoalsWidget', x: 0, y: 4, w: 12, h: 4 },
      ];
  }
};

export default PersonaDashboard;
