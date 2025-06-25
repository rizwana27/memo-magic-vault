
import React, { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download, Upload } from 'lucide-react';
import NewProjectForm from './NewProjectForm';
import ImportProjectForm from './ImportProjectForm';
import ExcelUploadForm from './ExcelUploadForm';
import { generateProjectTemplate } from '@/utils/excelParser';

interface ProjectCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

type CreationMode = 'selection' | 'manual' | 'import' | 'excel';

const ProjectCreationModal = ({ open, onOpenChange, onSubmit }: ProjectCreationModalProps) => {
  const [mode, setMode] = useState<CreationMode>('selection');

  const handleClose = () => {
    setMode('selection');
    onOpenChange(false);
  };

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
      // Reset mode and close modal after successful submission
      setMode('selection');
      onOpenChange(false);
    } catch (error) {
      // Error handling is done in the parent component
      console.error('Project creation failed:', error);
    }
  };

  const handleBulkSubmit = async (data: any[]) => {
    try {
      // Process each project individually
      for (const projectData of data) {
        // Transform Excel data to match the expected format
        const formattedData = {
          project_name: projectData.project_name,
          description: projectData.description || '',
          client_name: projectData.client_name || '',
          status: projectData.status?.toLowerCase() || 'planning',
          start_date: projectData.start_date || '',
          end_date: projectData.end_date || '',
          budget: projectData.budget ? parseFloat(projectData.budget) : null,
          project_manager: projectData.project_manager || '',
          region: projectData.region || ''
        };
        
        await onSubmit(formattedData);
      }
      
      setMode('selection');
      onOpenChange(false);
    } catch (error) {
      console.error('Bulk project creation failed:', error);
    }
  };

  const handleCancel = () => {
    setMode('selection');
  };

  const handleDownloadTemplate = () => {
    generateProjectTemplate();
  };

  if (mode === 'manual') {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <NewProjectForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Dialog>
    );
  }

  if (mode === 'import') {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <ImportProjectForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </Dialog>
    );
  }

  if (mode === 'excel') {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <ExcelUploadForm
          type="project"
          onSubmit={handleBulkSubmit}
          onCancel={handleCancel}
          onBack={handleCancel}
          onDownloadTemplate={handleDownloadTemplate}
        />
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 w-full max-w-4xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Create New Project</h2>
            <p className="text-gray-300">Choose how you'd like to create your project</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card 
              className="bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 transition-all duration-300 cursor-pointer group"
              onClick={() => setMode('manual')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
                  <Plus className="h-8 w-8 text-blue-400" />
                </div>
                <CardTitle className="text-white">Manual Entry</CardTitle>
                <CardDescription className="text-gray-300">
                  Create a project from scratch with custom details
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• Enter project details manually</li>
                  <li>• Full customization control</li>
                  <li>• Set up timeline and budget</li>
                  <li>• Assign team members</li>
                </ul>
                <Button 
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMode('manual');
                  }}
                >
                  Start Manual Entry
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 transition-all duration-300 cursor-pointer group"
              onClick={() => setMode('excel')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-green-600/30 transition-colors">
                  <Upload className="h-8 w-8 text-green-400" />
                </div>
                <CardTitle className="text-white">Excel Upload</CardTitle>
                <CardDescription className="text-gray-300">
                  Upload multiple projects from an Excel file
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• Bulk import from Excel (.xlsx)</li>
                  <li>• Download template for format</li>
                  <li>• Validate data before import</li>
                  <li>• Create multiple projects at once</li>
                </ul>
                <Button 
                  className="w-full mt-4 bg-green-600 hover:bg-green-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMode('excel');
                  }}
                >
                  Upload Excel File
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="bg-gray-800/50 border-gray-600 hover:bg-gray-700/50 transition-all duration-300 cursor-pointer group"
              onClick={() => setMode('import')}
            >
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-purple-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600/30 transition-colors">
                  <Download className="h-8 w-8 text-purple-400" />
                </div>
                <CardTitle className="text-white">Import from External</CardTitle>
                <CardDescription className="text-gray-300">
                  Import existing projects from external platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-400 space-y-2">
                  <li>• Import from Microsoft Project</li>
                  <li>• Connect to Jira projects</li>
                  <li>• Sync from GitHub repositories</li>
                  <li>• Auto-fill project details</li>
                </ul>
                <Button 
                  className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMode('import');
                  }}
                >
                  Import Project
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end mt-6">
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ProjectCreationModal;
