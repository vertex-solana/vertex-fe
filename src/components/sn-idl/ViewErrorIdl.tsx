import { Idl } from "@coral-xyz/anchor";
import { Idl as IdlV30 } from "anchor-v30";
import { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ViewErrorIdlProps {
  idl: Idl | IdlV30;
}

const ViewErrorIdl: FC<ViewErrorIdlProps> = ({ idl }) => {
  return (
    <Table className="text-sm text-gray-300">
      <TableHeader>
        <TableRow className="border-b border-gray-600">
          <TableHead className="text-gray-400 font-bold">Code</TableHead>
          <TableHead className="text-gray-400 font-bold">Name</TableHead>
          <TableHead className="text-gray-400 font-bold">Message</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {idl.errors?.map((error, index) => (
          <TableRow
            key={index}
            className="border-b border-gray-600 last:border-b-0"
          >
            <TableCell className="text-gray-400">{error.code}</TableCell>
            <TableCell className="text-gray-400">{error.name}</TableCell>
            <TableCell className="text-gray-400">{error.msg}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ViewErrorIdl;
