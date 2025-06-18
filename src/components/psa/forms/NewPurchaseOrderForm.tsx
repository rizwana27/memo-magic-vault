
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
import { CalendarIcon, Plus, Trash2, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useVendors, useProjects } from '@/hooks/usePSAData';

interface LineItem {
  id: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface NewPurchaseOrderFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const NewPurchaseOrderForm = ({ onSubmit, onCancel }: NewPurchaseOrderFormProps) => {
  const { data: vendors, isLoading: vendorsLoading } = useVendors();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  
  const [formData, setFormData] = useState({
    poNumber: '',
    vendor: '',
    project: '',
    status: 'open',
    notes: '',
  });
  const [orderDate, setOrderDate] = useState<Date>(new Date());
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: '1', itemName: '', quantity: 1, unitPrice: 0, total: 0 }
  ]);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generatePONumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PO-${year}-${random}`;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'unitPrice') {
          updated.total = updated.quantity * updated.unitPrice;
        }
        return updated;
      }
      return item;
    }));
  };

  const addLineItem = () => {
    const newId = (lineItems.length + 1).toString();
    setLineItems(prev => [...prev, { id: newId, itemName: '', quantity: 1, unitPrice: 0, total: 0 }]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const getTotalAmount = () => {
    return lineItems.reduce((sum, item) => sum + item.total, 0);
  };

  const validateForm = () => {
    if (!formData.vendor) {
      setError('Please select a vendor');
      return false;
    }

    if (lineItems.some(item => !item.itemName.trim())) {
      setError('All line items must have a name');
      return false;
    }

    // Validate that selected vendor exists in our data
    const selectedVendor = vendors?.find(vendor => vendor.vendor_id === formData.vendor);
    if (!selectedVendor) {
      setError('Selected vendor is invalid. Please choose a valid vendor from the dropdown.');
      return false;
    }

    // Validate that selected project exists if one is selected
    if (formData.project) {
      const selectedProject = projects?.find(project => project.project_id === formData.project);
      if (!selectedProject) {
        setError('Selected project is invalid. Please choose a valid project from the dropdown.');
        return false;
      }
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
      const poNumber = formData.poNumber || generatePONumber();
      
      // Map the form data to the correct database schema
      const poData = {
        po_number: poNumber,
        vendor_id: formData.vendor,
        project_id: formData.project || null,
        order_date: orderDate.toISOString().split('T')[0],
        delivery_date: deliveryDate?.toISOString().split('T')[0] || null,
        line_items: lineItems,
        total_amount: getTotalAmount(),
        status: formData.status,
        notes: formData.notes || null,
      };

      console.log('Creating purchase order with data:', poData);
      await onSubmit(poData);
    } catch (error: any) {
      console.error('Form submission error:', error);
      setError(error.message || 'Failed to create purchase order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-4xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-white text-xl">Create Purchase Order</DialogTitle>
      </DialogHeader>
      
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-700 rounded-md">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* PO Number */}
          <div className="space-y-2">
            <Label htmlFor="poNumber" className="text-gray-200">PO Number</Label>
            <Input
              id="poNumber"
              value={formData.poNumber}
              onChange={(e) => handleInputChange('poNumber', e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              placeholder="Auto-generated if empty"
            />
            {!formData.poNumber && (
              <p className="text-sm text-gray-400">Will auto-generate: {generatePONumber()}</p>
            )}
          </div>

          {/* Vendor */}
          <div className="space-y-2">
            <Label className="text-gray-200">Vendor *</Label>
            <Select 
              value={formData.vendor} 
              onValueChange={(value) => handleInputChange('vendor', value)}
              disabled={vendorsLoading}
            >
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder={vendorsLoading ? "Loading vendors..." : "Select a vendor"} />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                {vendors?.map((vendor) => (
                  <SelectItem key={vendor.vendor_id} value={vendor.vendor_id} className="text-white hover:bg-gray-700">
                    {vendor.vendor_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Project */}
          <div className="space-y-2">
            <Label className="text-gray-200">Project (Optional)</Label>
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
                    {project.client && ` (${project.client.client_name})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label className="text-gray-200">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="open" className="text-white hover:bg-gray-700">Open</SelectItem>
                <SelectItem value="in-progress" className="text-white hover:bg-gray-700">In Progress</SelectItem>
                <SelectItem value="closed" className="text-white hover:bg-gray-700">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-200">Order Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(orderDate, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600" align="start">
                <Calendar
                  mode="single"
                  selected={orderDate}
                  onSelect={setOrderDate}
                  initialFocus
                  className="bg-gray-800 text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">Delivery Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20",
                    !deliveryDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {deliveryDate ? format(deliveryDate, "PPP") : <span>Pick delivery date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600" align="start">
                <Calendar
                  mode="single"
                  selected={deliveryDate}
                  onSelect={setDeliveryDate}
                  initialFocus
                  className="bg-gray-800 text-white"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-gray-200">Line Items</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addLineItem}
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
                  <TableHead className="text-gray-300">Item Name</TableHead>
                  <TableHead className="text-gray-300">Quantity</TableHead>
                  <TableHead className="text-gray-300">Unit Price</TableHead>
                  <TableHead className="text-gray-300">Total</TableHead>
                  <TableHead className="text-gray-300 w-16"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.map((item) => (
                  <TableRow key={item.id} className="border-white/10">
                    <TableCell>
                      <Input
                        value={item.itemName}
                        onChange={(e) => updateLineItem(item.id, 'itemName', e.target.value)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Item name"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateLineItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateLineItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="0.00"
                      />
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      ${item.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {lineItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLineItem(item.id)}
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
            
            <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
              <div className="text-right">
                <p className="text-gray-300">Total Amount:</p>
                <p className="text-2xl font-bold text-white">${getTotalAmount().toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-gray-200">Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            placeholder="Add any additional notes..."
            rows={3}
          />
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
          disabled={!formData.vendor || lineItems.some(item => !item.itemName) || isSubmitting}
        >
          {isSubmitting ? 'Creating...' : 'Create Purchase Order'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default NewPurchaseOrderForm;
