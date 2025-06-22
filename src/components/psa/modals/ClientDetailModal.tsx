
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Building, Mail, Phone, Globe } from 'lucide-react';
import { useClientApi } from '@/hooks/useApiIntegration';
import EditClientForm from '../forms/EditClientForm';

interface ClientDetailModalProps {
  clientId: string | null;
  onClose: () => void;
}

const ClientDetailModal = ({ clientId, onClose }: ClientDetailModalProps) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const { data: client, isLoading } = useClientApi(clientId || '');

  if (!clientId) return null;

  if (showEditForm) {
    return (
      <EditClientForm
        client={client}
        onClose={() => setShowEditForm(false)}
        onCancel={() => setShowEditForm(false)}
      />
    );
  }

  return (
    <Dialog open={!!clientId} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            Client Details
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
        ) : client ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-white">{client.client_name}</h2>
              <Badge variant="outline" className="text-gray-300 border-gray-500">
                {client.client_type || 'new'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300 flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    Company
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">{client.company_name}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Primary Contact Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">{client.primary_contact_email}</p>
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
                  <p className="text-white">{client.phone_number || 'No phone number'}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300 flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    Industry
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">{client.industry || 'Not specified'}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">
                    Revenue Tier
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">{client.revenue_tier || 'Not specified'}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300">
                    Primary Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">{client.primary_contact_name}</p>
                </CardContent>
              </Card>
            </div>

            {client.notes && (
              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-gray-300">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">{client.notes}</p>
                </CardContent>
              </Card>
            )}

            {client.tags && client.tags.length > 0 && (
              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-gray-300">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {client.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-gray-300 border-gray-500">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>Client not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailModal;
