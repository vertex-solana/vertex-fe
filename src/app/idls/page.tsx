"use client";

import { Button } from "@/components/ui/button";
import { GET_IDLS } from "@/const/api.const";
import { useStoreModal } from "@/hooks/use-store-modal";
import { IdlDapp } from "@/models/app.model";
import { axiosInstance } from "@/services/config";
import { useEffect, useState } from "react";
import IdlView from "@/components/sn-idl/modal/IdlView";
import { UploadIdlModal } from "@/components/sn-idl/modal/UploadIdlModal";

const IDL = () => {
  const onOpen = useStoreModal((state) => state.onOpen);

  const [idls, setIdls] = useState<IdlDapp[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIdl, setSelectedIdl] = useState<IdlDapp | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    const fetchIdls = async () => {
      try {
        const response = await axiosInstance.get(GET_IDLS);
        const data = response?.data?.data;
        if (data.length === 0) {
          onOpen();
        } else {
          setIdls(data || []);
        }
      } catch (error) {
        console.error("Error fetching Idl:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchIdls();
  }, [onOpen, isUploadModalOpen]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleCardClick = (idl: IdlDapp) => {
    setSelectedIdl(idl);
  };

  const handleCloseModal = () => {
    setSelectedIdl(null);
  };

  return (
    <div className="h-screen flex flex-col p-4 border-t border-gray-700 relative">
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {idls.map((idl) => (
            <div
              key={idl.id}
              className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow bg-slate-800 cursor-pointer"
              onClick={() => handleCardClick(idl)}
            >
              <h2 className="text-lg font-semibold">{idl.name}</h2>
              <p className="text-sm">Version: {idl.version}</p>
              <p className="text-sm">Program ID: {idl.programId}</p>
            </div>
          ))}
        </div>
      </div>
      <Button
        className="w-[100px] fixed bottom-4 right-4 z-40"
        onClick={() => setIsUploadModalOpen(true)}
      >
        Upload IDL
      </Button>
      {selectedIdl && (
        <IdlView idl={selectedIdl.idlJson} onClose={handleCloseModal} />
      )}
      <UploadIdlModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
};

export default IDL;
