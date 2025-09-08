"use client";

import { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, Eye } from "lucide-react";
import TablesAndTriggersView from "@/components/sn-indexer/TablesAndTriggersView";
import { usePathname } from "next/navigation";
import EditorPanel from "@/components/sn-indexer/EditorPanel";
import { useAppContext } from "@/context";
import { useAppHooks } from "@/hooks";
import VaultBalance from "@/components/sn-home/VaultBalance";
import WithdrawModal from "@/components/sn-indexer/modals/WithdrawModal";
import { Button } from "@/components/ui/button";
import { isNil } from "lodash";
import useVaultBalanceHooks from "@/hooks/billing-hooks/useVaultBalanceHooks";
import { PublicKey } from "@solana/web3.js";
import { seeds } from "@/services/billing-service/sdk";
import { VaultType } from "@/models/app.model";

const IndexerItem = () => {
  const indexerId = Number(usePathname().split("/indexers/").pop());
  const { userInfo, indexer } = useAppContext();

  const { setIndexer, vertexProgram } = useAppContext();
  const { handleGetIndexerDetail } = useAppHooks();
  const { getIndexerVaultBalance, indexerVaultBalance, refreshVaultBalance } =
    useVaultBalanceHooks();

  const [indexerPubkey, setIndexerPubkey] = useState<PublicKey | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenWithdrawModal, setIsOpenWithdrawModal] = useState(false);
  const [isOwnerIndexer, setIsOwnerIndexer] = useState(false);
  const [hasLoadedVaultBalance, setHasLoadedVaultBalance] = useState(false);

  const handleGetIndexerVaultBalance = useCallback(async () => {
    if (indexerPubkey && !hasLoadedVaultBalance) {
      await getIndexerVaultBalance(indexerPubkey.toBase58());
      setHasLoadedVaultBalance(true);
    }
  }, [indexerPubkey, hasLoadedVaultBalance, getIndexerVaultBalance]);

  useEffect(() => {
    const getIndexer = async () => {
      try {
        setIsLoading(true);
        const response = await handleGetIndexerDetail(indexerId);

        if (response) {
          setIndexer(response);

          const isOwner =
            !isNil(userInfo) && userInfo.id === response.ownerAccountId;
          setIsOwnerIndexer(isOwner);

          if (isOwner && userInfo) {
            setIndexerPubkey(
              PublicKey.findProgramAddressSync(
                seeds.indexer(new PublicKey(userInfo.walletAddress), indexerId),
                vertexProgram.programId
              )[0]
            );
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching indexer:", error);
        setIsLoading(false);
      }
    };

    getIndexer();
  }, [indexerId]);

  useEffect(() => {
    if (indexerPubkey && isOwnerIndexer && !hasLoadedVaultBalance) {
      // Add a small delay to prevent immediate API calls
      const timer = setTimeout(() => {
        handleGetIndexerVaultBalance();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [indexerPubkey, isOwnerIndexer, hasLoadedVaultBalance]);

  const [activeTab, setActiveTab] = useState("tables");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen w-full border-t border-gray-800">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex w-full h-full"
      >
        <div className="w-16 p-4 border-r border-border flex flex-col items-center space-y-4 pt-8 h-full">
          <TabsList className="flex flex-col gap-4 w-full">
            <TabsTrigger value="tables" className="flex flex-col items-center">
              <Table size={24} />
              <span className="sr-only">Tables & Triggers</span>
            </TabsTrigger>
            <TabsTrigger value="view" className="flex flex-col items-center">
              <Eye size={24} />
              <span className="sr-only">View Data</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 p-6 h-full w-full overflow-auto">
          {isOwnerIndexer && indexerPubkey && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-x-4">
                <VaultBalance
                  variant={VaultType.INDEXER}
                  showLabel={true}
                  className="bg-[#1e2024] border-neutral6"
                  vaultAddress={indexerPubkey.toBase58()}
                  refreshTrigger={0} // Disable auto-refresh to prevent excessive calls
                />
              </div>
              <Button
                className="bg-gradient-to-r from-[#6d2ef4] to-[#8b5cf6] hover:from-[#7c3aed] hover:to-[#9f7aea] hover:shadow-lg hover:shadow-purple-500/25"
                onClick={() => setIsOpenWithdrawModal(true)}
                disabled={
                  !hasLoadedVaultBalance || (indexerVaultBalance ?? 0) <= 0
                }
              >
                Withdraw SOL
              </Button>
            </div>
          )}

          <TabsContent value="tables" className="h-full">
            <TablesAndTriggersView indexerId={indexerId} />
          </TabsContent>
          <TabsContent value="view" className="h-full">
            <EditorPanel />
          </TabsContent>
        </div>
      </Tabs>

      {isOwnerIndexer && isOpenWithdrawModal && (
        <WithdrawModal
          isOpen={isOpenWithdrawModal}
          onClose={() => setIsOpenWithdrawModal(false)}
          indexerId={indexerId}
          availableBalance={indexerVaultBalance}
          onWithdrawSuccess={() => {
            if (indexerPubkey) {
              refreshVaultBalance(VaultType.INDEXER, indexerPubkey.toBase58());
            }
          }}
        />
      )}
    </div>
  );
};

export default IndexerItem;
