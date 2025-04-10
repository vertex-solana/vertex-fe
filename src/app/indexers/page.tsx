"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/services/config";
import IndexerItem from "@/components/sn-indexer/IndexerItem";
import { GET_INDEXERS } from "@/const/api.const";

const Indexer = () => {
  const onOpen = useStoreModal((state) => state.onOpen);
  const isOpen = useStoreModal((state) => state.isOpen);
  const [indexers, setIndexers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndexerId, setSelectedIndexerId] = useState<number | null>(
    null
  );

  useEffect(() => {
    const fetchIndexers = async () => {
      try {
        const response = await axiosInstance.get(GET_INDEXERS);
        const data = response?.data?.data;
        if (data.length === 0) {
          onOpen();
        } else {
          setIndexers(data || []);
        }
      } catch (error) {
        console.error("Error fetching indexers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchIndexers();
  }, [onOpen]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (selectedIndexerId) {
    return <IndexerItem indexerId={selectedIndexerId} />;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      {indexers.length === 0 ? (
        <div>No indexers found. Please create one.</div>
      ) : (
        <ul className="space-y-4">
          {indexers?.map((indexer) => (
            <li
              key={indexer.id}
              className="p-4 border rounded shadow bg-slate-800 cursor-pointer"
              onClick={() => setSelectedIndexerId(indexer.id)}
            >
              <h3 className="font-bold">{indexer.name}</h3>
              <p>ID: {indexer.id}</p>
              <p>Program ID: {indexer.programId}</p>
              <p>Version: {indexer.version}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Indexer;
