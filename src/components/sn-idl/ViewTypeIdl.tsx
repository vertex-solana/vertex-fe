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
import { IdlType, IdlTypeDef } from "@coral-xyz/anchor/dist/cjs/idl";
import {
  IdlDefinedFieldsNamed,
  IdlTypeDef as IdlTypeDefV30,
  IdlType as IdlTypeV30,
} from "anchor-v30/dist/cjs/idl";

interface ViewTypeIdlProps {
  idl: Idl | IdlV30;
}

const ViewTypeIdl: FC<ViewTypeIdlProps> = ({ idl }) => {
  const renderFileTypeForIdlV30 = (type: IdlTypeDefV30) => {
    if (type.type.kind === "enum") {
      return type.type.variants?.map((variant, index) => (
        <li key={index}>{variant.name}</li>
      ));
    }

    if (type.type.kind === "struct") {
      const showType = (type: IdlTypeV30) => {
        if (typeof type === "object" && "array" in type) {
          return `[${type.array[0]}; ${type.array[1]}]`;
        } else {
          return type.toString();
        }
      };

      return (type.type.fields as IdlDefinedFieldsNamed)?.map(
        (field, index) => (
          <li key={index} className="flex">
            <span className="text-gray-400">{field.name}</span>
            <span className="text-gray-500">:</span>
            <span className="text-gray-400 mx-2">{showType(field.type)}</span>
          </li>
        )
      );
    }
  };

  const renderFileTypeForIdlV29 = (type: IdlTypeDef) => {
    if (type.type.kind === "enum") {
      return type.type.variants?.map((variant, index) => (
        <li key={index}>{variant.name}</li>
      ));
    }

    if (type.type.kind === "struct") {
      const showType = (type: IdlType) => {
        if (typeof type === "object" && "array" in type) {
          return `[${type.array[0]}; ${type.array[1]}]`;
        } else {
          return type.toString();
        }
      };

      return type.type.fields?.map((field, index) => (
        <li key={index} className="flex">
          <span className="text-gray-400">{field.name}</span>
          <span className="text-gray-500">:</span>
          <span className="text-primary5 mx-2">{showType(field.type)}</span>
        </li>
      ));
    }

    if (type.type.kind === "alias") {
    }
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
        {idl.types?.map((type, index) => (
          <TableRow
            key={index}
            className="border-b border-gray-700 last:border-b-0"
          >
            <TableCell className="truncate">
              <span className="text-gray-400 font-bold">{type.type.kind}</span>
              <span className="mx-2 text-gray-400">{type.name}</span>
            </TableCell>
            <TableCell className="truncate">
              <ul>
                {isIdlV29(idl)
                  ? renderFileTypeForIdlV29(type as IdlTypeDef)
                  : renderFileTypeForIdlV30(type as IdlTypeDefV30)}
              </ul>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ViewTypeIdl;
