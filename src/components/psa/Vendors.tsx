import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog } from '@/components/ui/dialog';
import { Plus, Search, Filter, Building, Mail, Phone, FileText, ShoppingCart } from 'lucide-react';
import { useVendors } from '@/hooks/useVendors';
import NewVendorForm from './forms/NewVendorForm';
import NewPurchaseOrderForm from './forms/NewPurchaseOrderForm';

const Vendors = () => {
  const { vendors, createVendor, isLoading } = useVendors();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewVendorModal, setShowNewPOModal] = useState(false);
  const [showNewPOModal, setShowNewPOModal] = useState(false);

  const getStatusColor = (status?: string) => {
    return status === 'active' ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = (status?: string) => {
    return status === 'active' ? 'Active' : 'Inactive';
  };

  const getPOStatusColor = (status?: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'closed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredVendors = vendors?.filter(vendor =>
    vendor?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor?.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleNewVendor = async (data: any) => {
    console.log('Creating new vendor:', data);
    const result = await createVendor(data);
    if (result.success) {
      setShowNewVendorModal(false);
    }
  };

  const handleNewPurchaseOrder = (data: any) => {
    console.log('Creating new purchase order:', data);
    setShowNewPOModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Vendor Management</h1>
          <p className="text-gray-400">Manage vendor relationships and contracts</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowNewVendorModal(true)}
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vendor
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
            className="pl-10 bg-white/10 border-white/20 text-white"
          />
        </div>
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Vendor Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/10 backdrop-blur-md">
          <TabsTrigger value="overview" className="text-gray-300 data-[state=active]:text-white">Overview</TabsTrigger>
          <TabsTrigger value="contracts" className="text-gray-300 data-[state=active]:text-white">Contracts</TabsTrigger>
          <TabsTrigger value="purchase-orders" className="text-gray-300 data-[state=active]:text-white">Purchase Orders</TabsTrigger>
          <TabsTrigger value="performance" className="text-gray-300 data-[state=active]:text-white">Performance</TabsTrigger>
          <TabsTrigger value="resources" className="text-gray-300 data-[state=active]:text-white">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="bg-white/10 backdrop-blur-md border-white/20 animate-pulse">
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
                <Card key={vendor.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white text-lg">{vendor.name}</CardTitle>
                      <Badge className={`${getStatusColor(vendor.status)} text-white`}>
                        {getStatusText(vendor.status)}
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-300">
                      Contact: {vendor.contact_person}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-gray-300 text-sm">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        {vendor.email}
                      </div>
                      
                      <div className="flex items-center text-gray-300 text-sm">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {vendor.phone}
                      </div>
                      
                      <div className="text-gray-300 text-sm">
                        <p className="line-clamp-2">{vendor.services_offered}</p>
                      </div>

                      {vendor.contract_start_date && vendor.contract_end_date && (
                        <div className="text-gray-400 text-xs">
                          Contract: {new Date(vendor.contract_start_date).toLocaleDateString()} - {new Date(vendor.contract_end_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {filteredVendors.length === 0 && !isLoading && (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-12 text-center">
                <Building className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                <h3 className="text-xl font-medium text-white mb-2">No vendors found</h3>
                <p className="text-gray-400 mb-4">
                  {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first vendor'}
                </p>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowNewVendorModal(true)}
                  disabled={isLoading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Vendor
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Vendor Contracts</CardTitle>
              <CardDescription className="text-gray-400">Manage vendor agreements and terms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                <h3 className="text-xl font-medium text-white mb-2">Contract Management</h3>
                <p className="text-gray-400">Contract creation and management features coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchase-orders" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-white">Purchase Orders</h3>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => setShowNewPOModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Purchase Order
            </Button>
          </div>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="p-12 text-center">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
              <h3 className="text-xl font-medium text-white mb-2">No Purchase Orders</h3>
              <p className="text-gray-400">Purchase orders will appear here once created</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Vendor Performance</CardTitle>
              <CardDescription className="text-gray-400">KPIs and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                <h3 className="text-xl font-medium text-white mb-2">Performance Analytics</h3>
                <p className="text-gray-400">Performance tracking and analytics coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Vendor Resources</CardTitle>
              <CardDescription className="text-gray-400">View vendors' linked resources or staff</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Building className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                <h3 className="text-xl font-medium text-white mb-2">Resource Management</h3>
                <p className="text-gray-400">Vendor resource tracking coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Vendor Modal */}
      <Dialog open={showNewVendorModal} onOpenChange={setShowNewVendorModal}>
        <NewVendorForm
          onSubmit={handleNewVendor}
          onCancel={() => setShowNewVendorModal(false)}
          isLoading={isLoading}
        />
      </Dialog>

      {/* New Purchase Order Modal */}
      <Dialog open={showNewPOModal} onOpenChange={setShowNewPOModal}>
        <NewPurchaseOrderForm
          onSubmit={handleNewPurchaseOrder}
          onCancel={() => setShowNewPOModal(false)}
        />
      </Dialog>
    </div>
  );
};

export default Vendors;
