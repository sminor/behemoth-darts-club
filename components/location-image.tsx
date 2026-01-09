"use client"

import React, { useState } from 'react';
import { MapPin } from "lucide-react";

interface LocationImageProps {
    src?: string;
    alt: string;
}

export function LocationImage({ src, alt }: LocationImageProps) {
    const [hasError, setHasError] = useState(false);

    if (!src || hasError) {
        return (
            <div className="absolute inset-0 flex items-center justify-center text-neutral-600">
                <MapPin className="h-12 w-12 opacity-20" />
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className="object-cover w-full h-full relative z-10"
            onError={() => setHasError(true)}
        />
    );
}
