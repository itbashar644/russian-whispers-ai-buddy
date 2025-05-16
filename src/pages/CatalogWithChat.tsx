
import React from "react";
import { lazy, Suspense } from "react";
import ChatWidget from "@/components/chat/ChatWidget";
import { Skeleton } from "@/components/ui/skeleton";

// Import the Catalog component
const Catalog = lazy(() => import("./Catalog"));

const CatalogWithChat = () => {
  return (
    <>
      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center"><Skeleton className="w-full h-full" /></div>}>
        <Catalog />
      </Suspense>
      <ChatWidget />
    </>
  );
};

export default CatalogWithChat;
