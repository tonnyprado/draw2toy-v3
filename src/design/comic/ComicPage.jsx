import React, { useEffect } from "react";

export default function ComicPage({ children, snap = true }) {
    useEffect(() => {
        document.body.classList.add("page-comic");
        return () => document.body.classList.remove("page-comic");
    }, []);

    return (
        <div className="relative min-h-screen bg-[#FFF7EC] text-[#1B1A1F]">
            {/* Halftone background */}
            <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-25" style={{
                backgroundImage: "radial-gradient(#1B1A1F 1px, transparent 1px)",
                backgroundSize: "12px 12px",
                maskImage: "linear-gradient(180deg, rgba(0,0,0,.9), rgba(0,0,0,.4) 40%, rgba(0,0,0,.12) 70%, rgba(0,0,0,0) 100%)",
                WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,.9), rgba(0,0,0,.4) 40%, rgba(0,0,0,.12) 70%, rgba(0,0,0,0) 100%)",
            }} />

            <main data-snap={snap ? "y" : "none"} className={snap ? "snap-y snap-proximity" : ""}>
                {children}
            </main>

            {/* Local styles for the Comic theme */}
            <style>{`
                html { scroll-behavior: smooth; }
                .panel { background: #FFFFFF; border: 3px solid #1B1A1F; box-shadow: 8px 8px 0 #1B1A1F10; border-radius: 14px; }
                .comic-btn { background: #FFEC48; border: 2.5px solid #1B1A1F; box-shadow: 4px 4px 0 #1B1A1F; font-weight: 800; text-transform: uppercase; letter-spacing: .02em; transition: transform 120ms ease, box-shadow 120ms ease; }
                .comic-btn:hover { transform: translate(-1px,-1px); box-shadow: 6px 6px 0 #1B1A1F; }
                .comic-btn:disabled { opacity: .5; cursor: not-allowed; }
                .btn-ghost-comic { background: transparent; border: 2px solid #1B1A1F; padding: .6rem 1rem; font-weight: 700; box-shadow: 3px 3px 0 #1B1A1F; transition: transform 120ms ease, box-shadow 120ms ease; }
                .btn-ghost-comic:hover { transform: translate(-1px,-1px); box-shadow: 5px 5px 0 #1B1A1F; }
                @keyframes jiggle { 0%{transform:rotate(-.6deg) translateY(0)} 50%{transform:rotate(.6deg) translateY(-2px)} 100%{transform:rotate(-.6deg) translateY(0)} }
                .jiggle { animation: jiggle 2.4s ease-in-out infinite; transform-origin: 50% 60%; }
                [data-snap="y"] [data-snap-item] { scroll-snap-align: start; }
            `}</style>
        </div>
    );
}

