
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface LineItem {
  itemName: string;
  quantity: number;
  unitPrice: number;
}

interface NewPurchaseOrderFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const NewPurchaseOrderForm = ({ onSubmit, onCancel }: NewPurchaseOrderFormProps) => {
  const [formData, setFormData] = React.useState({
    poNumber: '',
    vendor: '',
    orderDate: undefined as Date | undefined,
    deliveryDate: undefined as Date | undefined,
    status: '',
    notes: '',
  });

  const [lineItems, setLineItems] = React.useState<LineItem[]>([
    { itemName: '', quantity: 1, unitPrice: 0 }
  ]);

  const addLineItem = () => {
    setLineItems([...lineItems, { itemName: '', quantity: 1, unitPrice: 0 }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((_, i) => i !== index));
    }
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updatedItems = [...lineItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setLineItems(updatedItems);
  };

  const calculateTotal = () => {
    return lineItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, lineItems, totalAmount: calculateTotal() });
  };

  return (
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
      <DialogHeader>
        <DialogTitle className="text-white text-2xl">Create New Purchase Order</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="poNumber" className="text-gray-300">PO Number *</Label>
            <Input
              id="poNumber"
              required
              value={formData.poNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, poNumber: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Enter PO number or leave blank for auto-generation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vendor" className="text-gray-300">Vendor *</Label>
            <Select value={formData.vendor} onValueChange={(value) => setFormData(prev => ({ ...prev, vendor: value }))}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select vendor" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="vendor-1">ABC Software Solutions</SelectItem>
                <SelectItem value="vendor-2">Tech Hardware Co.</SelectItem>
                <SelectItem value="vendor-3">Cloud Services Inc.</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Order Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-gray-800 border-gray-600 text-white",
                    !formData.orderDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.orderDate ? format(formData.orderDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.orderDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, orderDate: date }))}
                  initialFocus
                  className="bg-gray-800 border-gray-600"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Delivery Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-gray-800 border-gray-600 text-white",
                    !formData.deliveryDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.deliveryDate ? format(formData.deliveryDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.deliveryDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, deliveryDate: date }))}
                  initialFocus
                  className="bg-gray-800 border-gray-600"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="status" className="text-gray-300">Status *</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-gray-300 text-lg">Line Items</Label>
            <Button type="button" onClick={addLineItem} variant="outline" size="sm" className="border-gray-600 text-gray-300">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {lineItems.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-800/30 rounded-lg">
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Item Name</Label>
                  <Input
                    value={item.itemName}
                    onChange={(e) => updateLineItem(index, 'itemName', e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Enter item name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateLineItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Unit Price</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => updateLineItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-300 text-sm">Total</Label>
                  <div className="flex items-center space-x-2">
                    <div className="bg-gray-700 px-3 py-2 rounded-md text-white flex-1">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </div>
                    {lineItems.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeLineItem(index)}
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <Label className="text-gray-300 text-lg">Total Amount: <span className="text-green-400 font-bold">${calculateTotal().toFixed(2)}</span></Label>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-gray-300">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="bg-gray-800 border-gray-600 text-white"
            placeholder="Additional notes for this purchase order"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onCancel} className="border-gray-600 text-gray-300">
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Create Purchase Order
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default NewPurchaseOrderForm;
