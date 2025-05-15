
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash, MergeIcon } from "lucide-react";

interface BatchOperationsProps {
  selectedCount: number;
  onBatchDelete: () => void;
  onBatchMerge: () => void;
  disabled?: boolean;
}

const BatchOperations: React.FC<BatchOperationsProps> = ({
  selectedCount,
  onBatchDelete,
  onBatchMerge,
  disabled = false
}) => {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
      <span className="text-sm font-medium">
        Выбрано товаров: {selectedCount}
      </span>
      
      <div className="flex-1"></div>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="destructive" 
            size="sm" 
            className="flex items-center gap-1"
            disabled={disabled}
          >
            <Trash className="h-4 w-4" />
            <span>Удалить</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить выбранные товары?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы собираетесь удалить {selectedCount} товаров. Это действие нельзя будет отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={onBatchDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="secondary" 
            size="sm" 
            className="flex items-center gap-1"
            disabled={disabled || selectedCount < 2}
          >
            <MergeIcon className="h-4 w-4" />
            <span>Объединить</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Объединить выбранные товары?</AlertDialogTitle>
            <AlertDialogDescription>
              Вы собираетесь объединить {selectedCount} товаров в группу вариантов. 
              Товары будут отображаться как варианты одного продукта при совпадении названия модели.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={onBatchMerge}>
              Объединить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BatchOperations;
