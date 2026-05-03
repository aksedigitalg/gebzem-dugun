"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Bell, BellDot, CheckCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  markNotificationReadAction,
  markAllNotificationsReadAction,
} from "@/lib/actions/notification";

type Notification = {
  id: string;
  kind: string;
  title: string;
  body: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
};

export function NotificationBell() {
  const { status } = useSession();
  const [items, setItems] = React.useState<Notification[]>([]);
  const [loading, setLoading] = React.useState(false);

  const unread = items.filter((n) => !n.isRead).length;

  const fetchNotifications = React.useCallback(async () => {
    if (status !== "authenticated") return;
    setLoading(true);
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setItems(data.items ?? []);
      }
    } catch (err) {
      console.error("notifications fetch failed", err);
    } finally {
      setLoading(false);
    }
  }, [status]);

  React.useEffect(() => {
    if (status !== "authenticated") return;
    fetchNotifications();
    const id = setInterval(fetchNotifications, 30_000); // 30sn polling
    return () => clearInterval(id);
  }, [status, fetchNotifications]);

  if (status !== "authenticated") return null;

  const Icon = unread > 0 ? BellDot : Bell;

  return (
    <DropdownMenu onOpenChange={(o) => o && fetchNotifications()}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Bildirimler"
          className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-background transition hover:border-primary"
        >
          <Icon className={cn("h-4 w-4", unread > 0 && "text-primary")} />
          {unread > 0 && (
            <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <DropdownMenuLabel className="px-0 text-sm font-semibold text-foreground">
            Bildirimler
          </DropdownMenuLabel>
          {unread > 0 && (
            <button
              type="button"
              onClick={async () => {
                await markAllNotificationsReadAction();
                fetchNotifications();
              }}
              className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <CheckCheck className="h-3 w-3" /> Tümünü okundu işaretle
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="m-0" />

        <div className="max-h-80 overflow-y-auto">
          {loading && items.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground">Yükleniyor…</div>
          ) : items.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <Bell className="mx-auto h-8 w-8 text-muted-foreground/40" />
              <p className="mt-2 text-sm text-muted-foreground">Henüz bildirim yok</p>
            </div>
          ) : (
            items.slice(0, 10).map((n) => (
              <NotificationItem
                key={n.id}
                n={n}
                onClick={async () => {
                  if (!n.isRead) {
                    await markNotificationReadAction(n.id);
                    fetchNotifications();
                  }
                }}
              />
            ))
          )}
        </div>

        <DropdownMenuSeparator className="m-0" />
        <DropdownMenuItem asChild>
          <Link href="/hesabim/bildirimler" className="justify-center text-center text-sm font-medium text-primary">
            Tüm bildirimleri gör
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NotificationItem({
  n,
  onClick,
}: {
  n: Notification;
  onClick: () => void;
}) {
  const content = (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 transition-colors",
        !n.isRead ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/50",
      )}
    >
      {!n.isRead && (
        <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-primary" aria-hidden />
      )}
      {n.isRead && (
        <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-transparent" aria-hidden />
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-tight">{n.title}</p>
        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
        <p className="mt-1 text-[10px] text-muted-foreground">
          {new Date(n.createdAt).toLocaleString("tr-TR", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );

  if (n.link) {
    return (
      <Link href={n.link} onClick={onClick} className="block border-b border-border last:border-b-0">
        {content}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className="block w-full border-b border-border text-left last:border-b-0">
      {content}
    </button>
  );
}
