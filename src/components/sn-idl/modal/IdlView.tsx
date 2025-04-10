import { Idl } from "@coral-xyz/anchor";
import { Idl as IdlV30 } from "anchor-v30";
import { useEffect, useState } from "react";
import { isIdlV29 } from "../helper";
import { Button } from "@/components/ui/button";
import ViewIdlAccount from "../ViewAccountIdl";
import ViewTypeIdl from "../ViewTypeIdl";
import ViewErrorIdl from "../ViewErrorIdl";

interface IdlViewProps {
  idl: Idl | IdlV30;
  onClose: () => void;
}

const IdlView = ({ idl, onClose }: IdlViewProps) => {
  const [activeTab, setActiveTab] = useState("instructions");

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
      case "instructions":
        return (
          <ul className="list-disc pl-6">
            {idl.instructions.map((instruction, index) => (
              <li key={index}>{instruction.name}</li>
            ))}
          </ul>
        );
      case "accounts":
        return <ViewIdlAccount idl={idl} />;
      case "types":
        return <ViewTypeIdl idl={idl} />;
      case "errors":
        return <ViewErrorIdl idl={idl} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 text-white rounded-lg p-6 w-3/4 max-h-[90vh] overflow-y-auto shadow-lg relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {isIdlV29(idl) ? (idl as Idl).name : (idl as IdlV30).metadata.name}
          </h2>
          <Button
            className="text-gray-400 hover:text-gray-200"
            onClick={onClose}
          >
            Close
          </Button>
        </div>
        <nav className="flex space-x-4 border-b border-gray-600 mb-4">
          <Button
            variant={"ghost"}
            className={`pb-2 font-bold ${
              activeTab === "instructions"
                ? "border-b-2 text-blue-500"
                : "text-gray-400 hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("instructions")}
          >
            Instructions
          </Button>
          <Button
            variant={"ghost"}
            className={`pb-2 font-bold ${
              activeTab === "accounts"
                ? "border-b-2 text-blue-500"
                : "text-gray-400 hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("accounts")}
          >
            Accounts
          </Button>
          <Button
            variant={"ghost"}
            className={`pb-2 font-bold ${
              activeTab === "types"
                ? "border-b-2 text-blue-500"
                : "text-gray-400 hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("types")}
          >
            Types
          </Button>
          <Button
            variant={"ghost"}
            className={`pb-2 font-bold ${
              activeTab === "errors"
                ? "border-b-2 text-blue-500"
                : "text-gray-400 hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("errors")}
          >
            Errors
          </Button>
        </nav>
        <div>{renderContent()}</div>
      </div>
    </div>
  );
};

export default IdlView;
