
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Package, DollarSign, FileText, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const VendorDashboard = () => {
  // Fetch purchase orders for this vendor
  const { data: purchaseOrders = [] } = useQuery({
    queryKey: ['vendor-purchase-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('purchase_orders')
        .select('*, project:projects(*), vendor:vendors(*)')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const activePOs = purchaseOrders.filter(po => po.status === 'open' || po.status === 'in-progress').length;
  const totalValue = purchaseOrders.reduce((sum, po) => sum + (po.total_amount || 0), 0);
  const completedPOs = purchaseOrders.filter(po => po.status === 'closed').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Vendor Portal</h1>
          <p className="text-gray-300 mt-1">Manage your purchase orders and deliveries</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-blue-100/10 border-blue-400/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Active Orders</CardTitle>
            <Package className="h-4 w-4 text-blue-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activePOs}</div>
            <p className="text-xs text-blue-200 mt-1">{purchaseOrders.length} total orders</p>
          </CardContent>
        </Card>

        <Card className="bg-green-100/10 border-green-400/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-100">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-green-200 mt-1">All purchase orders</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-100/10 border-purple-400/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">Completed</CardTitle>
            <FileText className="h-4 w-4 text-purple-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{completedPOs}</div>
            <p className="text-xs text-purple-200 mt-1">Delivered orders</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-100/10 border-orange-400/30 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-300" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activePOs}</div>
            <p className="text-xs text-orange-200 mt-1">Awaiting delivery</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Purchase Orders */}
      <Card className="bg-gray-800/50 border-gray-600">
        <CardHeader>
          <CardTitle className="text-white">Recent Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {purchaseOrders.slice(0, 5).map((po) => (
              <div key={po.id} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                <div>
                  <p className="font-medium text-white">{po.po_number}</p>
                  <p className="text-sm text-gray-300">
                    {po.project?.project_name || 'No project'} • ${po.total_amount?.toLocaleString() || '0'}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  po.status === 'open' ? 'bg-yellow-500/20 text-yellow-300' :
                  po.status === 'in-progress' ? 'bg-blue-500/20 text-blue-300' :
                  'bg-green-500/20 text-green-300'
                }`}>
                  {po.status}
                </span>
              </div>
            ))}
            {purchaseOrders.length === 0 && (
              <p className="text-gray-400 text-center py-4">No purchase orders yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorDashboard;
