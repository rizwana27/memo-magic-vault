import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog } from '@/components/ui/dialog';
import { Plus, Search, Filter, DollarSign, FileText, CreditCard, TrendingUp } from 'lucide-react';
import { usePSAData } from '@/hooks/usePSAData';
import NewInvoiceForm from './forms/NewInvoiceForm';

const Financial = () => {
  const { useInvoices, useExpenses } = usePSAData();
  const { data: invoices, isLoading: invoicesLoading } = useInvoices();
  const { data: expenses, isLoading: expensesLoading } = useExpenses();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewInvoiceModal, setShowNewInvoiceModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-500';
      case 'sent': return 'bg-blue-500';
      case 'overdue': return 'bg-red-500';
      case 'draft': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const handleNewInvoice = (data: any) => {
    console.log('Creating new invoice:', data);
    setShowNewInvoiceModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Financial Management</h1>
          <p className="text-gray-400">Manage invoices, expenses, and financial reporting</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowNewInvoiceModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Invoice
        </Button>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-white">$124,580</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Outstanding</p>
                <p className="text-2xl font-bold text-yellow-500">$32,400</p>
              </div>
              <FileText className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Expenses</p>
                <p className="text-2xl font-bold text-red-500">$18,950</p>
              </div>
              <CreditCard className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-sm">Net Profit</p>
                <p className="text-2xl font-bold text-blue-500">$105,630</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Tabs */}
      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-md">
          <TabsTrigger value="invoices" className="text-gray-300 data-[state=active]:text-white">Invoices</TabsTrigger>
          <TabsTrigger value="expenses" className="text-gray-300 data-[state=active]:text-white">Expenses</TabsTrigger>
          <TabsTrigger value="reports" className="text-gray-300 data-[state=active]:text-white">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search invoices..."
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

          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Invoices</CardTitle>
              <CardDescription className="text-gray-300">Manage client invoices and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Invoice #</TableHead>
                    <TableHead className="text-gray-300">Client</TableHead>
                    <TableHead className="text-gray-300">Amount</TableHead>
                    <TableHead className="text-gray-300">Due Date</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoicesLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-400">Loading...</TableCell>
                    </TableRow>
                  ) : (
                    invoices?.slice(0, 10).map((invoice: any) => (
                      <TableRow key={invoice.id} className="border-gray-700">
                        <TableCell className="text-white">{invoice.invoice_number}</TableCell>
                        <TableCell className="text-gray-300">{invoice.client?.name || 'No Client'}</TableCell>
                        <TableCell className="text-white">${invoice.amount?.toLocaleString() || '0'}</TableCell>
                        <TableCell className="text-gray-300">
                          {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : 'No due date'}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(invoice.status)} text-white`}>
                            {invoice.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Expenses</CardTitle>
              <CardDescription className="text-gray-300">Track project and operational expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700">
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Category</TableHead>
                    <TableHead className="text-gray-300">Description</TableHead>
                    <TableHead className="text-gray-300">Amount</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {expensesLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-gray-400">Loading...</TableCell>
                    </TableRow>
                  ) : (
                    expenses?.slice(0, 10).map((expense: any) => (
                      <TableRow key={expense.id} className="border-gray-700">
                        <TableCell className="text-gray-300">
                          {expense.expense_date ? new Date(expense.expense_date).toLocaleDateString() : 'No date'}
                        </TableCell>
                        <TableCell className="text-white">{expense.category}</TableCell>
                        <TableCell className="text-gray-300">{expense.description || 'No description'}</TableCell>
                        <TableCell className="text-white">${expense.amount?.toLocaleString() || '0'}</TableCell>
                        <TableCell>
                          <Badge className={`${getStatusColor(expense.status)} text-white`}>
                            {expense.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Financial Reports</CardTitle>
              <CardDescription className="text-gray-300">Generate financial analytics and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Financial reports coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Invoice Modal */}
      <Dialog open={showNewInvoiceModal} onOpenChange={setShowNewInvoiceModal}>
        <NewInvoiceForm
          onSubmit={handleNewInvoice}
          onCancel={() => setShowNewInvoiceModal(false)}
        />
      </Dialog>
    </div>
  );
};

export default Financial;
