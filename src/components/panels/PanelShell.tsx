"use client";

import { useStore } from "@/lib/store";
import { signOut } from "@/lib/api-client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FilePlus2,
  ListChecks,
  LogOut,
  ExternalLink,
  PenLine,
  Shield,
  Menu,
  X,
  Megaphone,
  Radio,
  Briefcase,
  Mail,
  AlertCircle,
  Users,
  TrendingUp,
  Layout as LayoutIcon,
} from "lucide-react";
import { useState } from "react";

interface PanelShellProps {
  role: "EDITOR" | "ADMIN";
  items: { id: string; label: string; Icon: typeof LayoutDashboard }[];
  active: string;
  onSelect: (id: string) => void;
  user: { name: string; email: string; role: string };
  children: React.ReactNode;
}

export function PanelShell({
  role,
  items,
  active,
  onSelect,
  user,
  children,
}: PanelShellProps) {
  const { navigate, refreshSession } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const onSignOut = async () => {
    await signOut();
    await refreshSession();
    navigate({ type: "home" });
  };

  return (
    <div className="min-h-screen bg-surface-alt flex">
      {/* Sidebar — desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border sticky top-0 h-screen">
        <SidebarContent
          role={role}
          items={items}
          active={active}
          onSelect={onSelect}
          user={user}
          onSignOut={onSignOut}
          onVisitSite={() => navigate({ type: "home" })}
        />
      </aside>

      {/* Sidebar — mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex flex-col w-72 bg-card h-full">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 p-2 rounded-md hover:bg-muted"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent
              role={role}
              items={items}
              active={active}
              onSelect={(id) => {
                onSelect(id);
                setMobileOpen(false);
              }}
              user={user}
              onSignOut={onSignOut}
              onVisitSite={() => navigate({ type: "home" })}
            />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card border-b border-border h-14 flex items-center px-4 md:px-6 gap-3">
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-md hover:bg-muted"
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-ui text-xs text-ink-tertiary">
              {role === "ADMIN" ? "Admin Panel" : "Editor Panel"}
            </p>
            <p className="font-display text-base font-bold leading-tight truncate">
              {items.find((i) => i.id === active)?.label ?? "Dashboard"}
            </p>
          </div>
          <button
            onClick={() => navigate({ type: "home" })}
            className="inline-flex items-center gap-1.5 px-3 h-9 rounded-md border border-border hover:bg-muted font-ui text-xs font-semibold"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">View site</span>
          </button>
        </header>

        {/* Content */}
        <motion.main
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}

function SidebarContent({
  role,
  items,
  active,
  onSelect,
  user,
  onSignOut,
  onVisitSite,
}: {
  role: "EDITOR" | "ADMIN";
  items: { id: string; label: string; Icon: typeof LayoutDashboard }[];
  active: string;
  onSelect: (id: string) => void;
  user: { name: string; email: string; role: string };
  onSignOut: () => void;
  onVisitSite: () => void;
}) {
  return (
    <>
      <div className="p-5 border-b border-border">
        <div className="font-display text-lg font-extrabold">
          The<span className="text-brand">National</span>Dispatch
        </div>
        <p className="font-ui text-[11px] uppercase tracking-wider text-ink-tertiary mt-1 flex items-center gap-1">
          {role === "ADMIN" ? (
            <>
              <Shield className="h-3 w-3" /> Admin Panel
            </>
          ) : (
            <>
              <PenLine className="h-3 w-3" /> Editor Panel
            </>
          )}
        </p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-md font-ui text-sm transition-colors",
                isActive
                  ? "bg-brand text-white font-medium"
                  : "text-ink-secondary hover:bg-muted hover:text-foreground"
              )}
            >
              <item.Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border space-y-2">
        <button
          onClick={onVisitSite}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-muted font-ui text-xs text-ink-secondary hover:text-foreground transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Visit public site
        </button>
        <div className="px-3 py-2 flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-brand/15 text-brand flex items-center justify-center font-display text-sm font-bold shrink-0">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-ui text-xs font-semibold truncate">{user.name}</p>
            <p className="font-ui text-[10px] text-ink-tertiary truncate">{user.email}</p>
          </div>
          <button
            onClick={onSignOut}
            className="p-1.5 rounded-md hover:bg-muted text-ink-secondary hover:text-foreground transition-colors"
            aria-label="Sign out"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </>
  );
}

// Editor sidebar items
export const EDITOR_NAV = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "new-article", label: "New Article", Icon: FilePlus2 },
  { id: "submissions", label: "My Submissions", Icon: ListChecks },
];

// Admin sidebar items
export const ADMIN_NAV = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "articles", label: "Articles", Icon: ListChecks },
  { id: "editors", label: "Editors", Icon: PenLine },
  { id: "ads", label: "Advertisements", Icon: Megaphone },
  { id: "live", label: "Live", Icon: Radio },
  { id: "live-updates", label: "Live Updates", Icon: AlertCircle },
  { id: "breaking", label: "Breaking News", Icon: AlertCircle },
  { id: "careers", label: "Careers", Icon: Briefcase },
  { id: "layout", label: "Homepage Layout", Icon: LayoutIcon },
  { id: "messages", label: "Messages", Icon: Mail },
  { id: "subscribers", label: "Subscribers", Icon: Users },
  { id: "analytics", label: "Analytics", Icon: TrendingUp },
];
