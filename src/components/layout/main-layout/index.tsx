"use client";

import React, {
  ComponentPropsWithoutRef,
  FC,
  useEffect,
  useState,
} from "react";

import Header from "../header";
import Footer from "../footer";
import { usePathname } from "next/navigation";
import { twJoin } from "tailwind-merge";
import { useAppContext } from "@/context";
import { Modal } from "@/components/ui/Modal";
import { axiosInstance } from "@/services/config";
import { UPDATE_USERNAME } from "@/const/api.const";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";

interface UpdateUserNameProps {
  isOpen: boolean;
  onClose: () => void;
}

const UpdateUserName: FC<UpdateUserNameProps> = ({ isOpen, onClose }) => {
  const [userName, setUserName] = useState("");
  const { setUserInfo } = useAppContext();

  const onUpdateUserName = async () => {
    try {
      const response = await axiosInstance.patch(UPDATE_USERNAME, {
        userName,
      });
      setUserInfo(response.data.data);
      onClose();
      toast.success("User name updated successfully!");
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  return (
    <Modal
      title="Update User Name"
      description=""
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="flex flex-col gap-4">
        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2"
          placeholder="Enter your user name"
        />
        <Button
          onClick={() => {
            onUpdateUserName();
          }}
        >
          Update
        </Button>
      </div>
    </Modal>
  );
};

const MainLayout: FC<ComponentPropsWithoutRef<"div">> = ({
  children,
  className,
  ...otherProps
}) => {
  const pathName = usePathname();

  const [isOpenModal, setIsOpenModal] = useState(false);
  const { userInfo } = useAppContext();

  useEffect(() => {
    if (userInfo && !userInfo.isUpdatedUserName) {
      setIsOpenModal(true);
    }
  }, [userInfo]);

  return (
    <div className="min-h-screen">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(139,92,246,0.3)_0%,transparent_30%),radial-gradient(circle_at_90%_80%,rgba(59,130,246,0.3)_0%,transparent_30%)] -z-[1]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(rgba(148,163,184,0.1)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30 -z-[1]"></div>
      <Header />

      <Toaster />

      <div
        className={twJoin(
          "z-[10]",
          "max-w-full",
          "min-h-screen",
          "overflow-x-hidden",
          "mx-auto pt-[76px]",
          "relative flex flex-col",
          pathName !== "/" && "sm:max-w-[1376px]"
        )}
      >
        {children}
      </div>
      {pathName === "/" && <Footer />}
      {!userInfo?.isUpdatedUserName && (
        <UpdateUserName
          isOpen={isOpenModal}
          onClose={() => setIsOpenModal(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
