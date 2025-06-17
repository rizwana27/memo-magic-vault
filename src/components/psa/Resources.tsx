
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Plus, Search, Filter, Users, Clock, TrendingUp, Calendar } from 'lucide-react';

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock resource data
  const resources = [
    { id: 1, name: 'John Smith', role: 'Senior Developer', department: 'Engineering', utilization: 92, capacity: 40, billableHours: 160 },
    { id: 2, name: 'Sarah Davis', role: 'Project Manager', department: 'Operations', utilization: 87, capacity: 40, billableHours: 152 },
    { id: 3, name: 'Mike Johnson', role: 'UX Designer', department: 'Design', utilization: 95, capacity: 40, billableHours: 168 },
    { id: 4, name: 'Emily Brown', role: 'Business Analyst', department: 'Strategy', utilization: 78, capacity: 40, billableHours: 140 },
    { id: 5, name: 'David Wilson', role: 'Developer', department: 'Engineering', utilization: 85, capacity: 40, billableHours: 148 },
  ];

  const getUtilizationColor = (utilization: number) => {
    if (utilization >= 90) return 'text-red-500 bg-red-500/20';
    if (utilization >= 80) return 'text-yellow-500 bg-yellow-500/20';
    return 'text-green-500 bg-green-500/20';
  };

  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    resource.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Resource Management</h1>
          <p className="text-gray-400">Manage team capacity and utilization</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Resource
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Resources</p>
                <p className="text-2xl font-bold text-white">{resources.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Utilization</p>
                <p className="text-2xl font-bold text-white">87%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Capacity</p>
                <p className="text-2xl font-bold text-white">200h</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Overallocated</p>
                <p className="text-2xl font-bold text-red-500">2</p>
              </div>
              <Calendar className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resource Tabs */}
      <Tabs defaultValue="utilization" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
          <TabsTrigger value="utilization" className="text-gray-300 data-[state=active]:text-white">Utilization</TabsTrigger>
          <TabsTrigger value="capacity" className="text-gray-300 data-[state=active]:text-white">Capacity Planning</TabsTrigger>
          <TabsTrigger value="allocation" className="text-gray-300 data-[state=active]:text-white">Allocation</TabsTrigger>
        </TabsList>

        <TabsContent value="utilization" className="space-y-4">
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

          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Resource Utilization</CardTitle>
              <CardDescription className="text-gray-400">Current utilization rates and capacity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredResources.map((resource) => (
                  <div key={resource.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">{resource.name}</h4>
                        <p className="text-sm text-gray-400">{resource.role} • {resource.department}</p>
                      </div>
                      <Badge className={`${getUtilizationColor(resource.utilization)}`}>
                        {resource.utilization}%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Utilization</span>
                        <span className="text-white">{resource.billableHours}h / {resource.capacity}h</span>
                      </div>
                      <Progress value={resource.utilization} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capacity">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Capacity Planning</CardTitle>
              <CardDescription className="text-gray-400">Plan future resource allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Calendar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Capacity planning view coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="allocation">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Resource Allocation</CardTitle>
              <CardDescription className="text-gray-400">Manage project assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Resource allocation view coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Resources;
