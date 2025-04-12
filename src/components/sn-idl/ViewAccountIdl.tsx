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
import { IdlAccountDef, IdlType } from "@coral-xyz/anchor/dist/cjs/idl";
import {
  IdlAccount,
  IdlDefinedFieldsNamed,
  IdlTypeDefTyStruct,
  IdlType as IdlTypeV30,
} from "anchor-v30/dist/cjs/idl";

interface ViewIdlAccountProps {
  idl: Idl | IdlV30;
}

const ViewIdlAccount: FC<ViewIdlAccountProps> = ({ idl }) => {
  const renderFileTypeForIdlV30 = (account: IdlAccount) => {
    const idlTypes = (idl as IdlV30).types;
    const accountType = idlTypes?.find(
      (idlType) => idlType.name === account.name
    );

    const showType = (type: IdlTypeV30) => {
      if (typeof type === "object" && "array" in type) {
        return `[${type.array[0]}; ${type.array[1]}]`;
      } else {
        return type.toString();
      }
    };

    return (
      (accountType?.type as IdlTypeDefTyStruct).fields as IdlDefinedFieldsNamed
    )?.map((field, index) => (
      <li key={index} className="flex">
        <span className="text-gray-400">{field.name}</span>
        <span className="text-gray-500">:</span>
        <span className="!text-primary5 mx-2">{showType(field.type)}</span>
      </li>
    ));
  };

  const renderFileTypeForIdlV29 = (account: IdlAccountDef) => {
    const showType = (type: IdlType) => {
      if (typeof type === "object" && "array" in type) {
        return `[${type.array[0]}; ${type.array[1]}]`;
      } else {
        return type.toString();
      }
    };

    return account.type.fields.map((field, index) => (
      <li key={index} className="flex">
        <span className="text-gray-400">{field.name}</span>
        <span className="text-gray-500">:</span>
        <span className="text-primary5 mx-2">{showType(field.type)}</span>
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
        {idl.accounts?.map((account, index) => (
          <TableRow
            key={index}
            className="border-b border-gray-700 last:border-b-0"
          >
            <TableCell className="truncate">{account.name}</TableCell>
            <TableCell className="truncate">
              <ul>
                {isIdlV29(idl)
                  ? renderFileTypeForIdlV29(account as IdlAccountDef)
                  : renderFileTypeForIdlV30(account as IdlAccount)}
              </ul>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ViewIdlAccount;
