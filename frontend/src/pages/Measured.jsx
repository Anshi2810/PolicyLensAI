import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BG_IMAGE_1 = "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260713_140344_79e1296a-86d7-43fd-9b5f-63ffe560f291.png&w=1280&q=85";
const FRONT_VIDEO = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260713_162101_0d7498c5-29bb-47bf-a99f-2773c0a880a9.mp4";
const OVERLAY_IMAGE = "https://soft-zoom-63098134.figma.site/_assets/v11/3f10f1876e118f72a396e05a6c2d099569478272.png";

const navLinks = ["Device", "Real Stories", "Science", "Plans", "Reach Us"];

export default function Measured() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoWrapperRef = useRef(null);
  const gridRef = useRef(null);

  // Mouse coordinate refs
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothMouseRef = useRef({ x: 0, y: 0 });
  
  // Parallax grid offset refs
  const gridOffsetRef = useRef({ x: 0, y: 0 });
  const smoothGridOffsetRef = useRef({ x: 0, y: 0 });

  // Body scroll lock
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Handle window resizing for the canvas mask
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas && containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on mount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track cursor coordinates
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  };

  // Setup loop for smooth LERP follow masking and grid parallax shifting
  useEffect(() => {
    let animFrameId;

    const updateSpotlight = () => {
      if (!containerRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      // 1) Smooth cursor LERP for spotlight reveal (factor 0.1)
      smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * 0.1;
      smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * 0.1;

      // 2) Smooth LERP for grid parallax shift (offset relative to center * 16, eased at 0.06)
      const centerX = width / 2;
      const centerY = height / 2;

      const targetGridX = ((mouseRef.current.x - centerX) / centerX) * 16;
      const targetGridY = ((mouseRef.current.y - centerY) / centerY) * 16;

      smoothGridOffsetRef.current.x += (targetGridX - smoothGridOffsetRef.current.x) * 0.06;
      smoothGridOffsetRef.current.y += (targetGridY - smoothGridOffsetRef.current.y) * 0.06;

      // 3) Apply parallax to grid element
      if (gridRef.current) {
        gridRef.current.style.transform = `translate3d(${smoothGridOffsetRef.current.x}px, ${smoothGridOffsetRef.current.y}px, 0)`;
      }

      // 4) Draw canvas mask
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const sx = smoothMouseRef.current.x;
          const sy = smoothMouseRef.current.y;

          // Mask gradient stops: center full white (0-40%), then feathers out
          const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, 260);
          grad.addColorStop(0, 'rgba(255,255,255,1)');
          grad.addColorStop(0.4, 'rgba(255,255,255,1)');
          grad.addColorStop(0.6, 'rgba(255,255,255,0.75)');
          grad.addColorStop(0.75, 'rgba(255,255,255,0.4)');
          grad.addColorStop(0.88, 'rgba(255,255,255,0.12)');
          grad.addColorStop(1, 'rgba(255,255,255,0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(sx, sy, 260, 0, Math.PI * 2);
          ctx.fill();

          const dataUrl = canvas.toDataURL();
          if (videoWrapperRef.current) {
            videoWrapperRef.current.style.maskImage = `url(${dataUrl})`;
            videoWrapperRef.current.style.webkitMaskImage = `url(${dataUrl})`;
          }
        }
      }

      animFrameId = requestAnimationFrame(updateSpotlight);
    };

    animFrameId = requestAnimationFrame(updateSpotlight);
    return () => cancelAnimationFrame(animFrameId);
  }, []);

  return (
    <div className="font-helvetica-neue w-full bg-white select-none text-white relative">
      
      {/* Navigation Layer (z-50) */}
      <nav className="fixed top-0 left-0 right-0 h-24 flex items-center justify-between px-6 sm:px-12 z-50 pointer-events-none">
        {/* Logo */}
        <div className="pointer-events-auto">
          <svg className="w-7 h-7 fill-white" viewBox="0 0 256 256">
            <path d="M 256 64 L 256 128 L 192.5 128 L 160 95 L 128 64 L 96 95 L 63.5 128 L 64 128 L 128 192 L 128 256 L 64.5 256 L 32 223 L 0 192 L 0 64 L 64 0 L 192 0 Z M 256 192 L 256 256 L 192.5 256 L 160 223 L 128 192 L 128 128 L 192 128 Z" />
          </svg>
        </div>

        {/* Desktop Center Menu */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="liquid-glass rounded-full px-1 py-1 flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link}
                className="px-5 py-2.5 text-white/70 text-sm font-medium rounded-full hover:text-white transition-all duration-300 relative group"
              >
                {link}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block pointer-events-auto">
          <button className="liquid-glass rounded-full px-5 py-2.5 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white text-sm font-medium">Reserve Yours</span>
          </button>
        </div>

        {/* Mobile Hamburger menu trigger */}
        <div className="md:hidden pointer-events-auto">
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="liquid-glass rounded-full w-12 h-12 flex flex-col items-center justify-center gap-1.5 active:scale-95 transition-all duration-300"
          >
            <span className="w-5 h-[1.5px] bg-white rounded" />
            <span className="w-3.5 h-[1.5px] bg-white rounded" />
          </button>
        </div>
      </nav>

      {/* Mobile Fullscreen Menu (z-55) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ ease: [0.77, 0, 0.18, 1], duration: 0.5 }}
            className="fixed inset-0 bg-[#0a0a0a] z-55 flex flex-col justify-between p-8 sm:p-12"
          >
            {/* Close button row */}
            <div className="flex justify-end">
              <motion.button
                initial={{ rotate: -90, scale: 0.8, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -90, scale: 0.8, opacity: 0 }}
                transition={{ ease: [0.77, 0, 0.18, 1], duration: 0.5 }}
                onClick={() => setMobileMenuOpen(false)}
                className="liquid-glass rounded-full w-12 h-12 flex items-center justify-center"
              >
                <div className="relative w-5 h-5">
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-[1.5px] bg-white rounded rotate-45" />
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-[1.5px] bg-white rounded -rotate-45" />
                </div>
              </motion.button>
            </div>

            {/* Menu Items Stack */}
            <div className="flex-1 flex flex-col justify-center items-center gap-6">
              {navLinks.map((link, idx) => (
                <div key={link} className="overflow-hidden">
                  <motion.button
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 24, opacity: 0 }}
                    transition={{
                      ease: [0.77, 0, 0.18, 1],
                      duration: 0.6,
                      delay: 0.1 + idx * 0.06
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-3xl sm:text-4xl text-white/90 font-medium hover:text-white transition-colors"
                  >
                    {link}
                  </motion.button>
                </div>
              ))}
            </div>

            {/* Mobile CTA */}
            <div className="flex justify-center pb-6">
              <motion.button
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 24, opacity: 0 }}
                transition={{ ease: [0.77, 0, 0.18, 1], duration: 0.6, delay: 0.4 }}
                onClick={() => setMobileMenuOpen(false)}
                className="liquid-glass rounded-full px-8 py-4 flex items-center gap-3 w-full sm:w-auto justify-center"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                <span className="text-white text-base font-semibold">Reserve Yours</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section Container (100vh) */}
      <section
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="w-full h-screen relative overflow-hidden bg-black flex flex-col justify-center items-center"
      >
        {/* Layer 1 — Parallax Grid Background (z-0, opacity 0.1) */}
        <div 
          ref={gridRef}
          className="absolute inset-0 z-0 pointer-events-none opacity-10 flex items-center justify-center"
          style={{ width: '110%', height: '110%', left: '-5%', top: '-5%' }}
        >
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#64748b" strokeWidth="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>

        {/* Layer 2 — Background Image (z-10) */}
        <div 
          className="absolute inset-0 z-10 bg-center bg-cover bg-no-repeat pointer-events-none"
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
        />

        {/* Layer 3 — Hero Text (z-20) */}
        <div className="absolute top-24 sm:top-28 md:top-32 left-0 right-0 text-center z-20 pointer-events-none">
          <h1 
            className="uppercase tracking-tight text-[4.5rem] xs:text-[5.5rem] sm:text-[10rem] md:text-[13rem] lg:text-[16rem] leading-[0.9] font-normal"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Measured
          </h1>
        </div>

        {/* Layer 4 — Overlay Image (z-25) */}
        <img 
          src={OVERLAY_IMAGE} 
          alt="depth overlay" 
          className="absolute inset-0 z-25 w-full h-full object-cover pointer-events-none"
        />

        {/* Layer 5 — Spotlight Reveal & Video (z-30) */}
        {/* The video wrapper is clipped to the bottom 60% of the screen and masked by the canvas dataURL */}
        <div 
          ref={videoWrapperRef}
          className="absolute inset-0 z-30 pointer-events-none"
          style={{ 
            clipPath: 'inset(40% 0 0 0)',
            maskSize: '100% 100%',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: '100% 100%',
            WebkitMaskRepeat: 'no-repeat'
          }}
        >
          <video
            src={FRONT_VIDEO}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hidden Canvas used to generate the mask image */}
        <canvas 
          ref={canvasRef} 
          className="hidden" 
        />
      </section>

    </div>
  );
}
