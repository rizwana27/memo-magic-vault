
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Search, ExternalLink, Building, Mail, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImportClientFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

interface ExternalClient {
  id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  industry?: string;
  website?: string;
  location?: string;
  source: string;
}

// Mock data for external clients - replace with actual API calls
const mockExternalClients: Record<string, ExternalClient[]> = {
  clearbit: [
    {
      id: 'cb-001',
      name: 'John Smith',
      company: 'Amazon Web Services',
      email: 'john.smith@amazon.com',
      phone: '+1-206-266-1000',
      industry: 'Technology',
      website: 'aws.amazon.com',
      location: 'Seattle, WA',
      source: 'Clearbit'
    },
    {
      id: 'cb-002',
      name: 'Sarah Johnson',
      company: 'Microsoft Corporation',
      email: 'sarah.johnson@microsoft.com',
      phone: '+1-425-882-8080',
      industry: 'Technology',
      website: 'microsoft.com',
      location: 'Redmond, WA',
      source: 'Clearbit'
    }
  ],
  hubspot: [
    {
      id: 'hs-001',
      name: 'David Chen',
      company: 'Google LLC',
      email: 'david.chen@google.com',
      phone: '+1-650-253-0000',
      industry: 'Technology',
      website: 'google.com',
      location: 'Mountain View, CA',
      source: 'HubSpot'
    },
    {
      id: 'hs-002',
      name: 'Emily Rodriguez',
      company: 'Apple Inc.',
      email: 'emily.rodriguez@apple.com',
      phone: '+1-408-996-1010',
      industry: 'Technology',
      website: 'apple.com',
      location: 'Cupertino, CA',
      source: 'HubSpot'
    }
  ],
  partner: [
    {
      id: 'pa-001',
      name: 'Michael Taylor',
      company: 'Tesla, Inc.',
      email: 'michael.taylor@tesla.com',
      phone: '+1-650-681-5000',
      industry: 'Automotive',
      website: 'tesla.com',
      location: 'Palo Alto, CA',
      source: 'Partner API'
    },
    {
      id: 'pa-002',
      name: 'Lisa Wang',
      company: 'Netflix, Inc.',
      email: 'lisa.wang@netflix.com',
      phone: '+1-408-540-3700',
      industry: 'Entertainment',
      website: 'netflix.com',
      location: 'Los Gatos, CA',
      source: 'Partner API'
    }
  ]
};

const ImportClientForm = ({ onSubmit, onCancel }: ImportClientFormProps) => {
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [availableClients, setAvailableClients] = useState<ExternalClient[]>([]);
  const [selectedClient, setSelectedClient] = useState<ExternalClient | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSourceChange = (source: string) => {
    setSelectedSource(source);
    setSearchTerm('');
    setSelectedClient(null);
    setError('');
    
    console.log('Loading clients for source:', source);
    
    // Automatically load clients for the selected source
    const sourceClients = mockExternalClients[source] || [];
    console.log('Found clients:', sourceClients.length);
    setAvailableClients(sourceClients);
  };

  const handleSearch = () => {
    if (!selectedSource || !searchTerm.trim()) return;
    
    setIsSearching(true);
    setError('');
    
    console.log('Searching for:', searchTerm, 'in source:', selectedSource);
    
    // Simulate API call delay
    setTimeout(() => {
      const sourceClients = mockExternalClients[selectedSource] || [];
      const filteredResults = sourceClients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      console.log('Search results:', filteredResults.length);
      setAvailableClients(filteredResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleClientSelect = (client: ExternalClient) => {
    console.log('Selected client:', client);
    setSelectedClient(client);
    setError('');
  };

  const handleImport = () => {
    if (!selectedClient) {
      setError('Please select a client to import');
      return;
    }

    try {
      console.log('Starting import process for client:', selectedClient.company);
      
      // Convert external client to our client format
      const clientData = {
        client_name: selectedClient.name,
        company_name: selectedClient.company,
        primary_contact_email: selectedClient.email,
        primary_contact_name: selectedClient.name,
        phone_number: selectedClient.phone || null,
        industry: selectedClient.industry || null,
        client_type: 'prospect',
        revenue_tier: null,
        tags: [`imported-from-${selectedSource}`, 'external-client'],
        notes: `Imported from ${selectedClient.source}${selectedClient.website ? ` - Website: ${selectedClient.website}` : ''}${selectedClient.location ? ` - Location: ${selectedClient.location}` : ''}`,
        external_source: selectedClient.source,
        external_id: selectedClient.id
      };

      console.log('Submitting client data:', clientData);
      onSubmit(clientData);
    } catch (error: any) {
      console.error('Import error:', error);
      setError(`Failed to import client: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-white">Import Client from External Source</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {error && (
          <Alert className="border-red-600 bg-red-900/20">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-200">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Source Selection */}
        <div>
          <Label htmlFor="source">Select Source *</Label>
          <Select value={selectedSource} onValueChange={handleSourceChange}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Choose external source" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="clearbit" className="text-white hover:bg-gray-700">
                Clearbit
              </SelectItem>
              <SelectItem value="hubspot" className="text-white hover:bg-gray-700">
                HubSpot
              </SelectItem>
              <SelectItem value="partner" className="text-white hover:bg-gray-700">
                Partner API
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        {selectedSource && (
          <div>
            <Label htmlFor="search">Search Clients (Optional)</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="search"
                placeholder="Enter company name, contact name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/10 border-white/20"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                onClick={handleSearch}
                disabled={!searchTerm.trim() || isSearching}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Search className="w-4 h-4 mr-2" />
                {isSearching ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </div>
        )}

        {/* Available Clients */}
        {selectedSource && availableClients.length > 0 && (
          <div>
            <Label>Available Clients ({availableClients.length} found)</Label>
            <div className="grid gap-3 mt-2 max-h-64 overflow-y-auto">
              {availableClients.map((client) => (
                <Card 
                  key={client.id}
                  className={`cursor-pointer transition-all hover:bg-gray-700/50 ${
                    selectedClient?.id === client.id 
                      ? 'bg-blue-600/20 border-blue-400' 
                      : 'bg-gray-800/50 border-gray-600'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">{client.company}</h3>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                        <Badge variant="outline" className="text-xs border-blue-400 text-blue-400">
                          {client.source}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      Contact: {client.name}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {client.email}
                        </span>
                        {client.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {client.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    {client.industry && (
                      <div className="mb-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {client.industry} • {client.location}
                        </span>
                      </div>
                    )}
                    <Button
                      onClick={() => handleClientSelect(client)}
                      variant={selectedClient?.id === client.id ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                    >
                      {selectedClient?.id === client.id ? 'Selected' : 'Select to Import'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Selected Client Preview */}
        {selectedClient && (
          <div>
            <Label>Selected Client Preview</Label>
            <Card className="bg-green-900/20 border-green-600 mt-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <CardTitle className="text-white">{selectedClient.company}</CardTitle>
                </div>
                <CardDescription className="text-gray-300">
                  This client will be imported with the following details:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Contact Name:</span>
                    <p className="text-white">{selectedClient.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <p className="text-white">{selectedClient.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Phone:</span>
                    <p className="text-white">{selectedClient.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Industry:</span>
                    <p className="text-white">{selectedClient.industry || 'Not specified'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Source:</span>
                    <p className="text-white">{selectedClient.source}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">External ID:</span>
                    <p className="text-white">{selectedClient.id}</p>
                  </div>
                  {selectedClient.website && (
                    <div className="col-span-2">
                      <span className="text-gray-400">Website:</span>
                      <p className="text-white">{selectedClient.website}</p>
                    </div>
                  )}
                  {selectedClient.location && (
                    <div className="col-span-2">
                      <span className="text-gray-400">Location:</span>
                      <p className="text-white">{selectedClient.location}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedSource && availableClients.length === 0 && !isSearching && (
          <div className="text-center py-8 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No clients found{searchTerm ? ` matching "${searchTerm}"` : ' in this source'}</p>
            <p className="text-sm">Try adjusting your search terms or check another source</p>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleImport}
          disabled={!selectedClient}
          className="bg-green-600 hover:bg-green-700"
        >
          Import Client
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ImportClientForm;
