"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { setupGsap } from "../lib/gsap";
import { SpotWalk } from "./SpotWalk";

const ink = "#c4a57a";
const inkDark = "#9e734c";
const inkMid = "#b38b62";
const cream = "#f4eee4";
const slotLite = "#dcc7a6";

type MarkProps = { id: string };

export function FloorVisual({ id }: MarkProps) {
  if (id === "floor") return <StakeFlowMark />;
  if (id === "ledger") return <RackMark />;
  if (id === "gpu") return <GpuMark />;
  if (id === "robots") return <SpotWalk />;
  return <ExitMark />;
}

function Fan({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const rays = Array.from({ length: 52 }, (_, i) => {
    const a = (i / 52) * Math.PI * 2;
    const inner = r * 0.4;
    const outer = r * 0.97;
    return (
      <line
        key={i}
        x1={cx + Math.cos(a) * inner}
        y1={cy + Math.sin(a) * inner}
        x2={cx + Math.cos(a) * outer}
        y2={cy + Math.sin(a) * outer}
        stroke={ink}
        strokeWidth={r * 0.028}
        strokeLinecap="round"
      />
    );
  });
  return (
    <g className="fv-fan">
      <circle cx={cx} cy={cy} r={r} fill={cream} />
      {rays}
      <circle cx={cx} cy={cy} r={r * 0.2} fill={ink} />
    </g>
  );
}

function Grill({ x, y, w }: { x: number; y: number; w: number }) {
  const n = Math.floor(w / 6.2);
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <rect
          key={i}
          x={x + i * 6.2}
          y={y}
          width="3.1"
          height="16"
          rx="0.5"
          fill={ink}
        />
      ))}
    </g>
  );
}

function GpuUnit({ x }: { x: number }) {
  const fins = Array.from({ length: 16 }, (_, i) => (
    <rect
      key={i}
      x={26 + i * 11.2}
      y={26}
      width="5.4"
      height="100"
      rx="1.2"
      fill={i % 2 ? inkDark : inkMid}
    />
  ));
  const fingers = Array.from({ length: 32 }, (_, i) => (
    <rect key={i} x={58 + i * 8.2} y="150" width="5" height="12" rx="0.6" fill={slotLite} />
  ));
  const pins = Array.from({ length: 8 }, (_, i) => (
    <circle
      key={i}
      cx={400 + (i % 4) * 6}
      cy={20 + Math.floor(i / 4) * 8}
      r="1.7"
      fill={cream}
    />
  ));
  return (
    <g transform={`translate(${x} 8)`}>
      <rect x="-16" y="12" width="18" height="128" rx="2" fill={inkDark} />
      <circle cx="-7" cy="22" r="2.2" fill={slotLite} />
      <circle cx="-7" cy="132" r="2.2" fill={slotLite} />
      <rect x="-12" y="32" width="11" height="16" rx="1.5" fill={cream} />
      <rect x="-12" y="54" width="11" height="9" rx="1.2" fill={cream} />
      <rect x="-12" y="68" width="11" height="9" rx="1.2" fill={cream} />
      <rect x="-12" y="84" width="11" height="14" rx="1.5" fill={inkMid} />

      <rect x="2" y="8" width="428" height="140" rx="8" fill={ink} />
      <rect x="16" y="20" width="214" height="112" rx="5" fill={slotLite} />
      {fins}

      <circle cx="338" cy="76" r="60" fill={inkDark} />
      <circle cx="338" cy="76" r="60" fill="none" stroke={inkMid} strokeWidth="5" />
      <Fan cx={338} cy={76} r={52} />
      <circle cx="338" cy="76" r="60" fill="none" stroke={ink} strokeWidth="1.4" />

      <rect x="392" y="12" width="32" height="26" rx="3" fill={inkDark} />
      {pins}
      <rect x="396" y="42" width="24" height="10" rx="2" fill={inkMid} />

      <circle cx="22" cy="30" r="3.2" fill={cream} />
      <rect x="48" y="148" width="300" height="16" rx="1" fill={inkDark} />
      {fingers}
    </g>
  );
}

function GpuMark() {
  return (
    <svg
      className="floor-visual"
      viewBox="0 0 520 220"
      preserveAspectRatio="xMinYMax slice"
      aria-hidden="true"
    >
      <g className="fv-belt">
        <GpuUnit x={0} />
        <GpuUnit x={448} />
      </g>
    </svg>
  );
}

function StakeFlowMark() {
  const root = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = root.current;
    if (!svg) return;
    const gsap = setupGsap();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const chips = svg.querySelectorAll(".fv-chip");
      const arrows = svg.querySelectorAll(".fv-flow");
      const dollar = svg.querySelector(".fv-dollar");
      const shoulder = svg.querySelector(".fv-bot-sh");
      const elbow = svg.querySelector(".fv-bot-el");
      const jaws = svg.querySelectorAll(".fv-bot-jaw");

      if (reduced) return;

      gsap.set(chips, { y: -28, opacity: 0, scale: 0.72, transformOrigin: "50% 50%" });
      gsap.set(arrows, { strokeDasharray: "6 8", strokeDashoffset: 0 });

      const intro = gsap.timeline();
      intro.to(chips, {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.55,
        stagger: 0.1,
        ease: "back.out(1.7)",
      });

      gsap.to(chips, {
        y: -5,
        duration: 1.6,
        stagger: 0.12,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 0.7,
      });

      gsap.to(dollar, {
        scale: 1.04,
        transformOrigin: "50% 50%",
        duration: 1.4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      gsap.to(arrows, {
        strokeDashoffset: -28,
        duration: 1.05,
        repeat: -1,
        ease: "none",
      });

      gsap.to(shoulder, {
        rotation: 14,
        transformOrigin: "0px 0px",
        duration: 1.9,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      gsap.to(elbow, {
        rotation: -20,
        transformOrigin: "0px 0px",
        duration: 1.9,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      gsap.to(jaws, {
        x: 5,
        duration: 0.7,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        stagger: 0.08,
      });
    }, svg);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={root}
      className="floor-visual floor-visual--flow"
      viewBox="0 0 1020 220"
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
    >
      {/*
        Reading order is the causal order: capital comes in, it buys machine
        time, and the yield is what those machines billed. An earlier version
        put yield in the middle, which read as though the yield were funding
        the hardware rather than coming out of it.
      */}
      <Bucket x={36} y={42} label="Assets" />
      <g transform="translate(36 42)">
        <g transform="translate(78 12)">
          <g className="fv-chip">
            <AssetTesla />
          </g>
        </g>
        <g transform="translate(22 46)">
          <g className="fv-chip">
            <AssetNvidia />
          </g>
        </g>
        <g transform="translate(128 50)">
          <g className="fv-chip">
            <AssetGold />
          </g>
        </g>
        <g transform="translate(70 86)">
          <g className="fv-chip">
            <AssetBtc />
          </g>
        </g>
      </g>

      <FlowArrow x={250} y={118} />

      <Bucket x={270} y={42} w={400} label="GPU and Robots" />
      <g transform="translate(325 84) scale(0.44)">
        <GpuUnit x={0} />
      </g>
      <g transform="translate(547 28) scale(0.72)">
        <FlowRobot />
      </g>

      <FlowArrow x={726} y={118} />

      <Bucket x={790} y={40}>
        <text
          x="108"
          y="147"
          textAnchor="middle"
          fill="#5c4a36"
          fontFamily="Inter Tight, system-ui, sans-serif"
          fontSize="11"
          fontWeight="600"
        >
          yield{" "}
          <tspan
            fill="#3d3228"
            fontFamily="Syne, sans-serif"
            fontSize="16"
            fontWeight="700"
            letterSpacing="-0.04em"
          >
            13.12%
          </tspan>{" "}
          net
        </text>
      </Bucket>
      <g transform="translate(820 40)">
        <g className="fv-dollar">
          <circle cx="78" cy="92" r="38" fill={ink} />
          <circle cx="78" cy="92" r="32" fill="none" stroke={cream} strokeWidth="2.2" />
          <circle cx="78" cy="92" r="27" fill={inkDark} />
          <line x1="78" y1="70" x2="78" y2="114" stroke={cream} strokeWidth="3.2" strokeLinecap="round" />
          <path
            d="M90 80c0-6-5-10-12-10s-12 4-12 9c0 10 24 6 24 16 0 6-5 10-12 10s-12-4-12-9"
            fill="none"
            stroke={cream}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
        </g>
      </g>

    </svg>
  );
}

function FlowRobot() {
  return (
    <g>
      <rect x="28" y="156" width="84" height="20" rx="5" fill={inkDark} />
      <rect x="36" y="150" width="68" height="12" rx="4" fill={ink} />
      <circle cx="42" cy="166" r="3" fill={slotLite} />
      <circle cx="98" cy="166" r="3" fill={slotLite} />
      <rect x="58" y="128" width="24" height="26" rx="4" fill={inkMid} />
      <rect x="62" y="132" width="16" height="3" rx="1" fill={cream} opacity="0.45" />
      <circle cx="70" cy="148" r="14" fill={ink} />
      <circle cx="70" cy="148" r="6" fill={cream} />
      <g transform="translate(70 148)">
        <g className="fv-bot-sh">
          <rect x="-8" y="-78" width="16" height="82" rx="8" fill={ink} />
          <rect x="-5" y="-62" width="4" height="48" rx="2" fill={inkDark} />
          <rect x="1" y="-62" width="4" height="48" rx="2" fill={slotLite} />
          <g transform="translate(0 -70)">
            <circle r="13" fill={slotLite} />
            <circle r="5" fill={inkDark} />
            <g className="fv-bot-el">
              <path d="M0 0 H72" stroke={inkDark} strokeWidth="5" strokeLinecap="round" opacity="0.55" />
              <rect x="0" y="-8" width="86" height="16" rx="8" fill={inkDark} />
              <rect x="18" y="-4" width="52" height="3" rx="1.5" fill={cream} opacity="0.35" />
              <g transform="translate(86 0)">
                <circle r="11" fill={slotLite} />
                <circle r="4.5" fill={ink} />
                <rect x="-2" y="-6" width="40" height="12" rx="6" fill={ink} />
                <rect x="32" y="-14" width="26" height="28" rx="6" fill={inkMid} />
                <rect x="36" y="-8" width="10" height="16" rx="2" fill={cream} opacity="0.4" />
                <rect className="fv-bot-jaw" x="56" y="-12" width="18" height="6" rx="2" fill={cream} />
                <rect className="fv-bot-jaw" x="56" y="6" width="18" height="6" rx="2" fill={cream} />
              </g>
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

function Bucket({
  x,
  y,
  w = 180,
  label,
  children,
}: {
  x: number;
  y: number;
  w?: number;
  label?: string;
  children?: ReactNode;
}) {
  const k = w / 180;
  const left = 18 * k;
  const right = 198 * k;
  const floorL = 48 * k;
  const floorR = 168 * k;
  const baseL = 54 * k;
  const baseR = 162 * k;
  const cx = 108 * k;
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={cx} cy="148" rx={92 * k} ry="10" fill={ink} opacity="0.18" />
      <path
        d={`M${left} 128 L${floorL} 152 H${floorR} L${right} 128`}
        fill={slotLite}
        stroke={ink}
        strokeWidth="1.4"
      />
      <path d={`M${floorL} 152 H${floorR} L${baseR} 162 H${baseL} Z`} fill={ink} opacity="0.35" />
      {children}
      {label ? (
        <text
          x={cx}
          y="146"
          textAnchor="middle"
          fill="#5c4a36"
          fontFamily="Inter Tight, system-ui, sans-serif"
          fontSize="10"
          fontWeight="600"
          letterSpacing="0.02em"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

function FlowArrow({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} fill="none" stroke={ink} strokeWidth="2.2" strokeLinecap="round">
      <path className="fv-flow" d="M0 0 H38" />
      <path d="M30 -7 L40 0 L30 7" />
    </g>
  );
}

function AssetTesla() {
  return (
    <g transform="scale(1.4)">
      <circle cx="16" cy="16" r="16" fill="#E82127" />
      <svg x="5.2" y="3.6" width="21.6" height="23.2" viewBox="0 0 254.584 253.502">
        <g transform="translate(-45.84 -64.297)" fill="#fff">
          <path d="M 173.146,317.299 208.622,117.78 c 33.815,0 44.481,3.708 46.021,18.843 0,0 22.684,-8.458 34.125,-25.636 C 244.122,90.299 199.263,89.366 199.263,89.366 l -26.176,31.882 0.059,-0.004 -26.176,-31.883 c 0,0 -44.86,0.934 -89.5,21.622 11.431,17.178 34.124,25.636 34.124,25.636 1.549,-15.136 12.202,-18.844 45.79,-18.868 l 35.762,199.548" />
          <path d="m 173.132,80.157 c 36.09,-0.276 77.399,5.583 119.687,24.014 5.652,-10.173 7.105,-14.669 7.105,-14.669 C 253.697,71.213 210.406,64.954 173.127,64.797 135.85,64.954 92.561,71.214 46.34,89.502 c 0,0 2.062,5.538 7.1,14.669 42.28,-18.431 83.596,-24.29 119.687,-24.014 h 0.005" />
        </g>
      </svg>
    </g>
  );
}

function AssetNvidia() {
  return (
    <g transform="scale(1.4)">
      <circle cx="16" cy="16" r="16" fill="#76B900" />
      <svg x="2.2" y="7.2" width="27.6" height="18.4" viewBox="0 0 42 30">
        <path
          fill="#fff"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.889,8.985L16.889,6.28C17.151,6.26 17.417,6.247 17.687,6.238C25.087,6.006 29.942,12.597 29.942,12.597C29.942,12.597 24.698,19.879 19.076,19.879C18.333,19.882 17.594,19.764 16.889,19.529L16.889,11.325C19.769,11.673 20.349,12.945 22.081,15.833L25.933,12.585C25.933,12.585 23.121,8.897 18.381,8.897C17.866,8.897 17.373,8.933 16.889,8.985ZM16.889,0.047L16.889,4.09C17.154,4.069 17.42,4.052 17.687,4.042C27.977,3.696 34.682,12.482 34.682,12.482C34.682,12.482 26.982,21.846 18.959,21.846C18.224,21.846 17.535,21.778 16.889,21.663L16.889,24.161C17.442,24.231 18.015,24.273 18.613,24.273C26.078,24.273 31.477,20.461 36.705,15.948C37.572,16.642 41.121,18.331 41.85,19.071C36.879,23.231 25.295,26.586 18.727,26.586C18.113,26.584 17.5,26.552 16.889,26.49L16.889,30L45.264,30L45.264,0.047L16.889,0.047ZM16.889,19.529L16.889,21.662C9.984,20.432 8.067,13.254 8.067,13.254C8.067,13.254 11.383,9.58 16.889,8.985L16.889,11.325L16.878,11.324C13.988,10.977 11.731,13.677 11.731,13.677C11.731,13.677 12.996,18.221 16.889,19.529ZM4.625,12.943C4.625,12.943 8.717,6.903 16.889,6.28L16.889,4.088C7.838,4.815 0,12.48 0,12.48C0,12.48 4.439,25.313 16.889,26.488L16.889,24.16C7.753,23.011 4.625,12.943 4.625,12.943Z"
        />
      </svg>
    </g>
  );
}

function AssetGold() {
  return (
    <g transform="scale(1.4)">
      <circle cx="16" cy="16" r="16" fill="#C9A227" />
      <path d="M8 11.2 13.6 8.2h10.2L18.2 11.2Z" fill="#FFE082" />
      <path d="M8 11.2h10.2v4.2L8 13.8Z" fill="#E0B83D" />
      <path d="M18.2 11.2 23.8 8.2v4.1L18.2 15.4Z" fill="#B8860B" />
      <path d="M6.6 16.4 14.8 12h12L18.4 16.4Z" fill="#FFF1B0" />
      <path d="M6.6 16.4H18.4v5.4L6.6 19.6Z" fill="#E6B422" />
      <path d="M18.4 16.4 26.8 12v5.2L18.4 21.8Z" fill="#A67C0A" />
      <rect x="12.4" y="15.6" width="5.2" height="2.6" rx="0.4" fill="#D4A017" />
    </g>
  );
}

function AssetBtc() {
  return (
    <g transform="scale(1.4)">
      <circle cx="16" cy="16" r="16" fill="#F7931A" />
      <path
        fill="#fff"
        d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.113-.92-.22-1.385-.326l.695-2.788L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.803 1.006l-.804 3.23c.048.012.11.03.18.057l-.181-.045-1.13 4.532c-.086.212-.303.531-.63.41.014.02-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.232.32l-.715 2.872 1.727.43.708-2.84c.472.13.93.249 1.378.359l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"
      />
    </g>
  );
}

function RackMark() {
  const cells = Array.from({ length: 48 }, (_, i) => {
    const col = i % 8;
    const row = Math.floor(i / 8);
    return (
      <rect
        key={i}
        className="fv-blade"
        x={86 + col * 16}
        y={38 + row * 22}
        width="10"
        height="16"
        rx="1.5"
        fill={i % 3 === 0 ? inkDark : ink}
        style={{ animationDelay: `${(i % 8) * 0.12}s` }}
      />
    );
  });
  return (
    <svg className="floor-visual" viewBox="0 0 320 220" aria-hidden="true">
      <rect x="70" y="24" width="148" height="156" rx="6" fill={slotLite} />
      <rect x="78" y="32" width="132" height="140" rx="4" fill={cream} />
      {cells}
    </svg>
  );
}

function ExitMark() {
  return (
    <svg className="floor-visual" viewBox="0 0 340 180" aria-hidden="true">
      <rect x="18" y="64" width="304" height="52" rx="8" fill={ink} />
      <rect className="fv-pill" x="36" y="78" width="92" height="24" rx="12" fill={cream} />
      <rect className="fv-pill fv-pill-2" x="140" y="78" width="58" height="24" rx="12" fill={slotLite} />
      <circle className="fv-pulse" cx="248" cy="90" r="9" fill={cream} />
      <Grill x={24} y={122} w={292} />
    </svg>
  );
}
