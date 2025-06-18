import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useClients } from '@/hooks/usePSAData';

interface NewProjectFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const NewProjectForm = ({ onSubmit, onCancel }: NewProjectFormProps) => {
  const { data: clients, isLoading } = useClients();
  const [projectName, setProjectName] = useState('');
  const [clientId, setClientId] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('planning');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [budget, setBudget] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [deliveryStatus, setDeliveryStatus] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      project_name: projectName,
      client_id: clientId,
      description,
      status,
      start_date: startDate ? startDate.toISOString() : null,
      end_date: endDate ? endDate.toISOString() : null,
      budget: budget ? parseFloat(budget) : 0,
      attachments,
      delivery_status: deliveryStatus ? 'complete' : 'incomplete',
    });
  };

  return (
    <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-2xl">
      <DialogHeader>
        <DialogTitle className="text-white">Create New Project</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="bg-white/10 border-white/20"
          />
        </div>
        <div>
          <Label htmlFor="clientId">Client</Label>
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              {clients?.map((client) => (
                <SelectItem key={client.client_id} value={client.client_id} className="text-white hover:bg-gray-700">
                  {client.client_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-white/10 border-white/20"
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="planning" className="text-white hover:bg-gray-700">Planning</SelectItem>
              <SelectItem value="active" className="text-white hover:bg-gray-700">Active</SelectItem>
              <SelectItem value="on_hold" className="text-white hover:bg-gray-700">On Hold</SelectItem>
              <SelectItem value="completed" className="text-white hover:bg-gray-700">Completed</SelectItem>
              <SelectItem value="cancelled" className="text-white hover:bg-gray-700">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  disabled={(date) =>
                    date > new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  disabled={(date) =>
                    date > new Date()
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div>
          <Label htmlFor="budget">Budget</Label>
          <Input
            type="number"
            id="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="bg-white/10 border-white/20"
          />
        </div>
        <div>
          <Label htmlFor="attachments">Attachments</Label>
          <Input
            type="file"
            id="attachments"
            multiple
            onChange={(e) => {
              if (e.target.files) {
                setAttachments(Array.from(e.target.files));
              }
            }}
            className="bg-white/10 border-white/20"
          />
        </div>
        <div>
          <Label htmlFor="deliveryStatus">Delivery Status</Label>
          <Switch id="deliveryStatus" checked={deliveryStatus} onCheckedChange={setDeliveryStatus} />
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default NewProjectForm;
