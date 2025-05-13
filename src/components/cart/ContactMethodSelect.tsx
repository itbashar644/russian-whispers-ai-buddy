
import React from "react";
import { Phone } from "lucide-react";
import TelegramIcon from "@/components/icons/TelegramIcon";
import WhatsAppIcon from "@/components/icons/WhatsAppIcon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContactMethodSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const ContactMethodSelect = ({ value, onValueChange }: ContactMethodSelectProps) => {
  return (
    <Select 
      value={value} 
      onValueChange={onValueChange}
    >
      <SelectTrigger>
        <SelectValue placeholder="Выберите способ связи" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="phone">
          <div className="flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            По телефону
          </div>
        </SelectItem>
        <SelectItem value="telegram">
          <div className="flex items-center">
            <TelegramIcon size={16} className="mr-2" />
            Telegram
          </div>
        </SelectItem>
        <SelectItem value="whatsapp">
          <div className="flex items-center">
            <WhatsAppIcon size={16} className="mr-2" />
            WhatsApp
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default ContactMethodSelect;
