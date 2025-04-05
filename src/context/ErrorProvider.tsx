'use client';

import React, { useContext, useState } from 'react';
import { twJoin } from 'tailwind-merge';
import { CommonDialog } from '@/components/common';

const INITIAL_STATE = {} as any;

const ErrorContext = React.createContext(INITIAL_STATE);

export const useErrorContext = () => useContext(ErrorContext);

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [errorData, setErrorData] = useState(DEFAULT_ERROR_CONNECT_DATA);

  return (
    <ErrorContext.Provider
      value={{ errorData: errorData, setErrorData: setErrorData }}
    >
      {children}
      <ErrorDialog
        title={errorData.title}
        message={errorData.message}
        isOpen={Boolean(errorData.message)}
        onClose={() => setErrorData(DEFAULT_ERROR_CONNECT_DATA)}
      />
    </ErrorContext.Provider>
  );
};

interface ErrorProviderProps {
  children: React.ReactNode;
}

const DEFAULT_ERROR_CONNECT_DATA = {
  title: '',
  message: '',
};

const ErrorDialog: React.FC<ErrorConnectDialogProps> = ({
  isOpen,
  title,
  message,
  onClose,
}) => {
  return (
    <CommonDialog
      isOpen={isOpen}
      onClose={onClose}
      dialogTitle={title}
      titleClassName={twJoin('font-normal', 'text-lg text-neutral2')}
    >
      <p
        className={twJoin(
          'w-full',
          'mb-6 mt-8',
          'font-normal',
          'text-lg text-center',
        )}
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {message}
      </p>
    </CommonDialog>
  );
};

interface ErrorConnectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}
