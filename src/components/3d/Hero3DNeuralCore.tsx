import React, { useEffect, useRef, useState } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  opacity: number;
}

interface OrbitBadge {
  name: string;
  category: string;
  color: string;
  angle: number;
  speed: number;
  radiusX: number;
  radiusY: number;
  tilt: number;
}

export const Hero3DNeuralCore: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const shockwaveTriggerRef = useRef(0);

  // Satellite Badges revolving in 3D orbit
  const [badges, setBadges] = useState<OrbitBadge[]>([
    { name: 'LangGraph', category: 'Agentic AI', color: '#000000', angle: 0, speed: 0.012, radiusX: 220, radiusY: 90, tilt: -0.35 },
    { name: 'Model Context Protocol', category: 'MCP SDK', color: '#000000', angle: (Math.PI * 2) / 5, speed: 0.01, radiusX: 240, radiusY: 100, tilt: 0.4 },
    { name: 'Ragas Evals', category: 'LLM Quality', color: '#000000', angle: ((Math.PI * 2) / 5) * 2, speed: 0.014, radiusX: 210, radiusY: 85, tilt: -0.2 },
    { name: 'ChromaDB RAG', category: 'Vector Search', color: '#000000', angle: ((Math.PI * 2) / 5) * 3, speed: 0.011, radiusX: 230, radiusY: 95, tilt: 0.25 },
    { name: 'Playwright AI', category: 'Self-Healing', color: '#000000', angle: ((Math.PI * 2) / 5) * 4, speed: 0.013, radiusX: 200, radiusY: 80, tilt: -0.45 },
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = 420);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = Math.min(460, Math.max(360, window.innerHeight * 0.45));
    };

    window.addEventListener('resize', handleResize);

    // Generate 3D Sphere Points
    const numPoints = 72;
    const sphereRadius = Math.min(width, height) * 0.28;
    const points: Point3D[] = [];

    for (let i = 0; i < numPoints; i++) {
      const phi = Math.acos(-1 + (2 * i) / numPoints);
      const theta = Math.sqrt(numPoints * Math.PI) * phi;

      const x = sphereRadius * Math.cos(theta) * Math.sin(phi);
      const y = sphereRadius * Math.sin(theta) * Math.sin(phi);
      const z = sphereRadius * Math.cos(phi);

      points.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        size: Math.random() * 2.5 + 1.5,
        opacity: Math.random() * 0.6 + 0.4,
      });
    }

    // Camera and 3D Rotation State
    let rotX = 0.2;
    let rotY = 0;
    let targetRotX = 0.2;
    let targetRotY = 0;
    let shockwaveRadius = 0;
    let shockwaveAlpha = 0;
    let lastTrigger = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Check external trigger
      if (shockwaveTriggerRef.current !== lastTrigger) {
        lastTrigger = shockwaveTriggerRef.current;
        shockwaveRadius = 20;
        shockwaveAlpha = 0.6;
      }

      // Smooth mouse interpolation
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;
      targetRotY += 0.004; // Continuous auto rotation

      const centerX = width / 2;
      const centerY = height / 2;
      const fov = 400;

      // Draw 3D Ambient Orbital Rings
      const ringAngles = [
        { rx: rotX * 0.8, ry: rotY * 0.5, r: sphereRadius * 1.35, tilt: 0.3 },
        { rx: rotX * 0.6, ry: -rotY * 0.7, r: sphereRadius * 1.55, tilt: -0.4 },
        { rx: -rotX * 0.5, ry: rotY * 0.9, r: sphereRadius * 1.75, tilt: 0.6 },
      ];

      ringAngles.forEach((ring, index) => {
        ctx.save();
        ctx.beginPath();
        const steps = 60;
        for (let s = 0; s <= steps; s++) {
          const a = (s / steps) * Math.PI * 2;
          const px = ring.r * Math.cos(a);
          const py = ring.r * Math.sin(a) * Math.cos(ring.tilt);
          const pz = ring.r * Math.sin(a) * Math.sin(ring.tilt);

          // Rotate
          const y1 = py * Math.cos(ring.rx) - pz * Math.sin(ring.rx);
          const z1 = py * Math.sin(ring.rx) + pz * Math.cos(ring.rx);
          const x2 = px * Math.cos(ring.ry) + z1 * Math.sin(ring.ry);
          const z2 = -px * Math.sin(ring.ry) + z1 * Math.cos(ring.ry);

          const scale = fov / (fov + z2 + 200);
          const projX = centerX + x2 * scale;
          const projY = centerY + y1 * scale;

          if (s === 0) ctx.moveTo(projX, projY);
          else ctx.lineTo(projX, projY);
        }
        ctx.strokeStyle = index === 0 ? 'rgba(0, 0, 0, 0.12)' : 'rgba(0, 0, 0, 0.06)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.restore();
      });

      // Transform & Project 3D Nodes
      const projected = points.map((p) => {
        // Rotate X
        const y1 = p.baseY * Math.cos(rotX) - p.baseZ * Math.sin(rotX);
        const z1 = p.baseY * Math.sin(rotX) + p.baseZ * Math.cos(rotX);

        // Rotate Y
        const x2 = p.baseX * Math.cos(rotY) + z1 * Math.sin(rotY);
        const z2 = -p.baseX * Math.sin(rotY) + z1 * Math.cos(rotY);

        const scale = fov / (fov + z2 + 100);
        return {
          projX: centerX + x2 * scale,
          projY: centerY + y1 * scale,
          z: z2,
          scale,
          size: p.size * scale,
          opacity: p.opacity * Math.max(0.2, (z2 + sphereRadius) / (sphereRadius * 2)),
        };
      });

      // Sort points by depth (Painter's algorithm)
      projected.sort((a, b) => a.z - b.z);

      // Draw 3D Neural Connections between neighboring vertices
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];
          const dx = p1.projX - p2.projX;
          const dy = p1.projY - p2.projY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 65) {
            const alpha = (1 - dist / 65) * 0.25 * Math.min(p1.scale, p2.scale);
            ctx.strokeStyle = `rgba(0, 0, 0, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.projX, p1.projY);
            ctx.lineTo(p2.projX, p2.projY);
            ctx.stroke();
          }
        }
      }

      // Draw 3D Vertices / Neural Nodes
      projected.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.projX, p.projY, Math.max(1, p.size), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${p.opacity * 0.9})`;
        ctx.fill();

        // Inner glowing core
        if (p.z > 0) {
          ctx.beginPath();
          ctx.arc(p.projX, p.projY, p.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        }
      });

      // Draw Click Shockwave Pulse if active
      if (shockwaveAlpha > 0.01) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, shockwaveRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 0, 0, ${shockwaveAlpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        shockwaveRadius += 4;
        shockwaveAlpha *= 0.94;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Update Badges Orbit Position
  useEffect(() => {
    const interval = setInterval(() => {
      setBadges((prev) =>
        prev.map((badge) => ({
          ...badge,
          angle: badge.angle + badge.speed,
        }))
      );
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: nx, y: ny });
  };

  const handleTriggerPulse = () => {
    shockwaveTriggerRef.current += 1;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleTriggerPulse}
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '920px',
        margin: '2rem auto 1.5rem',
        height: '380px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'crosshair',
        perspective: '1200px',
      }}
    >
      {/* 3D WebGL / Canvas Layer */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none',
        }}
      />

      {/* Center 3D AI Quality Node Badge */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) rotateX(${mousePos.y * -20}deg) rotateY(${mousePos.x * 25}deg) translateZ(30px)`,
          transition: 'transform 0.15s ease-out',
          background: '#000000',
          color: '#ffffff',
          padding: '0.65rem 1.25rem',
          borderRadius: '9999px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 10px #22c55e',
          }}
        />
        <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.04em' }}>
          QE2AI NEURAL ENGINE
        </span>
      </div>

      {/* Revolving 3D Orbit Badges */}
      {badges.map((badge, idx) => {
        // Calculate 3D Elliptical coordinates with tilt
        const x = Math.cos(badge.angle) * badge.radiusX;
        const rawY = Math.sin(badge.angle) * badge.radiusY;
        const z = Math.sin(badge.angle) * 120; // 3D depth

        const y = rawY + x * badge.tilt;
        const scale = (z + 240) / 360; // Perspective scale
        const opacity = Math.max(0.4, (z + 120) / 240);
        const zIndex = z > 0 ? 15 : 2;

        return (
          <div
            key={idx}
            style={{
              position: 'absolute',
              top: `calc(50% + ${y}px)`,
              left: `calc(50% + ${x}px)`,
              transform: `translate(-50%, -50%) scale(${scale})`,
              opacity,
              zIndex,
              background: 'var(--bg-secondary, #ffffff)',
              border: '1px solid var(--border-strong, #000000)',
              borderRadius: '6px',
              padding: '0.35rem 0.65rem',
              boxShadow: z > 0 ? '0 8px 24px rgba(0,0,0,0.15)' : 'none',
              pointerEvents: 'none',
              transition: 'opacity 0.2s ease',
              whiteSpace: 'nowrap',
            }}
          >
            <div style={{ fontSize: '0.6rem', color: 'var(--text-muted, #71717a)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {badge.category}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-primary, #000000)' }}>
              {badge.name}
            </div>
          </div>
        );
      })}

      {/* Bottom Hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '0.5rem',
          fontSize: '0.68rem',
          color: 'var(--text-muted, #71717a)',
          fontFamily: 'var(--font-mono, monospace)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
        }}
      >
        <span>✦ Drag cursor to rotate 3D sphere</span>
        <span>•</span>
        <span>Click to emit neural pulse</span>
      </div>
    </div>
  );
};
