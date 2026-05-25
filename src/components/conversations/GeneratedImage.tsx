import { useState } from "react";
import type { GeneratedImageType } from "@/types/conversation.type";
import { cn } from "@/utils/cn";

type Props = {
  image: GeneratedImageType;
  alt?: string;
};

export function GeneratedImage({ image, alt = "Image générée" }: Props) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="mt-2 rounded-xl overflow-hidden border border-base-200 max-w-sm">
      {!loaded && !error && (
        <div className="w-full aspect-square bg-background-soft-100 animate-pulse rounded-xl" />
      )}

      {error && (
        <div className="w-full aspect-square bg-background-soft-100 flex items-center justify-center rounded-xl">
          <p className="text-xs text-foreground-soft-400">Impossible de charger l'image</p>
        </div>
      )}

      <img
        src={image.dataUrl}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={cn(
          "w-full object-cover transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0 absolute",
        )}
      />
    </div>
  );
}
