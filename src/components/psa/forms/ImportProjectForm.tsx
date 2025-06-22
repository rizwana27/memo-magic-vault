
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Search, ExternalLink, Calendar, User, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ImportProjectFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

interface ExternalProject {
  id: string;
  title: string;
  description: string;
  client: string;
  status: string;
  owner: string;
  startDate?: string;
  endDate?: string;
  source: string;
}

// Mock data for external projects - replace with actual API calls
const mockExternalProjects: Record<string, ExternalProject[]> = {
  microsoft: [
    {
      id: 'ms-001',
      title: 'Azure Cloud Migration',
      description: 'Migrate on-premise infrastructure to Azure cloud platform',
      client: 'TechCorp Inc',
      status: 'In Progress',
      owner: 'Sarah Johnson',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      source: 'Microsoft Project'
    },
    {
      id: 'ms-002',
      title: 'Office 365 Deployment',
      description: 'Enterprise-wide Office 365 rollout and training',
      client: 'Global Enterprises',
      status: 'Planning',
      owner: 'Mike Chen',
      startDate: '2024-02-01',
      endDate: '2024-05-15',
      source: 'Microsoft Project'
    }
  ],
  jira: [
    {
      id: 'jira-001',
      title: 'E-commerce Platform Redesign',
      description: 'Complete redesign of customer-facing e-commerce platform',
      client: 'RetailMax',
      status: 'Active',
      owner: 'Alex Rodriguez',
      startDate: '2024-01-10',
      endDate: '2024-08-30',
      source: 'Jira'
    },
    {
      id: 'jira-002',
      title: 'Mobile App Development',
      description: 'Native iOS and Android mobile application development',
      client: 'StartupTech',
      status: 'In Development',
      owner: 'Emma Wilson',
      startDate: '2024-03-01',
      endDate: '2024-12-15',
      source: 'Jira'
    }
  ],
  github: [
    {
      id: 'gh-001',
      title: 'API Gateway Modernization',
      description: 'Modernize legacy API gateway infrastructure',
      client: 'FinanceFlow',
      status: 'Active',
      owner: 'David Park',
      startDate: '2024-02-15',
      endDate: '2024-07-30',
      source: 'GitHub'
    },
    {
      id: 'gh-002',
      title: 'DevOps Pipeline Setup',
      description: 'Implement CI/CD pipeline for microservices architecture',
      client: 'CloudFirst',
      status: 'Planning',
      owner: 'Lisa Zhang',
      startDate: '2024-04-01',
      endDate: '2024-09-30',
      source: 'GitHub'
    }
  ]
};

const ImportProjectForm = ({ onSubmit, onCancel }: ImportProjectFormProps) => {
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ExternalProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<ExternalProject | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSourceChange = (source: string) => {
    setSelectedSource(source);
    setSearchTerm('');
    setSearchResults([]);
    setSelectedProject(null);
  };

  const handleSearch = async () => {
    if (!selectedSource || !searchTerm.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const sourceProjects = mockExternalProjects[selectedSource] || [];
      const filteredResults = sourceProjects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setSearchResults(filteredResults);
      setIsSearching(false);
    }, 1000);
  };

  const handleProjectSelect = (project: ExternalProject) => {
    setSelectedProject(project);
  };

  const handleImport = () => {
    if (!selectedProject) return;

    // Convert external project to our project format
    const projectData = {
      project_name: selectedProject.title,
      description: selectedProject.description,
      client_id: `external-${selectedProject.client.toLowerCase().replace(/\s+/g, '-')}`,
      status: selectedProject.status.toLowerCase().replace(/\s+/g, '_'),
      start_date: selectedProject.startDate || null,
      end_date: selectedProject.endDate || null,
      project_manager: selectedProject.owner,
      delivery_status: 'incomplete',
      tags: [`imported-from-${selectedSource}`, 'external-project'],
      external_source: selectedProject.source,
      external_id: selectedProject.id
    };

    console.log('Importing project:', projectData);
    onSubmit(projectData);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'in progress':
      case 'in development':
        return 'bg-green-500';
      case 'planning':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <DialogContent className="bg-white/10 backdrop-blur-md border-white/20 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-white">Import Project from External Source</DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Source Selection */}
        <div>
          <Label htmlFor="source">Select Source *</Label>
          <Select value={selectedSource} onValueChange={handleSourceChange}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue placeholder="Choose external source" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="microsoft" className="text-white hover:bg-gray-700">
                Microsoft Project
              </SelectItem>
              <SelectItem value="jira" className="text-white hover:bg-gray-700">
                Jira
              </SelectItem>
              <SelectItem value="github" className="text-white hover:bg-gray-700">
                GitHub
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Search */}
        {selectedSource && (
          <div>
            <Label htmlFor="search">Search Projects</Label>
            <div className="flex gap-2 mt-1">
              <Input
                id="search"
                placeholder="Enter project name, description, or client..."
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

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div>
            <Label>Search Results ({searchResults.length} found)</Label>
            <div className="grid gap-3 mt-2 max-h-64 overflow-y-auto">
              {searchResults.map((project) => (
                <Card 
                  key={project.id}
                  className={`cursor-pointer transition-all hover:bg-gray-700/50 ${
                    selectedProject?.id === project.id 
                      ? 'bg-blue-600/20 border-blue-400' 
                      : 'bg-gray-800/50 border-gray-600'
                  }`}
                  onClick={() => handleProjectSelect(project)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-white">{project.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={`${getStatusColor(project.status)} text-white`}>
                          {project.status}
                        </Badge>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {project.client}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {project.owner}
                        </span>
                      </div>
                      <span className="text-blue-300">{project.source}</span>
                    </div>
                    {project.startDate && (
                      <div className="mt-2 text-xs text-gray-400">
                        Timeline: {new Date(project.startDate).toLocaleDateString()} - {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Ongoing'}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Selected Project Preview */}
        {selectedProject && (
          <div>
            <Label>Selected Project Preview</Label>
            <Card className="bg-green-900/20 border-green-600 mt-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <CardTitle className="text-white">{selectedProject.title}</CardTitle>
                </div>
                <CardDescription className="text-gray-300">
                  This project will be imported with the following details:
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Client:</span>
                    <p className="text-white">{selectedProject.client}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Owner:</span>
                    <p className="text-white">{selectedProject.owner}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Status:</span>
                    <p className="text-white">{selectedProject.status}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Source:</span>
                    <p className="text-white">{selectedProject.source}</p>
                  </div>
                  {selectedProject.startDate && (
                    <div className="col-span-2">
                      <span className="text-gray-400">Timeline:</span>
                      <p className="text-white">
                        {new Date(selectedProject.startDate).toLocaleDateString()} - {selectedProject.endDate ? new Date(selectedProject.endDate).toLocaleDateString() : 'Ongoing'}
                      </p>
                    </div>
                  )}
                  <div className="col-span-2">
                    <span className="text-gray-400">Description:</span>
                    <p className="text-white">{selectedProject.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {searchResults.length === 0 && searchTerm && !isSearching && selectedSource && (
          <div className="text-center py-8 text-gray-400">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No projects found matching "{searchTerm}"</p>
            <p className="text-sm">Try adjusting your search terms</p>
          </div>
        )}
      </div>

      <DialogFooter>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleImport}
          disabled={!selectedProject}
          className="bg-green-600 hover:bg-green-700"
        >
          Import Project
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default ImportProjectForm;
