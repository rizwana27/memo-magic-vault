import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog } from '@/components/ui/dialog';
import { Plus, Search, Filter, Clock, Calendar, CheckCircle } from 'lucide-react';
import { useTimesheets } from '@/hooks/useTimesheets';
import TimesheetEntryForm from './forms/TimesheetEntryForm';

const Timesheets = () => {
  const { timesheets, createTimesheet, isLoading } = useTimesheets();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);

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

  const handleNewTimeEntry = async (data: any) => {
    console.log('Creating new time entry:', data);
    const result = await createTimesheet(data);
    if (result.success) {
      setShowNewEntryModal(false);
    }
  };

  // Calculate stats from actual data
  const today = new Date().toISOString().split('T')[0];
  const dailyTotal = timesheets?.filter(t => t.date === today).reduce((sum, t) => sum + (t.hours || 0), 0) || 0;
  const weeklyTotal = timesheets?.reduce((sum, t) => sum + (t.hours || 0), 0) || 0;
  const pendingCount = timesheets?.filter(t => t.status === 'submitted').length || 0;
  const approvedCount = timesheets?.filter(t => t.status === 'approved').length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Timesheets</h1>
          <p className="text-gray-400">Track and manage your time entries</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowNewEntryModal(true)}
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Entry
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Today</p>
                <p className="text-2xl font-bold text-white">{dailyTotal}h</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Hours</p>
                <p className="text-2xl font-bold text-white">{weeklyTotal}h</p>
              </div>
              <Calendar className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Approved</p>
                <p className="text-2xl font-bold text-green-500">{approvedCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Entry Tab */}
      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-md">
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
                className="pl-10 bg-white/10 border-white/20 text-white"
              />
            </div>
            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Recent Time Entries</CardTitle>
              <CardDescription className="text-gray-300">Your latest timesheet entries</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-gray-600 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
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
              )}

              {filteredTimesheets.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                  <h3 className="text-xl font-medium text-white mb-2">No timesheets found</h3>
                  <p className="text-gray-400 mb-4">Start tracking your time by creating your first entry</p>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowNewEntryModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Entry
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Weekly Timesheet</CardTitle>
              <CardDescription className="text-gray-400">Summary of all time entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                <h3 className="text-xl font-medium text-white mb-2">Weekly View</h3>
                <p className="text-gray-400">Weekly timesheet view coming soon</p>
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
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                <h3 className="text-xl font-medium text-white mb-2">Approval System</h3>
                <p className="text-gray-400">Timesheet approval workflow coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Time Entry Modal */}
      <Dialog open={showNewEntryModal} onOpenChange={setShowNewEntryModal}>
        <TimesheetEntryForm
          onSubmit={handleNewTimeEntry}
          onCancel={() => setShowNewEntryModal(false)}
          isLoading={isLoading}
        />
      </Dialog>
    </div>
  );
};

export default Timesheets;
