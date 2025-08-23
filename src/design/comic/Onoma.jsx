import React from "react";

export default function Onoma({ text = "¡WOW!", small = false }) {
    const size = small ? 80 : 120;
    const r = small ? 32 : 48;
    return (
        <div className="select-none" aria-hidden>
            <svg width={size} height={size} viewBox="0 0 120 120" className="overflow-visible">
                <g transform="translate(60,60)">
                    <Starburst r={r} spikes={16} fill="#FFEC48" stroke="#1B1A1F" />
                    <text x="0" y="6" textAnchor="middle" fontSize={small ? 16 : 22} fontWeight="900" fill="#1B1A1F">{text}</text>
                </g>
            </svg>
        </div>
    );
}

function Starburst({ r = 40, spikes = 14, fill = "#FFEC48", stroke = "#1B1A1F" }) {
    const points = [];
    const inner = r * 0.6;
    for (let i = 0; i < spikes * 2; i++) {
        const angle = (i * Math.PI) / spikes;
        const rad = i % 2 === 0 ? r : inner;
        const x = Math.cos(angle) * rad;
        const y = Math.sin(angle) * rad;
        points.push(`${x},${y}`);
    }
    return <polygon points={points.join(" ")} fill={fill} stroke={stroke} strokeWidth="3" />;
}