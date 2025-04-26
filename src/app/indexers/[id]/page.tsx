"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, Eye } from "lucide-react";
import TablesAndTriggersView from "@/components/sn-indexer/TablesAndTriggersView";
import ViewData from "@/components/sn-indexer/ViewData";
import { usePathname } from "next/navigation";

const IndexerItem = () => {
  const indexerId = Number(usePathname().split("/indexers/").pop());

  const [activeTab, setActiveTab] = useState("tables");

  return (
    <div className="flex h-screen w-full border-t border-gray-800">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex w-full h-full"
      >
        <div className="w-16 p-4 border-r border-border flex flex-col items-center space-y-4 pt-8 h-full">
          <TabsList className="flex flex-col gap-4 w-full">
            <TabsTrigger value="tables" className="flex flex-col items-center">
              <Table size={24} />
              <span className="sr-only">Tables & Triggers</span>
            </TabsTrigger>
            <TabsTrigger value="view" className="flex flex-col items-center">
              <Eye size={24} />
              <span className="sr-only">View Data</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 p-6 overflow-auto h-full">
          <TabsContent value="tables" className="h-full">
            <TablesAndTriggersView indexerId={indexerId} />
          </TabsContent>
          <TabsContent value="view" className="h-full">
            <ViewData indexerId={indexerId} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default IndexerItem;
