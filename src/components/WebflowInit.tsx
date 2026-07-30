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
        // Set dynamic data-page attribute for animations based on current path
        const path = window.location.pathname;
        let page = "home";
        if (path.includes("about-us")) page = "about";
        else if (path.includes("contact-us")) page = "contact";
        else if (path.includes("journal")) page = "blog";
        else if (path.includes("post/")) page = "blog-post";
        else if (path.includes("project/")) page = "project-detail";
        else if (path.includes("project")) page = "project";
        else if (path.includes("service")) page = "service";
        else if (path.includes("sustainability")) page = "sustainability";
        else if (path.includes("privacy-policy")) page = "terms";
        else if (path.includes("terms-of-service")) page = "terms";
        document.body.setAttribute("data-page", page);
        
        const wWebflow = (window as any).Webflow;
        if (wWebflow && Array.isArray(wWebflow)) {
          console.log("Executing Webflow queue...", wWebflow.length);
          wWebflow.forEach(fn => {
            if (typeof fn === "function") {
              try {
                fn();
              } catch (e) {
                console.warn("Webflow init function failed (likely missing element on this page):", e);
              }
            }
          });
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
