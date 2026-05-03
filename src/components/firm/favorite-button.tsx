"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleFavoriteAction } from "@/lib/actions/favorite";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  firmId,
  initiallyFavorited,
}: {
  firmId: string;
  initiallyFavorited?: boolean;
}) {
  const router = useRouter();
  const { status } = useSession();
  const [favorited, setFavorited] = React.useState(initiallyFavorited ?? false);
  const [pending, startTransition] = React.useTransition();

  return (
    <Button
      variant="outline"
      size="lg"
      className={cn("w-full transition-colors", favorited && "border-rose-500 bg-rose-50 text-rose-700 hover:bg-rose-100")}
      onClick={() => {
        if (status === "unauthenticated") {
          router.push(`/cift?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
          return;
        }
        startTransition(async () => {
          const res = await toggleFavoriteAction(firmId);
          if (res.ok) setFavorited(res.favorited ?? false);
        });
      }}
      disabled={pending}
    >
      <Heart className={cn("h-4 w-4", favorited && "fill-rose-500 text-rose-500")} />
      {favorited ? "Favorilerimde" : "Favorilere Ekle"}
    </Button>
  );
}
