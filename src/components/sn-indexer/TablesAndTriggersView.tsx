"use client";

import { Button } from "@/components/ui/button";
import { FC, useEffect, useState } from "react";
import { CreateTableModal } from "./modals/CreateTableModal";
import { IndexerTableMetadata } from "@/models/app.model";
import TableStructure from "./TableStructure";
import CreateTriggerModal from "./modals/CreateTriggerModal";
import { useAppContext } from "@/context";
import { isNil } from "lodash";
import { useAppHooks } from "@/hooks";

interface TablesAndTriggersViewProps {
  indexerId: number;
}

const TablesAndTriggersView: FC<TablesAndTriggersViewProps> = ({
  indexerId,
}) => {
  const { userInfo, indexer } = useAppContext();
  const { handleGetTablesInIndexer } = useAppHooks();

  const isOwnerIndexer =
    !isNil(userInfo) &&
    !isNil(indexer) &&
    userInfo.id === indexer.ownerAccountId;

  const [isOpenModalCreateTable, setIsOpenModalCreateTable] = useState(false);
  const [isOpenModalCreateTrigger, setIsOpenModalCreateTrigger] =
    useState(false);
  const [tables, setTables] = useState<IndexerTableMetadata[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getTables = async () => {
      try {
        const response = await handleGetTablesInIndexer(indexerId);
        setTables(response ?? []);
      } catch (error) {
        console.error("Error getting tables:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getTables();
  }, [indexerId, isOpenModalCreateTable, isOpenModalCreateTrigger]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Tables & Triggers</h2>
        {isOwnerIndexer && (
          <div className="flex gap-2">
            <Button onClick={() => setIsOpenModalCreateTable(true)}>
              Create Table
            </Button>
            <Button onClick={() => setIsOpenModalCreateTrigger(true)}>
              Create Trigger
            </Button>
          </div>
        )}
      </div>
      <p className="text-gray-400">
        This is the view for managing tables and triggers for the indexer.
      </p>

      {isOwnerIndexer && isOpenModalCreateTable && (
        <CreateTableModal
          indexerId={indexerId}
          isOpen={isOpenModalCreateTable}
          onClose={() => setIsOpenModalCreateTable(false)}
        />
      )}

      {isOwnerIndexer && isOpenModalCreateTrigger && (
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
