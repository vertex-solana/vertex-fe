"use client";

import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface CreateTriggerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const modalInfo = {
  title: "Create Trigger",
  description: "Create a new trigger in the database.",
};

const CreateTriggerModal = ({ isOpen, onClose }: CreateTriggerModalProps) => {
  const [triggerName, setTriggerName] = useState("");

  const handleCreate = () => {
    // TODO: Implement trigger creation logic
    console.log("Creating trigger:", triggerName);
    onClose();
  };

  return (
    <Modal
      title={modalInfo.title}
      description={modalInfo.description}
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="space-y-4">
        <Input
          placeholder="Trigger Name"
          value={triggerName}
          onChange={(e) => setTriggerName(e.target.value)}
        />
        <Button onClick={handleCreate}>Create</Button>
      </div>
    </Modal>
  );
};

export default CreateTriggerModal;
