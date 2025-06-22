
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

interface ImportVendorFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

interface ExternalVendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone?: string;
  services: string;
  website?: string;
  location?: string;
  source: string;
}

// Mock data for external vendors - replace with actual API calls
const mockExternalVendors: Record<string, ExternalVendor[]> = {
  clearbit: [
    {
      id: 'cb-v001',
      name: 'CloudTech Solutions',
      contactPerson: 'Jennifer Adams',
      email: 'jennifer.adams@cloudtech.com',
      phone: '+1-555-0123',
      services: 'Cloud Infrastructure, DevOps',
      website: 'cloudtech-solutions.com',
      location: 'San Francisco, CA',
      source: 'Clearbit'
    },
    {
      id: 'cb-v002',
      name: 'SecureData Corp',
      contactPerson: 'Robert Kim',
      email: 'robert.kim@securedata.com',
      phone: '+1-555-0456',
      services: 'Cybersecurity, Data Protection',
      website: 'securedata.com',
      location: 'Austin, TX',
      source: 'Clearbit'
    }
  ],
  hubspot: [
    {
      id: 'hs-v001',
      name: 'Marketing Pros LLC',
      contactPerson: 'Amanda Foster',
      email: 'amanda.foster@marketingpros.com',
      phone: '+1-555-0789',
      services: 'Digital Marketing, SEO',
      website: 'marketingpros.com',
      location: 'New York, NY',
      source: 'HubSpot'
    },
    {
      id: 'hs-v002',
      name: 'Design Studio Inc',
      contactPerson: 'Carlos Mendez',
      email: 'carlos.mendez@designstudio.com',
      phone: '+1-555-0321',
      services: 'UI/UX Design, Branding',
      website: 'designstudio.com',
      location: 'Los Angeles, CA',
      source: 'HubSpot'
    }
  ],
  partner: [
    {
      id: 'pa-v001',
      name: 'Legal Advisors Group',
      contactPerson: 'Patricia Wilson',
      email: 'patricia.wilson@legaladvisors.com',
      phone: '+1-555-0654',
      services: 'Legal Services, Compliance',
      website: 'legaladvisors.com',
      location: 'Chicago, IL',
      source: 'Partner API'
    },
    {
      id: 'pa-v002',
      name: 'Financial Consultants Ltd',
      contactPerson: 'Thomas Brown',
      email: 'thomas.brown@finconsult.com',
      phone: '+1-555-0987',
      services: 'Financial Planning, Accounting',
      website: 'finconsult.com',
      location: 'Boston, MA',
      source: 'Partner API'
    }
  ]
};

const ImportVendorForm = ({ onSubmit, onCancel }: ImportVendorFormProps) => {
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [availableVendors, setAvailableVendors] = useState<ExternalVendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<ExternalVendor | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSourceChange = (source: string) => {
    setSelectedSource(source);
    setSearchTerm('');
    setSelectedVendor(null);
    setError('');
    
    console.log('Loading vendors for source:', source);
    
    // Automatically load vendors for the selected source
    const sourceVendors = mockExternalVendors[source] || [];
    console.log('Found vendors:', sourceVendors.length);
    setAvailableVendors(sourceVendors);
  };

  const handleSearch = () => {
    if (!selectedSource || !searchTerm.trim()) return;
    
    setIsSearching(true);
    setError('');
    
    console.log('Searching for:', searchTerm, 'in source:', selectedSource);
    
    // Simulate API call delay
    setTimeout(() => {
      const sourceVendors = mockExternalVendors[selectedSource] || [];
      const filteredResults = sourceVendors.filter(vendor =>
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.services.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      console.log('Search results:', filteredResults.length);
      setAvailableVendors(filteredResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleVendorSelect = (vendor: ExternalVendor) => {
    console.log('Selected vendor:', vendor);
    setSelectedVendor(vendor);
    setError('');
  };

  const handleImport = () => {
    if (!selectedVendor) {
      setError('Please select a vendor to import');
      return;
    }

    try {
      console.log('Starting import process for vendor:', selectedVendor.name);
      
      // Convert external vendor to our vendor format
      const vendorData = {
        vendor_name: selectedVendor.name,
        contact_person: selectedVendor.contactPerson,
        contact_email: selectedVendor.email,
        phone_number: selectedVendor.phone || null,
        services_offered: selectedVendor.services,
        status: 'active',
        contract_start_date: null,
        contract_end_date: null,
        notes: `Imported from ${selectedVendor.source}${selectedVendor.website ? ` - Website: ${selectedVendor.website}` : ''}${selectedVendor.location ? ` - Location: ${selectedVendor.location}` : ''}`,
        attachments: null,
        external_source: selectedVendor.source,
        external_id: selectedVendor.id
      };

      console.log('Submitting vendor data:', vendorData);
      onSubmit(vendorData);
    } catch (error: any) {
      console.error('Import error:', error);
      setError(`Failed to import vendor: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-white">Import Vendor from External Source</DialogTitle>
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
            <Label htmlFor="search">Search Vendors (Optional)</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="search"
                placeholder="Enter vendor name, contact person, or services..."
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

        {/* Available Vendors */}
        {selectedSource && availableVendors.length > 0 && (
          <div>
            <Label>Available Vendors ({availableVendors.length} found)</Label>
            <div className="grid gap-3 mt-2 max-h-64 overflow-y-auto">
              {availableVendors.map((vendor) => (
                <Card 
                  key={vendor.id}
                  className={`cursor-pointer transition-all hover:bg-gray-700/50 ${
                    selectedVendor?.id === vendor.id 
                      ? 'bg-blue-600/20 border-blue-400' 
                      : 'bg-gray-800/50 border-gray-600'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">{vendor.name}</h3>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                        <Badge variant="outline" className="text-xs border-blue-400 text-blue-400">
                          {vendor.source}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">
                      Contact: {vendor.contactPerson}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {vendor.email}
                        </span>
                        {vendor.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {vendor.phone}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mb-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {vendor.services} • {vendor.location}
                      </span>
                    </div>
                    <Button
                      onClick={() => handleVendorSelect(vendor)}
                      variant={selectedVendor?.id === vendor.id ? "default" : "outline"}
                      size="sm"
                      className="w-full"
                    >
                      {selectedVendor?.id === vendor.id ? 'Selected' : 'Select to Import'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Selected Vendor Preview */}
        {selectedVendor && (
          <div>
            <Label>Selected Vendor Preview</Label>
            <Card className="bg-green-900/20 border-green-600 mt-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <CardTitle className="text-white">{selectedVendor.name}</CardTitle>
                </div>
                <CardDescription className="text-gray-300">
                  This vendor will be imported with the following details:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Contact Person:</span>
                    <p className="text-white">{selectedVendor.contactPerson}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Email:</span>
                    <p className="text-white">{selectedVendor.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Phone:</span>
                    <p className="text-white">{selectedVendor.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Services:</span>
                    <p className="text-white">{selectedVendor.services}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Source:</span>
                    <p className="text-white">{selectedVendor.source}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">External ID:</span>
                    <p className="text-white">{selectedVendor.id}</p>
                  </div>
                  {selectedVendor.website && (
                    <div className="col-span-2">
                      <span className="text-gray-400">Website:</span>
                      <p className="text-white">{selectedVendor.website}</p>
                    </div>
                  )}
                  {selectedVendor.location && (
                    <div className="col-span-2">
                      <span className="text-gray-400">Location:</span>
                      <p className="text-white">{selectedVendor.location}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {selectedSource && availableVendors.length === 0 && !isSearching && (
          <div className="text-center py-8 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No vendors found{searchTerm ? ` matching "${searchTerm}"` : ' in this source'}</p>
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
          disabled={!selectedVendor}
          className="bg-green-600 hover:bg-green-700"
        >
          Import Vendor
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ImportVendorForm;
