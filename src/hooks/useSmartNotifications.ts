
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SmartNotification } from '@/components/notifications/NotificationCenter';

interface NotificationRule {
  id: string;
  name: string;
  category: SmartNotification['category'];
  condition: string;
  priority: SmartNotification['priority'];
  enabled: boolean;
}

export const useSmartNotifications = () => {
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const { toast } = useToast();

  // Initialize notification rules
  useEffect(() => {
    const defaultRules: NotificationRule[] = [
      {
        id: 'budget-alert',
        name: 'Project Budget Alert',
        category: 'project',
        condition: 'budget_used > 80',
        priority: 'high',
        enabled: true
      },
      {
        id: 'resource-overallocation',
        name: 'Resource Overallocation',
        category: 'resource',
        condition: 'allocation > 100',
        priority: 'medium',
        enabled: true
      },
      {
        id: 'invoice-overdue',
        name: 'Invoice Overdue',
        category: 'financial',
        condition: 'days_overdue > 0',
        priority: 'high',
        enabled: true
      },
      {
        id: 'deadline-approaching',
        name: 'Project Deadline Approaching',
        category: 'project',
        condition: 'days_until_deadline <= 3',
        priority: 'medium',
        enabled: true
      },
      {
        id: 'timesheet-missing',
        name: 'Missing Timesheets',
        category: 'resource',
        condition: 'timesheet_submitted = false AND days_since_period_end > 2',
        priority: 'medium',
        enabled: true
      }
    ];

    setRules(defaultRules);
  }, []);

  const createNotification = useCallback((
    type: SmartNotification['type'],
    category: SmartNotification['category'],
    title: string,
    message: string,
    priority: SmartNotification['priority'] = 'medium',
    actionable: boolean = false,
    relatedId?: string,
    metadata?: Record<string, any>
  ) => {
    const notification: SmartNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      category,
      title,
      message,
      priority,
      timestamp: new Date(),
      read: false,
      actionable,
      relatedId,
      metadata
    };

    setNotifications(prev => [notification, ...prev]);

    // Show toast for high priority notifications
    if (priority === 'high') {
      toast({
        title: title,
        description: message,
        variant: type === 'alert' ? 'destructive' : 'default',
      });
    }

    return notification.id;
  }, [toast]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  }, []);

  // Smart notification triggers based on business rules
  const checkProjectBudgetAlert = useCallback((projectId: string, budgetUsed: number, totalBudget: number) => {
    const percentage = (budgetUsed / totalBudget) * 100;
    
    if (percentage > 80) {
      createNotification(
        'alert',
        'project',
        'Project Budget Alert',
        `Project has exceeded ${percentage.toFixed(1)}% of allocated budget`,
        percentage > 90 ? 'high' : 'medium',
        true,
        projectId,
        { budgetUsed, totalBudget, percentage }
      );
    }
  }, [createNotification]);

  const checkResourceOverallocation = useCallback((resourceId: string, resourceName: string, allocation: number) => {
    if (allocation > 100) {
      createNotification(
        'warning',
        'resource',
        'Resource Overallocation',
        `${resourceName} is allocated ${allocation}% capacity`,
        allocation > 120 ? 'high' : 'medium',
        true,
        resourceId,
        { resourceName, allocation }
      );
    }
  }, [createNotification]);

  const checkInvoiceOverdue = useCallback ((invoiceId: string, clientName: string, amount: number, daysOverdue: number) => {
    if (daysOverdue > 0) {
      createNotification(
        'alert',
        'financial',
        'Invoice Overdue',
        `Invoice for ${clientName} ($${amount.toLocaleString()}) is ${daysOverdue} days overdue`,
        daysOverdue > 30 ? 'high' : 'medium',
        true,
        invoiceId,
        { clientName, amount, daysOverdue }
      );
    }
  }, [createNotification]);

  const checkDeadlineApproaching = useCallback((projectId: string, projectName: string, daysUntilDeadline: number) => {
    if (daysUntilDeadline <= 3 && daysUntilDeadline > 0) {
      createNotification(
        'warning',
        'project',
        'Deadline Approaching',
        `${projectName} deadline is in ${daysUntilDeadline} day${daysUntilDeadline === 1 ? '' : 's'}`,
        daysUntilDeadline === 1 ? 'high' : 'medium',
        true,
        projectId,
        { projectName, daysUntilDeadline }
      );
    }
  }, [createNotification]);

  const getNotificationStats = useCallback(() => {
    const total = notifications.length;
    const unread = notifications.filter(n => !n.read).length;
    const highPriority = notifications.filter(n => n.priority === 'high' && !n.read).length;
    const byCategory = notifications.reduce((acc, notif) => {
      acc[notif.category] = (acc[notif.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return { total, unread, highPriority, byCategory };
  }, [notifications]);

  return {
    notifications,
    rules,
    createNotification,
    markAsRead,
    dismissNotification,
    clearAllNotifications,
    markAllAsRead,
    checkProjectBudgetAlert,
    checkResourceOverallocation,
    checkInvoiceOverdue,
    checkDeadlineApproaching,
    getNotificationStats
  };
};
