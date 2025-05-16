
import React from "react";
import Catalog from "./Catalog";
import ChatWidget from "@/components/chat/ChatWidget";

const CatalogWithChat = () => {
  return (
    <>
      <Catalog />
      <ChatWidget />
    </>
  );
};

export default CatalogWithChat;
