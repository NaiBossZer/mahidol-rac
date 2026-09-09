import { C } from "./tokens";

export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className="font-mono section-eyebrow" style={{ color: light ? C.amber : C.amber }}>
      {children}
    </p>
  );
}

export function SourceTag({ children }: { children: React.ReactNode }) {
  return <span className="source-tag">{children}</span>;
}

export function PageHero({
  eyebrow,
  title,
  subtitle,
  dark = true,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  subtitle?: string;
  dark?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section
      style={{ background: dark ? C.dark : C.wood }}
      className="px-6 py-20 md:py-28"
    >
      <div className="max-w-[1200px] mx-auto">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1
          className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold mt-3 mb-6 leading-tight"
          style={{ color: C.cream }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className="font-body text-lg md:text-xl max-w-[600px] leading-relaxed"
            style={{ color: "rgba(243,235,221,0.72)", fontFamily: "'Noto Sans Thai', sans-serif" }}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

export function SectionWrap({
  children,
  bg,
  className = "",
}: {
  children: React.ReactNode;
  bg?: string;
  className?: string;
}) {
  return (
    <section style={{ background: bg || C.cream }} className={`px-6 py-16 md:py-20 ${className}`}>
      <div className="max-w-[1200px] mx-auto">{children}</div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: React.ReactNode;
  desc?: string;
}) {
  return (
    <div className="mb-10 md:mb-14">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="font-display text-3xl md:text-4xl font-semibold mt-2" style={{ color: C.dark }}>
        {title}
      </h2>
      {desc && (
        <p
          className="font-body text-base md:text-lg mt-3 max-w-[560px] leading-relaxed"
          style={{ color: C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}
        >
          {desc}
        </p>
      )}
    </div>
  );
}

export function KnowledgeCard({
  img,
  alt,
  category,
  title,
  desc,
  onClick,
}: {
  img: string;
  alt: string;
  category: string;
  title: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="interactive-card group text-left rounded-xl overflow-hidden w-full"
      style={{ background: "#fff", boxShadow: "0 2px 16px rgba(42,33,29,0.08)" }}
    >
      <div className="h-44 overflow-hidden relative" style={{ background: C.creamDeep }}>
        <img
          src={img}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(42,33,29,0.35) 0%, transparent 60%)" }}
        />
      </div>
      <div className="p-5">
        <Eyebrow>{category}</Eyebrow>
        <h3 className="font-display text-lg font-semibold mt-1.5 mb-2" style={{ color: C.dark }}>
          {title}
        </h3>
        <p
          className="font-body text-sm leading-relaxed line-clamp-2"
          style={{ color: C.muted, fontFamily: "'Noto Sans Thai', sans-serif" }}
        >
          {desc}
        </p>
        <div className="mt-4 flex items-center gap-2" style={{ color: C.blue }}>
          <span className="font-mono text-xs tracking-wide">เข้าชม</span>
          <span className="text-sm transition-transform duration-200 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </button>
  );
}

export function DetailDrawer({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 drawer-backdrop"
        onClick={onClose}
      />
      {/* Drawer */}
      <div
        className="fixed right-0 top-0 bottom-0 z-50 overflow-y-auto animate-slideIn"
        style={{
          width: "min(420px, 92vw)",
          background: C.cream,
          boxShadow: "-8px 0 40px rgba(42,33,29,0.25)",
        }}
      >
        <div className="flex items-center justify-between p-6 border-b sticky top-0 z-10"
          style={{ background: C.cream, borderColor: "rgba(90,64,48,0.15)" }}>
          <h3 className="font-display text-xl font-semibold" style={{ color: C.dark }}>{title}</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-lg transition-colors"
            style={{ background: "rgba(90,64,48,0.1)", color: C.dark }}
            aria-label="ปิด"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </>
  );
}

export function ProcessStep({
  num,
  title,
  desc,
  icon,
  note,
  active,
  onClick,
}: {
  num: string;
  title: string;
  desc: string;
  icon: string;
  note?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-xl overflow-hidden transition-all duration-200 border"
      style={{
        background: active ? C.dark : "#fff",
        borderColor: active ? C.blue : "rgba(90,64,48,0.12)",
      }}
    >
      <div className="flex items-start gap-4 p-5">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: active ? "rgba(255,255,255,0.1)" : `${C.amber}20` }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[9px] tracking-[0.15em] uppercase mb-0.5" style={{ color: active ? C.amber : C.amber }}>
            {num}
          </p>
          <p className="font-display font-semibold text-base" style={{ color: active ? C.cream : C.dark }}>
            {title}
          </p>
          {active && (
            <p
              className="font-body text-sm leading-relaxed mt-2 animate-fadeIn"
              style={{ color: "rgba(243,235,221,0.8)", fontFamily: "'Noto Sans Thai', sans-serif" }}
            >
              {desc}
            </p>
          )}
          {active && note && (
            <div className="mt-3 rounded-lg px-3 py-2" style={{ background: `${C.amber}20`, border: `1px solid ${C.amber}30` }}>
              <p className="font-body text-xs" style={{ color: C.amber, fontFamily: "'Noto Sans Thai', sans-serif" }}>
                ⚠️ {note}
              </p>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}

export function Footer({ navigate }: { navigate: (p: string) => void }) {
  const links = [
    {
      label: "ความรู้",
      items: [
        { label: "ครั่งคืออะไร", page: "what-is-lac" },
        { label: "วงจรชีวิต", page: "life-cycle" },
        { label: "ระบบนิเวศ", page: "habitat" },
        { label: "ต้นพิงอาศัย", page: "host-plants" },
        { label: "การเพาะเลี้ยง", page: "lac-farming" },
      ],
    },
    {
      label: "ผลิตภัณฑ์",
      items: [
        { label: "ครั่งสู่ผลิตภัณฑ์", page: "lac-product" },
        { label: "นวัตกรรม", page: "product-innovation" },
        { label: "ครั่งรอบตัว", page: "lac-around-us" },
      ],
    },
    {
      label: "เกษตรกร & ชุมชน",
      items: [
        { label: "ครั่งลำปาง", page: "lampang-lac" },
        { label: "ทางเลือกเกษตรกร", page: "farmers-choice" },
        { label: "Carbon Footprint", page: "carbon-footprint" },
        { label: "ชุมชน", page: "community" },
      ],
    },
  ];

  return (
    <footer
      style={{ background: C.dark, borderTop: "1px solid rgba(255,255,255,0.06)" }}
      className="py-16"
    >
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div>
            <button onClick={() => navigate("home")} className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-mono font-bold"
                style={{ background: C.red, color: C.cream }}
              >
                ครั่ง
              </div>
            </button>
            <p className="font-mono text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: C.amber }}>
              LAC LEARNING CENTER
            </p>
            <p
              className="font-body text-sm leading-relaxed mt-2"
              style={{ color: "rgba(243,235,221,0.5)", fontFamily: "'Noto Sans Thai', sans-serif" }}
            >
              ห้องเรียนรู้ครั่ง<br />ความรู้ที่ยั่งยืน
            </p>
          </div>
          {links.map((group) => (
            <div key={group.label}>
              <p className="font-mono text-[9px] tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(243,235,221,0.3)" }}>
                {group.label}
              </p>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item.page}>
                    <button
                      onClick={() => navigate(item.page)}
                      className="font-body text-sm transition-colors"
                      style={{ color: "rgba(243,235,221,0.55)", fontFamily: "'Noto Sans Thai', sans-serif" }}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          className="pt-8 border-t flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          style={{ borderColor: "rgba(255,255,255,0.06)" }}
        >
          <p className="font-mono text-xs" style={{ color: "rgba(243,235,221,0.25)" }}>
            © 2568 LAC Learning Center — ห้องเรียนรู้ครั่ง
          </p>
          <div className="flex gap-6">
            {["TGO", "ISO 14067", "สำนักงานเศรษฐกิจการเกษตร"].map((s) => (
              <span key={s} className="font-mono text-[9px] tracking-[0.12em]" style={{ color: "rgba(243,235,221,0.2)" }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
