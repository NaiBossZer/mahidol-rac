import { useEffect, useState } from "react";
import { RacContainer, RacSection, RacSectionHeader } from "@/components/rac";
import { ActivityCard } from "./ActivityCard";
import { ActivityDetailModal } from "./ActivityDetailModal";
import { loadActivities } from "../data/activityData";
import type { Activity } from "../types";

export function ActivitySection() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selected, setSelected] = useState<Activity | null>(null);

  useEffect(() => {
    const sync = () => setActivities(loadActivities().filter((item) => item.status === "published"));
    sync();
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  if (!activities.length) return null;

  return (
    <>
      <RacSection id="activities" className="scroll-mt-24 bg-white/70">
        <RacContainer>
          <RacSectionHeader eyebrow="Activities & Stories" title="กิจกรรมและเรื่องราวจากศูนย์เรียนรู้" description="รวมกิจกรรม ข่าวสาร และเรื่องราวการเรียนรู้ พร้อมภาพประกอบจากพื้นที่จริง" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {activities.map((activity) => <ActivityCard key={activity.id} activity={activity} onOpen={() => setSelected(activity)} />)}
          </div>
        </RacContainer>
      </RacSection>
      {selected && <ActivityDetailModal activity={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
