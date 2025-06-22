
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Send } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationButtonProps {
  type: 'task_assignment' | 'timesheet_approval' | 'invoice_sent' | 'project_update';
  data: any;
  defaultEmail?: string;
  defaultName?: string;
  buttonText?: string;
}

const NotificationButton: React.FC<NotificationButtonProps> = ({
  type,
  data,
  defaultEmail = '',
  defaultName = '',
  buttonText = 'Send Notification'
}) => {
  const { sendNotification } = useNotifications();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(defaultEmail);
  const [name, setName] = useState(defaultName);
  const [customMessage, setCustomMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!email) return;

    setIsSending(true);
    
    const notificationData = {
      ...data,
      custom_message: customMessage
    };

    try {
      await sendNotification({
        type,
        recipient_email: email,
        recipient_name: name,
        data: notificationData
      });
      
      setOpen(false);
      setEmail('');
      setName('');
      setCustomMessage('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Mail className="w-4 h-4 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle>Send Notification</DialogTitle>
          <DialogDescription className="text-gray-300">
            Send an email notification about this {type.replace('_', ' ')}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-300">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="recipient@example.com"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="name" className="text-gray-300">Recipient Name (Optional)</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          
          <div>
            <Label htmlFor="message" className="text-gray-300">Additional Message (Optional)</Label>
            <Textarea
              id="message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add any additional context..."
              className="bg-gray-700 border-gray-600 text-white"
              rows={3}
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSend}
            disabled={!email || isSending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSending ? 'Sending...' : 'Send Notification'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationButton;
