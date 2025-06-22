import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog } from '@/components/ui/dialog';
import { Plus, Search, Filter, User, Mail, Phone, Calendar } from 'lucide-react';
import { useResources, useCreateResource } from '@/hooks/usePSAData';
import NewResourceForm from './forms/NewResourceForm';
import CapacityPlanning from './CapacityPlanning';

const Resources = () => {
  const { data: resources, isLoading } = useResources();
  const createResource = useCreateResource();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewResourceModal, setShowNewResourceModal] = useState(false);

  // Listen for custom event from Dashboard
  useEffect(() => {
    const handleOpenModal = () => {
      setShowNewResourceModal(true);
    };

    window.addEventListener('openResourceModal', handleOpenModal);
    return () => {
      window.removeEventListener('openResourceModal', handleOpenModal);
    };
  }, []);

  const getStatusColor = (status?: boolean) => {
    return status ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = (status?: boolean) => {
    return status ? 'Active' : 'Inactive';
  };

  const filteredResources = resources?.filter(resource =>
    resource?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource?.email_address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource?.department?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleNewResource = async (data: any) => {
    console.log('Creating new resource:', data);
    try {
      await createResource.mutateAsync(data);
      setShowNewResourceModal(false);
    } catch (error) {
      console.error('Error creating resource:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Resources</h1>
          <p className="text-gray-400">Manage your team and their allocations</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowNewResourceModal(true)}
          disabled={createResource.isPending}
        >
          <Plus className="w-4 h-4 mr-2" />
          {createResource.isPending ? 'Adding...' : 'Add Resource'}
        </Button>
      </div>

      {/* Resource Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
          <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="capacity" className="text-gray-300 data-[state=active]:text-white">
            Capacity Planning
          </TabsTrigger>
          <TabsTrigger value="utilization" className="text-gray-300 data-[state=active]:text-white">
            Utilization
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search resources..."
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

          {/* Resources Grid */}
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
              {filteredResources.map((resource) => (
                <Card key={resource.resource_id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white text-lg">{resource.full_name}</CardTitle>
                      <Badge className={`${getStatusColor(resource.active_status)} text-white`}>
                        {getStatusText(resource.active_status)}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-400">
                      {resource.department || 'No department assigned'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {resource.email_address && (
                        <div className="flex items-center text-gray-300 text-sm">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {resource.email_address}
                        </div>
                      )}
                      
                      {resource.phone_number && (
                        <div className="flex items-center text-gray-300 text-sm">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {resource.phone_number}
                        </div>
                      )}
                      
                      {resource.role && (
                        <div className="flex items-center text-gray-300 text-sm">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          {resource.role}
                        </div>
                      )}
                      
                      {resource.join_date && (
                        <div className="flex items-center text-gray-300 text-sm">
                          <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                          Joined: {new Date(resource.join_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredResources.length === 0 && !isLoading && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-12 text-center">
                <User className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                <h3 className="text-xl font-medium text-white mb-2">No resources found</h3>
                <p className="text-gray-400 mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first team member'}
                </p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowNewResourceModal(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Resource
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="capacity">
          <CapacityPlanning />
        </TabsContent>

        <TabsContent value="utilization">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Resource Utilization Analytics</CardTitle>
              <CardDescription className="text-gray-400">
                Detailed utilization metrics and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Advanced utilization analytics coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Resource Modal */}
      <Dialog open={showNewResourceModal} onOpenChange={setShowNewResourceModal}>
        <NewResourceForm
          onSubmit={handleNewResource}
          onCancel={() => setShowNewResourceModal(false)}
        />
      </Dialog>
    </div>
  );
};

export default Resources;
