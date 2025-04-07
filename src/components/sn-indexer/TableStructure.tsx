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
    <Table className="mb-4 border-collapse border border-gray-300">
      <TableHeader>
        <TableRow className="border-b border-gray-400">
          <TableHead>Column Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Nullable</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tableMetadata.schema.map((field, index) => (
          <TableRow
            key={index}
            className="border-b border-gray-300 last:border-b-0"
          >
            <TableCell>{field.name}</TableCell>
            <TableCell>{field.type}</TableCell>
            <TableCell>{field.nullable ? "Yes" : "No"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableStructure;
