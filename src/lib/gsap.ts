"use client";

import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { log } from "../logger";

const gsapLog = log.child("gsap");

let registered = false;

export function setupGsap(): typeof gsap {
  if (!registered) {
    gsap.registerPlugin(ScrollToPlugin);
    gsap.defaults({ ease: "power3.out" });
    gsap.config({ force3D: true, nullTargetWarn: false });
    registered = true;
    gsapLog.info("plugins registered", { plugins: ["ScrollToPlugin"] });
  }
  return gsap;
}

export { gsap };
