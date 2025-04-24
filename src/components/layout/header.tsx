import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { twJoin } from "tailwind-merge";
import { jwtDecode } from "jwt-decode";
import { useAppService } from "@/hooks";
import Image from "next/image";
import { ImageAssets } from "public";

type NavItem = {
  label: string;
  href: string;
  isExternal?: boolean;
};

const navigationIndexer: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "IDL", href: "/idls" },
];

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { handleGetUserInfo } = useAppService();
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

      urlParams.delete("accessToken");
      const newUrl = `${window.location.origin}${window.location.pathname}${
        urlParams.toString() ? `?${urlParams.toString()}` : ""
      }`;
      window.history.replaceState({}, document.title, newUrl);
    }
  }, []);

  useEffect(() => {
    const fetchUserInfo = async (token: string) => {
      try {
        const decoded: { sub: string } = jwtDecode(token);
        const accountId = parseInt(decoded.sub);

        await handleGetUserInfo(accountId);
      } catch (error) {
        console.error("Failed to decode token or fetch user info:", error);
      }
    };

    const token = Cookies.get("token");
    if (isLoggedIn && token) {
      fetchUserInfo(token);
    }
  }, [isLoggedIn]);

  const handleSignIn = () => {
    window.location.href = `${process.env.SERVICE_URL}/auth/google/login`;
  };

  const handleSignOut = () => {
    Cookies.remove("token");
    setIsLoggedIn(false);
    router.push("/");
    window.location.reload();
  };

  return (
    <header
      className={`fixed top-0 z-20 w-full border-b transition-colors duration-200 bg-background backdrop-blur-sm border-border`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center gap-x-1.5">
            <Image
              src={ImageAssets.LogoImage}
              alt="logo image"
              className="w-6 h-6"
            />
            <div
              className="font-bold text-xl tracking-tight cursor-pointer"
              onClick={() => router.push("/")}
            >
              Vertex
            </div>
          </div>

          <div>
            <nav className="hidden md:flex space-x-8 text-sm font-medium">
              {navigationIndexer.map((item) => (
                <div
                  key={item.label}
                  onClick={() => router.push(item.href)}
                  className={twJoin(
                    " hover:text-foreground transition hover:cursor-pointer",
                    item.href === pathName
                      ? "text-[#642bdf]"
                      : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </div>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4 ">
            {isLoggedIn ? (
              <Button size="lg" className="group" onClick={handleSignOut}>
                Sign Out
              </Button>
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
                  {navigationIndexer.map((item) => (
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
