
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle, UserPlus, UserMinus, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const AdminManager = () => {
  const [email, setEmail] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<{ email: string, isAdmin: boolean } | null>(null);
  const { profile } = useAuth();
  
  // Check if current user is a super admin
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  
  useEffect(() => {
    const checkSuperAdminStatus = async () => {
      // Если пользователь - halafbashar@gmail.com, он всегда супер-админ
      if (profile?.email === 'halafbashar@gmail.com') {
        setIsSuperAdmin(true);
        return;
      }
      
      if (!profile?.id) return;
      
      // Иначе проверяем флаг is_super_admin
      const { data, error } = await supabase
        .from('user_roles')
        .select('is_super_admin')
        .eq('user_id', profile.id)
        .eq('role', 'admin')
        .single();
      
      if (error) {
        console.error("Error checking super admin status:", error);
        return;
      }
      
      setIsSuperAdmin(data?.is_super_admin === true);
    };
    
    checkSuperAdminStatus();
  }, [profile]);
  
  const handleSearch = async () => {
    if (!searchEmail.trim()) return;
    
    setSearchLoading(true);
    setSearchResult(null);
    
    try {
      // First check if the user exists by their email
      const { data: users, error: userError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', searchEmail)
        .single();
      
      if (userError || !users) {
        toast.error("User not found", {
          description: "No user found with this email address."
        });
        setSearchLoading(false);
        return;
      }
      
      const userId = users.id;
      
      // Then check if they have admin role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'admin');
      
      if (roleError) {
        toast.error("Error", {
          description: "Failed to check admin status."
        });
        setSearchLoading(false);
        return;
      }
      
      setSearchResult({
        email: searchEmail,
        isAdmin: roleData && roleData.length > 0
      });
      
    } catch (error) {
      console.error("Error searching user:", error);
      toast.error("Error", {
        description: "Failed to search for user."
      });
    } finally {
      setSearchLoading(false);
    }
  };
  
  const handleManageAdmin = async (action: 'add' | 'remove') => {
    if (!email.trim() || !isSuperAdmin) return;
    
    setLoading(true);
    
    try {
      // Call our custom database function
      const { data, error } = await supabase.rpc(
        'manage_admin_privileges',
        {
          admin_email: profile?.email || '',
          target_email: email,
          action: action
        }
      );
      
      if (error) {
        toast.error(`Failed to ${action} admin`, {
          description: error.message
        });
        return;
      }
      
      if (data === true) {
        toast.success(`Admin ${action === 'add' ? 'added' : 'removed'}`, {
          description: `User ${email} has been ${action === 'add' ? 'granted' : 'removed from'} admin privileges.`
        });
        setEmail('');
        
        // Update search result if this is the same user
        if (searchResult && searchResult.email === email) {
          setSearchResult({
            ...searchResult,
            isAdmin: action === 'add'
          });
        }
      } else {
        toast.error(`Operation failed`, {
          description: `Unable to ${action} admin privileges for ${email}.`
        });
      }
      
    } catch (error) {
      console.error(`Error ${action}ing admin:`, error);
      toast.error("Error", {
        description: `An error occurred while ${action === 'add' ? 'adding' : 'removing'} admin.`
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (!isSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Admin Management</CardTitle>
          <CardDescription>
            You don't have permission to manage admin users.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin User Management</CardTitle>
        <CardDescription>
          Grant or revoke administrative privileges for users.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Search User</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Email address"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={searchLoading}>
              <Search className="h-4 w-4 mr-2" />
              {searchLoading ? "Searching..." : "Search"}
            </Button>
          </div>
          
          {searchResult && (
            <div className="rounded-md border p-4">
              <div className="flex items-center gap-3">
                {searchResult.isAdmin ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                )}
                <div>
                  <p className="font-medium">{searchResult.email}</p>
                  <p className="text-sm text-muted-foreground">
                    {searchResult.isAdmin ? "Has admin privileges" : "No admin privileges"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Manage Admin</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => handleManageAdmin('add')}
              disabled={loading || !email}
              className="flex-1"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {loading ? "Processing..." : "Add Admin"}
            </Button>
            <Button 
              onClick={() => handleManageAdmin('remove')}
              disabled={loading || !email}
              variant="destructive"
              className="flex-1"
            >
              <UserMinus className="h-4 w-4 mr-2" />
              {loading ? "Processing..." : "Remove Admin"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminManager;
