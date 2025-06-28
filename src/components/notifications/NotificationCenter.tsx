
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  X, 
  Filter,
  Settings,
  Clock,
  DollarSign,
  Users,
  FileText,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export interface SmartNotification {
  id: string;
  type: 'alert' | 'warning' | 'info' | 'success';
  category: 'project' | 'resource' | 'financial' | 'system' | 'client';
  title: string;
  message: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: Date;
  read: boolean;
  actionable: boolean;
  relatedId?: string;
  metadata?: Record<string, any>;
}

const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all');
  const { toast } = useToast();

  // Mock smart notifications - replace with real data
  useEffect(() => {
    const mockNotifications: SmartNotification[] = [
      {
        id: '1',
        type: 'alert',
        category: 'project',
        title: 'Project Budget Alert',
        message: 'Project Alpha-2024 has exceeded 85% of allocated budget',
        priority: 'high',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        read: false,
        actionable: true,
        relatedId: 'P001',
        metadata: { budgetUsed: 85, projectName: 'Alpha-2024' }
      },
      {
        id: '2',
        type: 'warning',
        category: 'resource',
        title: 'Resource Overallocation',
        message: 'John Smith is allocated 120% capacity this week',
        priority: 'medium',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        read: false,
        actionable: true,
        relatedId: 'R001',
        metadata: { resourceName: 'John Smith', allocation: 120 }
      },
      {
        id: '3',
        type: 'info',
        category: 'client',
        title: 'Client Check-in Due',
        message: 'Monthly check-in with TechCorp is scheduled for tomorrow',
        priority: 'medium',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
        read: true,
        actionable: true,
        relatedId: 'C001',
        metadata: { clientName: 'TechCorp', meetingDate: 'tomorrow' }
      },
      {
        id: '4',
        type: 'alert',
        category: 'financial',
        title: 'Invoice Overdue',
        message: '3 invoices totaling $45,000 are now overdue',
        priority: 'high',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        read: false,
        actionable: true,
        metadata: { overdueCount: 3, totalAmount: 45000 }
      },
      {
        id: '5',
        type: 'success',
        category: 'project',
        title: 'Milestone Completed',
        message: 'Beta-2024 Phase 1 milestone completed ahead of schedule',
        priority: 'low',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        read: true,
        actionable: false,
        relatedId: 'P002',
        metadata: { projectName: 'Beta-2024', milestone: 'Phase 1' }
      }
    ];

    setNotifications(mockNotifications);
  }, []);

  const getNotificationIcon = (type: SmartNotification['type'], category: SmartNotification['category']) => {
    if (type === 'alert') return <AlertTriangle className="h-4 w-4 text-red-500" />;
    if (type === 'warning') return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    if (type === 'success') return <CheckCircle className="h-4 w-4 text-green-500" />;
    
    switch (category) {
      case 'project': return <FileText className="h-4 w-4 text-blue-500" />;
      case 'resource': return <Users className="h-4 w-4 text-purple-500" />;
      case 'financial': return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'system': return <Settings className="h-4 w-4 text-gray-500" />;
      default: return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getPriorityColor = (priority: SmartNotification['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    toast({
      title: "Notification dismissed",
      description: "The notification has been removed",
    });
  };

  const handleActionClick = (notification: SmartNotification) => {
    markAsRead(notification.id);
    toast({
      title: "Action triggered",
      description: `Taking action for: ${notification.title}`,
    });
    // Here you would typically navigate to the relevant page or trigger an action
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'high') return notif.priority === 'high';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const highPriorityCount = notifications.filter(n => n.priority === 'high' && !n.read).length;

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 left-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg relative"
          size="icon"
        >
          <Bell className="h-6 w-6 text-white" />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Card className="w-96 h-[600px] bg-white border shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg">Smart Alerts</CardTitle>
            {highPriorityCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {highPriorityCount} urgent
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => {/* Open settings */}}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <div className="p-4 border-b">
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filter === 'high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('high')}
            >
              High Priority
            </Button>
          </div>
        </div>

        <CardContent className="p-0 flex-1">
          <ScrollArea className="h-[460px]">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-8 w-8 mx-auto mb-4 opacity-50" />
                <p>No notifications to display</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type, notification.category)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          <Badge 
                            className={`text-xs ${getPriorityColor(notification.priority)}`}
                            variant="outline"
                          >
                            {notification.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            {format(notification.timestamp, 'MMM d, h:mm a')}
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {notification.actionable && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs text-blue-600 hover:text-blue-800"
                                onClick={() => handleActionClick(notification)}
                              >
                                Take Action
                              </Button>
                            )}
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-xs"
                                onClick={() => markAsRead(notification.id)}
                              >
                                Mark Read
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                              onClick={() => dismissNotification(notification.id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
