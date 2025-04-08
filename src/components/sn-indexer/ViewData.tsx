"use client";

import { FC, useEffect, useState } from "react";
import axios from "axios";
import { IndexerTableMetadata } from "@/models/app.model";
import TableStructure from "./TableStructure";
import EditorPanel from "./EditorPanel";

interface ViewDataProps {
  indexerId: number;
}

const ViewData: FC<ViewDataProps> = ({ indexerId }) => {
  const [tables, setTables] = useState<IndexerTableMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/indexers/${indexerId}/tables`,
          {
            headers: {
              Authorization: `Bearer YOUR_AUTH_TOKEN`,
            },
          }
        );

        const data = response?.data.data;
        setTables(data || []);
      } catch (error) {
        console.error("Error fetching tables:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTables();
  }, [indexerId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-full w-full">
      <div className="w-1/3 p-4 overflow-auto border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-6">Tables for Indexer</h2>
        {tables.length === 0 ? (
          <div>No tables found for this indexer.</div>
        ) : (
          tables.map((table) => (
            <TableStructure key={table.fullTableName} tableMetadata={table} />
          ))
        )}
      </div>

      <div className="w-2/3 p-4">
        <EditorPanel />
      </div>
    </div>
  );
};

export default ViewData;
