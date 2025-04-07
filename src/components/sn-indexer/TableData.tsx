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
import { ExecuteQueryResponse } from "@/models/app.model";

interface TableDataProps {
  responseQuery: ExecuteQueryResponse;
}

const TableData: FC<TableDataProps> = ({ responseQuery }) => {
  return (
    <div className="mt-6">
      <Table className="border-collapse border border-gray-300">
        <TableHeader>
          <TableRow className="border-b border-gray-400">
            {Object.keys(responseQuery.schema).map((fieldName) => (
              <TableHead key={fieldName}>{fieldName}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {responseQuery.rows.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              className="border-b border-gray-300 last:border-b-0"
            >
              {Object.keys(responseQuery.schema).map((fieldName) => (
                <TableCell key={fieldName}>{row[fieldName]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableData;
