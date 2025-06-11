
import { Outlet } from "react-router-dom";
import YandexMetrika from "@/components/analytics/YandexMetrika";
import ChatWidget from "@/components/chat/ChatWidget";
import { Toaster } from "@/components/ui/sonner";

const AppLayout = () => {
  return (
    <>
      <YandexMetrika />
      <Outlet />
      <ChatWidget />
      <Toaster />
    </>
  );
};

export default AppLayout;
