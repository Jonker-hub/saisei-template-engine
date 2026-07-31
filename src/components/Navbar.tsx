"use client";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsHidden(true);
      } else if (currentScrollY < lastScrollY) {
        setIsHidden(false);
      }
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="nav" style={{ 
      transform: isHidden ? "translateY(-100%)" : "translateY(0)", 
      transition: "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)"
    }}><div className="nav_container u-container u-grid-custom"><div id="w-node-_2f9d6796-df40-8ea0-228b-6e8c39ea93c9-39ea93c7" className="nav_logo_wrap"><a aria-label="home logo link" href="/" aria-current="page" className="nav_logo u-overflow-clip w-inline-block w--current"><div className="nav_logo_text" data-loader="nav-logo" style={{ fontFamily: "var(--font--secondary, serif)", fontSize: "clamp(1.2rem, 2.5vw, 1.8rem)", fontWeight: 300, textTransform: "uppercase", color: "var(--theme--text)", letterSpacing: "0.08em", whiteSpace: "nowrap" }}>LX2</div></a></div><div className="nav_item_wrap u-column-custom u-hflex-between-center"><div className="nav_est u-text-small u-weight-medium"><div aria-label="microtext 0b" data-loader="nav-est">Microtext 0B</div></div>{/* $ */}<button type="button" data-menu="openbtn" aria-label="Open navigation menu" className="nav_button_wrap u-vflex-center-center u-gap-xsmall"><div className="nav_btn_line"><div data-loader="nav-btn-line" className="line btn-rel"></div><div className="line btn-abs"></div></div><div className="nav_btn_line"><div data-loader="nav-btn-line" className="line btn-rel"></div><div className="line btn-abs"></div></div></button>{/* /$ */}</div><div className="line_wrapper is-abs"><div data-loader="nav-line" className="line"></div></div></div></nav>
  );
}
