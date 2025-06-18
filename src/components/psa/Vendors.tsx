
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog } from '@/components/ui/dialog';
import { Plus, Search, Filter, Building, Mail, Phone, FileText, ShoppingCart } from 'lucide-react';
import { usePSAData } from '@/hooks/usePSAData';
import NewVendorForm from './forms/NewVendorForm';
import NewPurchaseOrderForm from './forms/NewPurchaseOrderForm';

// Mock data for purchase orders (this would come from database in real app)
const mockPurchaseOrders = [
  {
    id: 1,
    poNumber: 'PO-2024-001',
    vendor: 'ABC Software Solutions',
    orderDate: '2024-03-15',
    deliveryDate: '2024-04-15',
    status: 'Open',
    totalAmount: 15000,
  },
  {
    id: 2,
    poNumber: 'PO-2024-002',
    vendor: 'Tech Hardware Co.',
    orderDate: '2024-03-10',
    deliveryDate: '2024-03-25',
    status: 'In Progress',
    totalAmount: 8500,
  },
];

const Vendors = () => {
  const { useVendors, createVendor } = usePSAData();
  const { data: vendors, isLoading, error } = useVendors();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewVendorModal, setShowNewVendorModal] = useState(false);
  const [showNewPOModal, setShowNewPOModal] = useState(false);

  const getStatusColor = (status?: string) => {
    return status === 'active' ? 'bg-green-500' : 'bg-red-500';
  };

  const getStatusText = (status?: string) => {
    return status === 'active' ? 'Active' : 'Inactive';
  };

  const getPOStatusColor = (status?: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-500';
      case 'In Progress': return 'bg-yellow-500';
      case 'Closed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredVendors = vendors?.filter(vendor =>
    vendor.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.contact_person?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleNewVendor = async (data: any) => {
    console.log('Creating new vendor:', data);
    try {
      await createVendor.mutateAsync(data);
      setShowNewVendorModal(false);
    } catch (error) {
      console.error('Error creating vendor:', error);
      // Error is handled by the mutation's onError callback
    }
  };

  const handleNewPurchaseOrder = (data: any) => {
    console.log('Creating new purchase order:', data);
    // TODO: Implement purchase order creation
    setShowNewPOModal(false);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Vendor Management</h1>
            <p className="text-gray-400">Manage vendor relationships and contracts</p>
          </div>
        </div>
        <Card className="bg-red-900/20 border-red-500">
          <CardContent className="p-6">
            <p className="text-red-400">Error loading vendors: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <div className="text-center py-8">
              <p className="text-gray-400">Loading vendors...</p>
            </div>
          ) : filteredVendors.length === 0 ? (
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-8 text-center">
                <Building className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
                <h3 className="text-xl font-medium text-white mb-2">No Vendors Found</h3>
                <p className="text-gray-400 mb-4">
                  {searchTerm ? 'No vendors match your search criteria.' : 'Get started by adding your first vendor.'}
                </p>
                {!searchTerm && (
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowNewVendorModal(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Vendor
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor) => (
                <Card key={vendor.vendor_id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white text-lg">{vendor.vendor_name}</CardTitle>
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
                        {vendor.contact_email}
                      </div>
                      
                      {vendor.phone_number && (
                        <div className="flex items-center text-gray-300 text-sm">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {vendor.phone_number}
                        </div>
                      )}
                      
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPurchaseOrders.map((po) => (
              <Card key={po.id} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-white text-lg">{po.poNumber}</CardTitle>
                    <Badge className={`${getPOStatusColor(po.status)} text-white`}>
                      {po.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-gray-300">
                    {po.vendor}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Order Date:</span>
                      <span className="text-white">{new Date(po.orderDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Delivery Date:</span>
                      <span className="text-white">{new Date(po.deliveryDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Amount:</span>
                      <span className="text-green-400 font-semibold">${po.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
