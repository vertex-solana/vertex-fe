import { Twitter, Github, MessageCircleCode } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background py-8 border-t border-border z-50 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-y-3">
            <div className="text-primary mr-2 flex items-center gap-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"></polygon>
                <line x1="12" y1="22" x2="12" y2="15.5"></line>
                <polyline points="22 8.5 12 15.5 2 8.5"></polyline>
                <line x1="2" y1="15.5" x2="12" y2="8.5"></line>
                <line x1="12" y1="8.5" x2="22" y2="15.5"></line>
              </svg>
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
