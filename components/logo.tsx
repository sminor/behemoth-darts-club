"use client"

import React, { useState } from 'react';

export function Logo() {
    const [src, setSrc] = useState("/logo.png");

    return (
        <img
            src={src}
            alt="Behemoth Darts Club Logo"
            className="object-contain w-full h-full drop-shadow-lg"
            onError={() => {
                setSrc("https://placehold.co/400x400/2E7D32/FFFFFF?text=BDC");
            }}
        />
    );
}
