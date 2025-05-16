
// Since Catalog.tsx is a read-only file, I'll create a wrapper component that adds the chat widget
import React from "react";
import { lazy } from "react";
import ChatWidget from "@/components/chat/ChatWidget";

// Lazy load the original Catalog page
const OriginalCatalog = lazy(() => import("../pages/Catalog"));

const CatalogWithChat = () => {
  return (
    <>
      <OriginalCatalog />
      <ChatWidget />
    </>
  );
};

export default CatalogWithChat;
