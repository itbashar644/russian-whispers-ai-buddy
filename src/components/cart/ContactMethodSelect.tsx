
import React from "react";
import { Phone, MessageSquare } from "lucide-react";
import TelegramIcon from "@/components/icons/TelegramIcon";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import { Label } from "@/components/ui/label";

interface ContactMethodSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const ContactMethodSelect = ({ value, onValueChange }: ContactMethodSelectProps) => {
  return (
    <div className="space-y-2">
      <Label className="block text-sm font-medium">Предпочтительный способ связи</Label>
      <ToggleGroup 
        type="single" 
        value={value} 
        onValueChange={(value) => {
          if (value) onValueChange(value);
        }}
        className="justify-start"
        variant="outline"
      >
        <ToggleGroupItem value="phone" aria-label="По телефону" className="flex items-center gap-2 px-4 py-2">
          <Phone className="h-4 w-4" />
          <span>По телефону</span>
        </ToggleGroupItem>
        
        <ToggleGroupItem value="telegram" aria-label="Telegram" className="flex items-center gap-2 px-4 py-2">
          <TelegramIcon size={16} className="text-[#0088cc]" />
          <span>Telegram</span>
        </ToggleGroupItem>
        
        <ToggleGroupItem value="whatsapp" aria-label="WhatsApp" className="flex items-center gap-2 px-4 py-2">
          <WhatsAppIcon size={16} className="text-[#25D366]" />
          <span>WhatsApp</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default ContactMethodSelect;
