import {
  AppProvider,
  AuthProvider,
  HomeProvider,
  SolanaProvider,
} from "@/context";

import { ErrorProvider } from "@/context/ErrorProvider"; // Direct import

import { twJoin } from "tailwind-merge";
import { Inter, Kumbh_Sans, Fugaz_One } from "next/font/google";

import MainLayout from "@/components/layout/main-layout";

import "./globals.css";
import GoogleAnalytics from "@/components/common/GoogleAnalytics";
import { ThemeProvider } from "@/context/ThemeProvider";
import { ModalProvider } from "@/context/ModalProvider";
import { ToasterProvider } from "@/context/ToastProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const kumbhSans = Kumbh_Sans({
  subsets: ["latin"],
  variable: "--font-kumbhSans",
});

const fugazOne = Fugaz_One({
  subsets: ["latin"],
  variable: "--font-fugaz-one",
  weight: "400",
});

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <GoogleAnalytics />
      <body
        id="body"
        className={twJoin(
          inter.variable,
          kumbhSans.variable,
          fugazOne.variable,
        )}
        suppressHydrationWarning={true}
      >
        <AppProvider>
          <SolanaProvider>
            <AuthProvider>
              <HomeProvider>
                <ErrorProvider>
                  <MainLayout>
                    <ThemeProvider
                      attribute="class"
                      defaultTheme="system"
                      enableSystem
                    >
                      <ToasterProvider />
                      <ModalProvider />
                      {children}
                    </ThemeProvider>
                  </MainLayout>
                </ErrorProvider>
              </HomeProvider>
            </AuthProvider>
          </SolanaProvider>
        </AppProvider>
      </body>
    </html>
  );
}

interface RootLayoutProps {
  children: React.ReactNode;
}

declare global {
  interface Window {
    backpack?: any;
    phantom?: {
      solana: any;
    };
    solflare?: any;
  }
}
