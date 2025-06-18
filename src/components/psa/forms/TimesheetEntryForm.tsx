
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
import { CalendarIcon, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { usePSAData } from '@/hooks/usePSAData';

interface TimesheetEntryFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const TimesheetEntryForm = ({ onSubmit, onCancel, isLoading = false }: TimesheetEntryFormProps) => {
  const { useProjects, useTasks } = usePSAData();
  const { data: projects } = useProjects();
  const { data: tasks } = useTasks();
  
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTask, setSelectedTask] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [billable, setBillable] = useState(true);
  const [notes, setNotes] = useState('');
  const [totalHours, setTotalHours] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter tasks based on selected project
  const filteredTasks = tasks?.filter(task => task.project_id === selectedProject) || [];

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedProject) {
      newErrors.project = 'Project is required';
    }

    if (!selectedTask) {
      newErrors.task = 'Task is required';
    }

    if (totalHours <= 0) {
      newErrors.hours = 'Hours must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || isLoading) return;

    onSubmit({
      project: selectedProject,
      task: selectedTask,
      date: date.toISOString(),
      startTime,
      endTime,
      hours: totalHours,
      billable,
      notes,
    });
  };

  const selectedProjectName = projects?.find(p => p.id === selectedProject)?.name;
  const selectedTaskName = filteredTasks.find(t => t.id === selectedTask)?.title;

  return (
    <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-white text-xl">Log Time Entry</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Project Selection */}
          <div className="space-y-2">
            <Label htmlFor="project" className="text-gray-200">Project *</Label>
            <Select 
              value={selectedProject} 
              onValueChange={(value) => {
                setSelectedProject(value);
                setSelectedTask(''); // Reset task when project changes
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {projects?.map((project) => (
                  <SelectItem key={project.id} value={project.id} className="text-white hover:bg-gray-700">
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.project && <p className="text-red-400 text-sm">{errors.project}</p>}
          </div>

          {/* Task Selection */}
          <div className="space-y-2">
            <Label htmlFor="task" className="text-gray-200">Task *</Label>
            <Select 
              value={selectedTask} 
              onValueChange={setSelectedTask} 
              disabled={!selectedProject || isLoading}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select a task" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {filteredTasks.map((task) => (
                  <SelectItem key={task.id} value={task.id} className="text-white hover:bg-gray-700">
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.task && <p className="text-red-400 text-sm">{errors.task}</p>}
          </div>
        </div>

        {/* Date Selection */}
        <div className="space-y-2">
          <Label className="text-gray-200">Date *</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={isLoading}
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
                onSelect={setDate}
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
                onChange={(e) => setStartTime(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white"
                required
                disabled={isLoading}
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
                onChange={(e) => setEndTime(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white"
                required
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {errors.hours && <p className="text-red-400 text-sm">{errors.hours}</p>}

        {/* Billable Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="billable"
            checked={billable}
            onCheckedChange={setBillable}
            disabled={isLoading}
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
            disabled={isLoading}
          />
        </div>

        {/* Summary */}
        {selectedProject && selectedTask && totalHours > 0 && (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <h4 className="text-white font-medium mb-2">Summary</h4>
            <p className="text-gray-200">
              You're logging <span className="font-semibold text-blue-400">{totalHours.toFixed(1)} hours</span> on{' '}
              <span className="font-semibold text-green-400">{selectedProjectName}</span> – Task:{' '}
              <span className="font-semibold text-purple-400">{selectedTaskName}</span>
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
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isLoading || !selectedProject || !selectedTask || totalHours <= 0}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging...
            </>
          ) : (
            'Log Time'
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default TimesheetEntryForm;
