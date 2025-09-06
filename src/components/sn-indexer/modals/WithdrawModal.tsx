"use client";

import React, { FC, useState, useEffect } from "react";
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
import useWithdrawHooks from "@/hooks/billing-hooks/useWithdrawHooks";
import { useAppHooks } from "@/hooks";
import { ExecutionLayer } from "@/models/app.model";

const createFormSchema = (availableBalance: number) =>
  z.object({
    amount: z.string().refine((val) => {
      const num = parseFloat(val);
      if (isNaN(num) || num <= 0) {
        return false;
      }
      return num <= availableBalance;
    }, `Amount must be between 0 and ${availableBalance.toFixed(4)} SOL`),
  });

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  indexerId: number;
  onWithdrawSuccess?: () => void;
}

const WithdrawModal: FC<WithdrawModalProps> = ({
  isOpen,
  onClose,
  availableBalance,
  indexerId,
  onWithdrawSuccess,
}) => {
  const { userInfo } = useAppContext();
  const { walletConnect } = useAuthContext();
  const { handleSubmitVertexBillingTransaction } = useAppHooks();

  const [isLoading, setIsLoading] = useState(false);
  const [isTransactionSuccess, setIsTransactionSuccess] = useState(false);
  const {
    setTransactionHash,
    setTransactionStatus,
    handleReset,
    handleWithdraw: handleWithdrawTransaction,
    transactionHash,
    transactionStatus,
    handleGetTransactionResult,
  } = useWithdrawHooks();

  const form = useForm<z.infer<ReturnType<typeof createFormSchema>>>({
    resolver: zodResolver(createFormSchema(availableBalance)),
    defaultValues: {
      amount: "",
    },
  });

  const watchedAmount = form.watch("amount");
  const currentAmount = parseFloat(watchedAmount) || 0;
  const isAmountValid = currentAmount > 0 && currentAmount <= availableBalance;
  const isInsufficientBalance = currentAmount > availableBalance;

  const handleWithdraw = async (amount: number) => {
    if (!userInfo || !walletConnect) {
      throw new Error("User not connected");
    }

    if (amount > availableBalance) {
      throw new Error("Insufficient balance");
    }

    setTransactionStatus(BlockchainTransactionStatusEnum.LOADING);
    const txHash = await handleWithdrawTransaction({
      amount,
      walletAddress: walletConnect,
      indexerId,
    });

    if (!txHash) {
      throw new Error("Transaction failed");
    }

    setTransactionHash(txHash);

    try {
      console.log("Waiting for transaction confirmation...", txHash);
      await handleSubmitVertexBillingTransaction({
        executionLayer: ExecutionLayer.BASE_CHAIN,
        txHash,
      });
      const status = await handleGetTransactionResult(txHash);

      if (status === BlockchainTransactionStatusEnum.SUCCESS) {
        console.log("Transaction confirmed! Refreshing vault balance...");

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
      await handleWithdraw(amount);

      form.reset();
      onWithdrawSuccess?.();
    } catch (error) {
      console.error("Error withdrawing:", error);
      setTransactionStatus(BlockchainTransactionStatusEnum.FAILED);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to withdraw SOL. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fill with available balance when modal opens
  useEffect(() => {
    if (isOpen && availableBalance > 0) {
      form.setValue("amount", availableBalance.toString());
    }
  }, [isOpen, availableBalance, form]);

  useEffect(() => {
    form.clearErrors();
    form.trigger();
  }, [availableBalance, form]);

  const handleMaxClick = () => {
    form.setValue("amount", availableBalance.toString());
  };

  const handleCloseModal = () => {
    onClose();
    handleReset();
    setIsTransactionSuccess(false);
  };

  const handleTransactionToastClose = () => {
    handleReset();
  };

  const formatBalance = (amount: number) => {
    return amount.toFixed(4);
  };

  return (
    <>
      <Modal
        title="Withdraw from Indexer Vault"
        description="Withdraw SOL from your Indexer Vault"
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
                        {availableBalance.toFixed(4)} SOL
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
                    {formatBalance(availableBalance)} SOL
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral5">Withdraw Amount:</span>
                  <span
                    className={`${
                      isInsufficientBalance ? "text-red-400" : "text-white"
                    }`}
                  >
                    {form.watch("amount") || "0.0"} SOL
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral5">Remaining Balance:</span>
                  <span
                    className={`${
                      isInsufficientBalance ? "text-red-400" : "text-white"
                    }`}
                  >
                    {formatBalance(
                      availableBalance - (parseFloat(form.watch("amount")) || 0)
                    )}{" "}
                    SOL
                  </span>
                </div>
                {isInsufficientBalance && (
                  <div className="flex justify-between text-sm">
                    <span className="text-red-400">
                      Remaining After Withdraw:
                    </span>
                    <span className="text-red-400">
                      {(availableBalance - currentAmount).toFixed(4)} SOL
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
                      disabled={
                        isLoading || !isAmountValid || availableBalance === 0
                      }
                      className="bg-gradient-to-r from-[#6d2ef4] to-[#8b5cf6] hover:from-[#7c3aed] hover:to-[#9f7aea] hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? "Withdrawing..." : "Confirm Withdraw"}
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
    </>
  );
};

export default WithdrawModal;
