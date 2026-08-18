"use client";

import { Alignment, Fit, Layout, useRive } from "@rive-app/react-canvas";
import { log } from "../logger";

const riveLog = log.child("rive");

export function SpotWalk() {
  const { RiveComponent, setContainerRef } = useRive(
    {
      src: "/media/40-97-spot-robot-walking.riv",
      autoplay: true,
      layout: new Layout({
        fit: Fit.Cover,
        alignment: Alignment.BottomCenter,
      }),
      onRiveReady: (instance) => {
        const animations = instance.animationNames;
        const machines = instance.stateMachineNames;
        riveLog.info("spot walk ready", { animations, machines });
        if (machines.length) instance.play(machines);
        else if (animations.length) instance.play(animations);
        else instance.play();
      },
    },
    {
      shouldResizeCanvasToContainer: true,
      useDevicePixelRatio: true,
    },
  );

  return (
    <div className="floor-rive" ref={setContainerRef} aria-hidden="true">
      <RiveComponent />
    </div>
  );
}
