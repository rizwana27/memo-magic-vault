
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Mail } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationButtonProps {
  type: 'task_assignment' | 'timesheet_approval' | 'invoice_sent' | 'project_update';
  recipientEmail: string;
  recipientName?: string;
  data: any;
  children?: React.ReactNode;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({ 
  type, 
  recipientEmail, 
  recipientName, 
  data,
  children 
}) => {
  const { sendNotification } = useNotifications();
  const [isSending, setIsSending] = useState(false);

  const handleSendNotification = async () => {
    setIsSending(true);
    
    try {
      await sendNotification({
        type,
        recipient_email: recipientEmail,
        recipient_name: recipientName,
        data
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Button 
      onClick={handleSendNotification}
      disabled={isSending}
      variant="outline"
      className="border-gray-600 text-gray-300 hover:bg-gray-700"
    >
      <Mail className="w-4 h-4 mr-2" />
      {isSending ? 'Sending...' : (children || 'Send Notification')}
    </Button>
  );
};

export default NotificationButton;
