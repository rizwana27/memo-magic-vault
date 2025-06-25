
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Upload, Download } from 'lucide-react';
import NewVendorForm from './NewVendorForm';
import ImportVendorForm from './ImportVendorForm';
import ExcelUploadForm from './ExcelUploadForm';
import { generateVendorTemplate } from '@/utils/excelParser';

interface VendorCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

const VendorCreationModal = ({ open, onOpenChange, onSubmit }: VendorCreationModalProps) => {
  const [mode, setMode] = useState<'selection' | 'manual' | 'import' | 'excel'>('selection');

  const handleModeSelection = (selectedMode: 'manual' | 'import' | 'excel') => {
    console.log('Vendor creation mode selected:', selectedMode);
    setMode(selectedMode);
  };

  const handleBack = () => {
    setMode('selection');
  };

  const handleCancel = () => {
    setMode('selection');
    onOpenChange(false);
  };

  const handleSubmit = (data: any) => {
    console.log('Vendor creation modal submitting:', data);
    onSubmit(data);
    setMode('selection');
  };

  const handleBulkSubmit = async (data: any[]) => {
    try {
      // Process each vendor individually
      for (const vendorData of data) {
        // Transform Excel data to match the expected format
        const formattedData = {
          vendor_name: vendorData.vendor_name,
          contact_person: vendorData.contact_person,
          contact_email: vendorData.contact_email,
          phone_number: vendorData.phone_number || '',
          services_offered: vendorData.services_offered,
          status: vendorData.status?.toLowerCase() || 'active',
          contract_start_date: vendorData.contract_start_date || '',
          contract_end_date: vendorData.contract_end_date || '',
          notes: vendorData.notes || ''
        };
        
        await onSubmit(formattedData);
      }
      
      setMode('selection');
      onOpenChange(false);
    } catch (error) {
      console.error('Bulk vendor creation failed:', error);
    }
  };

  const handleDownloadTemplate = () => {
    generateVendorTemplate();
  };

  if (mode === 'manual') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <NewVendorForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onBack={handleBack}
        />
      </Dialog>
    );
  }

  if (mode === 'import') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <ImportVendorForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Dialog>
    );
  }

  if (mode === 'excel') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <ExcelUploadForm
          type="vendor"
          onSubmit={handleBulkSubmit}
          onCancel={handleCancel}
          onBack={handleBack}
          onDownloadTemplate={handleDownloadTemplate}
        />
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Vendor</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-300">Choose how you'd like to add a new vendor:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card 
              className="bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 cursor-pointer transition-colors"
              onClick={() => handleModeSelection('manual')}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Plus className="w-8 h-8 text-blue-400" />
                  <div>
                    <CardTitle className="text-white">Manual Entry</CardTitle>
                    <CardDescription className="text-gray-400">
                      Create a new vendor by entering details manually
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Create Manually
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 cursor-pointer transition-colors"
              onClick={() => handleModeSelection('excel')}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Upload className="w-8 h-8 text-green-400" />
                  <div>
                    <CardTitle className="text-white">Excel Upload</CardTitle>
                    <CardDescription className="text-gray-400">
                      Upload multiple vendors from an Excel file
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Upload Excel
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 cursor-pointer transition-colors"
              onClick={() => handleModeSelection('import')}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Download className="w-8 h-8 text-purple-400" />
                  <div>
                    <CardTitle className="text-white">Import from Source</CardTitle>
                    <CardDescription className="text-gray-400">
                      Import vendor data from Clearbit, HubSpot, or Partner API
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Import Vendor
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VendorCreationModal;
