"use client";

import { useEffect, useState } from "react";
import { axiosInstance } from "@/services/config";
import IndexerItem from "@/components/sn-indexer/IndexerItem";
import { GET_IDLS, GET_INDEXERS } from "@/const/api.const";
import { IdlDapp, IndexerResponse } from "@/models/app.model";
import { Button } from "@/components/ui/button";
import CreateIndexerModal from "@/components/sn-indexer/modals/CreateIndexerModal";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const Indexer = () => {
  const [indexers, setIndexers] = useState<IndexerResponse[]>([]);
  const [idls, setIdls] = useState<IdlDapp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIndexerId, setSelectedIndexerId] = useState<number | null>(
    null
  );
  const [isOpenCreateModal, setIsOpenCreateModal] = useState(false);

  useEffect(() => {
    const fetchIndexers = async () => {
      try {
        const response = await axiosInstance.get(GET_INDEXERS);
        const data = response?.data?.data;

        setIndexers(data || []);
      } catch (error) {
        console.error("Error fetching indexers:", error);
      } finally {
        setIsLoading(false);
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchIdls();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (selectedIndexerId) {
    return <IndexerItem indexerId={selectedIndexerId} />;
  }

  return (
    <div className="h-screen flex flex-col border-t border-gray-700 relative">
      {indexers.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          No indexers found. Please create one.
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {indexers?.map((indexer) => (
              <li key={indexer.id}>
                <Card
                  className="cursor-pointer hover:shadow-lg transition-shadow bg-slate-700"
                  onClick={() => setSelectedIndexerId(indexer.id)}
                >
                  <CardHeader>
                    <CardTitle>{indexer.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="truncate">Program ID: {indexer.programId}</p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Button
        className="w-[150px] fixed bottom-4 right-4 z-40"
        onClick={() => setIsOpenCreateModal(true)}
      >
        Create Indexer
      </Button>
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
