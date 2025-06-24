
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Database, Sparkles, MessageSquare, Bot, X, Minimize2, AlertCircle, Info } from 'lucide-react';
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
  error?: boolean;
  details?: string;
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
      content: 'How can I help you today? 👋 Ask me anything about your PSA data!',
      timestamp: new Date()
    }
  ]);
  const { toast } = useToast();

  const quickPrompts = [
    "Show all clients",
    "List active projects", 
    "Show team members",
    "Display recent timesheets"
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
      console.log('=== FRONTEND: Invoking AI Data Copilot ===');
      console.log('Prompt:', queryPrompt);
      
      const { data, error } = await supabase.functions.invoke('ai-data-copilot', {
        body: { prompt: queryPrompt }
      });

      console.log('=== FRONTEND: Function Response ===');
      console.log('Data:', data);
      console.log('Error:', error);

      if (error) {
        console.error('=== FRONTEND: Supabase Function Error ===');
        console.error('Error details:', error);
        
        let errorMessage = "I encountered a technical error. Please try again.";
        let errorDetails = '';
        
        // Provide more specific error messages
        if (error.message) {
          if (error.message.includes("Edge Function returned a non-2xx status code")) {
            errorMessage = "The AI service returned an error. Check the logs for details.";
          } else if (error.message.includes("timeout")) {
            errorMessage = "The query took too long to process. Please try a simpler query.";
          } else if (error.message.includes("quota") || error.message.includes("rate_limit")) {
            errorMessage = "⚠️ OpenAI API quota exceeded. Please check your billing and usage limits.";
          } else {
            errorMessage = `Service error: ${error.message}`;
          }
          errorDetails = error.message;
        }
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: errorMessage,
          timestamp: new Date(),
          error: true,
          details: errorDetails
        };
        setMessages(prev => [...prev, assistantMessage]);

        toast({
          title: "Query Failed",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }

      // Check if the response contains an error field
      if (data?.error) {
        console.error('=== FRONTEND: AI Copilot Error ===');
        console.error('AI error:', data.error);
        console.error('AI error details:', data.details);
        
        let errorMessage = data.error;
        
        // Provide user-friendly error messages based on specific errors
        if (data.error.includes("quota") || data.error.includes("rate_limit")) {
          errorMessage = "⚠️ OpenAI API quota exceeded. Please check your billing and usage limits in your OpenAI dashboard.";
        } else if (data.error.includes("API key")) {
          errorMessage = "🔑 OpenAI API key issue. Please verify your API key is valid and has sufficient credits.";
        } else if (data.error.includes("Assistant ID")) {
          errorMessage = "🤖 Assistant configuration issue. Please verify your Assistant ID is correct.";
        } else if (data.error.includes("forbidden")) {
          errorMessage = "❌ The query contains operations that are not allowed for security reasons. Please try rephrasing your question.";
        } else if (data.error.includes("thread")) {
          errorMessage = "🧵 Failed to create or manage conversation thread. This might be a temporary OpenAI issue.";
        } else if (data.error.includes("run")) {
          errorMessage = "⚙️ Assistant execution failed. Please try again or contact support.";
        }
        
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: errorMessage,
          timestamp: new Date(),
          error: true,
          details: data.details || data.error
        };
        setMessages(prev => [...prev, assistantMessage]);

        toast({
          title: "Query Error",
          description: errorMessage,
          variant: "destructive"
        });
        return;
      }

      // Success case
      console.log('=== FRONTEND: Success ===');
      console.log('SQL:', data.sql);
      console.log('Row count:', data.rowCount);
      console.log('Message:', data.message);
      
      let content = "";
      if (data.message) {
        // Assistant returned a text message
        content = data.message;
      } else if (data.rowCount === 0) {
        content = "No results found for your query.";
      } else {
        content = `Found ${data.rowCount} result${data.rowCount !== 1 ? 's' : ''}:`;
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: content,
        data: data.data || [],
        sql: data.sql,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);

      toast({
        title: "Query Executed",
        description: data.message ? "Response received" : `Found ${data.rowCount} results`,
      });

    } catch (err) {
      console.error('=== FRONTEND: Catch Block Error ===');
      console.error('Caught error:', err);
      
      let errorMessage = "Sorry, I encountered an unexpected error. Please try again.";
      let errorDetails = '';
      
      if (err instanceof Error) {
        if (err.message.includes("fetch")) {
          errorMessage = "🌐 Unable to connect to the AI service. Please check your internet connection and try again.";
        } else {
          errorMessage = `Unexpected error: ${err.message}`;
        }
        errorDetails = err.message;
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: errorMessage,
        timestamp: new Date(),
        error: true,
        details: errorDetails
      };
      setMessages(prev => [...prev, assistantMessage]);
      
      toast({
        title: "Unexpected Error",
        description: "Something went wrong. Please try again.",
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
                        : message.error
                        ? 'bg-red-900/50 text-red-200 mr-4 border border-red-600/30'
                        : 'bg-gray-700 text-gray-100 mr-4'
                    }`}>
                      {message.error && (
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="h-4 w-4 text-red-400" />
                          <span className="text-xs font-semibold text-red-400">Error</span>
                        </div>
                      )}
                      <p className="text-sm">{message.content}</p>
                      
                      {message.details && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-400 cursor-pointer flex items-center gap-1">
                            <Info className="h-3 w-3" />
                            Technical Details
                          </summary>
                          <pre className="bg-gray-800 p-2 rounded text-xs text-gray-300 mt-1 overflow-auto whitespace-pre-wrap">
                            {message.details}
                          </pre>
                        </details>
                      )}
                      
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
                  <div className="text-xs text-gray-400 mb-2">Try these examples:</div>
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
                <div className="text-xs text-gray-500 mt-1">
                  Press Enter to send, Shift+Enter for new line
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
