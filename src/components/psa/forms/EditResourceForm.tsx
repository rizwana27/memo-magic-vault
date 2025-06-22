
import React from 'react';
import { useForm } from 'react-hook-form';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useUpdateResourceApi } from '@/hooks/useApiIntegration';

interface EditResourceFormProps {
  resource: any;
  onClose: () => void;
  onCancel: () => void;
}

const EditResourceForm = ({ resource, onClose, onCancel }: EditResourceFormProps) => {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      full_name: resource?.full_name || '',
      email_address: resource?.email_address || '',
      phone_number: resource?.phone_number || '',
      department: resource?.department || '',
      role: resource?.role || '',
      availability: resource?.availability || 100,
      active_status: resource?.active_status || true,
      join_date: resource?.join_date || '',
    }
  });

  const updateResource = useUpdateResourceApi();

  const onSubmit = async (data: any) => {
    try {
      await updateResource.mutateAsync({
        resourceId: resource.resource_id,
        updates: {
          ...data,
          availability: parseInt(data.availability),
        }
      });
      onClose();
    } catch (error) {
      console.error('Error updating resource:', error);
    }
  };

  return (
    <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
      <DialogHeader>
        <DialogTitle className="text-white">Edit Resource</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="full_name" className="text-gray-300">Full Name</Label>
          <Input
            id="full_name"
            {...register('full_name', { required: true })}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="email_address" className="text-gray-300">Email Address</Label>
          <Input
            id="email_address"
            type="email"
            {...register('email_address', { required: true })}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="phone_number" className="text-gray-300">Phone Number</Label>
          <Input
            id="phone_number"
            {...register('phone_number')}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="department" className="text-gray-300">Department</Label>
            <Select onValueChange={(value) => setValue('department', value)} defaultValue={resource?.department}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                <SelectItem value="Engineering" className="text-white">Engineering</SelectItem>
                <SelectItem value="Design" className="text-white">Design</SelectItem>
                <SelectItem value="Marketing" className="text-white">Marketing</SelectItem>
                <SelectItem value="Sales" className="text-white">Sales</SelectItem>
                <SelectItem value="Operations" className="text-white">Operations</SelectItem>
                <SelectItem value="Finance" className="text-white">Finance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="role" className="text-gray-300">Role</Label>
            <Input
              id="role"
              {...register('role', { required: true })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="availability" className="text-gray-300">Availability (%)</Label>
            <Input
              id="availability"
              type="number"
              min="0"
              max="100"
              {...register('availability')}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="join_date" className="text-gray-300">Join Date</Label>
            <Input
              id="join_date"
              type="date"
              {...register('join_date')}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="active_status"
            checked={watch('active_status')}
            onCheckedChange={(checked) => setValue('active_status', checked)}
          />
          <Label htmlFor="active_status" className="text-gray-300">Active Status</Label>
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
            disabled={updateResource.isPending}
          >
            {updateResource.isPending ? 'Updating...' : 'Update Resource'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default EditResourceForm;
