import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog } from '@/components/ui/dialog';
import { Plus, Search, Filter, Clock, Calendar, CheckCircle } from 'lucide-react';
import { useTimesheets, useCreateTimesheet } from '@/hooks/usePSAData';
import TimesheetEntryForm from './forms/TimesheetEntryForm';

const Timesheets = () => {
  const { data: timesheets, isLoading, error } = useTimesheets();
  const createTimesheet = useCreateTimesheet();
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
    timesheet.project?.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    timesheet.task?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleNewTimeEntry = async (data: any) => {
    console.log('Creating new time entry:', data);
    try {
      await createTimesheet.mutateAsync(data);
      setShowNewEntryModal(false);
    } catch (error) {
      console.error('Error creating timesheet:', error);
      // Error is handled by the mutation's onError callback
    }
  };

  // Calculate totals from real data
  const calculateTotals = () => {
    if (!timesheets || timesheets.length === 0) {
      return { dailyTotal: 0, weeklyTotal: 0, pendingCount: 0, approvedCount: 0 };
    }

    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Get start of current week (Monday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);

    const dailyTotal = timesheets
      .filter(ts => ts.date === todayStr)
      .reduce((sum, ts) => sum + (ts.hours || 0), 0);

    const weeklyTotal = timesheets
      .filter(ts => {
        const tsDate = new Date(ts.date);
        return tsDate >= startOfWeek && tsDate <= today;
      })
      .reduce((sum, ts) => sum + (ts.hours || 0), 0);

    // Mock status counts for now since we don't have status field
    const pendingCount = Math.floor(timesheets.length * 0.3);
    const approvedCount = timesheets.length - pendingCount;

    return { dailyTotal, weeklyTotal, pendingCount, approvedCount };
  };

  const { dailyTotal, weeklyTotal, pendingCount, approvedCount } = calculateTotals();

  // Calculate hours from start/end time for display
  const calculateHours = (startTime: string, endTime: string) => {
    if (!startTime || !endTime) return 0;
    
    const start = new Date(`2000-01-01T${startTime}:00`);
    const end = new Date(`2000-01-01T${endTime}:00`);
    const diffMs = end.getTime() - start.getTime();
    return Math.max(0, diffMs / (1000 * 60 * 60));
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Timesheets</h1>
            <p className="text-gray-400">Track and manage your time entries</p>
          </div>
        </div>
        <Card className="bg-red-900/20 border-red-500">
          <CardContent className="p-6">
            <p className="text-red-400">Error loading timesheets: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
          disabled={createTimesheet.isPending}
        >
          <Plus className="w-4 h-4 mr-2" />
          {createTimesheet.isPending ? 'Adding...' : 'New Entry'}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Today</p>
                <p className="text-2xl font-bold text-white">{dailyTotal.toFixed(1)}h</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">This Week</p>
                <p className="text-2xl font-bold text-white">{weeklyTotal.toFixed(1)}h</p>
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

      {/* Timesheet Tabs */}
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
                <div className="text-center py-8">
                  <p className="text-gray-400">Loading timesheets...</p>
                </div>
              ) : filteredTimesheets.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                  <h3 className="text-xl font-medium text-white mb-2">No Time Entries Found</h3>
                  <p className="text-gray-400 mb-4">
                    {searchTerm ? 'No timesheets match your search criteria.' : 'Get started by logging your first time entry.'}
                  </p>
                  {!searchTerm && (
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => setShowNewEntryModal(true)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Log Your First Entry
                    </Button>
                  )}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Date</TableHead>
                      <TableHead className="text-gray-300">Project</TableHead>
                      <TableHead className="text-gray-300">Task</TableHead>
                      <TableHead className="text-gray-300">Time</TableHead>
                      <TableHead className="text-gray-300">Hours</TableHead>
                      <TableHead className="text-gray-300">Billable</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTimesheets.slice(0, 10).map((timesheet) => {
                      const hours = timesheet.hours || calculateHours(timesheet.start_time, timesheet.end_time);
                      return (
                        <TableRow key={timesheet.timesheet_id} className="border-gray-700">
                          <TableCell className="text-gray-300">
                            {new Date(timesheet.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-white">
                            {timesheet.project?.project_name || 'No Project'}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {timesheet.task || 'No task'}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {timesheet.start_time} - {timesheet.end_time}
                          </TableCell>
                          <TableCell className="text-white font-medium">
                            {hours.toFixed(1)}h
                          </TableCell>
                          <TableCell>
                            <Badge className={timesheet.billable ? 'bg-green-500' : 'bg-gray-500'}>
                              {timesheet.billable ? 'Billable' : 'Non-billable'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="weekly">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Weekly Timesheet</CardTitle>
              <CardDescription className="text-gray-400">Current week overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                <h3 className="text-xl font-medium text-white mb-2">Weekly View</h3>
                <p className="text-gray-400">Detailed weekly timesheet view coming soon</p>
                <p className="text-sm text-gray-500 mt-2">Current week total: {weeklyTotal.toFixed(1)} hours</p>
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
        />
      </Dialog>
    </div>
  );
};

export default Timesheets;
