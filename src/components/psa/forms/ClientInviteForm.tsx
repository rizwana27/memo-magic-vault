
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserPlus, Mail, MessageSquare } from 'lucide-react';
import { useCreateClientInvite } from '@/hooks/usePSAData';

interface ClientInviteFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ClientInviteFormData {
  client_name: string;
  email: string;
  invitation_message: string;
}

const ClientInviteForm: React.FC<ClientInviteFormProps> = ({ open, onOpenChange }) => {
  const createClientInvite = useCreateClientInvite();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ClientInviteFormData>();

  const onSubmit = async (data: ClientInviteFormData) => {
    try {
      await createClientInvite.mutateAsync(data);
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to send client invitation:', error);
    }
  };

  const handleClose = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-gray-800/95 backdrop-blur-sm border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-blue-400" />
            Invite Client
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client_name" className="text-gray-300">
              Client Name *
            </Label>
            <Input
              id="client_name"
              {...register('client_name', { required: 'Client name is required' })}
              className="bg-gray-700/50 border-gray-600 text-white"
              placeholder="Enter client name"
            />
            {errors.client_name && (
              <p className="text-sm text-red-400">{errors.client_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
              className="bg-gray-700/50 border-gray-600 text-white"
              placeholder="client@company.com"
            />
            {errors.email && (
              <p className="text-sm text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="invitation_message" className="text-gray-300 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Invitation Message
            </Label>
            <Textarea
              id="invitation_message"
              {...register('invitation_message')}
              className="bg-gray-700/50 border-gray-600 text-white min-h-[80px]"
              placeholder="Welcome to our PSA platform! We're excited to work with you..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={createClientInvite.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={createClientInvite.isPending}
            >
              {createClientInvite.isPending ? 'Sending...' : 'Send Invitation'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ClientInviteForm;
