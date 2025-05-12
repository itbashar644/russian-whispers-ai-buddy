
import React, { useState } from "react";
import { 
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Truck } from "lucide-react";

interface TrackingDialogProps {
  orderNumber: number;
  initialTrackingNumber: string;
  initialTrackingUrl: string;
  onSubmit: (trackingNumber: string, trackingUrl: string) => void;
}

const TrackingDialog: React.FC<TrackingDialogProps> = ({
  orderNumber,
  initialTrackingNumber,
  initialTrackingUrl,
  onSubmit
}) => {
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber);
  const [trackingUrl, setTrackingUrl] = useState(initialTrackingUrl);

  const handleOpen = () => {
    setTrackingNumber(initialTrackingNumber);
    setTrackingUrl(initialTrackingUrl);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleOpen}
        >
          <Truck className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Данные для отслеживания заказа</DialogTitle>
          <DialogDescription>
            Добавьте трек-номер и ссылку для отслеживания заказа №{orderNumber}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tracking-number">Трек-номер</Label>
            <Input 
              id="tracking-number" 
              value={trackingNumber} 
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Введите трек-номер"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tracking-url">Ссылка для отслеживания</Label>
            <Input 
              id="tracking-url" 
              value={trackingUrl} 
              onChange={(e) => setTrackingUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Отмена</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button onClick={() => onSubmit(trackingNumber, trackingUrl)}>Сохранить</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TrackingDialog;
