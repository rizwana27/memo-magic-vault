
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserRole = () => {
  return useQuery({
    queryKey: ['user-role'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('user_profiles')
        .select('role, full_name')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        return null;
      }

      return data;
    },
    enabled: true,
  });
};

export const useCreateUserProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (profileData: {
      user_id: string;
      email: string;
      full_name: string;
      role: 'admin' | 'employee' | 'vendor' | 'client';
    }) => {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([profileData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profiles'] });
      queryClient.invalidateQueries({ queryKey: ['user-role'] });
      toast({
        title: "Success",
        description: "User profile created successfully",
      });
    },
    onError: (error: any) => {
      console.error('Failed to create user profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create user profile",
        variant: "destructive",
      });
    },
  });
};
