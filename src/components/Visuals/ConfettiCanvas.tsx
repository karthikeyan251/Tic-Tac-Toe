import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

interface ConfettiCanvasProps {
  active: boolean;
  color?: string;
}

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({ active, color }) => {
  useEffect(() => {
    if (active) {
      const colors = color ? [color, '#ffffff', '#00eaff', '#ff2bd6'] : ['#00eaff', '#ff2bd6', '#ffb020', '#19f59a'];

      // Particle burst 1
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors,
      });

      // Secondary burst
      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
      }, 250);

      return () => clearTimeout(timer);
    }
  }, [active, color]);

  return null;
};
