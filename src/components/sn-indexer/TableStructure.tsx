"use client";

import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IndexerTableMetadata } from "@/models/app.model";

interface TableStructureProps {
  tableMetadata: IndexerTableMetadata;
}

const TableStructure: FC<TableStructureProps> = ({ tableMetadata }) => {
  return (
    <div
      className="mb-8 p-4 border rounded shadow bg-slate-900"
    >
      <h3 className="text-xl font-bold mb-2">{tableMetadata.tableName}</h3>
      <p className="text-sm text-gray-400 mb-4">
        Full Table Name: {tableMetadata.fullTableName}
      </p>
      <Table className="mb-4">
        <TableHeader>
          <TableRow className="border-b border-gray-600">
            <TableHead>Column</TableHead>
            <TableHead>Type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tableMetadata.schema.map((field, index) => (
            <TableRow
              key={index}
              className="border-b border-gray-700 last:border-b-0"
            >
              <TableCell>{field.name}</TableCell>
              <TableCell>{field.type}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableStructure;
