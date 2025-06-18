
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Building, FileText, DollarSign, Package, Eye, Edit, Trash2 } from 'lucide-react';
import NewVendorForm from './forms/NewVendorForm';
import NewPurchaseOrderForm from './forms/NewPurchaseOrderForm';
import { usePSAData } from '@/hooks/usePSAData';

const Vendors = () => {
  const { useVendors, usePurchaseOrders, createVendor, createPurchaseOrder } = usePSAData();
  const { data: vendors, isLoading: vendorsLoading } = useVendors();
  const { data: purchaseOrders, isLoading: poLoading } = usePurchaseOrders();
  
  const [showNewVendorForm, setShowNewVendorForm] = useState(false);
  const [showNewPOForm, setShowNewPOForm] = useState(false);

  const handleCreateVendor = async (vendorData: any) => {
    await createVendor.mutateAsync(vendorData);
    setShowNewVendorForm(false);
  };

  const handleCreatePO = async (poData: any) => {
    await createPurchaseOrder.mutateAsync(poData);
    setShowNewPOForm(false);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      active: 'bg-green-500',
      inactive: 'bg-gray-500',
      suspended: 'bg-red-500',
      open: 'bg-blue-500',
      'in-progress': 'bg-yellow-500',
      closed: 'bg-gray-500',
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-500';
  };

  if (vendorsLoading || poLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading vendors...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Vendors</h1>
          <p className="text-gray-400">Manage your vendor relationships and purchase orders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Vendors</CardTitle>
            <Building className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{vendors?.length || 0}</div>
            <p className="text-xs text-gray-400">
              {vendors?.filter(v => v.status === 'active').length || 0} active
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Purchase Orders</CardTitle>
            <FileText className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{purchaseOrders?.length || 0}</div>
            <p className="text-xs text-gray-400">
              {purchaseOrders?.filter(po => po.status === 'open').length || 0} open
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Spend</CardTitle>
            <DollarSign className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              ${purchaseOrders?.reduce((sum, po) => sum + (po.total_amount || 0), 0).toLocaleString() || '0'}
            </div>
            <p className="text-xs text-gray-400">Across all POs</p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Pending Deliveries</CardTitle>
            <Package className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {purchaseOrders?.filter(po => po.status === 'in-progress').length || 0}
            </div>
            <p className="text-xs text-gray-400">In progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="vendors" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white/10">
          <TabsTrigger value="vendors" className="text-gray-300 data-[state=active]:text-white">
            Vendors
          </TabsTrigger>
          <TabsTrigger value="purchase-orders" className="text-gray-300 data-[state=active]:text-white">
            Purchase Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vendors" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Vendor List</h2>
            <Button
              onClick={() => setShowNewVendorForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </div>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-300">Vendor Name</TableHead>
                  <TableHead className="text-gray-300">Contact Person</TableHead>
                  <TableHead className="text-gray-300">Services</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Contract Period</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors?.map((vendor) => (
                  <TableRow key={vendor.vendor_id} className="border-white/10">
                    <TableCell className="text-white font-medium">
                      {vendor.vendor_name}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div>
                        <div>{vendor.contact_person}</div>
                        <div className="text-sm text-gray-400">{vendor.contact_email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {vendor.services_offered}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusBadge(vendor.status || 'active')} text-white`}>
                        {vendor.status || 'active'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {vendor.contract_start_date && vendor.contract_end_date ? (
                        <div className="text-sm">
                          <div>{new Date(vendor.contract_start_date).toLocaleDateString()}</div>
                          <div className="text-gray-400">to {new Date(vendor.contract_end_date).toLocaleDateString()}</div>
                        </div>
                      ) : (
                        'Not specified'
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="purchase-orders" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Purchase Orders</h2>
            <Button
              onClick={() => setShowNewPOForm(true)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create PO
            </Button>
          </div>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-300">PO Number</TableHead>
                  <TableHead className="text-gray-300">Vendor</TableHead>
                  <TableHead className="text-gray-300">Project</TableHead>
                  <TableHead className="text-gray-300">Order Date</TableHead>
                  <TableHead className="text-gray-300">Total Amount</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchaseOrders?.map((po) => (
                  <TableRow key={po.id} className="border-white/10">
                    <TableCell className="text-white font-medium">
                      {po.po_number}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {po.vendor?.vendor_name || 'No vendor'}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {po.project?.project_name || 'No project'}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(po.order_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      ${po.total_amount?.toLocaleString() || '0.00'}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusBadge(po.status)} text-white`}>
                        {po.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Vendor Dialog */}
      <Dialog open={showNewVendorForm} onOpenChange={setShowNewVendorForm}>
        <NewVendorForm
          onSubmit={handleCreateVendor}
          onCancel={() => setShowNewVendorForm(false)}
        />
      </Dialog>

      {/* New Purchase Order Dialog */}
      <Dialog open={showNewPOForm} onOpenChange={setShowNewPOForm}>
        <NewPurchaseOrderForm
          onSubmit={handleCreatePO}
          onCancel={() => setShowNewPOForm(false)}
        />
      </Dialog>
    </div>
  );
};

export default Vendors;
