
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, User, Mail, Phone, Calendar, Building } from 'lucide-react';
import { useResourceApi } from '@/hooks/useApiIntegration';
import EditResourceForm from '../forms/EditResourceForm';

interface ResourceDetailModalProps {
  resourceId: string | null;
  onClose: () => void;
}

const ResourceDetailModal = ({ resourceId, onClose }: ResourceDetailModalProps) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const { data: resource, isLoading } = useResourceApi(resourceId || '');

  if (!resourceId) return null;

  const getStatusColor = (status?: boolean) => {
    return status ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = (status?: boolean) => {
    return status ? 'Active' : 'Inactive';
  };

  if (showEditForm) {
    return (
      <EditResourceForm
        resource={resource}
        onClose={() => setShowEditForm(false)}
        onCancel={() => setShowEditForm(false)}
      />
    );
  }

  return (
    <Dialog open={!!resourceId} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            Resource Details
            <Button
              onClick={() => setShowEditForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-6 bg-gray-600 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-600 rounded w-3/4 animate-pulse"></div>
          </div>
        ) : resource ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-white">{resource.full_name}</h2>
              <Badge className={`${getStatusColor(resource.active_status)} text-white`}>
                {getStatusText(resource.active_status)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">{resource.email_address}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300 flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    Phone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">{resource.phone_number || 'No phone number'}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300 flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    Department
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">{resource.department}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Role
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">{resource.role}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Join Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">
                    {resource.join_date ? new Date(resource.join_date).toLocaleDateString() : 'No join date'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">
                    Availability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">{resource.availability || 100}%</p>
                </CardContent>
              </Card>
            </div>

            {resource.skills && resource.skills.length > 0 && (
              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-gray-300">Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {resource.skills.map((skill: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-gray-300 border-gray-500">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>Resource not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResourceDetailModal;
