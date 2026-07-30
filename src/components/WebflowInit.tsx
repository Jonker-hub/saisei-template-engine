"use client";
import { useEffect } from "react";

export default function WebflowInit() {
  useEffect(() => {
    // Check if script is already injected
    if (document.querySelector('script[src="/assets/js/main-7d8c06d6.js"]')) {
      return;
    }

    const script = document.createElement("script");
    script.src = "/assets/js/main-7d8c06d6.js";
    script.type = "module";
    script.onload = () => {
      console.log("Webflow script loaded. Dispatching initialization events...");
      document.dispatchEvent(new Event("DOMContentLoaded", { bubbles: true, cancelable: true }));
      window.dispatchEvent(new Event("load", { bubbles: true, cancelable: true }));
      
      // Some Webflow scripts push initialization functions to an array instead of running them.
      // We manually execute them here.
      setTimeout(() => {
        const wWebflow = (window as any).Webflow;
        if (wWebflow && Array.isArray(wWebflow)) {
          console.log("Executing Webflow queue...", wWebflow.length);
          wWebflow.forEach(fn => typeof fn === "function" && fn());
        }
      }, 100);
    };
    script.onerror = (e) => {
      console.error("Failed to load Webflow script", e);
    };
    
    document.body.appendChild(script);
  }, []);

  return null;
}
