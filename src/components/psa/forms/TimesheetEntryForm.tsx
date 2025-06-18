import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useProjects } from '@/hooks/usePSAData';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TimesheetEntryFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const TimesheetEntryForm = ({ onSubmit, onCancel }: TimesheetEntryFormProps) => {
  const { data: projects, isLoading: projectsLoading } = useProjects();
  
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [billable, setBillable] = useState(true);
  const [notes, setNotes] = useState('');
  const [totalHours, setTotalHours] = useState(0);
  const [error, setError] = useState<string>('');

  // Common tasks - in a real app, these would come from a tasks table
  const commonTasks = [
    'Development',
    'Code Review', 
    'Testing',
    'Bug Fixes',
    'Planning',
    'Documentation',
    'Meeting',
    'Research',
    'Deployment',
    'Training'
  ];

  // Calculate total hours when start/end time changes
  useEffect(() => {
    if (startTime && endTime) {
      const start = new Date(`2000-01-01T${startTime}:00`);
      const end = new Date(`2000-01-01T${endTime}:00`);
      const diffMs = end.getTime() - start.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      setTotalHours(Math.max(0, diffHours));
    }
  }, [startTime, endTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!selectedProject) {
      setError('Please select a project');
      return;
    }

    if (!selectedTask) {
      setError('Please select a task');
      return;
    }

    if (!date) {
      setError('Please select a date');
      return;
    }

    if (totalHours <= 0) {
      setError('End time must be after start time');
      return;
    }

    // Find the selected project to get its ID
    const project = projects?.find(p => p.project_id === selectedProject);
    if (!project) {
      setError('Selected project not found. Please refresh and try again.');
      return;
    }

    onSubmit({
      project: selectedProject, // This is the project_id
      task: selectedTask,
      date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      startTime,
      endTime,
      hours: totalHours,
      billable,
      notes,
    });
  };

  const selectedProjectName = projects?.find(p => p.project_id === selectedProject)?.project_name;

  if (projectsLoading) {
    return (
      <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Log Time Entry</DialogTitle>
        </DialogHeader>
        <div className="py-8 text-center text-gray-300">Loading projects...</div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-white text-xl">Log Time Entry</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert className="border-red-500 bg-red-500/10">
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Project Selection */}
          <div className="space-y-2">
            <Label htmlFor="project" className="text-gray-200">Project *</Label>
            <Select value={selectedProject} onValueChange={(value) => {
              setSelectedProject(value);
              setSelectedTask(''); // Reset task when project changes
              setError(''); // Clear error when user makes changes
            }}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600 max-h-60 overflow-y-auto">
                {projects?.map((project) => (
                  <SelectItem key={project.project_id} value={project.project_id} className="text-white hover:bg-gray-700">
                    {project.project_name} {project.client && `(${project.client.client_name})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Task Selection */}
          <div className="space-y-2">
            <Label htmlFor="task" className="text-gray-200">Task *</Label>
            <Select value={selectedTask} onValueChange={(value) => {
              setSelectedTask(value);
              setError(''); // Clear error when user makes changes
            }} disabled={!selectedProject}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select a task" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {commonTasks.map((task) => (
                  <SelectItem key={task} value={task} className="text-white hover:bg-gray-700">
                    {task}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date Selection */}
        <div className="space-y-2">
          <Label className="text-gray-200">Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20",
                  !date && "text-gray-400"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  setError(''); // Clear error when user makes changes
                }}
                initialFocus
                className="bg-gray-800 text-white"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime" className="text-gray-200">Start Time *</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setError(''); // Clear error when user makes changes
                }}
                className="pl-10 bg-white/10 border-white/20 text-white"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endTime" className="text-gray-200">End Time *</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  setError(''); // Clear error when user makes changes
                }}
                className="pl-10 bg-white/10 border-white/20 text-white"
                required
              />
            </div>
          </div>
        </div>

        {/* Billable Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="billable"
            checked={billable}
            onCheckedChange={setBillable}
          />
          <Label htmlFor="billable" className="text-gray-200">Billable</Label>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-gray-200">Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            placeholder="Add any additional notes..."
            rows={3}
          />
        </div>

        {/* Summary */}
        {selectedProject && selectedTask && totalHours > 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <h4 className="text-white font-medium mb-2">Summary</h4>
            <p className="text-gray-200">
              You're logging <span className="font-semibold text-blue-400">{totalHours.toFixed(1)} hours</span> on{' '}
              <span className="font-semibold text-green-400">{selectedProjectName}</span> – Task:{' '}
              <span className="font-semibold text-purple-400">{selectedTask}</span>
            </p>
            {billable && (
              <p className="text-sm text-green-400 mt-1">✓ Billable time</p>
            )}
          </div>
        )}
      </form>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={!selectedProject || !selectedTask || totalHours <= 0}
        >
          Log Time
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default TimesheetEntryForm;
