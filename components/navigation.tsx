"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Search, User, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart } from "@/components/shopping-cart";
import { MessagingTrigger } from "@/components/messaging-trigger";

export function Navigation() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BC</span>
            </div>
            <span className="hidden font-bold sm:inline-block">
              BuildConnect India
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-foreground/80 text-foreground">
                Find Services <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/contractors">Find Contractors</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/services">Browse Services</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/post-project">Post Project</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-foreground/80 text-foreground">
                Buy Materials <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/materials">All Materials</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wishlist">My Wishlist</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">Track Orders</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/projects"
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              Projects
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 transition-colors hover:text-foreground/80 text-foreground">
                Join Us <ChevronDown className="h-3 w-3" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link href="/join-as-contractor">Become Contractor</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/join-as-vendor">Become Vendor</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/vendor-dashboard">Vendor Dashboard</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <nav className="grid gap-6 px-2 py-6">
              <Link href="/contractors" className="hover:text-foreground/80">
                Find Contractors
              </Link>
              <Link href="/materials" className="hover:text-foreground/80">
                Buy Materials
              </Link>
              <Link href="/projects" className="hover:text-foreground/80">
                Projects
              </Link>
              <Link href="/services" className="hover:text-foreground/80">
                Services
              </Link>
              <Link href="/orders" className="hover:text-foreground/80">
                My Orders
              </Link>
              <Link href="/wishlist" className="hover:text-foreground/80">
                Wishlist
              </Link>
              <Link
                href="/join-as-contractor"
                className="hover:text-foreground/80"
              >
                Become Contractor
              </Link>
              <Link href="/join-as-vendor" className="hover:text-foreground/80">
                Become Vendor
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contractors, materials..."
                className="pl-8 md:w-[300px] lg:w-[400px]"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MessagingTrigger
              currentUserId={isLoggedIn ? "user-123" : undefined}
              unreadCount={3}
            />
            <ShoppingCart />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hidden md:flex">
                  <User className="mr-2 h-4 w-4" />
                  {isLoggedIn ? "My Account" : "Login"}
                  <ChevronDown className="ml-2 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isLoggedIn ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">My Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders">My Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/projects">My Projects</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/wishlist">Wishlist</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => setIsLoggedIn(true)}>
                      Login
                    </DropdownMenuItem>
                    <DropdownMenuItem>Register</DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
