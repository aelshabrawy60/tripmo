"use client";

import { useEffect } from "react";
import Clarity from "@microsoft/clarity";

export default function ClarityProvider() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_CLARITY_ID) {
      // Load Clarity without blocking rendering
      requestIdleCallback(() => {
        Clarity.init(process.env.NEXT_PUBLIC_CLARITY_ID);
      });
    }
  }, []);

  return null;
}
