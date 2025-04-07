"use client";

import { FC, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import axios from "axios";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TypeColumn = [
  "varbinary",
  "varchar",
  "uint256",
  "int256",
  "integer",
  "double",
  "boolean",
  "timestamp",
  "date",
  "bigint",
] as const;

const schemaFieldSchema = z.object({
  name: z.string().min(1, "Field name is required."),
  type: z.enum(TypeColumn),
  nullable: z.boolean().optional(),
});

const formSchema = z.object({
  tableName: z.string().min(1, "Table name is required."),
  schema: z
    .array(schemaFieldSchema)
    .min(1, "At least one schema field is required."),
  accountId: z.number().min(1, "Account ID is required."),
});

interface CreateTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  indexerId: number;
}

export const CreateTableModal: FC<CreateTableModalProps> = ({
  isOpen,
  onClose,
  indexerId,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tableName: "",
      schema: [{ name: "", type: "varchar", nullable: false }],
      accountId: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "schema",
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const payload = {
        indexerId,
        tableName: values.tableName.trim(),
        schema: values.schema.map((field) => ({
          name: field.name.trim(),
          type: field.type,
          nullable: field.nullable,
        })),
        accountId: values.accountId,
      };

      await axios.post(
        `http://localhost:3000/api/indexers/${indexerId}/tables/create`,
        payload
      );

      toast.success("Table created successfully!");
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create table. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Create Table"
      description="Define a new table schema for the indexer."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="tableName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Table Name:</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Table Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-1">
                <FormLabel>Schema:</FormLabel>
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex space-x-4 items-center">
                      <FormField
                        control={form.control}
                        name={`schema.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input
                                disabled={isLoading}
                                placeholder="Field Name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`schema.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select
                                disabled={isLoading}
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {TypeColumn.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`schema.${index}.nullable`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  disabled={isLoading}
                                  checked={field.value}
                                  onChange={(e) =>
                                    field.onChange(e.target.checked)
                                  }
                                />
                                <span>Nullable</span>
                              </label>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        variant="outline"
                        onClick={() => remove(index)}
                        disabled={isLoading}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() =>
                    append({ name: "", type: "varchar", nullable: false })
                  }
                  disabled={isLoading}
                >
                  Add Field
                </Button>
              </div>
            </div>
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button variant="outline" onClick={onClose} disabled={isLoading}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                Create Table
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
