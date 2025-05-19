
import React from 'react';
import { CheckCircle, AlertCircle } from "lucide-react";

interface AdminSearchResultProps {
  result: { 
    email: string; 
    isAdmin: boolean 
  };
}

const AdminSearchResult: React.FC<AdminSearchResultProps> = ({ result }) => {
  return (
    <div className="rounded-md border p-4">
      <div className="flex items-center gap-3">
        {result.isAdmin ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <AlertCircle className="h-5 w-5 text-amber-500" />
        )}
        <div>
          <p className="font-medium">{result.email}</p>
          <p className="text-sm text-muted-foreground">
            {result.isAdmin ? "Has admin privileges" : "No admin privileges"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminSearchResult;
