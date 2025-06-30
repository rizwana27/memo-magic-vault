
import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Send, X, Bot, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DashboardChatProps {
  persona: string;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // Changed from Date to string for JSON compatibility
}

const DashboardChat: React.FC<DashboardChatProps> = ({ persona, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hi! I'm your dashboard assistant. I can help you customize your ${persona} dashboard, suggest relevant widgets, and guide you through organizing your workspace. What would you like to know?`,
      timestamp: new Date().toISOString(),
    },
  ]);

  // Load existing conversation
  const { data: conversation } = useQuery({
    queryKey: ['dashboard-conversation', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('dashboard_conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching conversation:', error);
        return null;
      }
      
      return data;
    },
    enabled: !!user?.id,
  });

  // Save conversation
  const saveConversation = useMutation({
    mutationFn: async (conversationData: Message[]) => {
      if (!user?.id) throw new Error('No user ID');
      
      const { error } = await supabase
        .from('dashboard_conversations')
        .upsert({
          user_id: user.id,
          conversation_data: conversationData as any, // Cast to any for Json compatibility
          context: { persona },
        });
      
      if (error) throw error;
    },
  });

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setMessage('');

    // Simulate AI response (in real implementation, this would call an AI service)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateResponse(userMessage.content, persona),
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, aiResponse];
      setMessages(finalMessages);
      saveConversation.mutate(finalMessages);
    }, 1000);
  };

  const generateResponse = (userInput: string, persona: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('widget') || input.includes('add')) {
      switch (persona) {
        case 'pmo':
          return "For PMO dashboards, I recommend starting with the Project Portfolio Overview widget to see all your projects at a glance. You might also want to add Resource Allocation Matrix and Risk Dashboard widgets. Would you like me to help you add any of these?";
        case 'executive':
          return "As an executive, you'll want to focus on high-level metrics. Try adding the Business KPIs widget for key performance indicators, or the Revenue Forecast widget for financial projections. These give you the strategic overview you need.";
        case 'org_leader':
          return "For team leadership, I suggest the Team Performance widget to track your team's productivity, and the Department Budget widget to monitor spending. The Staff Utilization widget is also great for capacity planning.";
        case 'resource':
          return "For individual contributors, start with the Timesheets widget for easy time tracking, and the Tasks widget to manage your work. The Goals widget can help you track your personal objectives.";
        default:
          return "I can help you find the right widgets for your role. What specific information do you need to track on your dashboard?";
      }
    }
    
    if (input.includes('customize') || input.includes('layout')) {
      return "You can customize your dashboard by dragging widgets to reposition them, or use the 'Add Widget' button to browse our widget library. Each widget can be resized and configured to show the data most relevant to your role.";
    }
    
    if (input.includes('help') || input.includes('how')) {
      return "I'm here to help you make the most of your dashboard! You can ask me about:\n• Adding or removing widgets\n• Customizing your layout\n• Understanding different metrics\n• Getting insights for your role\n\nWhat specific area would you like help with?";
    }
    
    return "I understand you're looking for dashboard assistance. Could you be more specific about what you'd like to do? I can help with widgets, layout, metrics, or any other dashboard-related questions.";
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-gray-900 border-gray-700 text-white h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-400" />
              Dashboard Assistant
            </span>
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
        
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-blue-400" />
                  </div>
                )}
                
                <Card className={`max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-blue-500/20 border-blue-500/50' 
                    : 'bg-gray-800/50 border-gray-700'
                }`}>
                  <CardContent className="p-3">
                    <p className="text-sm text-white whitespace-pre-wrap">{msg.content}</p>
                  </CardContent>
                </Card>
                
                {msg.role === 'user' && (
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-green-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me about your dashboard..."
              className="bg-gray-800 border-gray-700 text-white"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardChat;
