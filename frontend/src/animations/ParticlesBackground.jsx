import React, { useCallback } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadFull } from 'tsparticles';

const ParticleBackground = () => {
  const particlesInit = initParticlesEngine(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
    // You can access the particles container here if needed
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        fullScreen: { enable: true },
        background: {
          color: {
            value: '#060606',
          },
        },
        particles: {
          number: {
            value: 50,
            density: {
              enable: true,
              area: 800,
            },
          },
          color: {
            value: '#00ffff',
          },
          shape: {
            type: 'polygon',
            polygon: {
              sides: 6,
            },
          },
          opacity: {
            value: 0.5,
          },
          size: {
            value: 5,
          },
          links: {
            enable: true,
            distance: 150,
            color: '#00ffff',
            opacity: 0.4,
            width: 1,
          },
          move: {
            enable: true,
            speed: 2,
            direction: 'none',
            outModes: {
              default: 'bounce',
            },
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: 'repulse',
            },
            onClick: {
              enable: true,
              mode: 'push',
            },
            onResize: true,
            onCursor: {
              enable: true, // Enables cursor trail
              mode: 'trail', // Trail effect
              parallax: {
                enable: true, // Parallax effect while cursor moves
                force: 60,
              },
            },
          },
          modes: {
            repulse: {
              distance: 100,
              duration: 0.4,
            },
            push: {
              quantity: 4,
            },
            trail: {
              particles: {
                number: {
                  value: 10,
                },
                color: {
                  value: '#ffffff',
                },
                size: {
                  value: 5,
                },
                opacity: {
                  value: 0.5,
                },
                move: {
                  speed: 4,
                },
              },
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticleBackground;
