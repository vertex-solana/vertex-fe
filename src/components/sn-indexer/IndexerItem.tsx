"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { IndexerTableMetadata } from "@/models/app.model";
import TableStructure from "./TableStructure";
import EditorPanel from "./EditorPanel";

const IndexerItem = ({ indexerId }: { indexerId: string }) => {
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
    <div className="flex h-screen">
      <div className="w-2/5 p-4 overflow-auto border-r border-gray-700">
        <h2 className="text-2xl font-bold mb-6">Tables for Indexer</h2>
        {tables.length === 0 ? (
          <div>No tables found for this indexer.</div>
        ) : (
          tables.map((table) => (
            <div
              key={table.fullTableName}
              className="mb-8 p-4 border rounded shadow bg-slate-800"
            >
              <h3 className="text-xl font-bold mb-2">{table.tableName}</h3>
              <p className="text-sm text-gray-400 mb-4">
                Full Table Name: {table.fullTableName}
              </p>
              <TableStructure tableMetadata={table} />
            </div>
          ))
        )}
      </div>

      <div className="w-3/5 p-4">
        <EditorPanel />
      </div>
    </div>
  );
};

export default IndexerItem;
