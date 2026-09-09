import { useEffect, useState } from "react";
import { RacContainer, RacSection, RacSectionHeader } from "@/components/rac";
import { ActivityCard } from "./ActivityCard";
import { ActivityDetailModal } from "./ActivityDetailModal";
import { getActivities } from "../data/activityRepository";
import type { Activity } from "../types";

export function ActivitySection() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selected, setSelected] = useState<Activity | null>(null);

  useEffect(() => {
    let active = true;
    const sync = async () => {
      try {
        const items = await getActivities();
        if (active) setActivities(items.filter((item) => item.status === "published"));
      } catch {
        if (active) setActivities([]);
      }
    };
    void sync();
    const onStorage = () => void sync();
    window.addEventListener("storage", onStorage);
    return () => {
      active = false;
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  if (!activities.length) return null;

  return (
    <>
      <RacSection id="activities" className="scroll-mt-24 bg-white/70">
        <RacContainer>
          <RacSectionHeader
            eyebrow="Activities & Stories"
            title="กิจกรรมและเรื่องราวจากศูนย์เรียนรู้"
            description="รวมกิจกรรม ข่าวสาร และเรื่องราวการเรียนรู้ พร้อมภาพประกอบจากพื้นที่จริง"
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} onOpen={() => setSelected(activity)} />
            ))}
          </div>
        </RacContainer>
      </RacSection>
      {selected && <ActivityDetailModal activity={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
