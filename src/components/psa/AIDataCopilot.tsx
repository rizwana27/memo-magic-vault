
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Database, Sparkles, MessageSquare, Bot, X, Minimize2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface QueryResult {
  sql: string;
  data: any[];
  rowCount: number;
}

interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  data?: any[];
  sql?: string;
  timestamp: Date;
}

const AIDataCopilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'system',
      content: 'Hi there! 👋 How can I help you? How are you doing today?',
      timestamp: new Date()
    }
  ]);
  const { toast } = useToast();

  const quickPrompts = [
    "Show me underutilized resources",
    "List top-performing projects this quarter", 
    "Hours logged last week by each team"
  ];

  const handleQuickPrompt = (promptText: string) => {
    setPrompt(promptText);
    handleRunQuery(promptText);
  };

  const handleRunQuery = async (queryText?: string) => {
    const queryPrompt = queryText || prompt;
    
    if (!queryPrompt.trim()) {
      toast({
        title: "Please enter a query",
        description: "Type a question about your data",
        variant: "destructive"
      });
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: queryPrompt,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    setIsLoading(true);

    try {
      console.log('Invoking AI Data Copilot function with prompt:', queryPrompt);
      
      const { data, error } = await supabase.functions.invoke('ai-data-copilot', {
        body: { prompt: queryPrompt }
      });

      console.log('Function response:', { data, error });

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(`Function error: ${error.message}`);
      }

      // Check if the response contains an error
      if (data?.error) {
        console.error('AI Copilot error:', data.error);
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `Sorry, I encountered an error: ${data.error}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);

        toast({
          title: "Query Error",
          description: data.error,
          variant: "destructive"
        });
        return;
      }

      // Success case
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.rowCount === 0 ? "No results found for your query." :
                 `Found ${data.rowCount} result${data.rowCount !== 1 ? 's' : ''}:`,
        data: data.data || [],
        sql: data.sql,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);

      toast({
        title: "Query Executed",
        description: `Found ${data.rowCount} results`,
      });

    } catch (err) {
      console.error('Copilot error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute query';
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `Sorry, I encountered an error: ${errorMessage}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderTable = (data: any[]) => {
    if (!data || data.length === 0) {
      return null;
    }

    const columns = Object.keys(data[0]);

    return (
      <div className="overflow-auto max-h-48 mt-2 border border-gray-600 rounded">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column} className="text-gray-300 font-medium text-xs px-2 py-1">
                  {column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.slice(0, 10).map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column} className="text-gray-100 text-xs px-2 py-1">
                    {row[column] !== null && row[column] !== undefined 
                      ? String(row[column]) 
                      : '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {data.length > 10 && (
          <div className="text-xs text-gray-400 p-2 border-t border-gray-600">
            Showing first 10 of {data.length} results
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg z-50"
        size="icon"
      >
        <Bot className="h-6 w-6 text-white" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`bg-gray-800 border-gray-600 shadow-xl transition-all duration-200 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
      }`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-gray-600">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-white text-sm">AI Data Copilot</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-white"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-gray-400 hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <Collapsible open={!isMinimized}>
          <CollapsibleContent>
            <CardContent className="p-0 flex flex-col h-[520px]">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user' 
                        ? 'bg-blue-600 text-white ml-4' 
                        : 'bg-gray-700 text-gray-100 mr-4'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      
                      {message.sql && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs text-gray-300 border-gray-500">
                            SQL Generated
                          </Badge>
                          <pre className="bg-gray-800 p-2 rounded text-xs text-gray-300 mt-1 overflow-auto">
                            {message.sql}
                          </pre>
                        </div>
                      )}
                      
                      {message.data && message.data.length > 0 && (
                        <div className="mt-2">
                          {renderTable(message.data)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-700 text-gray-100 rounded-lg p-3 mr-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Analyzing your query...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Prompts - Show only initially */}
              {messages.length === 1 && (
                <div className="px-4 pb-2">
                  <div className="flex flex-wrap gap-2">
                    {quickPrompts.map((promptText, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickPrompt(promptText)}
                        className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                        disabled={isLoading}
                      >
                        {promptText}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Area */}
              <div className="border-t border-gray-600 p-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Ask me anything about your data..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 text-sm resize-none"
                    disabled={isLoading}
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleRunQuery();
                      }
                    }}
                  />
                  <Button
                    onClick={() => handleRunQuery()}
                    disabled={isLoading || !prompt.trim()}
                    className="bg-blue-600 hover:bg-blue-700 px-3"
                    size="sm"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Send'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default AIDataCopilot;
