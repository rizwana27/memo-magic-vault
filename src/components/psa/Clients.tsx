
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { Plus, Search, Filter, Globe, Mail, Phone, Building } from 'lucide-react';
import { useClients } from '@/hooks/useClients';
import NewClientForm from './forms/NewClientForm';

const Clients = () => {
  const { clients, createClient, isLoading } = useClients();
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewClientModal, setShowNewClientModal] = useState(false);

  const getHealthColor = (healthScore?: number) => {
    if (!healthScore) return 'bg-gray-500';
    if (healthScore >= 8) return 'bg-green-500';
    if (healthScore >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getHealthStatus = (healthScore?: number) => {
    if (!healthScore) return 'unknown';
    if (healthScore >= 8) return 'healthy';
    if (healthScore >= 5) return 'at risk';
    return 'critical';
  };

  const filteredClients = clients?.filter(client =>
    client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleNewClient = async (data: any) => {
    console.log('Creating new client:', data);
    const result = await createClient(data);
    if (result.success) {
      setShowNewClientModal(false);
    }
  };

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
          onClick={() => setShowNewClientModal(true)}
          disabled={isLoading}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Client
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
                <p className="text-gray-400 text-sm">Healthy Clients</p>
                <p className="text-2xl font-bold text-green-500">
                  {clients?.filter(c => (c?.health_score || 0) >= 8).length || 0}
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
                <p className="text-gray-400 text-sm">At Risk</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {clients?.filter(c => (c?.health_score || 0) >= 5 && (c?.health_score || 0) < 8).length || 0}
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
            <Card key={client.id} className="bg-gray-800/50 border-gray-700 hover:bg-gray-800/70 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-white text-lg">{client.name}</CardTitle>
                  <Badge className={`${getHealthColor(client.health_score)} text-white`}>
                    {getHealthStatus(client.health_score)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {client.email && (
                    <div className="flex items-center text-gray-300 text-sm">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {client.email}
                    </div>
                  )}
                  
                  {client.phone && (
                    <div className="flex items-center text-gray-300 text-sm">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {client.phone}
                    </div>
                  )}
                  
                  {client.website && (
                    <div className="flex items-center text-gray-300 text-sm">
                      <Globe className="w-4 h-4 mr-2 text-gray-400" />
                      <a href={client.website} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                        {client.website}
                      </a>
                    </div>
                  )}
                  
                  {client.address && (
                    <div className="text-gray-400 text-sm">
                      <p className="line-clamp-2">{client.address}</p>
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
              onClick={() => setShowNewClientModal(true)}
              disabled={isLoading}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </CardContent>
        </Card>
      )}

      {/* New Client Modal */}
      <Dialog open={showNewClientModal} onOpenChange={setShowNewClientModal}>
        <NewClientForm
          onSubmit={handleNewClient}
          onCancel={() => setShowNewClientModal(false)}
          isLoading={isLoading}
        />
      </Dialog>
    </div>
  );
};

export default Clients;
