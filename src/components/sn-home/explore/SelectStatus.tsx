"use client";

import React, { FC, useState } from "react";
import {
  DropdownRoot,
  DropdownContent,
  DropdownTrigger,
} from "@/components/common";
import { twJoin } from "tailwind-merge";
import { ExploreStatusEnum } from "@/models";
import { ArrowIcon } from "@/components/icons";

const SelectStatus: FC<SelectStatusProps> = ({
  selectedStatus,
  onSelectStatus,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownRoot open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DropdownTrigger>
        <div className="min-w-[114px] flex items-center justify-between gap-x-2 px-3 py-2.5 rounded-full bg-[#1e2024] text-neutral5">
          {!selectedStatus ? "Status" : selectedStatus}

          <ArrowIcon
            className={twJoin("text-neutral1", isOpen && "rotate-180")}
          />
        </div>
      </DropdownTrigger>
      <DropdownContent
        className={twJoin(
          "w-[100px]",
          "overflow-hidden",
          "border border-white/20 bg-[#1e2024]"
        )}
        align="start"
      >
        <div className="flex flex-col text-sm">
          <button
            className="p-3 py-2"
            onClick={() => {
              setIsOpen(false);
              onSelectStatus(undefined);
            }}
          >
            Status
          </button>
          {Object.values(ExploreStatusEnum).map((item, index) => (
            <button
              key={index}
              onClick={() => {
                onSelectStatus(item);
                setIsOpen(false);
              }}
              className="px-3 py-2 border-t border-neutral5"
            >
              {item}
            </button>
          ))}
        </div>
      </DropdownContent>
    </DropdownRoot>
  );
};

export default SelectStatus;

interface SelectStatusProps {
  selectedStatus?: ExploreStatusEnum;

  onSelectStatus: (value: ExploreStatusEnum | undefined) => void;
}
