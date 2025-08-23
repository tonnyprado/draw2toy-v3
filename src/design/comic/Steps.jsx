import React from "react";

export default function ComicSteps({ step }) {
    const steps = ["Dibujos", "Personaliza", "Detalles", "Revisión"];
    return (
        <div className="panel p-3" data-snap-item>
            <ol className="grid grid-cols-4 gap-2">
                {steps.map((label, i) => {
                    const active = step >= i + 1;
                    return (
                        <li key={i} className={`flex items-center justify-center text-center px-2 py-2 border-2 ${active ? "bg-[#FFEC48]" : "bg-white"}`} style={{ borderColor: "#1B1A1F" }}>
                            <span className="text-xs md:text-sm font-extrabold uppercase tracking-wide">{i + 1}. {label}</span>
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}