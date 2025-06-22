
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, AlertCircle, ExternalLink, Key } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const APIStatusDashboard: React.FC = () => {
  // Test webhook logs to verify webhook integration
  const { data: webhookLogs } = useQuery({
    queryKey: ['webhook-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('webhook_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data;
    }
  });

  const apiStatus = [
    {
      name: 'Microsoft OAuth',
      status: 'active',
      description: 'User authentication with role-based routing',
      endpoint: '/auth/callback',
      testAction: 'Login with Microsoft',
    },
    {
      name: 'Supabase API',
      status: 'active',
      description: 'Database operations with RLS enabled',
      endpoint: 'All CRUD operations',
      testAction: 'Create/View data in any module',
    },
    {
      name: 'Email Notifications',
      status: 'needs-config',
      description: 'Task assignments, reports, project updates',
      endpoint: '/functions/v1/send-notifications',
      testAction: 'Configure RESEND_API_KEY',
      configLink: 'https://supabase.com/dashboard/project/nkunwcjticnnfbfbceiy/settings/functions',
    },
    {
      name: 'Export API',
      status: 'active',
      description: 'Export reports as CSV/PDF',
      endpoint: '/functions/v1/export-reports',
      testAction: 'Use Export button on Reports page',
    },
    {
      name: 'Webhook Receiver',
      status: 'active',
      description: 'Generic webhook endpoint for integrations',
      endpoint: '/functions/v1/webhooks/{source}',
      testAction: 'Send POST to webhook URL',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'needs-config':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-600 hover:bg-green-700">Active</Badge>;
      case 'needs-config':
        return <Badge className="bg-yellow-600 hover:bg-yellow-700">Needs Config</Badge>;
      default:
        return <Badge className="bg-red-600 hover:bg-red-700">Inactive</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">API Integration Status</h2>
        <p className="text-gray-400">Monitor and test your PSA platform's API integrations</p>
      </div>

      <div className="grid gap-4">
        {apiStatus.map((api) => (
          <Card key={api.name} className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(api.status)}
                  <CardTitle className="text-white">{api.name}</CardTitle>
                  {getStatusBadge(api.status)}
                </div>
                {api.configLink && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(api.configLink, '_blank')}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Key className="w-4 h-4 mr-1" />
                    Configure
                  </Button>
                )}
              </div>
              <CardDescription className="text-gray-400">
                {api.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Endpoint:</span>
                  <code className="bg-gray-700 px-2 py-1 rounded text-blue-400">
                    {api.endpoint}
                  </code>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Test Action:</span>
                  <span className="text-gray-300">{api.testAction}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {webhookLogs && webhookLogs.length > 0 && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Webhook Activity</CardTitle>
            <CardDescription className="text-gray-400">
              Latest webhook events received
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {webhookLogs.map((log) => (
                <div key={log.id} className="flex justify-between items-center text-sm py-2 border-b border-gray-700">
                  <div>
                    <span className="text-white font-medium">{log.source}</span>
                    <span className="text-gray-400 ml-2">({log.event_type})</span>
                  </div>
                  <span className="text-gray-400">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
        <h3 className="text-blue-400 font-semibold mb-2">Quick Integration Guide</h3>
        <div className="space-y-2 text-sm text-gray-300">
          <p><strong>Microsoft OAuth:</strong> Already configured - users can login and are routed based on their role</p>
          <p><strong>Supabase:</strong> All data operations are secured with RLS policies</p>
          <p><strong>Email Notifications:</strong> Set RESEND_API_KEY in Supabase Edge Functions settings</p>
          <p><strong>Webhooks:</strong> Use endpoint: <code className="bg-gray-700 px-1 rounded">https://nkunwcjticnnfbfbceiy.supabase.co/functions/v1/webhooks/calendly</code></p>
        </div>
      </div>
    </div>
  );
};

export default APIStatusDashboard;
