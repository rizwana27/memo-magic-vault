
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Mail, 
  Download, 
  Webhook, 
  CheckCircle, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { useExport } from '@/hooks/useExport';

const APIDemo = () => {
  const { sendNotification } = useNotifications();
  const { exportReport } = useExport();
  
  const [email, setEmail] = useState('test@example.com');
  const [webhookTest, setWebhookTest] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTestNotification = async () => {
    setIsLoading(true);
    try {
      await sendNotification({
        type: 'task_assignment',
        recipient_email: email,
        recipient_name: 'Test User',
        data: {
          task_name: 'API Integration Test',
          project_name: 'Demo Project',
          due_date: '2024-01-15'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestExport = async () => {
    setIsLoading(true);
    try {
      await exportReport({
        format: 'csv',
        report_type: 'projects',
        filters: {
          start_date: '2024-01-01',
          end_date: '2024-12-31'
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  const webhookEndpoints = [
    {
      name: 'Calendly Webhook',
      url: 'https://nkunwcjticnnfbfbceiy.supabase.co/functions/v1/webhooks/calendly',
      description: 'Receives appointment bookings from Calendly'
    },
    {
      name: 'Slack Webhook', 
      url: 'https://nkunwcjticnnfbfbceiy.supabase.co/functions/v1/webhooks/slack',
      description: 'Processes messages and events from Slack'
    },
    {
      name: 'Generic Webhook',
      url: 'https://nkunwcjticnnfbfbceiy.supabase.co/functions/v1/webhooks/generic',
      description: 'Accepts any webhook payload for testing'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">API Integration Demo</h1>
        <p className="text-gray-400">Test and monitor all API integrations in your PSA platform</p>
      </div>

      {/* Webhook Endpoints */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Webhook className="w-5 h-5" />
            Inbound Webhooks
          </CardTitle>
          <CardDescription className="text-gray-400">
            Available endpoints for receiving data from external services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {webhookEndpoints.map((endpoint, index) => (
            <div key={index} className="border border-gray-600 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-white font-medium">{endpoint.name}</h3>
                <Badge variant="outline" className="border-green-500 text-green-400">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
              <p className="text-gray-400 text-sm mb-3">{endpoint.description}</p>
              <div className="flex items-center gap-2">
                <code className="bg-gray-700 px-2 py-1 rounded text-xs text-gray-300 flex-1">
                  {endpoint.url}
                </code>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  onClick={() => navigator.clipboard.writeText(endpoint.url)}
                >
                  Copy
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Email Notifications */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Email Notifications
          </CardTitle>
          <CardDescription className="text-gray-400">
            Test email notification system (requires RESEND_API_KEY)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-gray-300">Test Email Address</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email to test notifications"
              className="bg-gray-700/50 border-gray-600 text-white"
            />
          </div>
          <Button 
            onClick={handleTestNotification}
            disabled={isLoading || !email}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Mail className="w-4 h-4 mr-2" />
            {isLoading ? 'Sending...' : 'Send Test Notification'}
          </Button>
          
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-400 font-medium">Configuration Required</span>
            </div>
            <p className="text-gray-300 text-sm">
              To use email notifications, configure your RESEND_API_KEY in Supabase Edge Function secrets.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Export API */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Download className="w-5 h-5" />
            Report Export API
          </CardTitle>
          <CardDescription className="text-gray-400">
            Generate and download reports in various formats
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-600 rounded-lg p-4">
              <h3 className="text-white font-medium mb-2">CSV Export</h3>
              <p className="text-gray-400 text-sm mb-3">Export data in CSV format for spreadsheet analysis</p>
              <Button 
                onClick={handleTestExport}
                disabled={isLoading}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Test CSV Export
              </Button>
            </div>
            <div className="border border-gray-600 rounded-lg p-4">
              <h3 className="text-white font-medium mb-2">PDF Export</h3>
              <p className="text-gray-400 text-sm mb-3">Generate formatted PDF reports for clients</p>
              <Button 
                onClick={() => exportReport({ format: 'pdf', report_type: 'projects' })}
                disabled={isLoading}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700 w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Test PDF Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Status */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="w-5 h-5" />
            API Status & Access
          </CardTitle>
          <CardDescription className="text-gray-400">
            Current status of all integrated APIs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-600 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white font-medium">Supabase API</h3>
              <p className="text-green-400 text-sm">Connected</p>
            </div>
            <div className="text-center p-4 border border-gray-600 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-white font-medium">Microsoft OAuth</h3>
              <p className="text-green-400 text-sm">Active</p>
            </div>
            <div className="text-center p-4 border border-gray-600 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <AlertCircle className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-white font-medium">Email Service</h3>
              <p className="text-yellow-400 text-sm">Needs Config</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIDemo;
