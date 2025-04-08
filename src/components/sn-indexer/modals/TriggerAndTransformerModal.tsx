"use client";

import { FC, useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import { TriggerAndTransformer } from "@/models/app.model";
import * as Tooltip from "@radix-ui/react-tooltip";

const dummyData = [
  {
    triggerType: "WS",
    pdaPubkey: "D6q6wuQSrifJKZYpR1M8R4YawnLDtDsMmWM1NbBmgJ59",
    pdaName: "reserve",
    transformerPdaId: 7,
    transformerPda: {
      script:
        "function execute(pdaParser) {\n  const marketPrice = new utils.kamino.Fraction(pdaParser.liquidity.marketPriceSf);\n\n  return {\n    action: 'INSERT',\n    data: {\n      liquidity_available: new utils.common.BN(pdaParser.liquidity.availableAmount).toString(),\n      reserve_address: '711717171717171717'\n    }\n  }\n}",
    },
    indexerTableId: 6,
    indexerId: 1,
  },
  {
    triggerType: "WS",
    pdaPubkey: "D6q6wuQSrifJKZYpR1M8R4YawnLDtDsMmWM1NbBmgJ59",
    pdaName: "reserve",
    transformerPdaId: 7,
    transformerPda: {
      script:
        "function execute(pdaParser) {\n  const marketPrice = new utils.kamino.Fraction(pdaParser.liquidity.marketPriceSf);\n\n  return {\n    action: 'INSERT',\n    data: {\n      liquidity_available: new utils.common.BN(pdaParser.liquidity.availableAmount).toString(),\n      reserve_address: '711717171717171717'\n    }\n  }\n}",
    },
    indexerTableId: 6,
    indexerId: 1,
  },
];

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
  const [triggersAndTransformers, setTriggersAndTransformers] = useState<
    TriggerAndTransformer[]
  >([]);
  const [selectedScript, setSelectedScript] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const triggersAndTransformersResponse = await axios.get(
          `http://localhost:3000/api/indexers/${indexerId}/tables/${tableId}/trigger-transformer`
        );
        const data = triggersAndTransformersResponse?.data
          ?.data as TriggerAndTransformer[];

        setTriggersAndTransformers(data || []);
      } catch (error) {
        console.error("Error fetching triggers and transformers:", error);

        // Dummy data for development
        setTriggersAndTransformers(dummyData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [tableId]);

  if (isLoading) {
    return <div className="text-white text-center">Loading...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center">
      <div
        className={`bg-gray-900 text-white rounded-lg w-[800px] ${
          selectedScript ? "h-[600px]" : "h-auto"
        } relative overflow-hidden shadow-lg`}
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
                      setSelectedScript(
                        triggerAndTransformer.transformerPda.script
                      )
                    }
                  >
                    View Transformer
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {selectedScript && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-2">Transformer Script</h4>
              <div className="border border-gray-700 rounded-md overflow-hidden">
                <Editor
                  height="300px"
                  defaultLanguage="javascript"
                  value={selectedScript}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                  }}
                />
              </div>
              <div className="mt-4 text-right">
                <button
                  className="text-sm text-red-400 hover:underline"
                  onClick={() => setSelectedScript(null)}
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
