
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
  XCircle
} from 'lucide-react';
import { useProjects, useClients, useResources, useTimesheets, useInvoices } from '@/hooks/usePSAData';
import NewProjectForm from './forms/NewProjectForm';
import NewResourceForm from './forms/NewResourceForm';
import ClientInviteForm from './forms/ClientInviteForm';

interface DashboardProps {
  onTabChange?: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onTabChange }) => {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [showClientInviteForm, setShowClientInviteForm] = useState(false);

  const { data: projects = [] } = useProjects();
  const { data: clients = [] } = useClients();
  const { data: resources = [] } = useResources();
  const { data: timesheets = [] } = useTimesheets();
  const { data: invoices = [] } = useInvoices();

  // Calculate KPIs from real data
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const totalRevenue = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total_amount || 0), 0);
  const pendingInvoices = invoices.filter(inv => inv.status === 'sent' || inv.status === 'overdue').length;
  const utilization = resources.length > 0 ? Math.round((resources.filter(r => r.active_status).length / resources.length) * 100) : 0;

  const handleAddProject = () => {
    if (onTabChange) {
      onTabChange('projects');
      setTimeout(() => setShowProjectForm(true), 100);
    } else {
      setShowProjectForm(true);
    }
  };

  const handleAddResource = () => {
    if (onTabChange) {
      onTabChange('resources');
      setTimeout(() => setShowResourceForm(true), 100);
    } else {
      setShowResourceForm(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here's what's happening with your projects.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-300">Active Projects</CardTitle>
            <FolderOpen className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activeProjects}</div>
            <p className="text-xs text-blue-300 mt-1">
              {projects.length} total projects
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-300">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-300 mt-1">
              {pendingInvoices} pending invoices
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Team Members</CardTitle>
            <Users className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{resources.length}</div>
            <p className="text-xs text-purple-300 mt-1">
              {resources.filter(r => r.active_status).length} active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-300">Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{utilization}%</div>
            <Progress value={utilization} className="mt-2 h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer group" onClick={handleAddProject}>
          <CardContent className="p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
              <Plus className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Add Project</h3>
            <p className="text-sm text-gray-400">Create a new project and start tracking progress</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer group" onClick={() => setShowClientInviteForm(true)}>
          <CardContent className="p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600/30 transition-colors">
              <UserPlus className="h-6 w-6 text-green-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Invite Client</h3>
            <p className="text-sm text-gray-400">Send an invitation to a new client</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer group" onClick={handleAddResource}>
          <CardContent className="p-6 text-center">
            <div className="mx-auto w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600/30 transition-colors">
              <UserCheck className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="font-semibold text-white mb-2">Add Resource</h3>
            <p className="text-sm text-gray-400">Onboard a new team member</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Project Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-blue-400" />
              Recent Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.slice(0, 5).map((project) => (
                <div key={project.project_id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{project.project_name}</p>
                    <p className="text-sm text-gray-400">{project.client_id}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {project.status === 'active' && <CheckCircle className="h-4 w-4 text-green-400" />}
                    {project.status === 'planning' && <Clock className="h-4 w-4 text-yellow-400" />}
                    {project.status === 'on_hold' && <AlertTriangle className="h-4 w-4 text-orange-400" />}
                    {project.status === 'completed' && <CheckCircle className="h-4 w-4 text-blue-400" />}
                    {project.status === 'cancelled' && <XCircle className="h-4 w-4 text-red-400" />}
                    <span className="text-xs text-gray-400 capitalize">{project.status}</span>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-gray-400 text-center py-4">No projects yet</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Team Utilization */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-400" />
              Team Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resources.slice(0, 5).map((resource) => (
                <div key={resource.resource_id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                  <div>
                    <p className="font-medium text-white">{resource.full_name}</p>
                    <p className="text-sm text-gray-400">{resource.role} • {resource.department}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {resource.active_status ? (
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    ) : (
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    )}
                    <span className="text-xs text-gray-400">
                      {resource.active_status ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
              {resources.length === 0 && (
                <p className="text-gray-400 text-center py-4">No team members yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modal Forms */}
      <NewProjectForm open={showProjectForm} onOpenChange={setShowProjectForm} />
      <NewResourceForm open={showResourceForm} onOpenChange={setShowResourceForm} />
      <ClientInviteForm open={showClientInviteForm} onOpenChange={setShowClientInviteForm} />
    </div>
  );
};

export default Dashboard;
