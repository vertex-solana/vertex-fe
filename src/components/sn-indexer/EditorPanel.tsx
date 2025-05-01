"use client";

import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { ExecuteQueryResponse, QueryLogResponse } from "@/models/app.model";
import { isNil } from "lodash";
import DataViewManager from "./DataViewmanager";
import { useAppContext } from "@/context";
import { useAppHooks } from "@/hooks";

const EditorPanel = () => {
  const { indexer } = useAppContext();
  const { handleExecuteQuery, handleGetAllQueryLogs } = useAppHooks();

  const [query, setQuery] = useState<string>(
    "SELECT * FROM table_name LIMIT 10"
  );
  const [queryLog, setQueryLog] = useState<QueryLogResponse[]>([]);
  const [result, setResult] = useState<ExecuteQueryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateQueryLogModalOpen, setIsCreateQueryLogModalOpen] =
    useState(false);

  useEffect(() => {
    const getAllQuery = async () => {
      const response = await handleGetAllQueryLogs(indexer!.id);

      setQueryLog(response ?? []);
    };

    getAllQuery();
  }, [isCreateQueryLogModalOpen]);

  const executeQuery = async () => {
    setIsLoading(true);
    try {
      const response = await handleExecuteQuery(query);
      setResult(response ?? null);
    } catch (error) {
      console.error("Error executing query:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuerySelection = (selectedQuery: string) => {
    setQuery(selectedQuery);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex flex-col pr-3">
        <h2 className="text-2xl font-bold mb-4">SQL Editor</h2>
        <div className="grid grid-cols-[70%_30%] gap-2">
          <Editor
            height="300px"
            defaultLanguage="sql"
            value={query}
            onChange={(value) => setQuery(value || "")}
            theme="vs-dark"
          />
          <div className="flex flex-col gap-3 items-end justify-start">
            <select
              id="query-log"
              className="p-2 border border-gray-300 rounded-md bg-gray-700 text-white"
              onChange={(e) => handleQuerySelection(e.target.value)}
              disabled={queryLog.length === 0}
            >
              <option value="">
                {queryLog.length > 0 ? "Select Query" : "No queries available"}
              </option>
              {queryLog.map((log) => (
                <option key={log.id} value={log.query}>
                  {log.description || log.query}
                </option>
              ))}
            </select>
            <Button onClick={executeQuery} disabled={isLoading}>
              {isLoading ? "Executing..." : "Run Query"}
            </Button>
          </div>
        </div>
        <div className="mt-4 flex-1 overflow-auto border-t border-gray-700 pl-3">
          {isNil(result) ? (
            <div></div>
          ) : (
            <DataViewManager
              responseQuery={result}
              currentQuery={query}
              isCreateQueryLogModalOpen={isCreateQueryLogModalOpen}
              setIsCreateQueryLogModalOpen={setIsCreateQueryLogModalOpen}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;
