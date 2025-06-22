
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Building, Mail, Phone, Calendar } from 'lucide-react';
import { useVendorApi } from '@/hooks/useApiIntegration';
import EditVendorForm from '../forms/EditVendorForm';

interface VendorDetailModalProps {
  vendorId: string | null;
  onClose: () => void;
}

const VendorDetailModal = ({ vendorId, onClose }: VendorDetailModalProps) => {
  const [showEditForm, setShowEditForm] = useState(false);
  const { data: vendor, isLoading } = useVendorApi(vendorId || '');

  if (!vendorId) return null;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  if (showEditForm) {
    return (
      <EditVendorForm
        vendor={vendor}
        onClose={() => setShowEditForm(false)}
        onCancel={() => setShowEditForm(false)}
      />
    );
  }

  return (
    <Dialog open={!!vendorId} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center justify-between">
            Vendor Details
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
        ) : vendor ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-white">{vendor.vendor_name}</h2>
              <Badge className={`${getStatusColor(vendor.status)} text-white`}>
                {vendor.status || 'Unknown'}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300 flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    Contact Person
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">{vendor.contact_person}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300 flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Email
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">{vendor.contact_email}</p>
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
                  <p className="text-white">{vendor.phone_number || 'No phone number'}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300 flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">{vendor.services_offered}</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Contract Start
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">
                    {vendor.contract_start_date ? new Date(vendor.contract_start_date).toLocaleDateString() : 'No start date'}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-gray-300 flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    Contract End
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">
                    {vendor.contract_end_date ? new Date(vendor.contract_end_date).toLocaleDateString() : 'No end date'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {vendor.notes && (
              <Card className="bg-gray-700/50 border-gray-600">
                <CardHeader>
                  <CardTitle className="text-gray-300">Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white">{vendor.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p>Vendor not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VendorDetailModal;
