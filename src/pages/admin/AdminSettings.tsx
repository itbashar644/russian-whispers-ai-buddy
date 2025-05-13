
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Helmet } from 'react-helmet-async';
import { Settings } from 'lucide-react';
import AdminManager from '@/components/admin/AdminManager';

const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <Helmet>
        <title>Settings | Admin Panel</title>
      </Helmet>
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold md:text-2xl">Admin Settings</h1>
          <p className="text-muted-foreground">
            Manage system settings and user permissions
          </p>
        </div>
        <Settings className="h-8 w-8 text-muted-foreground" />
      </div>
      
      <div className="grid gap-6">
        <AdminManager />
        
        {/* Additional settings sections can be added here */}
      </div>
    </div>
  );
};

export default AdminSettings;
