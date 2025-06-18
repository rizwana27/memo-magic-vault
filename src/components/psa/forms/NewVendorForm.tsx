
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { CalendarIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface NewVendorFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const NewVendorForm = ({ onSubmit, onCancel }: NewVendorFormProps) => {
  const [formData, setFormData] = useState({
    vendor_name: '',
    contact_person: '',
    contact_email: '',
    phone_number: '',
    services_offered: '',
    status: 'active',
    notes: '',
  });
  const [contractStart, setContractStart] = useState<Date>();
  const [contractEnd, setContractEnd] = useState<Date>();
  const [attachments, setAttachments] = useState<FileList | null>(null);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Validation
    if (!formData.vendor_name.trim()) {
      setError('Vendor name is required');
      setIsSubmitting(false);
      return;
    }

    if (!formData.contact_person.trim()) {
      setError('Contact person is required');
      setIsSubmitting(false);
      return;
    }

    if (!formData.contact_email.trim()) {
      setError('Contact email is required');
      setIsSubmitting(false);
      return;
    }

    if (!isEmailValid(formData.contact_email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    if (!formData.services_offered.trim()) {
      setError('Services offered is required');
      setIsSubmitting(false);
      return;
    }

    // Validate contract dates
    if (contractStart && contractEnd && contractStart >= contractEnd) {
      setError('Contract end date must be after start date');
      setIsSubmitting(false);
      return;
    }

    try {
      // Map form data to match the database schema exactly
      const vendorData = {
        vendor_name: formData.vendor_name.trim(),
        contact_person: formData.contact_person.trim(),
        contact_email: formData.contact_email.trim(),
        phone_number: formData.phone_number.trim() || null,
        services_offered: formData.services_offered.trim(),
        status: formData.status,
        notes: formData.notes.trim() || null,
        contract_start_date: contractStart ? contractStart.toISOString().split('T')[0] : null,
        contract_end_date: contractEnd ? contractEnd.toISOString().split('T')[0] : null,
        attachments: null, // For now, we'll set this to null
      };

      console.log('Submitting vendor data:', vendorData);
      await onSubmit(vendorData);
      // Success is handled by the parent component
    } catch (error) {
      console.error('Error submitting vendor form:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create vendor. Please try again.';
      setError(`Failed to create vendor: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEmailValid = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  return (
    <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-white text-xl">Add New Vendor</DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <Alert className="border-red-500 bg-red-500/10">
            <AlertDescription className="text-red-400">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vendor Name */}
          <div className="space-y-2">
            <Label htmlFor="vendor_name" className="text-gray-200">Vendor Name *</Label>
            <Input
              id="vendor_name"
              value={formData.vendor_name}
              onChange={(e) => handleInputChange('vendor_name', e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              placeholder="Enter vendor name"
              required
            />
          </div>

          {/* Contact Person */}
          <div className="space-y-2">
            <Label htmlFor="contact_person" className="text-gray-200">Contact Person *</Label>
            <Input
              id="contact_person"
              value={formData.contact_person}
              onChange={(e) => handleInputChange('contact_person', e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              placeholder="Enter contact person name"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contact Email */}
          <div className="space-y-2">
            <Label htmlFor="contact_email" className="text-gray-200">Contact Email *</Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => handleInputChange('contact_email', e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              placeholder="vendor@example.com"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone_number" className="text-gray-200">Phone Number</Label>
            <Input
              id="phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={(e) => handleInputChange('phone_number', e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder-gray-400"
              placeholder="+1-555-0123"
            />
          </div>
        </div>

        {/* Services Offered */}
        <div className="space-y-2">
          <Label htmlFor="services_offered" className="text-gray-200">Services Offered *</Label>
          <Textarea
            id="services_offered"
            value={formData.services_offered}
            onChange={(e) => handleInputChange('services_offered', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            placeholder="Describe the services this vendor provides..."
            rows={3}
            required
          />
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label className="text-gray-200">Status *</Label>
          <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="active" className="text-white hover:bg-gray-700">Active</SelectItem>
              <SelectItem value="inactive" className="text-white hover:bg-gray-700">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Contract Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-gray-200">Contract Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20",
                    !contractStart && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {contractStart ? format(contractStart, "PPP") : <span>Pick start date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600" align="start">
                <Calendar
                  mode="single"
                  selected={contractStart}
                  onSelect={(date) => {
                    setContractStart(date);
                    if (error) setError('');
                  }}
                  initialFocus
                  className="bg-gray-800 text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label className="text-gray-200">Contract End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/10 border-white/20 text-white hover:bg-white/20",
                    !contractEnd && "text-gray-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {contractEnd ? format(contractEnd, "PPP") : <span>Pick end date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-600" align="start">
                <Calendar
                  mode="single"
                  selected={contractEnd}
                  onSelect={(date) => {
                    setContractEnd(date);
                    if (error) setError('');
                  }}
                  initialFocus
                  className="bg-gray-800 text-white"
                />
              </PopoverContent>
            </Popover>
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
          <p className="text-xs text-gray-400">Upload contracts, certificates, or other relevant documents</p>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-gray-200">Notes (Optional)</Label>
          <Textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
            placeholder="Add any additional notes about this vendor..."
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
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white"
          disabled={isSubmitting || !formData.vendor_name || !formData.contact_person || !formData.contact_email || !formData.services_offered || (formData.contact_email && !isEmailValid(formData.contact_email))}
        >
          {isSubmitting ? 'Adding...' : 'Add Vendor'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default NewVendorForm;
