
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";

interface OrderTermsProps {
  termsAgreed: boolean;
  setTermsAgreed: (value: boolean) => void;
  privacyAgreed: boolean;
  setPrivacyAgreed: (value: boolean) => void;
  saveInfo: boolean;
  setSaveInfo: (value: boolean) => void;
}

const OrderTerms = ({
  termsAgreed,
  setTermsAgreed,
  privacyAgreed,
  setPrivacyAgreed,
  saveInfo,
  setSaveInfo
}: OrderTermsProps) => {
  return (
    <>
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="termsAgreement" 
          checked={termsAgreed}
          onCheckedChange={(checked) => setTermsAgreed(checked === true)} 
          className="mt-1"
        />
        <label
          htmlFor="termsAgreement"
          className="text-sm font-medium leading-tight cursor-pointer"
        >
          Я прочитал(а) и согласен(на) с <Link to="/terms" className="text-primary underline" target="_blank">Условиями использования</Link>
        </label>
      </div>
      
      <div className="flex items-start space-x-2">
        <Checkbox 
          id="privacyAgreement" 
          checked={privacyAgreed}
          onCheckedChange={(checked) => setPrivacyAgreed(checked === true)} 
          className="mt-1"
        />
        <label
          htmlFor="privacyAgreement"
          className="text-sm font-medium leading-tight cursor-pointer"
        >
          Я прочитал(а) и согласен(на) с <Link to="/privacy" className="text-primary underline" target="_blank">Политикой конфиденциальности</Link>
        </label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="saveInfo" 
          checked={saveInfo}
          onCheckedChange={(checked) => setSaveInfo(checked === true)} 
        />
        <label
          htmlFor="saveInfo"
          className="text-sm font-medium leading-none cursor-pointer"
        >
          Сохранить информацию для будущих заказов
        </label>
      </div>
    </>
  );
};

export default OrderTerms;
