
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, Upload, X, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { usePSAData } from '@/hooks/usePSAData';

interface NewProjectFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const NewProjectForm = ({ onSubmit, onCancel }: NewProjectFormProps) => {
  const { useClients, useResources } = usePSAData();
  const { data: clients, isLoading: clientsLoading } = useClients();
  const { data: resources, isLoading: resourcesLoading } = useResources();
  
  const [formData, setFormData] = React.useState({
    name: '',
    client: '',
    projectManager: '',
    region: '',
    status: '',
    deliveryStatus: '',
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    budget: '',
    description: '',
    tags: [] as string[],
  });

  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string>('');
  const availableTags = ['High Priority', 'Backend', 'Frontend', 'Mobile', 'API', 'Database'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    if (!formData.client) {
      setError('Please select a client');
      return;
    }

    if (!formData.status) {
      setError('Please select a project status');
      return;
    }

    // Validate that the selected client exists
    const selectedClient = clients?.find(client => client.client_id === formData.client);
    if (!selectedClient) {
      setError('Selected client is invalid. Please choose a valid client from the dropdown.');
      return;
    }

    try {
      await onSubmit({ ...formData, tags: selectedTags });
    } catch (error: any) {
      console.error('Form submission error:', error);
      if (error.message?.includes('foreign key constraint')) {
        setError('The selected client does not exist. Please refresh the page and try again.');
      } else {
        setError(error.message || 'Failed to create project. Please try again.');
      }
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
      <DialogHeader>
        <DialogTitle className="text-white text-2xl">Create New Project</DialogTitle>
      </DialogHeader>
      
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700 rounded-md">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">Project Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Enter project name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="client" className="text-gray-300">Client *</Label>
            <Select 
              value={formData.client} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, client: value }))}
              disabled={clientsLoading}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder={clientsLoading ? "Loading clients..." : "Select client"} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {clients?.map((client) => (
                  <SelectItem key={client.client_id} value={client.client_id}>
                    {client.client_name} ({client.company_name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="projectManager" className="text-gray-300">Project Manager</Label>
            <Select 
              value={formData.projectManager} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, projectManager: value }))}
              disabled={resourcesLoading}
            >
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder={resourcesLoading ? "Loading resources..." : "Select project manager"} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {resources?.filter(resource => resource.active_status).map((resource) => (
                  <SelectItem key={resource.resource_id} value={resource.resource_id}>
                    {resource.full_name} - {resource.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="region" className="text-gray-300">Region</Label>
            <Select value={formData.region} onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="north-america">North America</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="asia-pacific">Asia Pacific</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="text-gray-300">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="planning">Planning</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryStatus" className="text-gray-300">Delivery Status</Label>
            <Select value={formData.deliveryStatus} onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryStatus: value }))}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select delivery status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="amber">Amber</SelectItem>
                <SelectItem value="red">Red</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-gray-800 border-gray-600 text-white",
                    !formData.startDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.startDate ? format(formData.startDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.startDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
                  initialFocus
                  className="bg-gray-800 border-gray-600"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-gray-800 border-gray-600 text-white",
                    !formData.endDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.endDate ? format(formData.endDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.endDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
                  initialFocus
                  className="bg-gray-800 border-gray-600"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget" className="text-gray-300">Budget</Label>
          <Input
            id="budget"
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
            className="bg-gray-800 border-gray-600 text-white"
            placeholder="Enter budget amount"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-gray-300">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="bg-gray-800 border-gray-600 text-white"
            placeholder="Enter project description"
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Tags</Label>
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={tag}
                  checked={selectedTags.includes(tag)}
                  onCheckedChange={() => toggleTag(tag)}
                />
                <Label htmlFor={tag} className="text-sm text-gray-300">{tag}</Label>
              </div>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedTags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-blue-600 text-white">
                  {tag}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer" 
                    onClick={() => toggleTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Attachments</Label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-400">Drop files here or click to upload</p>
            <Button variant="outline" className="mt-2 border-gray-600 text-gray-300">
              Choose Files
            </Button>
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onCancel} className="border-gray-600 text-gray-300">
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Create Project
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default NewProjectForm;
