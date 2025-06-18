import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog } from '@/components/ui/dialog';
import { Plus, Search, Filter, Calendar, Users, DollarSign } from 'lucide-react';
import { useProjects, useCreateProject } from '@/hooks/usePSAData';
import NewProjectForm from './forms/NewProjectForm';

const Projects = () => {
  const { data: projects, isLoading } = useProjects();
  const createProject = useCreateProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

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

  const filteredProjects = projects?.filter(project =>
    project?.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project?.client?.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleNewProject = async (data: any) => {
    console.log('Creating new project:', data);
    try {
      await createProject.mutateAsync(data);
      setShowNewProjectModal(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-gray-400">Manage your project portfolio</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowNewProjectModal(true)}
          disabled={createProject.isPending}
        >
          <Plus className="w-4 h-4 mr-2" />
          {createProject.isPending ? 'Creating...' : 'New Project'}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-700 text-white"
          />
        </div>
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Project Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-800/50">
          <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="kanban" className="text-gray-300 data-[state=active]:text-white">Kanban</TabsTrigger>
          <TabsTrigger value="gantt" className="text-gray-300 data-[state=active]:text-white">Gantt</TabsTrigger>
          <TabsTrigger value="calendar" className="text-gray-300 data-[state=active]:text-white">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-gray-800/50 border-gray-700 animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-600 rounded"></div>
                      <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => (
                <Card key={project.project_id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white text-lg">{project.project_name}</CardTitle>
                      <Badge className={`${getStatusColor(project.status)} text-white`}>
                        {project.status?.replace('_', ' ') || 'Unknown'}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-400">
                      {project.client?.client_name || 'No client assigned'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-gray-300 text-sm line-clamp-2">
                        {project.description || 'No description available'}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center text-gray-400">
                          <Calendar className="w-4 h-4 mr-1" />
                          {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'No start date'}
                        </div>
                        <div className="flex items-center text-gray-400">
                          <DollarSign className="w-4 h-4 mr-1" />
                          {project.budget ? `$${project.budget.toLocaleString()}` : 'No budget'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredProjects.length === 0 && !isLoading && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-12 text-center">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                <h3 className="text-xl font-medium text-white mb-2">No projects found</h3>
                <p className="text-gray-400 mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first project'}
                </p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowNewProjectModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="kanban">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Kanban Board</CardTitle>
              <CardDescription className="text-gray-400">Drag and drop project management</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['Planning', 'Active', 'On Hold', 'Completed'].map((column) => (
                  <div key={column} className="bg-gray-700/30 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-4 text-center">{column}</h3>
                    <div className="space-y-3">
                      {filteredProjects
                        .filter(p => p.status === column.toLowerCase().replace(' ', '_'))
                        .map((project) => (
                          <Card key={project.project_id} className="bg-gray-600/50 border-gray-600">
                            <CardContent className="p-3">
                              <h4 className="text-white text-sm font-medium">{project.project_name}</h4>
                              <p className="text-gray-400 text-xs mt-1">{project.client?.client_name}</p>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gantt">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Gantt Chart</CardTitle>
              <CardDescription className="text-gray-400">Project timeline visualization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Gantt chart view coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Project Calendar</CardTitle>
              <CardDescription className="text-gray-400">Timeline and milestone view</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Calendar view coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Project Modal */}
      <Dialog open={showNewProjectModal} onOpenChange={setShowNewProjectModal}>
        <NewProjectForm
          onSubmit={handleNewProject}
          onCancel={() => setShowNewProjectModal(false)}
        />
      </Dialog>
    </div>
  );
};

export default Projects;
