
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft } from 'lucide-react';

interface NewVendorFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  onBack?: () => void;
}

const NewVendorForm = ({ onSubmit, onCancel, onBack }: NewVendorFormProps) => {
  const [formData, setFormData] = useState({
    vendor_name: '',
    contact_person: '',
    contact_email: '',
    phone_number: '',
    services_offered: '',
    status: 'active',
    contract_start_date: '',
    contract_end_date: '',
    notes: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting vendor form:', formData);
    
    // Format dates properly or set to null if empty
    const submitData = {
      ...formData,
      contract_start_date: formData.contract_start_date || null,
      contract_end_date: formData.contract_end_date || null
    };
    
    onSubmit(submitData);
  };

  return (
    <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <div className="flex items-center gap-2">
          {onBack && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <DialogTitle className="text-white">Add New Vendor</DialogTitle>
        </div>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="vendor_name">Vendor Name *</Label>
            <Input
              id="vendor_name"
              value={formData.vendor_name}
              onChange={(e) => handleInputChange('vendor_name', e.target.value)}
              className="bg-white/10 border-white/20"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="contact_person">Contact Person *</Label>
            <Input
              id="contact_person"
              value={formData.contact_person}
              onChange={(e) => handleInputChange('contact_person', e.target.value)}
              className="bg-white/10 border-white/20"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contact_email">Contact Email *</Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => handleInputChange('contact_email', e.target.value)}
              className="bg-white/10 border-white/20"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              value={formData.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              className="bg-white/10 border-white/20"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="services_offered">Services Offered *</Label>
          <Input
            id="services_offered"
            value={formData.services_offered}
            onChange={(e) => handleInputChange('services_offered', e.target.value)}
            className="bg-white/10 border-white/20"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="active" className="text-white hover:bg-gray-700">Active</SelectItem>
                <SelectItem value="inactive" className="text-white hover:bg-gray-700">Inactive</SelectItem>
                <SelectItem value="pending" className="text-white hover:bg-gray-700">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="contract_start_date">Contract Start Date</Label>
            <Input
              id="contract_start_date"
              type="date"
              value={formData.contract_start_date}
              onChange={(e) => handleInputChange('contract_start_date', e.target.value)}
              className="bg-white/10 border-white/20"
            />
          </div>
          
          <div>
            <Label htmlFor="contract_end_date">Contract End Date</Label>
            <Input
              id="contract_end_date"
              type="date"
              value={formData.contract_end_date}
              onChange={(e) => handleInputChange('contract_end_date', e.target.value)}
              className="bg-white/10 border-white/20"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="bg-white/10 border-white/20"
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Create Vendor
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default NewVendorForm;
