export function LacKnowledgeCards() {
  const cards = [
    {
      icon: "🐞",
      title: "ครั่งคืออะไร & ถิ่นกำเนิด",
      desc: "ยางธรรมชาติจากแมลงครั่ง (Laccifer lacca) สารชันสีแดงธรรมชาติตั้งแต่เอเชียใต้ถึงตะวันออกเฉียงใต้",
      tag: "พื้นฐานครั่ง",
      bgColor: "bg-rose-50 dark:bg-rose-950/30",
      borderColor: "border-rose-200 dark:border-rose-800",
      badgeColor: "bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200",
    },
    {
      icon: "🌳",
      title: "พืชอาศัย & นิเวศวิทยา",
      desc: "ต้นไม้อาศัยที่เหมาะแก่การเพาะเลี้ยง เช่น จามจุรี (ก้ามปู) ปลัก สีเสียด พร้อมรับมือสภาวะโลกร้อน",
      tag: "นิเวศวิทยา",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      borderColor: "border-emerald-200 dark:border-emerald-800",
      badgeColor: "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200",
    },
    {
      icon: "📅",
      title: "การเพาะเลี้ยง & การจัดการ",
      desc: "เทคนิคการคัดแม่พันธุ์ รอบปฏิทินฤดูกาล (รอบร้อน/ฝน) อัตราปล่อยพันธุ์ และการดูแลป้องกันศัตรูครั่ง",
      tag: "คู่มือเกษตรกร",
      bgColor: "bg-amber-50 dark:bg-amber-950/30",
      borderColor: "border-amber-200 dark:border-amber-800",
      badgeColor: "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200",
    },
    {
      icon: "🧪",
      title: "ผลิตภัณฑ์ & การแปรรูป",
      desc: "การแปรรูปสู่ครั่งเมล็ด เชลแลก สีย้อมผ้า สารเคลือบผิวผลไม้/ยา และน้ำล้างครั่งบำรุงดิน",
      tag: "นวัตกรรม & มูลค่า",
      bgColor: "bg-sky-50 dark:bg-sky-950/30",
      borderColor: "border-sky-200 dark:border-sky-800",
      badgeColor: "bg-sky-100 dark:bg-sky-900 text-sky-800 dark:text-sky-200",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-8 space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          📚 หมวดหมู่องค์ความรู้เรื่องครั่ง
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          เจาะลึกข้อมูลทางนิเวศวิทยา การเพาะเลี้ยง และอุตสาหกรรมแปรรูปครั่ง
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} ${card.borderColor} border p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl">{card.icon}</span>
                <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${card.badgeColor}`}>
                  {card.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {card.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
