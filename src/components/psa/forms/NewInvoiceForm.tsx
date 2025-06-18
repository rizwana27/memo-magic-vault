
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CalendarIcon, Plus, Trash2, Upload, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { usePSAData } from '@/hooks/usePSAData';

interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
}

interface TimeEntry {
  id: string;
  description: string;
  hours: number;
  rate: number;
  total: number;
}

interface NewInvoiceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const NewInvoiceForm = ({ onSubmit, onCancel }: NewInvoiceFormProps) => {
  const { useProjects, useClients } = usePSAData();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: clients, isLoading: clientsLoading } = useClients();
  
  const [billingType, setBillingType] = useState<'milestone' | 'time-material'>('milestone');
  const [formData, setFormData] = useState({
    project: '',
    client: '',
    tax: 0,
    discount: 0,
  });
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date());
  const [dueDate, setDueDate] = useState<Date>();
  const [milestoneItems, setMilestoneItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', amount: 0 }
  ]);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([
    { id: '1', description: '', hours: 0, rate: 0, total: 0 }
  ]);
  const [attachments, setAttachments] = useState<FileList | null>(null);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const updateMilestoneItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setMilestoneItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const updateTimeEntry = (id: string, field: keyof TimeEntry, value: string | number) => {
    setTimeEntries(prev => prev.map(entry => {
      if (entry.id === id) {
        const updated = { ...entry, [field]: value };
        if (field === 'hours' || field === 'rate') {
          updated.total = updated.hours * updated.rate;
        }
        return updated;
      }
      return entry;
    }));
  };

  const addMilestoneItem = () => {
    const newId = (milestoneItems.length + 1).toString();
    setMilestoneItems(prev => [...prev, { id: newId, description: '', amount: 0 }]);
  };

  const removeMilestoneItem = (id: string) => {
    if (milestoneItems.length > 1) {
      setMilestoneItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const addTimeEntry = () => {
    const newId = (timeEntries.length + 1).toString();
    setTimeEntries(prev => [...prev, { id: newId, description: '', hours: 0, rate: 0, total: 0 }]);
  };

  const removeTimeEntry = (id: string) => {
    if (timeEntries.length > 1) {
      setTimeEntries(prev => prev.filter(entry => entry.id !== id));
    }
  };

  const getSubtotal = () => {
    if (billingType === 'milestone') {
      return milestoneItems.reduce((sum, item) => sum + item.amount, 0);
    } else {
      return timeEntries.reduce((sum, entry) => sum + entry.total, 0);
    }
  };

  const getTaxAmount = () => {
    return (getSubtotal() * formData.tax) / 100;
  };

  const getDiscountAmount = () => {
    return (getSubtotal() * formData.discount) / 100;
  };

  const getTotal = () => {
    return getSubtotal() + getTaxAmount() - getDiscountAmount();
  };

  const validateForm = () => {
    if (!formData.project) {
      setError('Please select a project');
      return false;
    }

    if (!formData.client) {
      setError('Please select a client');
      return false;
    }

    if (!dueDate) {
      setError('Please select a due date');
      return false;
    }

    // Validate that selected project exists
    const selectedProject = projects?.find(project => project.project_id === formData.project);
    if (!selectedProject) {
      setError('Selected project is invalid. Please choose a valid project from the dropdown.');
      return false;
    }

    // Validate that selected client exists
    const selectedClient = clients?.find(client => client.client_id === formData.client);
    if (!selectedClient) {
      setError('Selected client is invalid. Please choose a valid client from the dropdown.');
      return false;
    }

    if (billingType === 'milestone' && milestoneItems.some(item => !item.description.trim())) {
      setError('All milestone items must have a description');
      return false;
    }

    if (billingType === 'time-material' && timeEntries.some(entry => !entry.description.trim())) {
      setError('All time entries must have a description');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        billingType,
        invoiceDate: invoiceDate.toISOString().split('T')[0],
        dueDate: dueDate?.toISOString().split('T')[0],
        items: billingType === 'milestone' ? milestoneItems : timeEntries,
        subtotal: getSubtotal(),
        taxAmount: getTaxAmount(),
        discountAmount: getDiscountAmount(),
        total: getTotal(),
        attachments,
      });
    } catch (error: any) {
      console.error('Form submission error:', error);
      setError(error.message || 'Failed to create invoice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-5xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-white text-xl">Create New Invoice</DialogTitle>
      </DialogHeader>
      
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700 rounded-md">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Billing Type Selection */}
        <div className="space-y-2">
          <Label className="text-gray-200">Billing Type *</Label>
          <Tabs value={billingType} onValueChange={(value) => setBillingType(value as 'milestone' | 'time-material')}>
            <TabsList className="grid w-full grid-cols-2 bg-white/10">
              <TabsTrigger value="milestone" className="text-gray-300 data-[state=active]:text-white">
                Milestone Billing
              </TabsTrigger>
              <TabsTrigger value="time-material" className="text-gray-300 data-[state=active]:text-white">
                Time & Material
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Project */}
          <div className="space-y-2">
            <Label className="text-gray-200">Project *</Label>
            <Select 
              value={formData.project} 
              onValueChange={(value) => handleInputChange('project', value)}
              disabled={projectsLoading}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder={projectsLoading ? "Loading projects..." : "Select a project"} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {projects?.map((project) => (
                  <SelectItem key={project.project_id} value={project.project_id} className="text-white hover:bg-gray-700">
                    {project.project_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Client */}
          <div className="space-y-2">
            <Label className="text-gray-200">Client *</Label>
            <Select 
              value={formData.client} 
              onValueChange={(value) => handleInputChange('client', value)}
              disabled={clientsLoading}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder={clientsLoading ? "Loading clients..." : "Select a client"} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {clients?.map((client) => (
                  <SelectItem key={client.client_id} value={client.client_id} className="text-white hover:bg-gray-700">
                    {client.client_name} - {client.company_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-200">Invoice Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(invoiceDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600" align="start">
                <Calendar
                  mode="single"
                  selected={invoiceDate}
                  onSelect={setInvoiceDate}
                  initialFocus
                  className="bg-gray-800 text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">Due Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20",
                    !dueDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick due date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600" align="start">
                <Calendar
                  mode="single"
                  selected={dueDate}
                  onSelect={setDueDate}
                  initialFocus
                  className="bg-gray-800 text-white"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Items Section */}
        <Tabs value={billingType}>
          <TabsContent value="milestone" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-gray-200">Milestone Items</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMilestoneItem}
                className="border-blue-600 text-blue-400 hover:bg-blue-600/20"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-300">Description</TableHead>
                    <TableHead className="text-gray-300">Amount</TableHead>
                    <TableHead className="text-gray-300 w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {milestoneItems.map((item) => (
                    <TableRow key={item.id} className="border-white/10">
                      <TableCell>
                        <Input
                          value={item.description}
                          onChange={(e) => updateMilestoneItem(item.id, 'description', e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="Milestone description"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.amount}
                          onChange={(e) => updateMilestoneItem(item.id, 'amount', parseFloat(e.target.value) || 0)}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="0.00"
                        />
                      </TableCell>
                      <TableCell>
                        {milestoneItems.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMilestoneItem(item.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="time-material" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-gray-200">Time Entries</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTimeEntry}
                className="border-blue-600 text-blue-400 hover:bg-blue-600/20"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Entry
              </Button>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead className="text-gray-300">Description</TableHead>
                    <TableHead className="text-gray-300">Hours</TableHead>
                    <TableHead className="text-gray-300">Rate</TableHead>
                    <TableHead className="text-gray-300">Total</TableHead>
                    <TableHead className="text-gray-300 w-16"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timeEntries.map((entry) => (
                    <TableRow key={entry.id} className="border-white/10">
                      <TableCell>
                        <Input
                          value={entry.description}
                          onChange={(e) => updateTimeEntry(entry.id, 'description', e.target.value)}
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="Work description"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.25"
                          value={entry.hours}
                          onChange={(e) => updateTimeEntry(entry.id, 'hours', parseFloat(e.target.value) || 0)}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={entry.rate}
                          onChange={(e) => updateTimeEntry(entry.id, 'rate', parseFloat(e.target.value) || 0)}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </TableCell>
                      <TableCell className="text-white font-medium">
                        ${entry.total.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {timeEntries.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTimeEntry(entry.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>

        {/* Tax, Discount, and Total */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tax" className="text-gray-200">Tax (%)</Label>
            <Input
              id="tax"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.tax}
              onChange={(e) => handleInputChange('tax', parseFloat(e.target.value) || 0)}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discount" className="text-gray-200">Discount (%)</Label>
            <Input
              id="discount"
              type="number"
              min="0"
              max="100"
              step="0.01"
              value={formData.discount}
              onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || 0)}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <h4 className="text-white font-medium mb-4">Invoice Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-300">
              <span>Subtotal:</span>
              <span>${getSubtotal().toFixed(2)}</span>
            </div>
            {formData.tax > 0 && (
              <div className="flex justify-between text-gray-300">
                <span>Tax ({formData.tax}%):</span>
                <span>${getTaxAmount().toFixed(2)}</span>
              </div>
            )}
            {formData.discount > 0 && (
              <div className="flex justify-between text-gray-300">
                <span>Discount ({formData.discount}%):</span>
                <span>-${getDiscountAmount().toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-white/10">
              <span>Total:</span>
              <span>${getTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Attachments */}
        <div className="space-y-2">
          <Label htmlFor="attachments" className="text-gray-200">Attachments</Label>
          <div className="relative">
            <Input
              id="attachments"
              type="file"
              multiple
              onChange={(e) => setAttachments(e.target.files)}
              className="bg-white/10 border-white/20 text-white file:bg-blue-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1"
            />
            <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
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
          disabled={!formData.project || !formData.client || !dueDate || isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Invoice'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default NewInvoiceForm;
