"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import apiClient from "@/lib/api-client";
import { Logo } from "./logo";
import { Container } from "./container";

export function Navbar() {
  const [user, setUser] = useState<any>(null);

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      apiClient
        .get("/auth/me")
        .then((res) => setUser(res.data.data))
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav className="border-b border-neutral-200 dark:border-neutral-800 font-manrope">
      <Container className="py-4 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4">
        <div className="flex items-center gap-4 ">
          {navLinks.map((item, index) => <Link key={index} href={item.href} className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">{item.title}</Link>)}
        </div>
        <div className="flex items-center gap-4 border-l-2 border-neutral-300 dark:border-neutral-800 pl-4 py-0">
          <Link href="/login" className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">Login</Link>
          <Link href="/register" className="text-sm text-neutral-200 px-4 py-1 bg-foreground dark:bg-background dark:text-neutral-800 rounded-lg active:scale-[0.97]">Signup</Link>
          </div>
        </div>
      </Container>
    </nav>
  );
}
