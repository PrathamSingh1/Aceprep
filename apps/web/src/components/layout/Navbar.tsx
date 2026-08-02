"use client";

import Link from "next/link";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Logo } from "./logo";
import { Container } from "./container";
import { ThemeToggle } from "../theme/theme-toggle";

export function Navbar() {
  const { user, loading, logout } = useAuth();

  const navLinks = [
    {
    title: "Questions",
    href: "/questions"
    },
    {
    title: "Companies",
    href: "/companies"
    },
    {
    title: "Experiences",
    href: "/experiencs"
    },
    {
    title: "Resources",
    href: "/resources"
    },
    {
    title: "Pricing",
    href: "/pricing"
    }
  ];

  return (
    <nav className="border-b border-neutral-200 dark:border-neutral-800 font-manrope">
      <Container className="py-4 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 ">
          {navLinks.map((item, index) => <Link key={index} href={item.href} className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">{item.title}</Link>)}
        </div>
        <div className="flex items-center gap-4 border-l-2 border-neutral-300 dark:border-neutral-800 pl-4 py-0">
          {loading ? null : user ? (
            <>
              <span className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">{user.name || user.email}</span>
              <button onClick={logout} className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Login</Link>
              <Link href="/register" className="text-sm text-neutral-200 px-4 py-1 bg-foreground dark:text-neutral-800 dark:font-medium rounded-lg active:scale-[0.97] hover:shadow-brand dark:hover:shadow-brand transition-all duration-200">Signup</Link>
            </>
          )}
          </div>
          <div>
              <ThemeToggle />
          </div>
        </div>
      </Container>
    </nav>
  );
}
