
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Filter, Clock, Calendar, CheckCircle } from 'lucide-react';
import { usePSAData } from '@/hooks/usePSAData';

const Timesheets = () => {
  const { useTimesheets } = usePSAData();
  const { data: timesheets, isLoading } = useTimesheets();
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'submitted': return 'bg-blue-500';
      case 'draft': return 'bg-gray-500';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredTimesheets = timesheets?.filter(timesheet =>
    timesheet.project?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    timesheet.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Mock weekly timesheet data
  const weeklyData = [
    { date: '2024-01-15', project: 'Project Alpha', task: 'Development', hours: 8, status: 'draft' },
    { date: '2024-01-16', project: 'Project Beta', task: 'Testing', hours: 6, status: 'submitted' },
    { date: '2024-01-17', project: 'Project Alpha', task: 'Code Review', hours: 4, status: 'approved' },
    { date: '2024-01-18', project: 'Project Gamma', task: 'Planning', hours: 7, status: 'draft' },
    { date: '2024-01-19', project: 'Project Beta', task: 'Bug Fixes', hours: 5, status: 'submitted' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Timesheets</h1>
          <p className="text-gray-400">Track and manage your time entries</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Entry
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">This Week</p>
                <p className="text-2xl font-bold text-white">32h</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-500">5</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Approved</p>
                <p className="text-2xl font-bold text-green-500">12</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Hours</p>
                <p className="text-2xl font-bold text-white">128h</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timesheet Tabs */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
          <TabsTrigger value="daily" className="text-gray-300 data-[state=active]:text-white">Daily Entry</TabsTrigger>
          <TabsTrigger value="weekly" className="text-gray-300 data-[state=active]:text-white">Weekly View</TabsTrigger>
          <TabsTrigger value="approval" className="text-gray-300 data-[state=active]:text-white">Approval</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search timesheets..."
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
              <CardTitle className="text-white">Recent Time Entries</CardTitle>
              <CardDescription className="text-gray-400">Your latest timesheet entries</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Project</TableHead>
                    <TableHead className="text-gray-300">Description</TableHead>
                    <TableHead className="text-gray-300">Hours</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTimesheets.slice(0, 10).map((timesheet) => (
                    <TableRow key={timesheet.id} className="border-gray-700">
                      <TableCell className="text-gray-300">
                        {new Date(timesheet.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-white">
                        {timesheet.project?.name || 'No Project'}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {timesheet.description || 'No description'}
                      </TableCell>
                      <TableCell className="text-white font-medium">
                        {timesheet.hours}h
                      </TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(timesheet.status)} text-white`}>
                          {timesheet.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Weekly Timesheet</CardTitle>
              <CardDescription className="text-gray-400">Week of January 15 - 19, 2024</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Project</TableHead>
                    <TableHead className="text-gray-300">Task</TableHead>
                    <TableHead className="text-gray-300">Hours</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {weeklyData.map((entry, index) => (
                    <TableRow key={index} className="border-gray-700">
                      <TableCell className="text-gray-300">
                        {new Date(entry.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-white">{entry.project}</TableCell>
                      <TableCell className="text-gray-300">{entry.task}</TableCell>
                      <TableCell className="text-white font-medium">{entry.hours}h</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(entry.status)} text-white`}>
                          {entry.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-700">
                <span className="text-gray-400">Total Hours:</span>
                <span className="text-white font-bold text-lg">30h</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approval">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Timesheet Approvals</CardTitle>
              <CardDescription className="text-gray-400">Review and approve team timesheets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'John Smith', project: 'Project Alpha', hours: 40, status: 'pending' },
                  { name: 'Sarah Davis', project: 'Project Beta', hours: 38, status: 'pending' },
                  { name: 'Mike Johnson', project: 'Project Gamma', hours: 42, status: 'pending' },
                ].map((approval, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">{approval.name}</h4>
                      <p className="text-gray-400 text-sm">{approval.project} • {approval.hours} hours</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-600/20">
                        Reject
                      </Button>
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        Approve
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Timesheets;
