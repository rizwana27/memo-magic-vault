
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, DollarSign, FileText, TrendingUp, Clock, Eye, Edit, Trash2 } from 'lucide-react';
import NewInvoiceForm from './forms/NewInvoiceForm';
import { usePSAData } from '@/hooks/usePSAData';

const Financial = () => {
  const { useInvoices, useTimesheets, createInvoice } = usePSAData();
  const { data: invoices, isLoading: invoicesLoading } = useInvoices();
  const { data: timesheets, isLoading: timesheetsLoading } = useTimesheets();
  
  const [showNewInvoiceForm, setShowNewInvoiceForm] = useState(false);

  const handleCreateInvoice = async (invoiceData: any) => {
    await createInvoice.mutateAsync(invoiceData);
    setShowNewInvoiceForm(false);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      draft: 'bg-gray-500',
      sent: 'bg-blue-500',
      paid: 'bg-green-500',
      overdue: 'bg-red-500',
      cancelled: 'bg-gray-600',
    };
    return statusColors[status as keyof typeof statusColors] || 'bg-gray-500';
  };

  // Calculate financial metrics from real data
  const totalRevenue = invoices?.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0) || 0;
  const paidInvoices = invoices?.filter(invoice => invoice.status === 'paid') || [];
  const totalPaid = paidInvoices.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0);
  const pendingInvoices = invoices?.filter(invoice => ['sent', 'draft'].includes(invoice.status)) || [];
  const totalPending = pendingInvoices.reduce((sum, invoice) => sum + (invoice.total_amount || 0), 0);
  const overdueInvoices = invoices?.filter(invoice => invoice.status === 'overdue') || [];

  // Calculate billable hours from real timesheet data
  const billableHours = timesheets?.filter(timesheet => timesheet.billable).reduce((sum, timesheet) => {
    const start = new Date(`2000-01-01T${timesheet.start_time}`);
    const end = new Date(`2000-01-01T${timesheet.end_time}`);
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return sum + hours;
  }, 0) || 0;

  if (invoicesLoading || timesheetsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading financial data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Financial Management</h1>
          <p className="text-gray-400">Track invoices, revenue, and financial performance</p>
        </div>
        <Button
          onClick={() => setShowNewInvoiceForm(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              From {invoices?.length || 0} invoices
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Paid Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalPaid.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              {paidInvoices.length} paid invoices
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalPending.toLocaleString()}</div>
            <p className="text-xs text-gray-400">
              {pendingInvoices.length} pending invoices
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Billable Hours</CardTitle>
            <FileText className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{billableHours.toFixed(1)}h</div>
            <p className="text-xs text-gray-400">
              This period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="invoices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white/10">
          <TabsTrigger value="invoices" className="text-gray-300 data-[state=active]:text-white">
            Invoices
          </TabsTrigger>
          <TabsTrigger value="revenue" className="text-gray-300 data-[state=active]:text-white">
            Revenue Analysis
          </TabsTrigger>
          <TabsTrigger value="expenses" className="text-gray-300 data-[state=active]:text-white">
            Expenses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Invoice Management</h2>
            <div className="flex space-x-2">
              {overdueInvoices.length > 0 && (
                <Badge className="bg-red-500 text-white">
                  {overdueInvoices.length} Overdue
                </Badge>
              )}
            </div>
          </div>

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead className="text-gray-300">Invoice #</TableHead>
                  <TableHead className="text-gray-300">Client</TableHead>
                  <TableHead className="text-gray-300">Project</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-gray-300">Amount</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices?.map((invoice) => (
                  <TableRow key={invoice.id} className="border-white/10">
                    <TableCell className="text-white font-medium">
                      {invoice.invoice_number}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {invoice.client?.client_name || 'No client'}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {invoice.project?.project_name || 'No project'}
                    </TableCell>
                    <TableCell className="text-gray-300">
                      {new Date(invoice.invoice_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-white font-medium">
                      ${invoice.total_amount?.toLocaleString() || '0.00'}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusBadge(invoice.status)} text-white`}>
                        {invoice.status}
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

        <TabsContent value="revenue" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Revenue Breakdown</CardTitle>
              <CardDescription className="text-gray-400">
                Analysis of revenue streams and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-white font-medium">By Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-300">
                      <span>Paid:</span>
                      <span className="text-green-400">${totalPaid.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Pending:</span>
                      <span className="text-yellow-400">${totalPending.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Overdue:</span>
                      <span className="text-red-400">
                        ${overdueInvoices.reduce((sum, inv) => sum + (inv.total_amount || 0), 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-white font-medium">Payment Performance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-gray-300">
                      <span>Collection Rate:</span>
                      <span className="text-white">
                        {totalRevenue > 0 ? ((totalPaid / totalRevenue) * 100).toFixed(1) : '0'}%
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Average Invoice:</span>
                      <span className="text-white">
                        ${invoices?.length ? (totalRevenue / invoices.length).toLocaleString() : '0'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Expense Management</CardTitle>
              <CardDescription className="text-gray-400">
                Track and manage business expenses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-400">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Expense tracking features coming soon...</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Invoice Dialog */}
      <Dialog open={showNewInvoiceForm} onOpenChange={setShowNewInvoiceForm}>
        <NewInvoiceForm
          onSubmit={handleCreateInvoice}
          onCancel={() => setShowNewInvoiceForm(false)}
        />
      </Dialog>
    </div>
  );
};

export default Financial;
