import { FC, useState } from "react";
import { useForm } from "react-hook-form";
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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { axiosInstance } from "@/services/config";
import { UPLOAD_IDL } from "@/const/api.const";

const formSchema = z.object({
  programId: z.string().min(1, "Program ID is required."),
  version: z.string().min(1, "Version is required."),
  name: z.string().min(1, "Name is required."),
});

interface UploadIdlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadIdlModal: FC<UploadIdlModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [idlFile, setIdlFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      programId: "",
      version: "",
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIdlFile(file);
    } else {
      setIdlFile(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!idlFile) {
      toast.error("Please upload an IDL file.");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("programId", values.programId.trim());
      formData.append("version", values.version.trim());
      formData.append("name", values.name.trim());
      formData.append("idlJson", idlFile);

      await axiosInstance.post(UPLOAD_IDL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("IDL uploaded successfully!");
      onClose();
    } catch (error: any) {
      toast.error(
        `Failed to upload IDL. Please try again. ${error.response.data.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Upload IDL"
      description="Upload IDL of Program for parsing data onchain"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="programId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Program ID:</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="e.g., KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Version:</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="e.g., 1.11.0"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name:</FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="e.g., Kamino-Lending"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-4">
            <FormLabel>Upload IDL File:</FormLabel>
            <div className="border border-gray-700 rounded-md p-4 bg-gray-800 space-y-2">
              {!idlFile ? (
                <>
                  <p className="text-sm text-gray-400">
                    No file uploaded. Please upload an IDL file.
                  </p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    disabled={isLoading}
                    className="text-sm text-gray-300"
                  />
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-400">
                    Uploaded File: <span className="font-semibold">{idlFile.name}</span>
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIdlFile(null)}
                    disabled={isLoading}
                  >
                    Change File
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="pt-6 space-x-2 flex items-center justify-end">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              Upload
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
