
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Database, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface QueryResult {
  sql: string;
  data: any[];
  rowCount: number;
}

const AIDataCopilot = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<QueryResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const examplePrompts = [
    "Show me all unallocated resources this quarter",
    "List top 5 projects by budget",
    "Find all active clients in the technology industry",
    "Show me vendor contracts expiring this year",
    "Display projects with low utilization rates"
  ];

  const handleRunQuery = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Please enter a query",
        description: "Type a question about your data",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('ai-data-copilot', {
        body: { prompt }
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        setError(data.error);
        toast({
          title: "Query Error",
          description: data.error,
          variant: "destructive"
        });
      } else {
        setResult(data);
        toast({
          title: "Query Executed",
          description: `Found ${data.rowCount} results`,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to execute query';
      setError(errorMessage);
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
      return (
        <div className="text-center py-8 text-gray-400">
          <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No data found for your query</p>
        </div>
      );
    }

    const columns = Object.keys(data[0]);

    return (
      <div className="overflow-auto max-h-96">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column} className="text-gray-300 font-medium">
                  {column.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column} className="text-gray-100">
                    {row[column] !== null && row[column] !== undefined 
                      ? String(row[column]) 
                      : '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-400" />
          AI Data Copilot
        </CardTitle>
        <CardDescription className="text-gray-400">
          Ask questions about your PSA data in natural language
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Query Input */}
        <div className="space-y-2">
          <Textarea
            placeholder="Ask a question like: Show me projects where utilization is under 60%"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 min-h-[80px]"
            disabled={isLoading}
          />
          
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setPrompt(example)}
                className="text-xs border-gray-600 text-gray-300 hover:bg-gray-700"
                disabled={isLoading}
              >
                {example}
              </Button>
            ))}
          </div>
        </div>

        {/* Run Query Button */}
        <Button
          onClick={handleRunQuery}
          disabled={isLoading || !prompt.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            'Run Query'
          )}
        </Button>

        {/* Results Section */}
        {(result || error) && (
          <div className="space-y-4">
            {/* SQL Display */}
            {result?.sql && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-gray-300 border-gray-600">
                    Generated SQL
                  </Badge>
                  <Badge variant="outline" className="text-blue-300 border-blue-600">
                    {result.rowCount} rows
                  </Badge>
                </div>
                <pre className="bg-gray-800 p-3 rounded text-sm text-gray-300 overflow-auto">
                  {result.sql}
                </pre>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-900/20 border border-red-600 rounded p-4">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Data Table */}
            {result?.data && (
              <div className="space-y-2">
                <h4 className="text-white font-medium">Results</h4>
                <div className="bg-gray-800/50 border border-gray-600 rounded">
                  {renderTable(result.data)}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AIDataCopilot;
