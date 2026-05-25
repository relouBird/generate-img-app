// Topbar.tsx
import { NavLink } from "react-router";
import { cn } from "@/utils/cn";
import { NAV_ITEMS } from "@/constants/display/configuration.constant";
import { DropdownItem } from "@/components/ui/DropDown"; // ← import du composant

export function Topbar() {
  return (
    <header className="relative top-0 z-50 w-full border-b border-base-200 bg-background-50/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-lg bg-primary-500 grid place-items-center">
            <span className="text-white text-sm font-bold">D</span>
          </div>
          <span className="text-base font-semibold text-title-50">
            Dashboard
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <DropdownItem key={item.label} item={item} />
            ) : (
              <NavLink
                key={item.path}
                to={item.path!}
                end={item.path === "/"}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary-500 bg-primary-50"
                      : "text-foreground-soft-500 hover:text-title-50 hover:bg-background-soft-100",
                  )
                }
              >
                {item.label}
              </NavLink>
            ),
          )}
        </nav>

        {/* Avatar */}
        <div className="flex items-center gap-3">
          <button className="relative rounded-full size-9 bg-primary-100 grid place-items-center text-primary-500 font-semibold text-sm hover:bg-primary-200 transition-colors">
            RB
          </button>
        </div>
      </div>
    </header>
  );
}