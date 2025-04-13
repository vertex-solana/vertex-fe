import { Idl } from "@coral-xyz/anchor";
import { Idl as IdlV30 } from "anchor-v30";
import { useEffect, useState } from "react";
import { isIdlV29 } from "../helper";
import { Button } from "@/components/ui/button";
import ViewIdlAccount from "../ViewAccountIdl";
import ViewTypeIdl from "../ViewTypeIdl";
import ViewErrorIdl from "../ViewErrorIdl";
import { CloseIcon } from "@/components/icons";
import { twJoin } from "tailwind-merge";

interface IdlViewProps {
  idl: Idl | IdlV30;
  onClose: () => void;
}

const IdlView = ({ idl, onClose }: IdlViewProps) => {
  const [activeTab, setActiveTab] = useState<IdlViewTabsEnum>(
    IdlViewTabsEnum.Instructions
  );

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const renderContent = () => {
    switch (activeTab) {
      case IdlViewTabsEnum.Instructions:
        return (
          <div className="px-6">
            <ul className="list-disc pl-6">
              {idl.instructions.map((instruction, index) => (
                <li key={index}>{instruction.name}</li>
              ))}
            </ul>
          </div>
        );
      case IdlViewTabsEnum.Accounts:
        return <ViewIdlAccount idl={idl} />;
      case IdlViewTabsEnum.Types:
        return <ViewTypeIdl idl={idl} />;
      case IdlViewTabsEnum.Errors:
        return <ViewErrorIdl idl={idl} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#282828] text-white rounded-lg w-3/4 h-[80vh] shadow-lg relative border border-white/20 overflow-hidden">
        <div className="flex justify-between items-center mb-4 bg-white/5 px-6 py-2">
          <span className="flex flex-col gap-y-2">
            <h2 className="text-xl font-bold">
              {isIdlV29(idl)
                ? (idl as Idl).name
                : (idl as IdlV30).metadata.name}
            </h2>
            <p className="text-xs text-white/50">
              Version:{" "}
              {isIdlV29(idl)
                ? (idl as Idl).version
                : (idl as IdlV30).metadata.version}
            </p>
          </span>
          <button
            className="text-gray-400 hover:text-gray-200"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>
        <div className="flex space-x-3 mb-4 px-4">
          {Object.values(IdlViewTabsEnum).map((item) => (
            <Button
              className={twJoin(
                "text-xs !py-1.5 px-2 !h-fit",
                item === activeTab ? "bg-primary" : "bg-white/20"
              )}
              onClick={() => setActiveTab(item)}
            >
              {item}
            </Button>
          ))}
        </div>
        <div className="overflow-y-auto h-full">
          <div>{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default IdlView;

enum IdlViewTabsEnum {
  Instructions = "Instructions",
  Accounts = "Accounts",
  Types = "Types",
  Errors = "Errors",
}
