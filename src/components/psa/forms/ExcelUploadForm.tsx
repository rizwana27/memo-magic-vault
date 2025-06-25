
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Upload, Download, CheckCircle, AlertTriangle } from 'lucide-react';

interface ExcelUploadFormProps {
  onSubmit: (data: any[]) => void;
  onCancel: () => void;
  onBack?: () => void;
  type: 'project' | 'client' | 'vendor';
  onDownloadTemplate: () => void;
}

const ExcelUploadForm = ({ onSubmit, onCancel, onBack, type, onDownloadTemplate }: ExcelUploadFormProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    data: any[];
    errors: string[];
    warnings: string[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResults(null);
    }
  };

  const handleParseFile = async () => {
    if (!file) return;
    
    setUploading(true);
    setProgress(0);
    
    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 100);
      
      const { parseExcelFile, validateProjectData, validateClientData, validateVendorData } = await import('@/utils/excelParser');
      
      const parseResult = await parseExcelFile(file);
      
      if (parseResult.errors.length > 0) {
        setResults(parseResult);
        clearInterval(progressInterval);
        setProgress(100);
        setUploading(false);
        return;
      }
      
      // Validate data based on type
      const allErrors: string[] = [];
      const validData: any[] = [];
      
      parseResult.data.forEach((row: any, index: number) => {
        let rowErrors: string[] = [];
        
        switch (type) {
          case 'project':
            rowErrors = validateProjectData(row, index);
            break;
          case 'client':
            rowErrors = validateClientData(row, index);
            break;
          case 'vendor':
            rowErrors = validateVendorData(row, index);
            break;
        }
        
        if (rowErrors.length === 0) {
          validData.push(row);
        } else {
          allErrors.push(...rowErrors);
        }
      });
      
      clearInterval(progressInterval);
      setProgress(100);
      
      setResults({
        data: validData,
        errors: allErrors,
        warnings: parseResult.warnings
      });
      
    } catch (error) {
      console.error('Error parsing file:', error);
      setResults({
        data: [],
        errors: [`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`],
        warnings: []
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    if (results?.data) {
      onSubmit(results.data);
    }
  };

  return (
    <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <div className="flex items-center gap-2">
          {onBack && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <DialogTitle className="text-white">
            Upload {type.charAt(0).toUpperCase() + type.slice(1)} Excel File
          </DialogTitle>
        </div>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Template Download */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-blue-200 font-medium">Download Template</h3>
              <p className="text-blue-300/70 text-sm">
                Get the Excel template with the correct column format
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onDownloadTemplate}
              className="border-blue-500 text-blue-200 hover:bg-blue-900/30"
            >
              <Download className="w-4 h-4 mr-2" />
              Template
            </Button>
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="excel-file" className="text-white">
              Select Excel File (.xlsx)
            </Label>
            <Input
              id="excel-file"
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="bg-white/10 border-white/20 text-white"
            />
          </div>

          {file && (
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-sm text-gray-300">
                  Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              </div>
              <Button
                onClick={handleParseFile}
                disabled={uploading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Parsing...' : 'Parse File'}
              </Button>
            </div>
          )}

          {uploading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-300 text-center">
                Parsing Excel file... {progress}%
              </p>
            </div>
          )}
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-4">
            {results.errors.length > 0 && (
              <Alert className="bg-red-900/20 border-red-500/30">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-200">
                  <div className="space-y-1">
                    <p className="font-medium">Validation Errors:</p>
                    {results.errors.slice(0, 5).map((error, i) => (
                      <p key={i} className="text-sm">• {error}</p>
                    ))}
                    {results.errors.length > 5 && (
                      <p className="text-sm">... and {results.errors.length - 5} more errors</p>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {results.data.length > 0 && (
              <Alert className="bg-green-900/20 border-green-500/30">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <AlertDescription className="text-green-200">
                  <p className="font-medium">
                    Ready to import {results.data.length} {type}(s)
                  </p>
                  <p className="text-sm mt-1">
                    All validation checks passed. Click "Import Data" to proceed.
                  </p>
                </AlertDescription>
              </Alert>
            )}

            {results.warnings.length > 0 && (
              <Alert className="bg-yellow-900/20 border-yellow-500/30">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-yellow-200">
                  <div className="space-y-1">
                    <p className="font-medium">Warnings:</p>
                    {results.warnings.map((warning, i) => (
                      <p key={i} className="text-sm">• {warning}</p>
                    ))}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        {results?.data.length > 0 && (
          <Button 
            type="button" 
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700"
          >
            Import {results.data.length} {type}(s)
          </Button>
        )}
      </DialogFooter>
    </DialogContent>
  );
};

export default ExcelUploadForm;
