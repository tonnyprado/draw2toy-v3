import React from "react";

export function ComicButton({ children, className = "", as: As = "button", ...rest }) {
    return (
        <As className={`comic-btn px-4 py-2 ${className}`} {...rest}>
            {children}
        </As>
    );
}

export function GhostButton({ children, className = "", as: As = "button", ...rest }) {
    return (
        <As className={`btn-ghost-comic ${className}`} {...rest}>
            {children}
        </As>
    );
}

