
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Building, Mail, Phone, Calendar, ExternalLink } from 'lucide-react';
import { useVendorsApi, useCreateVendorApi } from '@/hooks/useApiIntegration';
import VendorCreationModal from './forms/VendorCreationModal';
import VendorDetailModal from './modals/VendorDetailModal';
import { useToast } from '@/hooks/use-toast';

const Vendors = () => {
  const { data: vendors, isLoading, refetch } = useVendorsApi();
  const createVendor = useCreateVendorApi();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewVendorModal, setShowNewVendorModal] = useState(false);
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const { toast } = useToast();

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
      
      // Refetch vendors to get the updated list
      await refetch();
      
      // Close modal
      setShowNewVendorModal(false);
      
      toast({
        title: "Vendor Created",
        description: `Vendor "${data.vendor_name}" has been created successfully.`,
      });
    } catch (error: any) {
      console.error('Error creating vendor:', error);
      
      // Provide detailed error information
      let errorMessage = 'Failed to create vendor. Please try again.';
      
      if (error.message?.includes('already imported')) {
        errorMessage = `Error: ${error.message}`;
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast({
        title: "Vendor Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleVendorClick = (vendorId: string) => {
    setSelectedVendorId(vendorId);
  };

  const handleAddVendorClick = () => {
    console.log('Add Vendor button clicked - showing modal');
    setShowNewVendorModal(true);
  };

  const handleCloseVendorModal = () => {
    console.log('Closing vendor creation modal');
    setShowNewVendorModal(false);
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
          onClick={handleAddVendorClick}
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
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-white text-lg">{vendor.vendor_name}</CardTitle>
                    {vendor.external_source && (
                      <div className="flex items-center gap-1">
                        <ExternalLink className="w-4 h-4 text-blue-400" />
                        <Badge variant="outline" className="text-xs border-blue-400 text-blue-400">
                          {vendor.external_source}
                        </Badge>
                      </div>
                    )}
                  </div>
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
                  
                  {vendor.external_source && vendor.external_id && (
                    <div className="text-xs text-blue-400 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      Imported from {vendor.external_source} (ID: {vendor.external_id})
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredVendors.length === 0 && !isLoading && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-12 text-center">
            <Building className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
            <h3 className="text-xl font-medium text-white mb-2">No vendors found</h3>
            <p className="text-gray-400 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first vendor'}
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAddVendorClick}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Vendor
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Vendor Creation Modal - Only shown when showNewVendorModal is true */}
      {showNewVendorModal && (
        <VendorCreationModal
          open={showNewVendorModal}
          onOpenChange={handleCloseVendorModal}
          onSubmit={handleNewVendor}
        />
      )}

      {/* Vendor Detail Modal */}
      <VendorDetailModal
        vendorId={selectedVendorId}
        onClose={() => setSelectedVendorId(null)}
      />
    </div>
  );
};

export default Vendors;
