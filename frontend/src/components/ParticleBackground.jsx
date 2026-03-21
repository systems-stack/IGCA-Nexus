import React, { useCallback } from 'react';
import Particles from "react-tsparticles";
import { loadSlim } from "@tsparticles/slim";

const ParticleBackground = () => {
  const particlesInit = useCallback(async engine => {
    // Loads the TSParticles engine
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
      options={{
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: { enable: true, mode: "push" },
            onHover: { enable: true, mode: "grab" },
            resize: true,
          },
          modes: {
            push: { quantity: 1 },
            grab: { distance: 150, links: { opacity: 0.3 } },
          },
        },
        particles: {
          color: { value: ["#6b46c1", "#3b82f6", "#10B981", "#ef4444"] },
          links: {
            color: "#6b46c1",
            distance: 180,
            enable: true,
            opacity: 0.15,
            width: 1,
          },
          collisions: { enable: false },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "bounce" },
            random: true,
            speed: 0.8,
            straight: false,
          },
          number: {
            density: { enable: true, area: 800 },
            value: 60,
          },
          opacity: { value: 0.6 },
          shape: { type: "circle" },
          size: { value: { min: 1, max: 3 } },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticleBackground;
