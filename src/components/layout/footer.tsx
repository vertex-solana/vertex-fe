'use client";';

import { Twitter, Github, MessageCircleCode } from "lucide-react";
import Image from "next/image";
import { ImageAssets } from "public";

export default function Footer() {
  return (
    <footer className="bg-background py-8 border-t border-border z-50 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-y-3">
            <div className=" mr-2 flex items-center gap-x-3">
              <Image
                src={ImageAssets.LogoImage}
                alt="logo image"
                className="w-6 h-6"
              />
              <span className="font-bold text-xl">Vertex</span>
            </div>

            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} Vertex. All rights reserved.
            </p>
          </div>
          <div className="flex flex-col gap-y-3 items-end">
            <p className="text-muted-foreground">
              Modular Indexing & Query Layer for Solana
            </p>
            <div className="flex space-x-4">
              <a
                href="https://x.com/vertex__sol"
                className="text-muted-foreground hover:text-foreground transition"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="https://github.com/vertex-solana"
                className="text-muted-foreground hover:text-foreground transition"
              >
                <span className="sr-only">GitHub</span>
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://t.me/+eYGNHuF2aTJkYWJl"
                className="text-muted-foreground hover:text-foreground transition"
              >
                <span className="sr-only">Telegram</span>
                <MessageCircleCode className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
