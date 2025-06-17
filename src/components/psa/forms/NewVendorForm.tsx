
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface NewVendorFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const NewVendorForm = ({ onSubmit, onCancel }: NewVendorFormProps) => {
  const [formData, setFormData] = React.useState({
    vendorName: '',
    contactPersonName: '',
    contactEmail: '',
    phoneNumber: '',
    servicesOffered: '',
    status: true,
    contractStartDate: undefined as Date | undefined,
    contractEndDate: undefined as Date | undefined,
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
      <DialogHeader>
        <DialogTitle className="text-white text-2xl">Add New Vendor</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="vendorName" className="text-gray-300">Vendor Name *</Label>
            <Input
              id="vendorName"
              required
              value={formData.vendorName}
              onChange={(e) => setFormData(prev => ({ ...prev, vendorName: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Enter vendor name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPersonName" className="text-gray-300">Contact Person Name *</Label>
            <Input
              id="contactPersonName"
              required
              value={formData.contactPersonName}
              onChange={(e) => setFormData(prev => ({ ...prev, contactPersonName: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Enter contact person name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactEmail" className="text-gray-300">Contact Email *</Label>
            <Input
              id="contactEmail"
              type="email"
              required
              value={formData.contactEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Enter contact email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-gray-300">Phone Number *</Label>
            <Input
              id="phoneNumber"
              required
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Contract Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-gray-800 border-gray-600 text-white",
                    !formData.contractStartDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.contractStartDate ? format(formData.contractStartDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.contractStartDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, contractStartDate: date }))}
                  initialFocus
                  className="bg-gray-800 border-gray-600"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-300">Contract End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-gray-800 border-gray-600 text-white",
                    !formData.contractEndDate && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.contractEndDate ? format(formData.contractEndDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.contractEndDate}
                  onSelect={(date) => setFormData(prev => ({ ...prev, contractEndDate: date }))}
                  initialFocus
                  className="bg-gray-800 border-gray-600"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="servicesOffered" className="text-gray-300">Services Offered</Label>
          <Textarea
            id="servicesOffered"
            value={formData.servicesOffered}
            onChange={(e) => setFormData(prev => ({ ...prev, servicesOffered: e.target.value }))}
            className="bg-gray-800 border-gray-600 text-white"
            placeholder="Describe the services this vendor offers"
            rows={4}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="status"
            checked={formData.status}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, status: checked }))}
          />
          <Label htmlFor="status" className="text-gray-300">Active Status</Label>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Attachments</Label>
          <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-1 text-sm text-gray-400">Upload contract documents</p>
            <Button variant="outline" className="mt-2 border-gray-600 text-gray-300" size="sm">
              Choose Files
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-gray-300">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="bg-gray-800 border-gray-600 text-white"
            placeholder="Additional notes about this vendor"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onCancel} className="border-gray-600 text-gray-300">
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Add Vendor
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default NewVendorForm;
