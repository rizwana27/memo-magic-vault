
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  FolderOpen, 
  Clock,
  DollarSign,
  TrendingUp,
  Plus,
  UserPlus,
  UserCheck,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download
} from 'lucide-react';
import { 
  useProjectsApi, 
  useClientsApi, 
  useResourcesApi, 
  useTimesheetsApi, 
  useInvoicesApi,
  useCreateProjectApi,
  useCreateResourceApi
} from '@/hooks/useApiIntegration';
import NewProjectForm from './forms/NewProjectForm';
import NewResourceForm from './forms/NewResourceForm';
import ClientInviteForm from './forms/ClientInviteForm';
import KPICards from './KPICards';
import { OutboundApiService } from '@/services/outboundApiService';
import { useToast } from '@/hooks/use-toast';

interface DashboardProps {
  onTabChange?: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onTabChange }) => {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [showClientInviteForm, setShowClientInviteForm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { toast } = useToast();
  
  // Use the new API hooks
  const { data: projects = [], isLoading: projectsLoading } = useProjectsApi();
  const { data: clients = [], isLoading: clientsLoading } = useClientsApi();
  const { data: resources = [], isLoading: resourcesLoading } = useResourcesApi();
  const { data: timesheets = [], isLoading: timesheetsLoading } = useTimesheetsApi();
  const { data: invoices = [], isLoading: invoicesLoading } = useInvoicesApi();
  
  const createProject = useCreateProjectApi();
  const createResource = useCreateResourceApi();

  // Calculate KPIs from real data
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const pendingInvoices = invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').length;
  const utilization = resources.length > 0 ? Math.round((resources.filter(r => r.active_status).length / resources.length) * 100) : 0;

  const isLoading = projectsLoading || clientsLoading || resourcesLoading || timesheetsLoading || invoicesLoading;

  const handleAddProject = () => {
    if (onTabChange) {
      onTabChange('projects');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openProjectModal'));
      }, 100);
    } else {
      setShowProjectForm(true);
    }
  };

  const handleAddResource = () => {
    if (onTabChange) {
      onTabChange('resources');
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openResourceModal'));
      }, 100);
    } else {
      setShowResourceForm(true);
    }
  };

  const handleCreateProject = async (data: any) => {
    try {
      await createProject.mutateAsync(data);
      setShowProjectForm(false);
      
      // Send notification email if needed
      if (data.project_manager_email) {
        await OutboundApiService.sendEmailNotification({
          to: [data.project_manager_email],
          subject: `New Project Assigned: ${data.project_name}`,
          message: `You have been assigned as project manager for ${data.project_name}`,
          type: 'project_update',
          relatedId: data.project_id
        });
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleCreateResource = async (data: any) => {
    try {
      await createResource.mutateAsync(data);
      setShowResourceForm(false);
      
      // Send welcome email
      if (data.email_address) {
        await OutboundApiService.sendEmailNotification({
          to: [data.email_address],
          subject: 'Welcome to the Team!',
          message: `Welcome ${data.full_name}! Your account has been created.`,
          type: 'task_assignment',
          relatedId: data.resource_id
        });
      }
    } catch (error) {
      console.error('Error creating resource:', error);
    }
  };

  const handleExportData = async (type: 'projects' | 'resources' | 'timesheets' | 'financials') => {
    setIsExporting(true);
    try {
      await OutboundApiService.exportData({
        type,
        format: 'csv',
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          end: new Date().toISOString().split('T')[0]
        }
      });
      
      toast({
        title: "Export Started",
        description: `${type} data export has been initiated. Download will start shortly.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: `Failed to export ${type} data. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-300 mt-1">Welcome back! Here's what's happening with your projects.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => handleExportData('projects')}
            disabled={isExporting}
            className="border-gray-600 text-gray-300"
          >
            <Download className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export Data'}
          </Button>
        </div>
      </div>

      {/* Enhanced KPI Cards with Real Data */}
      <KPICards />

      {/* Traditional KPI Cards with Real-time Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-100/10 border-blue-400/30 backdrop-blur-sm hover:bg-blue-100/15 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Active Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-blue-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {isLoading ? '...' : activeProjects}
            </div>
            <p className="text-xs text-blue-200 mt-1">
              {projects.length} total projects
            </p>
          </CardContent>
        </Card>

        <Card className="bg-green-100/10 border-green-400/30 backdrop-blur-sm hover:bg-green-100/15 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-100">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {isLoading ? '...' : `$${totalRevenue.toLocaleString()}`}
            </div>
            <p className="text-xs text-green-200 mt-1">
              {pendingInvoices} pending invoices
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-100/10 border-purple-400/30 backdrop-blur-sm hover:bg-purple-100/15 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">Team Members</CardTitle>
            <Users className="h-4 w-4 text-purple-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {isLoading ? '...' : resources.length}
            </div>
            <p className="text-xs text-purple-200 mt-1">
              {resources.filter(r => r.active_status).length} active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-orange-100/10 border-orange-400/30 backdrop-blur-sm hover:bg-orange-100/15 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {isLoading ? '...' : `${utilization}%`}
            </div>
            <Progress value={utilization} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 transition-all duration-300 cursor-pointer group" onClick={handleAddProject}>
          <CardContent className="p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
              <Plus className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Add Project</h3>
            <p className="text-sm text-gray-300">Create a new project and start tracking progress</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 transition-all duration-300 cursor-pointer group" onClick={() => setShowClientInviteForm(true)}>
          <CardContent className="p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600/30 transition-colors">
              <UserPlus className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Invite Client</h3>
            <p className="text-sm text-gray-300">Send an invitation to a new client</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 transition-all duration-300 cursor-pointer group" onClick={handleAddResource}>
          <CardContent className="p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600/30 transition-colors">
              <UserCheck className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Add Resource</h3>
            <p className="text-sm text-gray-300">Onboard a new team member</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Project Status with Real Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card className="bg-gray-800/50 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-blue-400" />
              Recent Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg animate-pulse">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                    </div>
                    <div className="w-16 h-4 bg-gray-600 rounded"></div>
                  </div>
                ))
              ) : (
                projects.slice(0, 5).map((project) => (
                  <div key={project.project_id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{project.project_name}</p>
                      <p className="text-sm text-gray-300">{project.client?.client_name || project.client_id}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.status === 'active' && <CheckCircle className="h-4 w-4 text-green-400" />}
                      {project.status === 'planning' && <Clock className="h-4 w-4 text-yellow-400" />}
                      {project.status === 'on_hold' && <AlertTriangle className="h-4 w-4 text-orange-400" />}
                      {project.status === 'completed' && <CheckCircle className="h-4 w-4 text-blue-400" />}
                      {project.status === 'cancelled' && <XCircle className="h-4 w-4 text-red-400" />}
                      <span className="text-xs text-gray-300 capitalize">{project.status}</span>
                    </div>
                  </div>
                ))
              )}
              {!isLoading && projects.length === 0 && (
                <p className="text-gray-300 text-center py-4">No projects yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Team Overview */}
        <Card className="bg-gray-800/50 border-gray-600">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-400" />
              Team Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg animate-pulse">
                    <div className="flex-1">
                      <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                    </div>
                    <div className="w-16 h-4 bg-gray-600 rounded"></div>
                  </div>
                ))
              ) : (
                resources.slice(0, 5).map((resource) => (
                  <div key={resource.resource_id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{resource.full_name}</p>
                      <p className="text-sm text-gray-300">{resource.role} • {resource.department}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {resource.active_status ? (
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      ) : (
                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      )}
                      <span className="text-xs text-gray-300">
                        {resource.active_status ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                ))
              )}
              {!isLoading && resources.length === 0 && (
                <p className="text-gray-300 text-center py-4">No team members yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Forms */}
      {showProjectForm && (
        <NewProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setShowProjectForm(false)}
        />
      )}
      
      {showResourceForm && (
        <NewResourceForm
          onSubmit={handleCreateResource}
          onCancel={() => setShowResourceForm(false)}
        />
      )}
      
      <ClientInviteForm open={showClientInviteForm} onOpenChange={setShowClientInviteForm} />
    </div>
  );
};

export default Dashboard;
