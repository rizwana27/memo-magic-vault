
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Calendar, DollarSign, User } from 'lucide-react';
import { useProjectApi } from '@/hooks/useApiIntegration';
import EditProjectForm from '../forms/EditProjectForm';

interface ProjectDetailModalProps {
  projectId: string | null;
  onClose: () => void;
}

const ProjectDetailModal = ({ projectId, onClose }: ProjectDetailModalProps) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const { data: project, isLoading } = useProjectApi(projectId || '');

  if (!projectId) return null;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'planning': return 'bg-yellow-500';
      case 'on_hold': return 'bg-orange-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (showEditForm) {
    return (
      <EditProjectForm
        project={project}
        onClose={() => setShowEditForm(false)}
        onCancel={() => setShowEditForm(false)}
      />
    );
  }

  return (
    <Dialog open={!!projectId} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            Project Details
            <Button
              onClick={() => setShowEditForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-6 bg-gray-600 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-600 rounded w-3/4 animate-pulse"></div>
          </div>
        ) : project ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-white">{project.project_name}</h2>
              <Badge className={`${getStatusColor(project.status)} text-white`}>
                {project.status?.replace('_', ' ') || 'Unknown'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Client
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">{project.client?.client_name || 'No client assigned'}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300 flex items-center">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Budget
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">
                    {project.budget ? `$${project.budget.toLocaleString()}` : 'No budget set'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Start Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">
                    {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'No start date'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    End Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">
                    {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'No end date'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {project.description && (
              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-gray-300">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">{project.description}</p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>Project not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProjectDetailModal;
