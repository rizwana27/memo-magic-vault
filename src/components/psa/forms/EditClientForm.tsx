
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateClientApi } from '@/hooks/useApiIntegration';

interface EditClientFormProps {
  client: any;
  onClose: () => void;
  onCancel: () => void;
}

const EditClientForm = ({ client, onClose, onCancel }: EditClientFormProps) => {
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      client_name: client?.client_name || '',
      company_name: client?.company_name || '',
      primary_contact_name: client?.primary_contact_name || '',
      primary_contact_email: client?.primary_contact_email || '',
      phone_number: client?.phone_number || '',
      industry: client?.industry || '',
      revenue_tier: client?.revenue_tier || '',
      client_type: client?.client_type || 'prospect',
      notes: client?.notes || '',
    }
  });

  const updateClient = useUpdateClientApi();

  const onSubmit = async (data: any) => {
    try {
      await updateClient.mutateAsync({
        clientId: client.client_id,
        updates: data
      });
      onClose();
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Client</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="client_name" className="text-gray-300">Client Name</Label>
              <Input
                id="client_name"
                {...register('client_name', { required: true })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="company_name" className="text-gray-300">Company Name</Label>
              <Input
                id="company_name"
                {...register('company_name', { required: true })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primary_contact_name" className="text-gray-300">Primary Contact Name</Label>
              <Input
                id="primary_contact_name"
                {...register('primary_contact_name', { required: true })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="primary_contact_email" className="text-gray-300">Primary Contact Email</Label>
              <Input
                id="primary_contact_email"
                type="email"
                {...register('primary_contact_email', { required: true })}
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
              <Label htmlFor="industry" className="text-gray-300">Industry</Label>
              <Input
                id="industry"
                {...register('industry')}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="revenue_tier" className="text-gray-300">Revenue Tier</Label>
              <Select onValueChange={(value) => setValue('revenue_tier', value)} defaultValue={client?.revenue_tier}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select revenue tier" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="small" className="text-white">Small (&lt; $1M)</SelectItem>
                  <SelectItem value="medium" className="text-white">Medium ($1M - $10M)</SelectItem>
                  <SelectItem value="large" className="text-white">Large ($10M - $100M)</SelectItem>
                  <SelectItem value="enterprise" className="text-white">Enterprise (&gt; $100M)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="client_type" className="text-gray-300">Client Type</Label>
              <Select onValueChange={(value) => setValue('client_type', value)} defaultValue={client?.client_type}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select client type" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="prospect" className="text-white">Prospect</SelectItem>
                  <SelectItem value="active" className="text-white">Active</SelectItem>
                  <SelectItem value="inactive" className="text-white">Inactive</SelectItem>
                </SelectContent>
              </Select>
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
              disabled={updateClient.isPending}
            >
              {updateClient.isPending ? 'Updating...' : 'Update Client'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditClientForm;
