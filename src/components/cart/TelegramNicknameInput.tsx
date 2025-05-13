
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import TelegramIcon from "@/components/icons/TelegramIcon";

interface TelegramNicknameInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const TelegramNicknameInput = ({ value, onChange, required = false }: TelegramNicknameInputProps) => {
  return (
    <div>
      <Label htmlFor="telegramNickname">Ник в Telegram</Label>
      <div className="flex items-center">
        <span className="bg-[#1EAEDB] p-2 rounded-l-md">
          <TelegramIcon className="h-5 w-5" />
        </span>
        <Input
          id="telegramNickname"
          name="telegramNickname"
          placeholder="Ваш ник в Telegram"
          value={value}
          onChange={onChange}
          className="rounded-l-none"
          required={required}
        />
      </div>
    </div>
  );
};

export default TelegramNicknameInput;
