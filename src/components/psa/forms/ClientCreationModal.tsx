
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Upload } from 'lucide-react';
import NewClientForm from './NewClientForm';
import ImportClientForm from './ImportClientForm';

interface ClientCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

const ClientCreationModal = ({ open, onOpenChange, onSubmit }: ClientCreationModalProps) => {
  const [mode, setMode] = useState<'selection' | 'manual' | 'import'>('selection');

  const handleModeSelection = (selectedMode: 'manual' | 'import') => {
    console.log('Client creation mode selected:', selectedMode);
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
    console.log('Client creation modal submitting:', data);
    onSubmit(data);
    setMode('selection');
  };

  if (mode === 'manual') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <NewClientForm
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
        <ImportClientForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">Add New Client</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-gray-300">Choose how you'd like to add a new client:</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      Create a new client by entering details manually
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
              onClick={() => handleModeSelection('import')}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Upload className="w-8 h-8 text-green-400" />
                  <div>
                    <CardTitle className="text-white">Import from Source</CardTitle>
                    <CardDescription className="text-gray-400">
                      Import client data from Clearbit, HubSpot, or Partner API
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Import Client
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientCreationModal;
