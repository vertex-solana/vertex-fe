"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/services/config";
import IndexerItem from "@/components/sn-indexer/IndexerItem";
import { GET_IDLS, GET_INDEXERS } from "@/const/api.const";
import { IdlDapp, IndexerResponse } from "@/models/app.model";
import { Button } from "@/components/ui/button";
import CreateIndexerModal from "@/components/sn-indexer/modals/CreateIndexerModal";
import { ArrowDirectionIcon } from "@/components/icons";
import { CommonInput } from "@/components/common";
import { SearchIcon } from "lucide-react";
import { twJoin } from "tailwind-merge";

const Indexer = () => {
  const [indexers, setIndexers] = useState<IndexerResponse[]>([]);
  const [idls, setIdls] = useState<IdlDapp[]>([]);
  const [selectedIndexerId, setSelectedIndexerId] = useState<number | null>(
    null
  );
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);
  const [updatedIndexers, setUpdatedIndexers] = useState<IndexerResponse[]>([]);

  const handleSearch = (valueSearch: string) => {
    const filterIdl = indexers.filter((item) =>
      item.name.toLocaleLowerCase().includes(valueSearch)
    );

    setUpdatedIndexers(filterIdl || []);
  };

  useEffect(() => {
    const fetchIndexers = async () => {
      try {
        const response = await axiosInstance.get(GET_INDEXERS);
        const data = response?.data?.data;

        setIndexers(data || []);
        setUpdatedIndexers(data || []);
      } catch (error) {
        console.error("Error fetching indexers:", error);
      }
    };

    fetchIndexers();
  }, [isOpenCreateModal]);

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
  }, []);

  if (selectedIndexerId) {
    return <IndexerItem indexerId={selectedIndexerId} />;
  }

  return (
    <div className="min-h-[calc(100vh-76px)] flex flex-col pt-10">
      <div className="flex flex-col items-center gap-y-5 sm:gap-y-8 overflow-y-auto pt-[76px]">
        <p className="text-4xl md:text-5xl lg:text-6xl font-bold  leading-tight">
          Indexer Space
        </p>

        <p className="text-gray-400 text-center max-w-2xl mx-auto">
          Manage and explore your custom indexers powered by Solana. Each
          indexer helps you monitor and analyze on-chain program activity in
          real-time — fast, flexible, and fully on-chain.
        </p>

        <Button
          className="w-[150px]"
          onClick={() => setIsOpenCreateModal(true)}
        >
          Create Indexer
          <ArrowDirectionIcon />
        </Button>
        <div className="rounded-2xl border border-border p-4 bg-[#0a0a0b]/90 w-full sm:max-w-[80%] min-h-[450px] flex items-center flex-col gap-y-1">
          <div className="w-full">
            <CommonInput
              startAdornment={<SearchIcon className="w-5 h-5" />}
              inputWrapperClassName={twJoin(
                "!bg-[#1e2024]",
                "overflow-hidden",
                "rounded-full border-none",
                "gap-x-2 h-[34px] !w-[220px] ml-auto"
              )}
              onChange={(e) => handleSearch(e.target.value.toLowerCase())}
              className="text-sm"
              placeholder="Search by name..."
            />
          </div>
          {updatedIndexers.length > 0 ? (
            <div className="w-full ">
              <div className="flex items-center w-full grid grid-cols-[35%_65%] px-4 py-2 bg-characterBackground2 rounded-t-lg text-sm text-neutral5">
                <p>Name</p>
                <p>Program ID</p>
              </div>
              <div className="flex flex-col sm:h-[330px] overflow-y-auto">
                {updatedIndexers?.map((indexer) => (
                  <div
                    key={indexer.id}
                    className="flex items-center w-full grid grid-cols-[35%_65%] px-4 py-4 border-b border-neutral6 font-medium text-sm sm:text-base hover:bg-white/5"
                  >
                    <p>{indexer.name}</p>
                    <button onClick={() => setSelectedIndexerId(indexer.id)}>
                      <p className="text-primary5 text-start truncate">
                        {indexer.programId}
                      </p>
                    </button>
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

      {isOpenCreateModal && (
        <CreateIndexerModal
          isOpen={isOpenCreateModal}
          onClose={() => setIsOpenCreateModal(false)}
          idls={idls}
        />
      )}
    </div>
  );
};

export default Indexer;
