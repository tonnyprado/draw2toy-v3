import React from "react";

export function Panel({ children, className = "", ...rest }) {
    return (
        <div className={`panel ${className}`} {...rest}>
            {children}
        </div>
    );
}

