
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useExport } from '@/hooks/useExport';

interface ExportButtonProps {
  reportType: 'timesheets' | 'projects' | 'invoices' | 'resources';
  filters?: any;
  disabled?: boolean;
}

const ExportButton: React.FC<ExportButtonProps> = ({ reportType, filters, disabled = false }) => {
  const { exportReport } = useExport();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'csv' | 'pdf') => {
    setIsExporting(true);
    
    try {
      await exportReport({
        format,
        report_type: reportType,
        filters
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          disabled={disabled || isExporting}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? 'Exporting...' : 'Export'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-800 border-gray-700">
        <DropdownMenuItem 
          onClick={() => handleExport('csv')}
          className="text-gray-300 hover:bg-gray-700"
        >
          <FileSpreadsheet className="w-4 h-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-700" />
        <DropdownMenuItem 
          onClick={() => handleExport('pdf')}
          className="text-gray-300 hover:bg-gray-700"
        >
          <FileText className="w-4 h-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
