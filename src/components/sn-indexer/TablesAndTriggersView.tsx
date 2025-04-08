"use client";

import { Button } from "@/components/ui/button";
import { FC, useState } from "react";
import { CreateTableModal } from "./modals/CreateTableModal";

interface TablesAndTriggersViewProps {
  indexerId: number;
}

const TablesAndTriggersView: FC<TablesAndTriggersViewProps> = ({
  indexerId,
}) => {
  const [isOpenModalCreateTable, setIsOpenModalCreateTable] = useState(false);
  const [isOpenModalCreateTrigger, setIsOpenModalCreateTrigger] =
    useState(false);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Tables & Triggers</h2>
        <div className="flex gap-2">
          <Button onClick={() => setIsOpenModalCreateTable(true)}>
            Create Table
          </Button>
          <Button>Create Trigger</Button>
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
    </div>
  );
};

export default TablesAndTriggersView;
