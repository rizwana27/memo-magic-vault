
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface NewClientFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const NewClientForm = ({ onSubmit, onCancel }: NewClientFormProps) => {
  const [formData, setFormData] = React.useState({
    client_name: '',
    company_name: '',
    industry: '',
    primary_contact_name: '',
    primary_contact_email: '',
    phone_number: '',
    client_type: '',
    revenue_tier: '',
    notes: '',
  });

  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const availableTags = ['VIP', 'Priority', 'New Business', 'Recurring', 'High Value', 'Strategic'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.client_name.trim()) {
      alert('Client name is required');
      return;
    }
    
    if (!formData.company_name.trim()) {
      alert('Company name is required');
      return;
    }
    
    if (!formData.primary_contact_name.trim()) {
      alert('Primary contact name is required');
      return;
    }
    
    if (!formData.primary_contact_email.trim()) {
      alert('Primary contact email is required');
      return;
    }
    
    if (!formData.client_type) {
      alert('Client type is required');
      return;
    }

    const submitData = {
      client_name: formData.client_name.trim(),
      company_name: formData.company_name.trim(),
      industry: formData.industry || null,
      primary_contact_name: formData.primary_contact_name.trim(),
      primary_contact_email: formData.primary_contact_email.trim(),
      phone_number: formData.phone_number.trim() || null,
      client_type: formData.client_type,
      revenue_tier: formData.revenue_tier || null,
      notes: formData.notes.trim() || null,
      tags: selectedTags.length > 0 ? selectedTags : null,
    };

    console.log('Submitting client data:', submitData);
    onSubmit(submitData);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
      <DialogHeader>
        <DialogTitle className="text-white text-2xl">Add New Client</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="client_name" className="text-gray-300">Client Name *</Label>
            <Input
              id="client_name"
              required
              value={formData.client_name}
              onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Enter client name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company_name" className="text-gray-300">Company Name *</Label>
            <Input
              id="company_name"
              required
              value={formData.company_name}
              onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Enter company name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry" className="text-gray-300">Industry</Label>
            <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="it">Information Technology</SelectItem>
                <SelectItem value="finance">Finance & Banking</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="retail">Retail & E-commerce</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="government">Government</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="client_type" className="text-gray-300">Client Type *</Label>
            <Select value={formData.client_type} onValueChange={(value) => setFormData(prev => ({ ...prev, client_type: value }))}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select client type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="prospect">Prospect</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="primary_contact_name" className="text-gray-300">Primary Contact Name *</Label>
            <Input
              id="primary_contact_name"
              required
              value={formData.primary_contact_name}
              onChange={(e) => setFormData(prev => ({ ...prev, primary_contact_name: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Enter contact name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="primary_contact_email" className="text-gray-300">Primary Contact Email *</Label>
            <Input
              id="primary_contact_email"
              type="email"
              required
              value={formData.primary_contact_email}
              onChange={(e) => setFormData(prev => ({ ...prev, primary_contact_email: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Enter email address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone_number" className="text-gray-300">Phone Number</Label>
            <Input
              id="phone_number"
              value={formData.phone_number}
              onChange={(e) => setFormData(prev => ({ ...prev, phone_number: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="revenue_tier" className="text-gray-300">Revenue Tier</Label>
            <Select value={formData.revenue_tier} onValueChange={(value) => setFormData(prev => ({ ...prev, revenue_tier: value }))}>
              <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Select revenue tier" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-600">
                <SelectItem value="small">Small ($0 - $50K)</SelectItem>
                <SelectItem value="medium">Medium ($50K - $500K)</SelectItem>
                <SelectItem value="enterprise">Enterprise ($500K+)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-gray-300">Tags</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-gray-300">Notes / Communication History</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            className="bg-gray-800 border-gray-600 text-white"
            placeholder="Enter notes or communication history"
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <Button type="button" variant="outline" onClick={onCancel} className="border-gray-600 text-gray-300">
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            Add Client
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default NewClientForm;
