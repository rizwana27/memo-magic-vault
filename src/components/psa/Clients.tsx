
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter, Globe, Mail, Phone, Building, ExternalLink } from 'lucide-react';
import { useClientsApi, useCreateClientApi } from '@/hooks/useApiIntegration';
import ClientCreationModal from './forms/ClientCreationModal';
import ClientDetailModal from './modals/ClientDetailModal';
import { useToast } from '@/hooks/use-toast';

const Clients = () => {
  const { data: clients, isLoading, error, refetch } = useClientsApi();
  const createClient = useCreateClientApi();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewClientModal, setShowNewClientModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const { toast } = useToast();

  const getHealthColor = (healthScore?: number) => {
    if (!healthScore) return 'bg-gray-500';
    if (healthScore >= 8) return 'bg-green-500';
    if (healthScore >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const filteredClients = clients?.filter(client =>
    client?.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client?.primary_contact_email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleNewClient = async (data: any) => {
    console.log('Submitting new client:', data);
    try {
      await createClient.mutateAsync(data);
      
      // Refetch clients to get the updated list
      await refetch();
      
      // Close modal
      setShowNewClientModal(false);
      
      toast({
        title: "Client Created",
        description: `Client "${data.client_name}" has been created successfully.`,
      });
    } catch (error: any) {
      console.error('Error creating client:', error);
      
      // Provide detailed error information
      let errorMessage = 'Failed to create client. Please try again.';
      
      if (error.message?.includes('already imported')) {
        errorMessage = `Error: ${error.message}`;
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      toast({
        title: "Client Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleClientClick = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const handleAddClientClick = () => {
    console.log('Add Client button clicked - showing modal');
    setShowNewClientModal(true);
  };

  const handleCloseClientModal = () => {
    console.log('Closing client creation modal');
    setShowNewClientModal(false);
  };

  if (error) {
    console.error('Error loading clients:', error);
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Clients</h1>
            <p className="text-gray-400">Manage your client relationships</p>
          </div>
        </div>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-12 text-center">
            <h3 className="text-xl font-medium text-white mb-2">Error Loading Clients</h3>
            <p className="text-gray-400 mb-4">
              There was an error loading your clients. Please try refreshing the page.
            </p>
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
          <h1 className="text-3xl font-bold text-white">Clients</h1>
          <p className="text-gray-400">Manage your client relationships</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleAddClientClick}
          disabled={createClient.isPending}
        >
          <Plus className="w-4 h-4 mr-2" />
          {createClient.isPending ? 'Adding...' : 'New Client'}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800/50 border-gray-700 text-white"
          />
        </div>
        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Client Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Clients</p>
                <p className="text-2xl font-bold text-white">{clients?.length || 0}</p>
              </div>
              <Building className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Clients</p>
                <p className="text-2xl font-bold text-green-500">
                  {clients?.filter(c => c?.client_type === 'active').length || 0}
                </p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Prospects</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {clients?.filter(c => c?.client_type === 'prospect').length || 0}
                </p>
              </div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-gray-800/50 border-gray-700 animate-pulse">
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
          {filteredClients.map((client) => (
            <Card 
              key={client.client_id} 
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors cursor-pointer"
              onClick={() => handleClientClick(client.client_id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-white text-lg">{client.client_name}</CardTitle>
                    {client.external_source && (
                      <div className="flex items-center gap-1">
                        <ExternalLink className="w-4 h-4 text-blue-400" />
                        <Badge variant="outline" className="text-xs border-blue-400 text-blue-400">
                          {client.external_source}
                        </Badge>
                      </div>
                    )}
                  </div>
                  <Badge className={`${getHealthColor()} text-white`}>
                    {client.client_type || 'new'}
                  </Badge>
                </div>
                <CardDescription className="text-gray-400">
                  {client.company_name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {client.primary_contact_email && (
                    <div className="flex items-center text-gray-300 text-sm">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {client.primary_contact_email}
                    </div>
                  )}
                  
                  {client.phone_number && (
                    <div className="flex items-center text-gray-300 text-sm">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {client.phone_number}
                    </div>
                  )}
                  
                  {client.industry && (
                    <div className="flex items-center text-gray-300 text-sm">
                      <Building className="w-4 h-4 mr-2 text-gray-400" />
                      {client.industry}
                    </div>
                  )}
                  
                  {client.revenue_tier && (
                    <div className="text-gray-400 text-sm">
                      <p>Revenue Tier: {client.revenue_tier}</p>
                    </div>
                  )}
                  
                  {client.external_source && client.external_id && (
                    <div className="text-xs text-blue-400 flex items-center gap-1">
                      <ExternalLink className="w-3 h-3" />
                      Imported from {client.external_source} (ID: {client.external_id})
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredClients.length === 0 && !isLoading && (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-12 text-center">
            <Building className="w-16 h-16 mx-auto mb-4 text-gray-400 opacity-50" />
            <h3 className="text-xl font-medium text-white mb-2">No clients found</h3>
            <p className="text-gray-400 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first client'}
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAddClientClick}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Client Creation Modal - Only shown when showNewClientModal is true */}
      {showNewClientModal && (
        <ClientCreationModal
          open={showNewClientModal}
          onOpenChange={handleCloseClientModal}
          onSubmit={handleNewClient}
        />
      )}

      {/* Client Detail Modal */}
      <ClientDetailModal
        clientId={selectedClientId}
        onClose={() => setSelectedClientId(null)}
      />
    </div>
  );
};

export default Clients;
