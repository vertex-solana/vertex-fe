"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Table, Hash } from "lucide-react";
import TableData from "./TableData";
// import BarChartView from "./BarChartView";
// import CounterView from "./CounterView";
import { ExecuteQueryResponse } from "@/models/app.model";

type DataViewManagerProps = {
  responseQuery: ExecuteQueryResponse | null;
};

const DataViewManager = ({ responseQuery }: DataViewManagerProps) => {
  const [activeView, setActiveView] = useState("table");

  if (!responseQuery) {
    return <div className="p-4 text-gray-400">No results to display</div>;
  }

  return (
    <div className="w-full">
      <Tabs
        defaultValue="table"
        value={activeView}
        onValueChange={setActiveView}
      >
        <div className="flex items-center justify-between mb-4">
          <TabsList className="bg-slate-800">
            <TabsTrigger value="table" className="flex items-center gap-2">
              <Table size={16} />
              <span>Table</span>
            </TabsTrigger>
            <TabsTrigger value="chart" className="flex items-center gap-2">
              <BarChart3 size={16} />
              <span>Bar Chart</span>
            </TabsTrigger>
            <TabsTrigger value="counter" className="flex items-center gap-2">
              <Hash size={16} />
              <span>Counter</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="table" className="mt-0">
          <TableData responseQuery={responseQuery} />
        </TabsContent>

        <TabsContent value="chart" className="mt-0">
          {/* <BarChartView data={responseQuery} /> */}
        </TabsContent>

        <TabsContent value="counter" className="mt-0">
          {/* <CounterView data={responseQuery} /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataViewManager;
