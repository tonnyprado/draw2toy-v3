// src/design/comic/layouts/ComicPage.jsx
import { SpeedLines } from "../system/Primitives";

export default function ComicPage({ title, subtitle, actions, halftone = false, children }) {
  return (
    <div className={halftone ? "comic-halftone relative" : "relative"}>
      <SpeedLines position="top" />
      <div className="container mx-auto px-6 py-10">
        {title || subtitle || actions ? (
          <header className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              {title ? <h1 className="text-3xl font-black uppercase leading-tight">{title}</h1> : null}
              {subtitle ? <p className="text-[#1B1A1F]/70">{subtitle}</p> : null}
            </div>
            <div className="flex items-center gap-3">{actions}</div>
          </header>
        ) : null}
        {children}
      </div>
      <SpeedLines position="bottom" />
    </div>
  );
}
