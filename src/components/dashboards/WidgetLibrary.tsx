
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WidgetDefinition {
  id: string;
  name: string;
  component_name: string;
  description?: string;
  category: string;
  required_permissions?: string[];
}

interface WidgetLibraryProps {
  availableWidgets: WidgetDefinition[];
  dashboardId: string;
  persona: string;
  onClose: () => void;
}

const WidgetLibrary: React.FC<WidgetLibraryProps> = ({ 
  availableWidgets, 
  dashboardId, 
  persona, 
  onClose 
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const addWidgetMutation = useMutation({
    mutationFn: async (widget: WidgetDefinition) => {
      // Get current dashboard layout
      const { data: dashboard } = await supabase
        .from('user_dashboards')
        .select('layout')
        .eq('id', dashboardId)
        .single();

      if (!dashboard) throw new Error('Dashboard not found');

      // Parse current layout
      const currentLayout = Array.isArray(dashboard.layout) ? dashboard.layout : [];

      // Add new widget to layout
      const newWidget = {
        id: `${widget.component_name}-${Date.now()}`,
        component: widget.component_name,
        x: 0,
        y: 0,
        w: 6,
        h: 4,
      };

      const updatedLayout = [...currentLayout, newWidget];

      // Update dashboard
      const { error } = await supabase
        .from('user_dashboards')
        .update({ layout: updatedLayout as any }) // Cast to any for Json compatibility
        .eq('id', dashboardId);

      if (error) throw error;

      return newWidget;
    },
    onSuccess: (newWidget) => {
      queryClient.invalidateQueries({ queryKey: ['user-dashboard'] });
      toast({
        title: "Widget Added",
        description: `${newWidget.component} has been added to your dashboard.`,
      });
      onClose();
    },
    onError: (error) => {
      console.error('Error adding widget:', error);
      toast({
        title: "Error",
        description: "Failed to add widget to dashboard.",
        variant: "destructive",
      });
    },
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'portfolio': return 'bg-purple-500/20 text-purple-300 border-purple-500/50';
      case 'strategic': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
      case 'operational': return 'bg-green-500/20 text-green-300 border-green-500/50';
      case 'individual': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/50';
    }
  };

  const groupedWidgets = availableWidgets.reduce((acc, widget) => {
    const category = widget.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(widget);
    return acc;
  }, {} as Record<string, WidgetDefinition[]>);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Widget Library</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="max-h-[600px] overflow-y-auto space-y-6">
          {Object.entries(groupedWidgets).map(([category, widgets]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-lg font-semibold text-white capitalize flex items-center gap-2">
                {category}
                <Badge className={getCategoryColor(category)}>
                  {widgets.length} widgets
                </Badge>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {widgets.map((widget) => (
                  <Card key={widget.id} className="bg-gray-800/50 border-gray-700">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white text-sm">{widget.name}</CardTitle>
                          <CardDescription className="text-gray-400 text-xs">
                            {widget.description}
                          </CardDescription>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => addWidgetMutation.mutate(widget)}
                          disabled={addWidgetMutation.isPending}
                          className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/50"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WidgetLibrary;
