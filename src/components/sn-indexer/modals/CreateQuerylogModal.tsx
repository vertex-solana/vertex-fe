"use client";

import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";

import { Modal } from "@/components/ui/Modal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { axiosInstance } from "@/services/config";
import { CREATE_QUERY_LOG } from "@/const/api.const";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/context";

const formSchema = z.object({
  query: z.string().optional(),
  description: z.string().min(1, "Description is required."),
});

interface CreateQueryLogModalProps {
  query: string;
  isOpen: boolean;
  onClose: () => void;
}

const CreateQueryLogModal: FC<CreateQueryLogModalProps> = ({
  query,
  isOpen,
  onClose,
}) => {
  const { indexer } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      const payload = {
        query,
        description: values.description.trim(),
        indexerId: indexer?.id,
      };

      await axiosInstance.post(CREATE_QUERY_LOG(indexer!.id), payload);

      toast.success("Create Query Log successfully!");
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to create Query Log. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Create Indexer"
      description="Create a new Indexer space for the Program."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-4"
            >
              <FormField
                control={form.control}
                name="query"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Query:</FormLabel>
                    <FormControl>
                      <Input value={query} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description:</FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isLoading}
                        placeholder="Kamino Indexer"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  Create
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  );
};

export default CreateQueryLogModal;
