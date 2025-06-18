import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface NewClientFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const NewClientForm = ({ onSubmit, onCancel, isLoading }: NewClientFormProps) => {
  const [formData, setFormData] = React.useState({
    clientName: '',
    companyName: '',
    industry: '',
    primaryContactName: '',
    primaryContactEmail: '',
    phoneNumber: '',
    clientType: '',
    revenueTier: '',
    notes: '',
  });

  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const availableTags = ['VIP', 'Priority', 'New Business', 'Recurring', 'High Value', 'Strategic'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ ...formData, tags: selectedTags });
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
            <Label htmlFor="clientName" className="text-gray-300">Client Name *</Label>
            <Input
              id="clientName"
              required
              value={formData.clientName}
              onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Enter client name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-gray-300">Company Name *</Label>
            <Input
              id="companyName"
              required
              value={formData.companyName}
              onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
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
            <Label htmlFor="clientType" className="text-gray-300">Client Type *</Label>
            <Select value={formData.clientType} onValueChange={(value) => setFormData(prev => ({ ...prev, clientType: value }))}>
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
            <Label htmlFor="primaryContactName" className="text-gray-300">Primary Contact Name *</Label>
            <Input
              id="primaryContactName"
              required
              value={formData.primaryContactName}
              onChange={(e) => setFormData(prev => ({ ...prev, primaryContactName: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Enter contact name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryContactEmail" className="text-gray-300">Primary Contact Email *</Label>
            <Input
              id="primaryContactEmail"
              type="email"
              required
              value={formData.primaryContactEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, primaryContactEmail: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Enter email address"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber" className="text-gray-300">Phone Number</Label>
            <Input
              id="phoneNumber"
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              className="bg-gray-800 border-gray-600 text-white"
              placeholder="Enter phone number"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="revenueTier" className="text-gray-300">Revenue Tier</Label>
            <Select value={formData.revenueTier} onValueChange={(value) => setFormData(prev => ({ ...prev, revenueTier: value }))}>
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
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            className="border-gray-600 text-gray-300"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Add Client'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default NewClientForm;
