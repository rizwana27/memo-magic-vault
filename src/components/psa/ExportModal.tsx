
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { FileText, FileSpreadsheet, Download, X } from 'lucide-react';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportTitle: string;
  onExport: (format: 'pdf' | 'excel') => Promise<void>;
}

const ExportModal = ({ open, onOpenChange, reportTitle, onExport }: ExportModalProps) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportingFormat, setExportingFormat] = useState<'pdf' | 'excel' | null>(null);

  const handleExport = async (format: 'pdf' | 'excel') => {
    setIsExporting(true);
    setExportingFormat(format);
    
    try {
      await onExport(format);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
      setExportingFormat(null);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    if (!isExporting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white mb-4">
            Export Report
          </DialogTitle>
        </DialogHeader>

        {isExporting ? (
          <div className="py-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-lg font-medium">Generating your report...</p>
            <p className="text-gray-300 text-sm mt-2">
              Preparing {exportingFormat?.toUpperCase()} format for "{reportTitle}"
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                Choose a file format to export the report:
              </p>
              <p className="text-white font-medium">"{reportTitle}"</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <Button
                onClick={() => handleExport('pdf')}
                className="h-20 flex flex-col items-center justify-center gap-2 bg-red-600/20 border-red-500/30 hover:bg-red-600/30 text-white"
                variant="outline"
              >
                <FileText className="w-8 h-8 text-red-400" />
                <span className="text-sm font-medium">PDF</span>
              </Button>

              <Button
                onClick={() => handleExport('excel')}
                className="h-20 flex flex-col items-center justify-center gap-2 bg-green-600/20 border-green-500/30 hover:bg-green-600/30 text-white"
                variant="outline"
              >
                <FileSpreadsheet className="w-8 h-8 text-green-400" />
                <span className="text-sm font-medium">Excel</span>
              </Button>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
