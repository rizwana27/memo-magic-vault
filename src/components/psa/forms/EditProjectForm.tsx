
import React from 'react';
import { useForm } from 'react-hook-form';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUpdateProjectApi, useClientsApi } from '@/hooks/useApiIntegration';

interface EditProjectFormProps {
  project: any;
  onClose: () => void;
  onCancel: () => void;
}

const EditProjectForm = ({ project, onClose, onCancel }: EditProjectFormProps) => {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      project_name: project?.project_name || '',
      description: project?.description || '',
      client_id: project?.client_id || '',
      status: project?.status || 'planning',
      budget: project?.budget || '',
      start_date: project?.start_date || '',
      end_date: project?.end_date || '',
    }
  });

  const updateProject = useUpdateProjectApi();
  const { data: clients } = useClientsApi();

  const onSubmit = async (data: any) => {
    try {
      await updateProject.mutateAsync({
        projectId: project.project_id,
        updates: {
          ...data,
          budget: data.budget ? parseFloat(data.budget) : null,
        }
      });
      onClose();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  return (
    <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
      <DialogHeader>
        <DialogTitle className="text-white">Edit Project</DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="project_name" className="text-gray-300">Project Name</Label>
          <Input
            id="project_name"
            {...register('project_name', { required: true })}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="client_id" className="text-gray-300">Client</Label>
          <Select onValueChange={(value) => setValue('client_id', value)} defaultValue={project?.client_id}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {clients?.map((client) => (
                <SelectItem key={client.client_id} value={client.client_id} className="text-white">
                  {client.client_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status" className="text-gray-300">Status</Label>
          <Select onValueChange={(value) => setValue('status', value)} defaultValue={project?.status}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="planning" className="text-white">Planning</SelectItem>
              <SelectItem value="active" className="text-white">Active</SelectItem>
              <SelectItem value="on_hold" className="text-white">On Hold</SelectItem>
              <SelectItem value="completed" className="text-white">Completed</SelectItem>
              <SelectItem value="cancelled" className="text-white">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start_date" className="text-gray-300">Start Date</Label>
            <Input
              id="start_date"
              type="date"
              {...register('start_date')}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div>
            <Label htmlFor="end_date" className="text-gray-300">End Date</Label>
            <Input
              id="end_date"
              type="date"
              {...register('end_date')}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="budget" className="text-gray-300">Budget</Label>
          <Input
            id="budget"
            type="number"
            step="0.01"
            {...register('budget')}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-gray-300">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
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
            disabled={updateProject.isPending}
          >
            {updateProject.isPending ? 'Updating...' : 'Update Project'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
};

export default EditProjectForm;
