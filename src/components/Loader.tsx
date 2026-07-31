"use client";
import { useEffect } from "react";

export default function Loader() {
  useEffect(() => {
    let frameId: number;
    const check = () => {
      const path = document.querySelector('path[data-loader="logo"]') as SVGPathElement;
      const text = document.querySelector('#lx0-text') as SVGTextElement;
      if (path && text) {
        text.style.opacity = window.getComputedStyle(path).opacity;
      }
      frameId = requestAnimationFrame(check);
    };
    frameId = requestAnimationFrame(check);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div dangerouslySetInnerHTML={{ __html: `<div data-loader="wrap" class="loader"><div class="loader_panel u-hflex-left-stretch"><div class="panel_inner"><div data-loader="panel-line" class="line is-panel-inner-l"></div></div><div data-loader="line-mid" class="line is-panel-l"></div></div><div class="loader_panel u-hflex-right-stretch"><div class="panel_inner"><div data-loader="panel-line" class="line is-pannel-inner-r"></div></div><div data-loader="line-mid" class="line is-panel-r"></div></div><div class="loader_logo"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" class="loader_svg"><g style="" transform="matrix(3.0810909271240234, 0, 0, 3.0810909271240234, -520.272705078125, -520.272705078125)"><circle cx="250" cy="250" r="75" stroke="currentColor" style="stroke-dasharray: 470.48;" fill="#FBF0DA" class="loader_circle"></circle><path d="M 284.045 267.921 C 279.542 268.136 278.089 269.716 275.983 272.015 C 270.246 267.993 265.525 264.186 260.223 256.788 C 256.01 251.042 252.597 244.722 250.709 237.898 L 250.128 237.898 C 250.128 249.031 250.273 260.092 250.636 271.225 C 250.709 272.589 251.072 278.694 251.072 279.772 C 251.072 282.286 248.53 283.219 247.585 283.219 C 245.552 283.219 245.552 281.926 245.552 281.424 C 245.552 280.418 246.06 275.965 246.06 275.103 C 246.351 268.783 246.278 266.125 246.496 242.064 C 244.172 246.517 240.468 253.771 231.68 262.39 C 225.869 268.136 220.277 271.44 216.791 273.451 L 216.5 272.877 C 228.702 262.534 238.943 249.677 244.099 237.898 L 228.266 237.898 C 225.724 237.898 221.657 238.186 218.897 238.688 L 217.227 235.6 C 222.674 236.031 227.903 236.174 229.283 236.174 L 246.496 236.174 C 246.496 228.489 245.77 222.815 245.625 221.738 C 245.479 220.66 245.261 220.014 244.39 217.5 L 252.016 219.368 C 252.67 219.511 252.815 219.87 252.815 220.229 C 252.815 221.163 252.452 221.379 250.273 222.672 C 250.127 224.826 250.2 234.235 250.128 236.174 L 270.754 236.174 L 273.659 232.727 C 273.877 232.44 274.458 231.865 274.821 231.865 C 275.257 231.865 275.765 232.368 276.201 232.727 L 279.832 236.031 C 280.268 236.39 280.559 236.749 280.559 237.108 C 280.559 237.755 279.905 237.898 279.469 237.898 L 251.58 237.898 C 253.178 241.561 259.424 253.556 270.1 260.738 C 270.899 261.313 278.38 266.341 284.045 267.346 L 284.045 267.921 Z" fill="transparent" stroke="transparent" data-loader="logo" class="loader_kanji"></path></g><text id="lx0-text" x="250" y="250" font-family="var(--font--secondary, serif)" font-size="40" font-weight="300" text-anchor="middle" dominant-baseline="middle" fill="#000000">LX0</text></svg></div></div>` }} />
  );
}
