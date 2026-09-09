import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, PlayCircle, ClipboardCheck, BarChart3 } from "lucide-react";

const ITEMS = [
  { label: "หน้าแรก", href: "/", icon: Home },
  { label: "ความรู้", href: "/lac/what-is-lac", icon: BookOpen },
  { label: "ใช้ประโยชน์", href: "/lac/application", icon: PlayCircle },
  { label: "ประเมิน", href: "/survey", icon: ClipboardCheck },
  { label: "สรุปผล", href: "/dashboard", icon: BarChart3 },
];

export function AppBottomBar() {
  const location = useLocation();
  const isKnowledge = location.pathname.startsWith("/lac/") && location.pathname !== "/lac/application";

  return (
    <nav aria-label="เมนูด้านล่าง" className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-rac-blue/95 text-white shadow-[0_-8px_24px_rgba(7,31,52,0.18)] backdrop-blur-md">
      <div className="mx-auto grid h-11 max-w-2xl grid-cols-5 sm:h-12">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/lac/what-is-lac" ? isKnowledge : location.pathname === item.href;
          return (
            <Link key={item.href} to={item.href} className={`flex min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-[9px] font-medium transition sm:text-[10px] ${active ? "bg-white/10 text-rac-gold" : "text-white/75 hover:bg-white/5 hover:text-white"}`} aria-current={active ? "page" : undefined}>
              <Icon size={14} aria-hidden="true" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
