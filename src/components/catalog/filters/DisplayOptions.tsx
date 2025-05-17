
import React from "react";
import { Grid2X2, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DisplayOptionsProps {
  showAsList: boolean;
  setShowAsList: (showAsList: boolean) => void;
}

const DisplayOptions: React.FC<DisplayOptionsProps> = ({
  showAsList,
  setShowAsList
}) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-md",
          !showAsList && "bg-muted text-accent-foreground"
        )}
        onClick={() => setShowAsList(false)}
      >
        <Grid2X2 className="h-4 w-4" />
        <span className="sr-only">Grid view</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-md",
          showAsList && "bg-muted text-accent-foreground"
        )}
        onClick={() => setShowAsList(true)}
      >
        <List className="h-4 w-4" />
        <span className="sr-only">List view</span>
      </Button>
    </div>
  );
};

export default DisplayOptions;
