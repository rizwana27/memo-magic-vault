
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Eye, 
  FileText, 
  ShoppingCart, 
  TrendingUp, 
  Users, 
  Building2,
  DollarSign,
  Calendar,
  Star
} from 'lucide-react';

const Vendors = () => {
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [isNewVendorOpen, setIsNewVendorOpen] = useState(false);
  const [isEditVendorOpen, setIsEditVendorOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [isNewPOOpen, setIsNewPOOpen] = useState(false);

  // Mock vendor data
  const vendors = [
    {
      id: 1,
      name: "TechCorp Solutions",
      category: "Technology",
      status: "Active",
      contractValue: "$250,000",
      contractEnd: "2024-12-31",
      rating: 4.8,
      contact: "john.doe@techcorp.com"
    },
    {
      id: 2,
      name: "Global Consulting",
      category: "Consulting",
      status: "Active",
      contractValue: "$180,000",
      contractEnd: "2024-09-15",
      rating: 4.5,
      contact: "sarah.smith@globalconsult.com"
    },
    {
      id: 3,
      name: "Office Supplies Inc",
      category: "Office Supplies",
      status: "Pending",
      contractValue: "$45,000",
      contractEnd: "2024-06-30",
      rating: 4.2,
      contact: "mike.wilson@officesupplies.com"
    }
  ];

  // Mock contracts data
  const contracts = [
    {
      id: 1,
      vendorName: "TechCorp Solutions",
      title: "Software Development Services",
      value: "$250,000",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      status: "Active"
    },
    {
      id: 2,
      vendorName: "Global Consulting",
      title: "Business Process Optimization",
      value: "$180,000",
      startDate: "2023-10-01",
      endDate: "2024-09-15",
      status: "Expiring Soon"
    }
  ];

  // Mock purchase orders data
  const purchaseOrders = [
    {
      id: "PO-001",
      vendorName: "TechCorp Solutions",
      description: "Software Licenses",
      amount: "$15,000",
      date: "2024-01-15",
      status: "Approved"
    },
    {
      id: "PO-002",
      vendorName: "Office Supplies Inc",
      description: "Office Equipment",
      amount: "$3,500",
      date: "2024-01-10",
      status: "Pending"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-600';
      case 'Pending': return 'bg-yellow-600';
      case 'Approved': return 'bg-blue-600';
      case 'Expiring Soon': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Vendor Management</h1>
          <p className="text-gray-400">Manage vendor relationships and contracts</p>
        </div>
        <Dialog open={isNewVendorOpen} onOpenChange={setIsNewVendorOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-white">
            <DialogHeader>
              <DialogTitle>Add New Vendor</DialogTitle>
              <DialogDescription className="text-gray-400">
                Create a new vendor profile for your organization.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" className="col-span-3 bg-gray-700 border-gray-600" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Select>
                  <SelectTrigger className="col-span-3 bg-gray-700 border-gray-600">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="supplies">Office Supplies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contact" className="text-right">Contact</Label>
                <Input id="contact" type="email" className="col-span-3 bg-gray-700 border-gray-600" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsNewVendorOpen(false)}>Create Vendor</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 bg-gray-800/50 border border-gray-700">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="purchase-orders">Purchase Orders</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="detailed-contracts">Contract Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4">
            {vendors.map((vendor) => (
              <Card key={vendor.id} className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        {vendor.name}
                      </CardTitle>
                      <CardDescription className="text-gray-400">
                        {vendor.category} • {vendor.contact}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(vendor.status)}>
                        {vendor.status}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-white text-sm">{vendor.rating}</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>Contract Value: <span className="text-white">{vendor.contractValue}</span></span>
                      <span>Contract End: <span className="text-white">{vendor.contractEnd}</span></span>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedVendor(vendor);
                          setIsViewDetailsOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedVendor(vendor);
                          setIsEditVendorOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Vendor Contracts</h2>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <FileText className="h-4 w-4 mr-2" />
              New Contract
            </Button>
          </div>
          <div className="grid gap-4">
            {contracts.map((contract) => (
              <Card key={contract.id} className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{contract.title}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {contract.vendorName}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(contract.status)}>
                      {contract.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>Value: <span className="text-white">{contract.value}</span></span>
                      <span>Period: <span className="text-white">{contract.startDate} - {contract.endDate}</span></span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Contract
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="purchase-orders" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Purchase Orders</h2>
            <Dialog open={isNewPOOpen} onOpenChange={setIsNewPOOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  New Purchase Order
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Create Purchase Order</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Create a new purchase order for a vendor.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="vendor" className="text-right">Vendor</Label>
                    <Select>
                      <SelectTrigger className="col-span-3 bg-gray-700 border-gray-600">
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.name}>
                            {vendor.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">Description</Label>
                    <Input id="description" className="col-span-3 bg-gray-700 border-gray-600" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount" className="text-right">Amount</Label>
                    <Input id="amount" type="number" className="col-span-3 bg-gray-700 border-gray-600" />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setIsNewPOOpen(false)}>Create Purchase Order</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid gap-4">
            {purchaseOrders.map((po) => (
              <Card key={po.id} className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-white">{po.id}</CardTitle>
                      <CardDescription className="text-gray-400">
                        {po.vendorName} • {po.description}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(po.status)}>
                      {po.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-sm text-gray-400">
                      <span>Amount: <span className="text-white">{po.amount}</span></span>
                      <span>Date: <span className="text-white">{po.date}</span></span>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit PO
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Vendor Performance Metrics</h3>
            <p className="text-gray-400">Performance analytics and KPIs coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Vendor Resources</h3>
            <p className="text-gray-400">Vendor resource management coming soon...</p>
          </div>
        </TabsContent>

        <TabsContent value="detailed-contracts" className="space-y-4">
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Detailed Contract Management</h3>
            <p className="text-gray-400">Advanced contract details and management coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* View Details Modal */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vendor Details</DialogTitle>
            <DialogDescription className="text-gray-400">
              Complete vendor information and contract history.
            </DialogDescription>
          </DialogHeader>
          {selectedVendor && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-gray-400">Vendor Name</Label>
                  <p className="text-white">{selectedVendor.name}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-400">Category</Label>
                  <p className="text-white">{selectedVendor.category}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-400">Status</Label>
                  <Badge className={getStatusColor(selectedVendor.status)}>
                    {selectedVendor.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm text-gray-400">Rating</Label>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-white">{selectedVendor.rating}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-gray-400">Contract Value</Label>
                  <p className="text-white">{selectedVendor.contractValue}</p>
                </div>
                <div>
                  <Label className="text-sm text-gray-400">Contract End</Label>
                  <p className="text-white">{selectedVendor.contractEnd}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Vendor Modal */}
      <Dialog open={isEditVendorOpen} onOpenChange={setIsEditVendorOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Edit Vendor</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update vendor information and details.
            </DialogDescription>
          </DialogHeader>
          {selectedVendor && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">Name</Label>
                <Input id="edit-name" defaultValue={selectedVendor.name} className="col-span-3 bg-gray-700 border-gray-600" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-category" className="text-right">Category</Label>
                <Select defaultValue={selectedVendor.category.toLowerCase()}>
                  <SelectTrigger className="col-span-3 bg-gray-700 border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="supplies">Office Supplies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-contact" className="text-right">Contact</Label>
                <Input id="edit-contact" defaultValue={selectedVendor.contact} className="col-span-3 bg-gray-700 border-gray-600" />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsEditVendorOpen(false)}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Vendors;
