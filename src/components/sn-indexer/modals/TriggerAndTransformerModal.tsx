"use client";

import { FC, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { TransformerPda, TriggerAndTransformer } from "@/models/app.model";
import * as Tooltip from "@radix-ui/react-tooltip";
import { twJoin } from "tailwind-merge";
import toast from "react-hot-toast";
import { useAppHooks } from "@/hooks";

interface TriggerAndTransformerModalProps {
  indexerId: number;
  tableId: number;
  onClose: () => void;
}

const TriggerAndTransformerModal: FC<TriggerAndTransformerModalProps> = ({
  tableId,
  indexerId,
  onClose,
}) => {
  const { handleGetTriggersAndTransformers, handleUpdateTransformerScript } =
    useAppHooks();

  const [triggersAndTransformers, setTriggersAndTransformers] = useState<
    TriggerAndTransformer[]
  >([]);
  const [selectedTransformer, setSelectedTransformer] =
    useState<TransformerPda | null>(null);
  const [isUpdateScript, setIsUpdateScript] = useState(false);
  const [script, setScript] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingScript, setIsUpdatingScript] = useState(false);

  const handleUpdateScript = async () => {
    if (!script) return;

    setIsUpdatingScript(true);
    try {
      await handleUpdateTransformerScript({
        indexerId,
        transformerId: selectedTransformer!.id,
        script,
      });
      toast.success("Script updated successfully");
    } catch (error) {
      toast.error("Failed to update script");
    } finally {
      setIsUpdatingScript(false);
      setSelectedTransformer(null);
      setIsUpdateScript(false);
    }
  };

  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await handleGetTriggersAndTransformers(
          indexerId,
          tableId
        );

        setTriggersAndTransformers(response ?? []);
      } catch (error) {
        console.error("Error getting triggers and transformers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getDetails();
  }, [tableId, isUpdatingScript]);

  if (isLoading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
      <div
        className={`bg-gray-900 text-white rounded-lg w-[800px] relative overflow-hidden shadow-lg`}
      >
        <div className="sticky top-0 bg-gray-900 z-10 p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Triggers & Transformers</h2>
          <button
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-200"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-auto h-[calc(100%-72px)]">
          <div>
            <h3 className="text-lg font-semibold mb-4">Triggers</h3>
            <ul className="space-y-3">
              {triggersAndTransformers.map((triggerAndTransformer, index) => (
                <li
                  key={index}
                  className="p-3 bg-gray-800 rounded-md shadow-sm flex justify-between items-center"
                >
                  <div className="flex items-center space-x-3">
                    <Tooltip.Provider>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <a
                            href={`https://solscan.io/account/${triggerAndTransformer.pdaPubkey}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline font-medium flex items-center"
                          >
                            <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded-md text-sm">
                              {triggerAndTransformer.pdaPubkey}
                            </span>
                          </a>
                        </Tooltip.Trigger>
                        <Tooltip.Content
                          className="bg-gray-700 text-gray-300 px-2 py-1 rounded-md text-sm shadow-md"
                          side="top"
                          align="center"
                        >
                          {triggerAndTransformer.pdaName}
                          <Tooltip.Arrow className="fill-gray-700" />
                        </Tooltip.Content>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                    <span className="text-sm text-gray-400">
                      {triggerAndTransformer.triggerType}
                    </span>
                  </div>
                  <button
                    className="text-blue-400 hover:underline text-sm"
                    onClick={() =>
                      setSelectedTransformer(
                        triggerAndTransformer.transformerPda
                      )
                    }
                  >
                    View Transformer
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {selectedTransformer && (
            <div className="mt-6">
              <div className="flex justify-between mb-4 text-right">
                <h4 className="text-lg font-semibold mb-2">
                  Transformer Script
                </h4>
                {!isUpdateScript ? (
                  <button
                    className="p-2 min-w-[74px] text-sm rounded-lg bg-[#6d2ef4]"
                    onClick={() => {
                      setIsUpdateScript(true);
                      setScript(selectedTransformer.script);
                    }}
                  >
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      className="p-2 min-w-[74px] text-sm rounded-lg border border-gray-50"
                      onClick={() => {
                        setIsUpdateScript(false);
                        setScript(null);
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      className={twJoin(
                        "p-2 min-w-[74px] text-sm rounded-lg",
                        script === selectedTransformer.script
                          ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                          : "bg-[#6d2ef4] hover:bg-[#824df3]"
                      )}
                      onClick={handleUpdateScript}
                      disabled={
                        script === selectedTransformer.script ||
                        isUpdatingScript
                      }
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>
              <div className="border border-gray-700 rounded-md overflow-hidden">
                <Editor
                  height="300px"
                  defaultLanguage="javascript"
                  value={selectedTransformer.script}
                  theme="vs-dark"
                  options={{
                    readOnly: !isUpdateScript,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                  }}
                  onChange={(value) => {
                    value && setScript(value);
                  }}
                />
              </div>
              <div className="mt-4 text-right">
                <button
                  className="text-sm text-red-400 hover:underline"
                  onClick={() => {
                    setSelectedTransformer(null);
                    setIsUpdateScript(false);
                    setScript(null);
                  }}
                >
                  Close Script
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TriggerAndTransformerModal;
