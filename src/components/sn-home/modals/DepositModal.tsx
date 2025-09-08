"use client";

import React, { FC, useEffect, useState } from "react";
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
import { CommonTransactionToast } from "@/components/common";
import { BlockchainTransactionStatusEnum } from "@/models";
import { useAppContext, useAuthContext } from "@/context";
import ReactDOM from "react-dom";
import useDepositHooks from "@/hooks/billing-hooks/useDepositHooks";
import { BlockChainUtils } from "@/utils";
import { useAppHooks } from "@/hooks";
import { ExecutionLayer } from "@/models/app.model";

const createFormSchema = (maxBalance: number) =>
  z.object({
    amount: z.string().refine((val) => {
      const num = parseFloat(val);
      if (isNaN(num) || num <= 0) {
        return false;
      }
      return num <= maxBalance;
    }, `Amount must be between 0 and ${maxBalance.toFixed(4)} SOL`),
  });

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepositSuccess?: () => void;
}

const DepositModal: FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onDepositSuccess,
}) => {
  const { userInfo, connection } = useAppContext();
  const { walletConnect } = useAuthContext();
  const { handleSubmitVertexBillingTransaction } = useAppHooks();

  const [isLoading, setIsLoading] = useState(false);
  const [maxSolBalance, setMaxSolBalance] = useState(0);
  const [isTransactionSuccess, setIsTransactionSuccess] = useState(false);
  const {
    handleDeposit: handleDepositTransaction,
    handleReset,
    setTransactionHash,
    setTransactionStatus,
    transactionStatus,
    transactionHash,
    handleGetTransactionResult,
  } = useDepositHooks();

  const form = useForm<z.infer<ReturnType<typeof createFormSchema>>>({
    resolver: zodResolver(createFormSchema(maxSolBalance)),
    defaultValues: {
      amount: "",
    },
  });

  const watchedAmount = form.watch("amount");
  const currentAmount = parseFloat(watchedAmount) || 0;
  const isAmountValid = currentAmount > 0 && currentAmount <= maxSolBalance;
  const isInsufficientBalance = currentAmount > 0 && currentAmount > maxSolBalance;

  const handleDeposit = async (amount: number) => {
    if (!userInfo || !walletConnect) {
      throw new Error("User not connected");
    }

    setTransactionStatus(BlockchainTransactionStatusEnum.LOADING);
    const txHash = await handleDepositTransaction({
      amount,
      walletAddress: walletConnect,
    });

    if (!txHash) {
      return
    }

    setTransactionHash(txHash);

    try {
      await handleSubmitVertexBillingTransaction({
        executionLayer: ExecutionLayer.BASE_CHAIN,
        txHash,
      });
      const status = await handleGetTransactionResult(txHash);

      if (status === BlockchainTransactionStatusEnum.SUCCESS) {
        console.log("Transaction confirmed! Refreshing vault balance...");

        // Trigger global vault balance refresh
        localStorage.setItem("vaultBalanceRefresh", Date.now().toString());
        window.dispatchEvent(new CustomEvent("vaultBalanceRefresh"));
        setIsTransactionSuccess(true);
      } else {
        throw new Error("Transaction failed");
      }
    } catch (error) {
      console.error("Error confirming transaction:", error);
      setTransactionStatus(BlockchainTransactionStatusEnum.FAILED);
      throw error;
    }
  };

  const onSubmit = async (
    values: z.infer<ReturnType<typeof createFormSchema>>
  ) => {
    setIsLoading(true);

    try {
      const amount = parseFloat(values.amount);
      await handleDeposit(amount);

      form.reset();
      onDepositSuccess?.();
    } catch (error) {
      console.error("Error depositing:", error);
      setTransactionStatus(BlockchainTransactionStatusEnum.FAILED);
      toast.error("Failed to deposit SOL. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchBalance = async () => {
      if (walletConnect) {
        const balance = await BlockChainUtils.getSolanaNativeTokenBalance(
          walletConnect,
          connection.rpcEndpoint
        );

        setMaxSolBalance(balance);
      }
    };

    fetchBalance();
  }, [walletConnect]);

  useEffect(() => {
    form.clearErrors();
    form.trigger();
  }, [maxSolBalance, form]);

  const handleMaxClick = () => {
    form.setValue("amount", maxSolBalance.toString());
  };

  const handleCloseModal = () => {
    onClose();
    handleReset();
    setIsTransactionSuccess(false);
  };

  const handleTransactionToastClose = () => {
    handleReset();
  };

  return (
    <Modal
      title="Deposit to User Vault"
      description="Deposit SOL to your User Vault for indexer operations"
      isOpen={isOpen}
      onClose={handleCloseModal}
    >
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col space-y-4"
            >
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (SOL)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.0001"
                          placeholder="0.0"
                          disabled={isLoading || isTransactionSuccess}
                          {...field}
                          className={`pr-20 ${
                            isInsufficientBalance
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2 text-xs"
                          onClick={handleMaxClick}
                          disabled={isLoading || isTransactionSuccess}
                        >
                          MAX
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                    {isInsufficientBalance && (
                      <p className="text-sm text-red-500 mt-1">
                        Insufficient balance. Available:{" "}
                        {maxSolBalance.toFixed(4)} SOL
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <div
                className={`rounded-lg p-3 space-y-2 ${
                  isInsufficientBalance
                    ? "bg-red-900/20 border border-red-500/30"
                    : "bg-[#1e2024]"
                }`}
              >
                <div className="flex justify-between text-sm">
                  <span className="text-neutral5">Available Balance:</span>
                  <span className="text-white">
                    {maxSolBalance.toFixed(4)} SOL
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral5">Deposit Amount:</span>
                  <span
                    className={`${
                      isInsufficientBalance ? "text-red-400" : "text-white"
                    }`}
                  >
                    {form.watch("amount") || "0.0"} SOL
                  </span>
                </div>
                {isInsufficientBalance && (
                  <div className="flex justify-between text-sm">
                    <span className="text-red-400">
                      Remaining After Deposit:
                    </span>
                    <span className="text-red-400">
                      {(maxSolBalance - currentAmount).toFixed(4)} SOL
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                {isTransactionSuccess ? (
                  <Button
                    onClick={handleCloseModal}
                    className="bg-gradient-to-r from-[#6d2ef4] to-[#8b5cf6] hover:from-[#7c3aed] hover:to-[#9f7aea] hover:shadow-lg hover:shadow-purple-500/25"
                  >
                    Close
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={onClose}
                      disabled={isLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading || !isAmountValid}
                      className="bg-gradient-to-r from-[#6d2ef4] to-[#8b5cf6] hover:from-[#7c3aed] hover:to-[#9f7aea] hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Depositing..." : "Confirm Deposit"}
                    </Button>
                  </>
                )}
              </div>
            </form>
          </Form>
        </div>

      {transactionHash &&
        ReactDOM.createPortal(
          <CommonTransactionToast
            status={transactionStatus}
            transactionHash={transactionHash}
            onCloseCallback={handleTransactionToastClose}
          />,
          document.body
        )}
    </Modal>
  );
};

export default DepositModal;
