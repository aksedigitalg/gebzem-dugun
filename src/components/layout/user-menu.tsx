"use client";

import * as React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  ChevronDown,
  User as UserIcon,
  Heart,
  Briefcase,
  LayoutDashboard,
  Shield,
  LogOut,
  Settings,
  ListChecks,
  Calendar,
  MessagesSquare,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type Role = "COUPLE" | "FIRM_OWNER" | "FIRM_STAFF" | "ADMIN" | "SUPER_ADMIN";

type UserMenuProps = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
  };
};

function rolePresentation(role: Role | string | null | undefined) {
  switch (role) {
    case "FIRM_OWNER":
    case "FIRM_STAFF":
      return {
        label: "İşletme",
        Icon: Briefcase,
        dashboard: "/firma-paneli",
        ringClass: "ring-2 ring-secondary/20 hover:ring-secondary/40",
        avatarBg: "bg-secondary text-white",
      };
    case "ADMIN":
    case "SUPER_ADMIN":
      return {
        label: "Yönetici",
        Icon: Shield,
        dashboard: "/admin/panel",
        ringClass: "ring-2 ring-amber-200 hover:ring-amber-300",
        avatarBg: "bg-amber-500 text-white",
      };
    default:
      return {
        label: "Çift",
        Icon: Heart,
        dashboard: "/hesabim",
        ringClass: "ring-2 ring-primary/20 hover:ring-primary/40",
        avatarBg: "bg-primary text-white",
      };
  }
}

function initials(name?: string | null, email?: string | null) {
  const source = (name?.trim() || email?.split("@")[0] || "G").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "G";
  const second = parts[1]?.[0] ?? "";
  return (first + second).toUpperCase().slice(0, 2);
}

export function UserMenu({ user }: UserMenuProps) {
  const role = user.role ?? null;
  const meta = rolePresentation(role);

  const coupleItems = [
    { href: "/hesabim", label: "Panelim", Icon: LayoutDashboard },
    { href: "/hesabim/favorilerim", label: "Favorilerim", Icon: Heart },
    { href: "/hesabim/tekliflerim", label: "Tekliflerim", Icon: MessagesSquare },
    { href: "/hesabim/checklist", label: "Checklist", Icon: ListChecks },
    { href: "/hesabim/ayarlar", label: "Ayarlar", Icon: Settings },
  ];

  const firmItems = [
    { href: "/firma-paneli", label: "Firma Paneli", Icon: LayoutDashboard },
    { href: "/firma-paneli/teklifler", label: "Gelen Teklifler", Icon: MessagesSquare },
    { href: "/firma-paneli/musait-takvim", label: "Müsaitlik Takvimi", Icon: Calendar },
    { href: "/firma-paneli/profilim", label: "Profil & Galeri", Icon: Briefcase },
    { href: "/firma-paneli/ayarlar", label: "Ayarlar", Icon: Settings },
  ];

  const adminItems = [
    { href: "/admin/panel", label: "Yönetim Paneli", Icon: LayoutDashboard },
    { href: "/admin/firmalar", label: "Firmalar", Icon: Briefcase },
    { href: "/admin/yorumlar", label: "Yorum Moderasyonu", Icon: MessagesSquare },
    { href: "/admin/ayarlar", label: "Site Ayarları", Icon: Settings },
  ];

  const items =
    role === "FIRM_OWNER" || role === "FIRM_STAFF"
      ? firmItems
      : role === "ADMIN" || role === "SUPER_ADMIN"
      ? adminItems
      : coupleItems;

  const RoleIcon = meta.Icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "group flex items-center gap-2 rounded-full border border-border bg-background pl-1 pr-3 text-sm transition-all",
            "hover:shadow-sm",
          )}
        >
          <span
            className={cn(
              "grid h-8 w-8 place-items-center rounded-full text-xs font-semibold transition-all",
              meta.avatarBg,
              meta.ringClass,
            )}
            aria-hidden
          >
            {initials(user.name, user.email)}
          </span>
          <span className="hidden flex-col items-start leading-tight md:flex">
            <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              {meta.label}
            </span>
            <span className="max-w-[120px] truncate text-xs font-semibold text-foreground">
              {user.name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "Hesap"}
            </span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform group-data-[state=open]:rotate-180" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <div className="flex items-start gap-3 px-2 py-2">
          <span
            className={cn(
              "grid h-10 w-10 flex-shrink-0 place-items-center rounded-full text-sm font-semibold",
              meta.avatarBg,
            )}
          >
            {initials(user.name, user.email)}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <RoleIcon className="h-3 w-3 text-muted-foreground" />
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {meta.label}
              </span>
            </div>
            <p className="truncate text-sm font-semibold text-foreground">
              {user.name ?? user.email?.split("@")[0]}
            </p>
            {user.email && (
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Hesabım</DropdownMenuLabel>
        {items.map(({ href, label, Icon }) => (
          <DropdownMenuItem key={href} asChild>
            <Link href={href} className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <span>{label}</span>
            </Link>
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700"
          onSelect={(e) => {
            e.preventDefault();
            void signOut({ callbackUrl: "/", redirect: true });
          }}
        >
          <LogOut className="h-4 w-4" />
          <span>Çıkış Yap</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/**
 * Yer tutucu: oturum durumu hâlâ yüklenirken gösterilir.
 * SSR'da render olur, hydration sonrası UserMenu veya AuthButtons ile yer değiştirir.
 */
export function UserMenuSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-muted">
        <UserIcon className="h-4 w-4 text-muted-foreground" />
      </span>
    </div>
  );
}
