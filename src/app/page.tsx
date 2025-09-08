"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  IdlDappResponse,
  IndexerResponse,
  IndexerTypeEnum,
  VaultType,
} from "@/models/app.model";
import { Button } from "@/components/ui/button";
import CreateIndexerModal from "@/components/sn-indexer/modals/CreateIndexerModal";
import { ArrowDirectionIcon } from "@/components/icons";
import { CommonInput, CommonPagination } from "@/components/common";
import VaultBalance from "@/components/sn-home/VaultBalance";
import DepositModal from "@/components/sn-home/modals/DepositModal";
import { SearchIcon } from "lucide-react";
import { twJoin } from "tailwind-merge";
import { useRouter } from "next/navigation";
import { useAppContext, useAuthContext } from "@/context";
import { isNil } from "lodash";
import { useAppHooks } from "@/hooks";
import { PublicKey } from "@solana/web3.js";
import { seeds } from "@/services/billing-service/sdk";
import useVaultBalanceHooks from "@/hooks/billing-hooks/useVaultBalanceHooks";

const Home = () => {
  const router = useRouter();
  const { userInfo, setIndexer, vertexProgram } = useAppContext();
  const { handleGetAllIndexers, handleGetIndexersOwner, handleGetIdls } =
    useAppHooks();
  const { walletConnect } = useAuthContext();

  const [idls, setIdls] = useState<IdlDappResponse[]>([]);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [isOpenDepositModal, setIsOpenDepositModal] = useState(false);
  const [indexers, setIndexers] = useState<IndexerResponse[]>([]);

  const [userVaultPubkey, setUserVaultPubkey] = useState<PublicKey>();
  const { getUserVaultBalance, refreshVaultBalance } = useVaultBalanceHooks();
  const hasInitialized = useRef(false);
  const hasFetchedIdlsForModal = useRef(false);

  const [selectedTypeIndexer, setSelectedTypeIndexer] = useState(
    IndexerTypeEnum.All
  );
  const [pagingData, setPagingData] = useState({
    totalItem: 0,
    currentPage: 1,
  });

  const handleSearch = (valueSearch: string) => {
    const filterIndexers = indexers.filter((item) =>
      item.name.toLocaleLowerCase().includes(valueSearch)
    );

    setIndexers(filterIndexers || []);
  };

  const fetchIdls = useCallback(async () => {
    try {
      const response = await handleGetIdls({});
      if (response) {
        setIdls(response.pageData || []);
      }
    } catch (error) {
      console.error("❌ Error fetching IDLs:", error);
    }
  }, [handleGetIdls]);

  const handleGetIndexerData = useCallback(
    async (indexerType: IndexerTypeEnum, pageNum: number, pageSize: number) => {
      try {
        if (isNil(userInfo)) {
          setIndexers([]);
          return;
        }
        let response;

        if (indexerType === IndexerTypeEnum.Owner) {
          response = await handleGetIndexersOwner({ pageNum, pageSize });
        } else {
          response = await handleGetAllIndexers({ pageNum, pageSize });
        }

        if (response) {
          setIndexers(response.pageData || []);
          setPagingData({
            currentPage: response.pageNum || 1,
            totalItem: response.total || 0,
          });
        }
      } catch (error) {
        console.error("❌ Error fetching indexers:", error);
      }
    },
    [userInfo, handleGetIndexersOwner, handleGetAllIndexers]
  );

  useEffect(() => {
    const initializeData = async () => {
      if (!userInfo) {
        hasInitialized.current = false;
        return;
      }

      if (hasInitialized.current) {
        return;
      }

      hasInitialized.current = true;

      await Promise.all([
        fetchIdls(),
        handleGetIndexerData(selectedTypeIndexer, 1, 5),
      ]);
    };

    initializeData();
  }, [selectedTypeIndexer, userInfo]);

  useEffect(() => {
    if (userInfo && hasInitialized.current) {
      handleGetIndexerData(selectedTypeIndexer, 1, 5);
    }
  }, [selectedTypeIndexer, userInfo]);

  useEffect(() => {
    if (isOpenCreateModal && userInfo) {
      if (!hasFetchedIdlsForModal.current) {
        hasFetchedIdlsForModal.current = true;
        fetchIdls();
      }
    } else if (!isOpenCreateModal) {
      hasFetchedIdlsForModal.current = false;
    }
  }, [isOpenCreateModal, userInfo]);

  useEffect(() => {
    if (walletConnect && vertexProgram) {
      setUserVaultPubkey(
        PublicKey.findProgramAddressSync(
          seeds.userVault(new PublicKey(walletConnect)),
          vertexProgram.programId
        )[0]
      );
    }
  }, [walletConnect, vertexProgram]);

  const handleGetUserVaultBalance = useCallback(async () => {
    if (userVaultPubkey) {
      refreshVaultBalance(VaultType.USER, userVaultPubkey.toBase58());
    }
  }, [userVaultPubkey, refreshVaultBalance]);

  const handleIndexerCreated = useCallback(async () => {
    await handleGetIndexerData(selectedTypeIndexer, 1, 5);
  }, [selectedTypeIndexer, handleGetIndexerData]);

  return (
    <div className="min-h-[calc(100vh-76px)] flex flex-col pt-10 pb-10">
      <div className="flex flex-col items-center gap-y-5 sm:gap-y-8 overflow-y-auto pt-[76px]">
        <p className="text-4xl md:text-5xl lg:text-6xl font-bold  leading-tight">
          Indexer Space
        </p>

        <p className="text-gray-400 text-center max-w-2xl mx-auto">
          Manage and explore your custom indexers powered by Solana. Each
          indexer helps you monitor and analyze on-chain program activity in
          real-time — fast, flexible, and fully on-chain.
        </p>

        {userInfo && (
          <div className="flex items-center gap-x-4">
            <VaultBalance
              variant={VaultType.USER}
              vaultAddress={userVaultPubkey?.toBase58()}
            />
            <Button
              className="w-[150px] bg-gradient-to-r from-[#6d2ef4] to-[#8b5cf6] hover:from-[#7c3aed] hover:to-[#9f7aea] hover:shadow-lg hover:shadow-purple-500/25"
              onClick={() => setIsOpenDepositModal(true)}
            >
              Deposit SOL
            </Button>
            <Button
              className="w-[150px] bg-gradient-to-r from-[#6d2ef4] to-[#8b5cf6] hover:from-[#7c3aed] hover:to-[#9f7aea] hover:shadow-lg hover:shadow-purple-500/25"
              onClick={() => setIsOpenCreateModal(true)}
            >
              Create Indexer
              <ArrowDirectionIcon />
            </Button>
          </div>
        )}

        <div className="flex flex-col w-full sm:max-w-[80%] relative">
          <div className="z-[100] w-fit flex items-center px-3 pt-2 rounded-t-xl border border-border bg-[#0a0a0b]/90 border-b-[#0a0a0b]/90 -mb-[1px]">
            {Object.values(IndexerTypeEnum).map((item) => (
              <button
                className={twJoin(
                  "p-2 min-w-[74px] text-sm rounded-lg",
                  item === selectedTypeIndexer && "bg-[#6d2ef4]"
                )}
                onClick={() => {
                  setSelectedTypeIndexer(item);
                  setPagingData({
                    totalItem: 0,
                    currentPage: 1,
                  });
                  handleGetIndexerData(item, 1, 5);
                }}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="w-fit absolute -top-3 right-0">
            <CommonInput
              startAdornment={<SearchIcon className="w-5 h-5" />}
              inputWrapperClassName={twJoin(
                "!bg-[#1e2024]",
                "overflow-hidden",
                "rounded-xl border-none",
                "gap-x-2 h-[40px] !w-[220px] ml-auto"
              )}
              onChange={(e) => handleSearch(e.target.value.toLowerCase())}
              className="text-sm"
              placeholder="Search by name..."
            />
          </div>
          <div className="w-full rounded-b-xl border border-border p-4 bg-[#0a0a0b]/90  min-h-[450px] flex items-center flex-col gap-y-1">
            {indexers.length > 0 ? (
              <div className="w-full ">
                <div className="flex items-center w-full grid grid-cols-[20%_50%_10%_20%] px-4 py-2 bg-characterBackground2 rounded-t-lg text-sm text-neutral5">
                  <p>Name</p>
                  <p>Description</p>
                  <p>Cluster</p>
                  <p>Author</p>
                </div>
                <div className="flex flex-col sm:h-[330px] overflow-y-auto">
                  {indexers?.map((indexer) => (
                    <div
                      key={indexer.id}
                      className="flex items-center w-full grid grid-cols-[20%_50%_10%_20%] px-4 py-4 border-b border-neutral6 font-medium text-sm sm:text-base hover:bg-white/5"
                    >
                      <p>{indexer.name}</p>
                      <button
                        onClick={() => {
                          router.push(`/indexers/${indexer.id}`);
                          setIndexer(indexer);
                        }}
                      >
                        <p className="text-primary5 text-start truncate">
                          {indexer.description}
                        </p>
                      </button>
                      <p className="text-primary5 text-start truncate">
                        {indexer.cluster}
                      </p>

                      <p className="text-primary5 text-start truncate">
                        {indexer.owner.walletAddress}
                      </p>
                    </div>
                  ))}
                </div>
                <CommonPagination
                  currentPage={pagingData?.currentPage}
                  totalItem={pagingData?.totalItem}
                  onChangePagination={(data) =>
                    handleGetIndexerData(
                      selectedTypeIndexer,
                      data.pageNum,
                      data.pageSize
                    )
                  }
                />
              </div>
            ) : (
              <div className="w-full h-full ">
                <p className="mx-auto my-auto w-full h-full text-center">
                  No indexers found. Please create one.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {isOpenDepositModal && (
        <DepositModal
          isOpen={isOpenDepositModal}
          onClose={() => setIsOpenDepositModal(false)}
          onDepositSuccess={() => {
            handleGetUserVaultBalance();
          }}
        />
      )}

      {isOpenCreateModal && (
        <CreateIndexerModal
          isOpen={isOpenCreateModal}
          onClose={() => setIsOpenCreateModal(false)}
          idls={idls}
          onIndexerCreated={handleIndexerCreated}
        />
      )}
    </div>
  );
};

export default Home;
