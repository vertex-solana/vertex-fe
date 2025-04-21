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
              <span className="font-bold text-xl">Sol Index Protocol</span>
            </div>

            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} Sol Index Protocol. All rights
              reserved.
            </p>
          </div>
          <div className="flex flex-col gap-y-3 items-end">
            <p className="text-muted-foreground">
              Modular Indexing & Query Layer for Solana
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition"
              >
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition"
              >
                <span className="sr-only">GitHub</span>
                <Github className="h-6 w-6" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition"
              >
                <span className="sr-only">MessageCircleCode</span>
                <MessageCircleCode className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
