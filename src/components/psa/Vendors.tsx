import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { Plus, Search, Filter, Building, Mail, Phone, Calendar } from 'lucide-react';
import { useVendorsApi, useCreateVendorApi } from '@/hooks/useApiIntegration';
import NewVendorForm from './forms/NewVendorForm';
import VendorDetailModal from './modals/VendorDetailModal';

const Vendors = () => {
  const { data: vendors, isLoading } = useVendorsApi();
  const createVendor = useCreateVendorApi();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewVendorModal, setShowNewVendorModal] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredVendors = vendors?.filter(vendor =>
    vendor?.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor?.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor?.services_offered?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleNewVendor = async (data: any) => {
    console.log('Creating new vendor:', data);
    try {
      await createVendor.mutateAsync(data);
      setShowNewVendorModal(false);
    } catch (error) {
      console.error('Error creating vendor:', error);
    }
  };

  const handleVendorClick = (vendorId: string) => {
    setSelectedVendorId(vendorId);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading vendors...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Vendors</h1>
          <p className="text-gray-400">Manage your vendor relationships</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowNewVendorModal(true)}
          disabled={createVendor.isPending}
        >
          <Plus className="w-4 h-4 mr-2" />
          {createVendor.isPending ? 'Adding...' : 'Add Vendor'}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-700 text-white"
          />
        </div>
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Vendor Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Vendors</p>
                <p className="text-2xl font-bold text-white">{vendors?.length || 0}</p>
              </div>
              <Building className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Vendors</p>
                <p className="text-2xl font-bold text-green-500">
                  {vendors?.filter(v => v?.status === 'active').length || 0}
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {vendors?.filter(v => v?.status === 'pending').length || 0}
                </p>
              </div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendors Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-gray-800/50 border-gray-700 animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                <div className="h-3 bg-gray-600 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-600 rounded"></div>
                  <div className="h-3 bg-gray-600 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVendors.map((vendor) => (
            <Card 
              key={vendor.vendor_id} 
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors cursor-pointer"
              onClick={() => handleVendorClick(vendor.vendor_id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-lg">{vendor.vendor_name}</CardTitle>
                  <Badge className={`${getStatusColor(vendor.status)} text-white`}>
                    {vendor.status || 'Unknown'}
                  </Badge>
                </div>
                <CardDescription className="text-gray-400">
                  {vendor.services_offered}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {vendor.contact_email && (
                    <div className="flex items-center text-gray-300 text-sm">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {vendor.contact_email}
                    </div>
                  )}
                  
                  {vendor.phone_number && (
                    <div className="flex items-center text-gray-300 text-sm">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {vendor.phone_number}
                    </div>
                  )}
                  
                  <div className="flex items-center text-gray-300 text-sm">
                    <Building className="w-4 h-4 mr-2 text-gray-400" />
                    {vendor.contact_person}
                  </div>
                  
                  {vendor.contract_start_date && (
                    <div className="flex items-center text-gray-300 text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      Contract: {new Date(vendor.contract_start_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* New Vendor Modal */}
      <Dialog open={showNewVendorModal} onOpenChange={setShowNewVendorModal}>
        <NewVendorForm
          onSubmit={handleNewVendor}
          onCancel={() => setShowNewVendorModal(false)}
        />
      </Dialog>

      {/* Vendor Detail Modal */}
      <VendorDetailModal
        vendorId={selectedVendorId}
        onClose={() => setSelectedVendorId(null)}
      />
    </div>
  );
};

export default Vendors;
