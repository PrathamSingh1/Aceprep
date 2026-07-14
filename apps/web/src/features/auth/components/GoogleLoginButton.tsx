"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: any;
  }
}

export function GoogleLoginButton() {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(buttonRef.current!, {
          theme: "outline",
          size: "large",
          width: "100%",
        });
      }
    };
    document.body.appendChild(script);
  }, []);

  const handleGoogleResponse = async (response: any) => {
    try {
      const { authApi } = await import("../lib/api");
      const res = await authApi.googleLogin(response.credential);
      localStorage.setItem("token", res.data.data.token);
      window.location.href = "/questions";
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  return <div ref={buttonRef} />;
}
