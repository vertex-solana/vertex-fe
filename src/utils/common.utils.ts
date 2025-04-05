import { ImageAssets } from "public";
import { AppConstant } from "@/const";
import { ApiResponse } from "apisauce";
import {
  EclipseSupportedTokenEnum,
  NetworkModeEnum,
  SolanaSupportedTokenEnum,
  SupportedChainEnum,
  SupportTokenType,
} from "@/models";
import { StaticImageData } from "next/image";
import { isEmpty } from "lodash";
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const uuid = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
    .replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
    .replace(/-/g, "");
};

export const checkEmailFormat = (email: string): boolean => {
  const regexEmail =
    /^(([^<>()[\]\\.,;:\s@\\"]+(\.[^<>()[\]\\.,;:\s@\\"]+)*)|(\\".+\\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.length && !regexEmail.test(email)) return false;
  else return true;
};

export const snakeToCamelCase = (str: string): string => {
  if (str.includes("_") || str.includes("-"))
    return str
      .toLowerCase()
      .replace(/([-_][a-z])/g, (group) =>
        group.toUpperCase().replace("-", "").replace("_", "")
      );

  return str;
};

export interface BaseResponseData<T> {
  statusCode: number;
  message?: string;
  error?: string;
  data: T;
}

export const getDappServicesResponseData = <T>(
  response: ApiResponse<BaseResponseData<T>>
): T | undefined => {
  const status = response?.status;
  const data = response?.data;

  if (!status || !data) return undefined;

  if (status >= 400 && status <= 500) return undefined;

  const statusCode = data.statusCode;

  if (statusCode >= 200 && statusCode <= 300) {
    return response.data?.data;
  } else {
    return undefined;
  }
};

export const getChainImageSrcByValue = (value: SupportedChainEnum) => {
  switch (value) {
    default:
      return "";
  }
};

export const truncateHash = (
  address?: string,
  startLength = 5,
  endLength = 5
) => {
  if (!address) return "";
  return `${address.substring(0, startLength)}...${address.substring(
    address.length - endLength
  )}`;
};

export const toHexString = (bytes: any) =>
  bytes.reduce(
    (str: any, byte: any) => str + byte.toString(16).padStart(2, "0"),
    ""
  );

export const getStorageAddressByChain = (chain: SupportedChainEnum) => {
  switch (chain) {
    case SupportedChainEnum.Solana:
      return {
        keyAddress: AppConstant.KEY_SOL_WALLET_ADDRESS,
        storageWalletAddress: localStorage.getItem(
          AppConstant.KEY_SOL_WALLET_ADDRESS
        ),
      };

    case SupportedChainEnum.Eclipse:
      return {
        keyAddress: AppConstant.KEY_ECLIPSE_WALLET_ADDRESS,
        storageWalletAddress: localStorage.getItem(
          AppConstant.KEY_ECLIPSE_WALLET_ADDRESS
        ),
      };

    case SupportedChainEnum.Sui:
      return {
        keyAddress: AppConstant.KEY_SUI_WALLET_ADDRESS,
        storageWalletAddress: localStorage.getItem(
          AppConstant.KEY_SUI_WALLET_ADDRESS
        ),
      };

    case SupportedChainEnum.Movement:
      return {
        keyAddress: AppConstant.KEY_MOVEMENT_WALLET_ADDRESS,
        storageWalletAddress: localStorage.getItem(
          AppConstant.KEY_MOVEMENT_WALLET_ADDRESS
        ),
      };

    case SupportedChainEnum.Soon:
      return {
        keyAddress: AppConstant.KEY_SOON_WALLET_ADDRESS,
        storageWalletAddress: localStorage.getItem(
          AppConstant.KEY_SOON_WALLET_ADDRESS
        ),
      };

    default:
      return {
        keyAddress: "",
        storageWalletAddress: "",
      };
  }
};

export const getStorageWalletAppByChain = (chain: SupportedChainEnum) => {
  switch (chain) {
    case SupportedChainEnum.Solana:
      return {
        keyWalletApp: AppConstant.KEY_SOL_WALLET_APP,
        storageWalletApp: localStorage.getItem(AppConstant.KEY_SOL_WALLET_APP),
      };

    case SupportedChainEnum.Eclipse:
      return {
        keyWalletApp: AppConstant.KEY_ECLIPSE_WALLET_APP,
        storageWalletApp: localStorage.getItem(
          AppConstant.KEY_ECLIPSE_WALLET_APP
        ),
      };

    case SupportedChainEnum.Soon:
      return {
        keyWalletApp: AppConstant.KEY_SOON_WALLET_APP,
        storageWalletApp: localStorage.getItem(AppConstant.KEY_SOON_WALLET_APP),
      };

    default:
      return {
        keyWalletApp: "",
        storageWalletApp: "",
      };
  }
};

export async function retry<T>(
  fn: () => Promise<T>,
  delay: number,
  maxRetries: number
): Promise<T> {
  return await recall(fn, delay, 0, maxRetries);
}

async function recall<T>(
  fn: () => T,
  delay: number,
  retries: number,
  maxRetries: number
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries > maxRetries) {
      throw err;
    }
    await wait(delay);
  }

  return await recall(fn, delay, retries + 1, maxRetries);
}

export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getTransactionHashInfoLink = (
  chain: SupportedChainEnum | undefined,
  transactionHash: string
) => {
  switch (chain) {
    case SupportedChainEnum.Solana:
      const solanaParams =
        process.env.NETWORK_MODE !== NetworkModeEnum.MAIN_NET
          ? `?cluster=${process.env.NETWORK_MODE}`
          : "";
      return `${process.env.NEXT_PUBLIC_SOLS_EXPLORER_URL}/tx/${transactionHash}/${solanaParams}`;

    case SupportedChainEnum.Eclipse:
      const eclipseParams =
        process.env.NETWORK_MODE === NetworkModeEnum.MAIN_NET
          ? ""
          : `?cluster=${NetworkModeEnum.TEST_NET}`;
      return `${process.env.NEXT_PUBLIC_ECLIPSE_EXPLORER_URL}/tx/${transactionHash}/${eclipseParams}`;

    case SupportedChainEnum.Soon:
      return `${process.env.NEXT_PUBLIC_SOON_EXPLORER_URL}/${transactionHash}`;

    case SupportedChainEnum.Sui:
      return `${
        process.env.NETWORK_MODE === NetworkModeEnum.MAIN_NET
          ? process.env.NEXT_PUBLIC_SUI_EXPLORER_URL
          : addSubdomain(
              process.env.NEXT_PUBLIC_SUI_EXPLORER_URL,
              NetworkModeEnum.TEST_NET
            )
      }/txblock/${transactionHash}`;

    case SupportedChainEnum.Movement:
      return `${process.env.NEXT_PUBLIC_APTOS_MOVEMENT_EXPLORER_URL}/${transactionHash}?network=${process.env.NETWORK_MODE}`;

    default:
      return "";
  }
};

export function addSubdomain(url?: string, subdomain?: string) {
  if (!url || !subdomain) return;
  if (url.endsWith("/")) {
    url = url.slice(0, -1);
  }

  const urlObj = new URL(url);
  const hostParts = urlObj.hostname.split(".");

  if (hostParts.length > 1) {
    if (hostParts.length === 2) {
      hostParts.unshift(subdomain);
    } else {
      hostParts.splice(1, 0, subdomain);
    }
    urlObj.hostname = hostParts.join(".");
  }

  return urlObj.toString();
}

export const stripIndent = (str: string) => {
  try {
    return str
      .split("\n")
      .map((l) => l.trim())
      .join("\n");
  } catch {
    return str;
  }
};

export const stringHashToNumber = (str: string) => {
  if (str.length === 0) return Math.floor(Math.random() * 100);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
    hash = hash % 10;
  }
  return hash;
};

export const getChainBaseToken = (chain: SupportedChainEnum) => {
  switch (chain) {
    case SupportedChainEnum.Solana:
      return SolanaSupportedTokenEnum.SOL;
    case SupportedChainEnum.Eclipse:
      return EclipseSupportedTokenEnum.ETH;
    default:
      return SolanaSupportedTokenEnum.SOL;
  }
};

export const getTokenImageSrcByValue = (value: SupportTokenType) => {
  switch (value) {
    case SolanaSupportedTokenEnum.SOL:
      return ImageAssets.SolTokenImage;

    case EclipseSupportedTokenEnum.ETH:
      return ImageAssets.EthTokenImage;

    default:
      return "";
  }
};

export const truncateEmail = (email: string): string => {
  return email.split("@")[0];
};

export const isMobile =
  typeof window !== "undefined" &&
  !isEmpty(
    window?.navigator?.userAgent.match(
      /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
    )
  );

function dec2hex(dec: number) {
  return ("0" + dec.toString(16)).substr(-2);
}

export function generateCodeVerifier() {
  var array = new Uint32Array(56 / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec2hex).join("");
}

function sha256(plain: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
}

function base64urlencode(array: ArrayBuffer) {
  var str = "";
  var bytes = new Uint8Array(array);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    str += String.fromCharCode(bytes[i]);
  }
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function generateCodeChallengeFromVerifier(plain: string) {
  var hashed = await sha256(plain);
  var base64encoded = base64urlencode(hashed);
  return base64encoded;
}
