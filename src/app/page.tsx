"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/services/config";
import {
  GET_IDLS,
  GET_INDEXERS,
  GET_INDEXERS_OWNER,
  GET_RPC,
} from "@/const/api.const";
import {
  IdlDapp,
  IndexerResponse,
  IndexerTypeEnum,
  RpcResponse,
} from "@/models/app.model";
import { Button } from "@/components/ui/button";
import CreateIndexerModal from "@/components/sn-indexer/modals/CreateIndexerModal";
import { ArrowDirectionIcon } from "@/components/icons";
import { CommonInput } from "@/components/common";
import { SearchIcon } from "lucide-react";
import { twJoin } from "tailwind-merge";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/context";
import { isNil } from "lodash";

const Home = () => {
  const router = useRouter();
  const { userInfo, setIndexer } = useAppContext();
  const [allIndexers, setAllIndexers] = useState<IndexerResponse[]>([]);
  const [ownerIndexers, setOwnerIndexers] = useState<IndexerResponse[]>([]);
  const [idls, setIdls] = useState<IdlDapp[]>([]);
  const [rpcs, setRpcs] = useState<RpcResponse[]>([]);
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [indexers, setIndexers] = useState<IndexerResponse[]>([]);

  const [selectedTypeIndexer, setSelectedTypeIndexer] = useState(
    IndexerTypeEnum.All
  );

  const handleSearch = (valueSearch: string) => {
    let filterIndexers = [];

    if (selectedTypeIndexer === IndexerTypeEnum.Owner) {
      filterIndexers = ownerIndexers.filter((item) =>
        item.name.toLocaleLowerCase().includes(valueSearch)
      );
    } else {
      filterIndexers = allIndexers.filter((item) =>
        item.name.toLocaleLowerCase().includes(valueSearch)
      );
    }

    setIndexers(filterIndexers || []);
  };

  useEffect(() => {
    const fetchIdls = async () => {
      try {
        const response = await axiosInstance.get(GET_IDLS);
        const data = response?.data?.data;

        setIdls(data || []);
      } catch (error) {
        console.error("Error fetching Idl:", error);
      }
    };
    fetchIdls();

    const fetchRpcs = async () => {
      try {
        const response = await axiosInstance.get(GET_RPC);
        const data = response?.data?.data;
        setRpcs(data || []);
      } catch (error) {
        console.error("Error fetching RPCs:", error);
      }
    };

    fetchRpcs();
  }, [isOpenCreateModal]);

  useEffect(() => {
    const fetchIndexersOwner = async () => {
      try {
        if (isNil(userInfo)) {
          setOwnerIndexers([]);
        } else {
          const response = await axiosInstance.get(GET_INDEXERS_OWNER);
          const data = response?.data?.data;

          setOwnerIndexers(data || []);
        }
      } catch (error) {
        console.error("Error fetching indexers:", error);
      }
    };

    const fetchAllIndexers = async () => {
      try {
        if (isNil(userInfo)) {
          setAllIndexers([]);
        } else {
          const response = await axiosInstance.get(GET_INDEXERS);
          const data = response?.data?.data;

          setAllIndexers(data || []);
        }
      } catch (error) {
        console.error("Error fetching indexers:", error);
      }
    };

    fetchAllIndexers();
    fetchIndexersOwner();
  }, [userInfo]);

  useEffect(() => {
    const filterIndexers =
      selectedTypeIndexer === IndexerTypeEnum.Owner
        ? ownerIndexers
        : allIndexers;

    setIndexers(filterIndexers);
  }, [selectedTypeIndexer, allIndexers, ownerIndexers]);

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
          <Button
            className="w-[150px]"
            onClick={() => setIsOpenCreateModal(true)}
          >
            Create Indexer
            <ArrowDirectionIcon />
          </Button>
        )}

        <div className="flex flex-col w-full sm:max-w-[80%] relative">
          <div className="z-[100] w-fit flex items-center px-3 pt-2 rounded-t-xl border border-border bg-[#0a0a0b]/90 border-b-[#0a0a0b]/90 -mb-[1px]">
            {Object.values(IndexerTypeEnum).map((item) => (
              <button
                className={twJoin(
                  "p-2 min-w-[74px] text-sm rounded-lg",
                  item === selectedTypeIndexer && "bg-[#6d2ef4]"
                )}
                onClick={() => setSelectedTypeIndexer(item)}
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
                <div className="flex items-center w-full grid grid-cols-[20%_70%_10%] px-4 py-2 bg-characterBackground2 rounded-t-lg text-sm text-neutral5">
                  <p>Name</p>
                  <p>Description</p>
                  <p>Cluster</p>
                </div>
                <div className="flex flex-col sm:h-[330px] overflow-y-auto">
                  {indexers?.map((indexer) => (
                    <div
                      key={indexer.id}
                      className="flex items-center w-full grid grid-cols-[20%_70%_10%] px-4 py-4 border-b border-neutral6 font-medium text-sm sm:text-base hover:bg-white/5"
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
                    </div>
                  ))}
                </div>
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

      {isOpenCreateModal && (
        <CreateIndexerModal
          isOpen={isOpenCreateModal}
          onClose={() => setIsOpenCreateModal(false)}
          idls={idls}
          rpcs={rpcs}
        />
      )}
    </div>
  );
};

export default Home;
