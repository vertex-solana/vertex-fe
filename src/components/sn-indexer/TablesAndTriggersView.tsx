"use client";

import { Button } from "@/components/ui/button";
import { FC, useEffect, useState } from "react";
import { CreateTableModal } from "./modals/CreateTableModal";
import { IndexerTableMetadata } from "@/models/app.model";
import TableStructure from "./TableStructure";
import axios from "axios";
import CreateTriggerModal from "./modals/CreateTriggerModal";

interface TablesAndTriggersViewProps {
  indexerId: number;
}

const TablesAndTriggersView: FC<TablesAndTriggersViewProps> = ({
  indexerId,
}) => {
  const [isOpenModalCreateTable, setIsOpenModalCreateTable] = useState(false);
  const [isOpenModalCreateTrigger, setIsOpenModalCreateTrigger] =
    useState(false);
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
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Tables & Triggers</h2>
        <div className="flex gap-2">
          <Button onClick={() => setIsOpenModalCreateTable(true)}>
            Create Table
          </Button>
          <Button onClick={() => setIsOpenModalCreateTrigger(true)}>
            Create Trigger
          </Button>
        </div>
      </div>
      <p className="text-gray-400">
        This is the view for managing tables and triggers for the indexer.
      </p>

      {isOpenModalCreateTable && (
        <CreateTableModal
          indexerId={indexerId}
          isOpen={isOpenModalCreateTable}
          onClose={() => setIsOpenModalCreateTable(false)}
        />
      )}

      {isOpenModalCreateTrigger && (
        <CreateTriggerModal
          indexerId={indexerId}
          tables={tables}
          isOpen={isOpenModalCreateTrigger}
          onClose={() => setIsOpenModalCreateTrigger(false)}
        />
      )}

      <div className="flex flex-wrap gap-4 mt-4">
        {tables.map((table) => (
          <TableStructure tableMetadata={table} key={table.fullTableName} />
        ))}
      </div>
    </div>
  );
};

export default TablesAndTriggersView;
