
import React from 'react';
import { useForm } from 'react-hook-form';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateVendorApi } from '@/hooks/useApiIntegration';

interface EditVendorFormProps {
  vendor: any;
  onClose: () => void;
  onCancel: () => void;
}

const EditVendorForm = ({ vendor, onClose, onCancel }: EditVendorFormProps) => {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      vendor_name: vendor?.vendor_name || '',
      contact_person: vendor?.contact_person || '',
      contact_email: vendor?.contact_email || '',
      phone_number: vendor?.phone_number || '',
      services_offered: vendor?.services_offered || '',
      status: vendor?.status || 'active',
      contract_start_date: vendor?.contract_start_date || '',
      contract_end_date: vendor?.contract_end_date || '',
      notes: vendor?.notes || '',
    }
  });

  const updateVendor = useUpdateVendorApi();

  const onSubmit = async (data: any) => {
    try {
      await updateVendor.mutateAsync({
        vendorId: vendor.vendor_id,
        updates: data
      });
      onClose();
    } catch (error) {
      console.error('Error updating vendor:', error);
    }
  };

  return (
    <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
      <DialogHeader>
        <DialogTitle className="text-white">Edit Vendor</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="vendor_name" className="text-gray-300">Vendor Name</Label>
          <Input
            id="vendor_name"
            {...register('vendor_name', { required: true })}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contact_person" className="text-gray-300">Contact Person</Label>
            <Input
              id="contact_person"
              {...register('contact_person', { required: true })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="contact_email" className="text-gray-300">Contact Email</Label>
            <Input
              id="contact_email"
              type="email"
              {...register('contact_email', { required: true })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone_number" className="text-gray-300">Phone Number</Label>
            <Input
              id="phone_number"
              {...register('phone_number')}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="status" className="text-gray-300">Status</Label>
            <Select onValueChange={(value) => setValue('status', value)} defaultValue={vendor?.status}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="active" className="text-white">Active</SelectItem>
                <SelectItem value="inactive" className="text-white">Inactive</SelectItem>
                <SelectItem value="pending" className="text-white">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="services_offered" className="text-gray-300">Services Offered</Label>
          <Input
            id="services_offered"
            {...register('services_offered', { required: true })}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contract_start_date" className="text-gray-300">Contract Start Date</Label>
            <Input
              id="contract_start_date"
              type="date"
              {...register('contract_start_date')}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="contract_end_date" className="text-gray-300">Contract End Date</Label>
            <Input
              id="contract_end_date"
              type="date"
              {...register('contract_end_date')}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="notes" className="text-gray-300">Notes</Label>
          <Textarea
            id="notes"
            {...register('notes')}
            className="bg-gray-700 border-gray-600 text-white"
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={updateVendor.isPending}
          >
            {updateVendor.isPending ? 'Updating...' : 'Update Vendor'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default EditVendorForm;
