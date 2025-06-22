
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ArrowLeft } from 'lucide-react';

interface NewClientFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  onBack?: () => void;
}

const NewClientForm = ({ onSubmit, onCancel, onBack }: NewClientFormProps) => {
  const [formData, setFormData] = useState({
    client_name: '',
    company_name: '',
    primary_contact_email: '',
    primary_contact_name: '',
    phone_number: '',
    industry: '',
    client_type: 'prospect',
    revenue_tier: '',
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
    console.log('Submitting client form:', formData);
    onSubmit(formData);
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
          <DialogTitle className="text-white">Add New Client</DialogTitle>
        </div>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client_name">Client Name *</Label>
            <Input
              id="client_name"
              value={formData.client_name}
              onChange={(e) => handleInputChange('client_name', e.target.value)}
              className="bg-white/10 border-white/20"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="company_name">Company Name *</Label>
            <Input
              id="company_name"
              value={formData.company_name}
              onChange={(e) => handleInputChange('company_name', e.target.value)}
              className="bg-white/10 border-white/20"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="primary_contact_name">Primary Contact Name *</Label>
            <Input
              id="primary_contact_name"
              value={formData.primary_contact_name}
              onChange={(e) => handleInputChange('primary_contact_name', e.target.value)}
              className="bg-white/10 border-white/20"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="primary_contact_email">Primary Contact Email *</Label>
            <Input
              id="primary_contact_email"
              type="email"
              value={formData.primary_contact_email}
              onChange={(e) => handleInputChange('primary_contact_email', e.target.value)}
              className="bg-white/10 border-white/20"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              value={formData.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              className="bg-white/10 border-white/20"
            />
          </div>
          
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={formData.industry}
              onChange={(e) => handleInputChange('industry', e.target.value)}
              className="bg-white/10 border-white/20"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="client_type">Client Type</Label>
            <Select value={formData.client_type} onValueChange={(value) => handleInputChange('client_type', value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="prospect" className="text-white hover:bg-gray-700">Prospect</SelectItem>
                <SelectItem value="active" className="text-white hover:bg-gray-700">Active</SelectItem>
                <SelectItem value="inactive" className="text-white hover:bg-gray-700">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="revenue_tier">Revenue Tier</Label>
            <Select value={formData.revenue_tier} onValueChange={(value) => handleInputChange('revenue_tier', value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Select tier" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="small" className="text-white hover:bg-gray-700">Small ($0-$1M)</SelectItem>
                <SelectItem value="medium" className="text-white hover:bg-gray-700">Medium ($1M-$10M)</SelectItem>
                <SelectItem value="large" className="text-white hover:bg-gray-700">Large ($10M+)</SelectItem>
              </SelectContent>
            </Select>
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
            Create Client
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default NewClientForm;
