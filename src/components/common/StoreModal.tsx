"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {toast} from 'react-hot-toast';

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
import axios from "axios";
import { useStoreModal } from "@/hooks/use-store-modal";

const formSchema = z.object({
	indexerName: z.string().min(1, 'Indexer Name is required.'),
	programId: z.string().min(1, 'Program ID is required.'),
	idlName: z.string().min(1, 'IDL Name is required.'),
	version: z.string().min(1, 'Version is required.'),
	idl: z
		.string()
		.min(1, 'IDL file content is required.')
		.refine((value) => {
			try {
				JSON.parse(value); // Ensure the string is valid JSON
				return true;
			} catch {
				return false;
			}
		}, 'IDL must be a valid JSON file.'),
});

export const StoreModal = () => {
  const storeModal = useStoreModal();
  
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			indexerName: '',
		},
	});

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    console.log('Form values:', values);

  };

  return (
		<Modal
			title="Create Indexer"
			description="Add a new store to manage indexers and IDL."
			isOpen={storeModal.isOpen}
			onClose={storeModal.onClose}
		>
			<div>
				<div className="space-y-4 py-2 pb-4">
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<FormField
								control={form.control}
								name="indexerName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Indexer Name:</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												placeholder="Kamino Indexer"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="programId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Program ID:</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												placeholder="KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="idlName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>IDL Name:</FormLabel>
										<FormControl>
											<Input
												disabled={isLoading}
												placeholder="Kamino-Lending"
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
												placeholder="0.1.0"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="idl"
								render={({ field }) => (
									<FormItem>
										<FormLabel>IDL: </FormLabel>
										<FormControl>
											<input
												type="file"
												accept=".json"
												disabled={isLoading}
												onChange={(e) => {
													if (e.target.files && e.target.files[0]) {
														const fileReader = new FileReader();
														fileReader.onload = () => {
															field.onChange(fileReader.result); // Set the file content as the field value
														};
														fileReader.readAsText(e.target.files[0]);
													}
												}}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="pt-6 space-x-2 flex items-center justify-end w-full">
								<Button
									variant="outline"
									onClick={storeModal.onClose}
									disabled={isLoading}
								>
									Cancel
								</Button>
								<Button type="submit" disabled={isLoading}>
									Continue
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</Modal>
	);
};
