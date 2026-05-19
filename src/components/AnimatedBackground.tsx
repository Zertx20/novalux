import React from 'react';

const AnimatedBackground = () => (
  <>
    <style>{`
      .bg-wrap {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background: #0A0A0F;
      }
      .blob {
        position: absolute;
        border-radius: 50%;
      }
      .blob-1 {
        width: 800px; height: 800px;
        background: radial-gradient(circle at center,
          rgba(109,40,217,0.35) 0%,
          rgba(109,40,217,0.1) 40%,
          transparent 70%);
        top: -300px; right: -200px;
        animation: b1 14s ease-in-out infinite;
      }
      .blob-2 {
        width: 700px; height: 700px;
        background: radial-gradient(circle at center,
          rgba(139,92,246,0.3) 0%,
          rgba(139,92,246,0.08) 40%,
          transparent 70%);
        bottom: -200px; left: -200px;
        animation: b2 18s ease-in-out infinite;
      }
      .blob-3 {
        width: 500px; height: 500px;
        background: radial-gradient(circle at center,
          rgba(167,139,250,0.2) 0%,
          transparent 65%);
        top: 30%; left: 30%;
        animation: b3 22s ease-in-out infinite;
      }
      .blob-4 {
        width: 350px; height: 350px;
        background: radial-gradient(circle at center,
          rgba(124,58,237,0.25) 0%,
          transparent 65%);
        top: 60%; right: 15%;
        animation: b4 12s ease-in-out infinite;
      }
      @keyframes b1 {
        0%,100% { transform: translate(0,0) scale(1); }
        25%  { transform: translate(-60px, 80px) scale(1.1); }
        50%  { transform: translate(50px, 30px) scale(0.95); }
        75%  { transform: translate(-30px,-60px) scale(1.05); }
      }
      @keyframes b2 {
        0%,100% { transform: translate(0,0) scale(1); }
        25%  { transform: translate(70px,-70px) scale(1.08); }
        50%  { transform: translate(-50px, 40px) scale(0.96); }
        75%  { transform: translate(40px, 70px) scale(1.04); }
      }
      @keyframes b3 {
        0%,100% { transform: translate(0,0) scale(1); }
        33%  { transform: translate(-80px, 50px) scale(1.15); }
        66%  { transform: translate(60px,-50px) scale(0.9); }
      }
      @keyframes b4 {
        0%,100% { transform: translate(0,0) scale(1); }
        50%  { transform: translate(-50px,-80px) scale(1.2); }
      }
    `}</style>

    <div className="bg-wrap">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />
    </div>
  </>
);

export default AnimatedBackground;
