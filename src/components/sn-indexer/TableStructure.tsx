"use client";

import { FC, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IndexerTableMetadata } from "@/models/app.model";
import TriggerAndTransformerModal from "./modals/TriggerAndTransformerModal";

interface TableStructureProps {
  tableMetadata: IndexerTableMetadata;
}

const TableStructure: FC<TableStructureProps> = ({ tableMetadata }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-4 border border-gray-700 rounded-md shadow-sm bg-gray-800 flex flex-col justify-between w-[300px]">
      <div>
        <h3 className="text-lg font-semibold text-white truncate">
          {tableMetadata.tableName}
        </h3>
        <p className="text-xs text-gray-400 truncate">
          {tableMetadata.fullTableName}
        </p>
      </div>
      <Table className="text-sm text-gray-300">
        <TableHeader>
          <TableRow className="border-b border-gray-600">
            <TableHead className="text-gray-400">Column</TableHead>
            <TableHead className="text-gray-400">Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableMetadata.schema.slice(0, 3).map((field, index) => (
            <TableRow
              key={index}
              className="border-b border-gray-700 last:border-b-0"
            >
              <TableCell className="truncate">{field.name}</TableCell>
              <TableCell className="truncate">{field.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {tableMetadata.schema.length > 3 && (
        <p className="text-xs text-gray-500 mt-2">
          +{tableMetadata.schema.length - 3} more columns
        </p>
      )}
      <button
        className="mt-4 text-sm text-blue-500 hover:underline"
        onClick={() => setIsModalOpen(true)}
      >
        View Triggers & Transformers
      </button>
      {isModalOpen && (
        <TriggerAndTransformerModal
          tableId={tableMetadata.id}
          indexerId={tableMetadata.indexerId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default TableStructure;
