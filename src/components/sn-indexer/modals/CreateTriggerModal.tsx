"use client";

import { useState } from "react";
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
import Editor from "@monaco-editor/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import { IndexerTableMetadata, TriggerType } from "@/models/app.model";
import { useAppHooks } from "@/hooks";

const triggerSchema = z.object({
  tableId: z.string().min(1, "Table is required."),
  triggerType: z.string().min(1, "Trigger type is required."),
  pdaName: z.string().min(1, "PDA name is required."),
  pdaPubkey: z.string().min(1, "PDA public key is required."),
});

interface CreateTriggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tables: IndexerTableMetadata[];
  indexerId: number;
}

const CreateTriggerModal = ({
  isOpen,
  onClose,
  tables,
  indexerId,
}: CreateTriggerModalProps) => {
  const { handlerCreateTriggerAndTransformer } = useAppHooks();

  const [transformCode, setTransformCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof triggerSchema>>({
    resolver: zodResolver(triggerSchema),
    defaultValues: {
      tableId: "",
      triggerType: "",
      pdaName: "",
      pdaPubkey: "",
    },
  });

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setTransformCode(reader.result as string);
    };
    reader.readAsText(file);
  };

  const onSubmit = async (values: z.infer<typeof triggerSchema>) => {
    if (!transformCode) {
      toast.error("Please upload a transformer file.");
      return;
    }

    setIsLoading(true);

    try {
      await handlerCreateTriggerAndTransformer({
        indexerId,
        tableId: Number(values.tableId),
        triggerType: values.triggerType,
        pdaPubkey: values.pdaPubkey.trim(),
        pdaName: values.pdaName.trim(),
        transformCode: transformCode,
      });

      toast.success("Trigger created successfully!");
      onClose();
    } catch (error) {
      toast.error(`Failed to create trigger. Please try again. ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Create Trigger"
      description="Define a new trigger and upload a transformer script."
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="1000px"
    >
      <div className="flex space-x-6">
        <div className="w-1/3 space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="tableId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Table:</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a table" />
                        </SelectTrigger>
                        <SelectContent>
                          {tables.map((table) => (
                            <SelectItem
                              key={table.id}
                              value={table.id.toString()}
                            >
                              {table.tableName}
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
                name="triggerType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trigger Type:</FormLabel>
                    <FormControl>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a trigger type" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(TriggerType).map((type) => (
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
                name="pdaName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PDA Name:</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="e.g., reserve"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pdaPubkey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PDA Public Key:</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="e.g., D6q6wuQSrifJKZYpR1M8R4YawnLDtDsMmWM1NbBmgJ59"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  Create Trigger
                </Button>
              </div>
            </form>
          </Form>
        </div>

        <div className="w-2/3 space-y-4">
          <div className="border border-gray-700 rounded-md p-4 bg-gray-800">
            <p className="text-sm text-gray-400 mb-2">
              Upload a transformer script:
            </p>
            <input
              type="file"
              accept=".js"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
              disabled={isLoading}
              className="text-sm text-gray-300"
            />
          </div>
          {transformCode && (
            <div className="border border-gray-700 rounded-md overflow-hidden">
              <Editor
                height="300px"
                defaultLanguage="javascript"
                value={transformCode}
                theme="vs-dark"
                options={{
                  readOnly: true, // TODO: Allow LLM to edit this
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CreateTriggerModal;
