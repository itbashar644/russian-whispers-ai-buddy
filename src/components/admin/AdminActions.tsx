
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";

interface AdminActionsProps {
  email: string;
  setEmail: (email: string) => void;
  loading: boolean;
  onAddAdmin: () => void;
  onRemoveAdmin: () => void;
}

const AdminActions: React.FC<AdminActionsProps> = ({ 
  email, 
  setEmail, 
  loading, 
  onAddAdmin, 
  onRemoveAdmin 
}) => {
  return (
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
          onClick={onAddAdmin}
          disabled={loading || !email}
          className="flex-1"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          {loading ? "Processing..." : "Add Admin"}
        </Button>
        <Button 
          onClick={onRemoveAdmin}
          disabled={loading || !email}
          variant="destructive"
          className="flex-1"
        >
          <UserMinus className="h-4 w-4 mr-2" />
          {loading ? "Processing..." : "Remove Admin"}
        </Button>
      </div>
    </div>
  );
};

export default AdminActions;
