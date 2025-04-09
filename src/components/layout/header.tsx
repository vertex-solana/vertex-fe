import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Link } from "wouter";
import Cookies from "js-cookie";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  isExternal?: boolean;
};

const navigationItems: NavItem[] = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how-it-works" },
  { label: "Use Cases", href: "#use-cases" },
  { label: "Pricing", href: "#pricing" },
  {
    label: "Docs",
    href: "https://docs.solindexprotocol.dev",
    isExternal: true,
  },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);

    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("accessToken");
    if (accessToken) {
      Cookies.set("token", accessToken, { expires: 7 });
      setIsLoggedIn(true);

      urlParams.delete("?accessToken");
      const newUrl = `${window.location.origin}${
        window.location.pathname
      }?${urlParams.toString()}`;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  // Effect to detect scroll and update header background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignIn = () => {
    window.location.href = "http://localhost:3000/api/auth/google/login";
  };

  const handleSignOut = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    router.refresh();
  };

  return (
    <header
      className={`top-0 z-50 w-full border-b transition-colors duration-200 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-sm border-border"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-primary mr-2">
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
            </div>
            <Link href="/">
              <a className="font-bold text-xl tracking-tight">
                Sol Index Protocol
              </a>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 text-sm font-medium">
            {navigationItems.map((item) =>
              item.isExternal ? (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  {item.label}
                </a>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition"
                >
                  {item.label}
                </a>
              )
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4 ">
            {isLoggedIn ? (
              <>
                <Button
                  size="lg"
                  className="group"
                  onClick={() => {
                    router.push("/indexer");
                  }}
                >
                  Create Indexer
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>

                <Button size="lg" className="group" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Button size="lg" className="group" onClick={handleSignIn}>
                Sign In with Google
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-8">
                  {navigationItems.map((item) => (
                    <SheetClose asChild key={item.label}>
                      {item.isExternal ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 text-foreground hover:text-primary transition"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <a
                          href={item.href}
                          className="px-4 py-2 text-foreground hover:text-primary transition"
                        >
                          {item.label}
                        </a>
                      )}
                    </SheetClose>
                  ))}
                  <div className="mt-4 border-t border-border pt-4">
                    <SheetClose asChild>
                      <a href="#early-access">
                        <Button className="w-full">Get Early Access</Button>
                      </a>
                    </SheetClose>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
