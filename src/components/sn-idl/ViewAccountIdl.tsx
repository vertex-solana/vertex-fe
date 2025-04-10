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
import { isIdlV29 } from "./helper";

interface ViewIdlAccountProps {
  idl: Idl | IdlV30;
}

const ViewIdlAccount: FC<ViewIdlAccountProps> = ({ idl }) => {
  // TODO: Update this
  const renderFileTypeForIdlV30 = (idl: IdlV30) => {
    const idlType = idl.types || [];

    return idl.accounts?.map((field, index) => {
      const accountType = idlType.find((type) => type.name === field.name);

      return (
        <li key={index} className="flex">
          <span className="text-gray-400">{accountType?.type.kind}</span>
          <span className="text-gray-500">:</span>
          <span className="text-gray-400 mx-2">{accountType?.type.kind}</span>
        </li>
      );
    });
  };

  const renderFileTypeForIdlV29 = (idl: Idl) => {
    return idl.accounts?.map((field, index) => (
      <li key={index} className="flex">
        <span className="text-gray-400">{field.type.fields[0].name}</span>
        <span className="text-gray-500">:</span>
        <span className="text-gray-400 mx-2">
          {field.type.fields[0].type as any}
        </span>
      </li>
    ));
  };

  return (
    <Table className="text-sm text-gray-300">
      <TableHeader>
        <TableRow className="border-b border-gray-600">
          <TableHead className="text-gray-400 font-bold">Name</TableHead>
          <TableHead className="text-gray-400 font-bold">Fields</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {idl.accounts?.map((field, index) => (
          <TableRow
            key={index}
            className="border-b border-gray-700 last:border-b-0"
          >
            <TableCell className="truncate">{field.name}</TableCell>
            <TableCell className="truncate">
              <ul>
                {isIdlV29(idl)
                  ? renderFileTypeForIdlV29(idl as Idl)
                  : renderFileTypeForIdlV30(idl as IdlV30)}
              </ul>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ViewIdlAccount;
