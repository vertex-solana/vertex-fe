"use client";

import React, {
  FC,
  useRef,
  useState,
  useEffect,
  ComponentPropsWithoutRef,
} from "react";

import {
  ExploreInterface,
  ExploreStatusEnum,
  SupportedChainEnum,
} from "@/models";

import { useAppContext } from "@/context";
import { useTranslation } from "react-i18next";
import { SearchIcon } from "@/components/icons";
import { twJoin, twMerge } from "tailwind-merge";
import { CommonInput, SelectedChainTabs } from "@/components/common";

import SelectStatus from "./SelectStatus";
import ExploreCard from "./explore-card";

const Explore: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...otherProps
}) => {
  const hasInitialized = useRef(false);
  const { t: getLabel } = useTranslation();
  const { exploreData } = useAppContext();

  const [updatedExploreData, setUpdatedExploreData] = useState<
    ExploreInterface[]
  >([]);

  const [filterStatus, setFilterStatus] = useState<
    ExploreStatusEnum | undefined
  >(undefined);

  const [chainFilter, setChainFilter] = useState<
    SupportedChainEnum | undefined
  >();

  const [valueSearchInput, setValueSearchInput] = useState("");

  const handleFilter = () => {
    const filteredData = exploreData.filter((item) => {
      const matchesChain = !chainFilter || item.network === chainFilter;
      const matchesStatus = !filterStatus || item.status === filterStatus;
      const matchesSearch =
        !valueSearchInput ||
        item.name.toLowerCase().includes(valueSearchInput.toLowerCase());
      return matchesChain && matchesStatus && matchesSearch;
    });

    setUpdatedExploreData(filteredData);
  };

  useEffect(() => {
    if (!hasInitialized.current) return;

    handleFilter();
  }, [hasInitialized, chainFilter, filterStatus, valueSearchInput]);

  useEffect(() => {
    if (!hasInitialized.current && exploreData.length > 0) {
      setUpdatedExploreData(
        exploreData.filter((item) => item.status !== ExploreStatusEnum.COMING)
      );
      hasInitialized.current = true;
    }
  }, [hasInitialized, exploreData]);

  return (
    <div
      className={twMerge("px-4 sm:px-0", "flex flex-col gap-y-4 sm:gap-y-6")}
      {...otherProps}
    >
      <p className="sm:text-[32px] font-semibold">{getLabel("lExplore")}</p>

      <div className="flex flex-col gap-y-6 sm:flex-row sm:items-center sm:gap-x-4">
        <div className="w-full overflow-x-auto">
          <SelectedChainTabs
            allowSelectAll
            isDefaultAll
            onSelectAll={() => setChainFilter(undefined)}
            onSelectChain={(chain) => setChainFilter(chain)}
          />
        </div>

        <div className="flex items-center gap-x-4">
          {/* <SelectStatus
            selectedStatus={filterStatus}
            onSelectStatus={(value) => setFilterStatus(value)}
          /> */}

          <CommonInput
            startAdornment={<SearchIcon className="w-5 h-5" />}
            inputWrapperClassName={twJoin(
              "!bg-[#1e2024]",
              "overflow-hidden",
              "rounded-full border-none",
              "gap-x-2 h-[44px] !w-[220px]"
            )}
            onChange={(e) => setValueSearchInput(e.target.value.toLowerCase())}
            className="text-sm"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5 gap-y-6">
        {updatedExploreData.map((item, index) => (
          <ExploreCard key={index} exploreData={item} />
        ))}
      </div>
    </div>
  );
};

export default Explore;
