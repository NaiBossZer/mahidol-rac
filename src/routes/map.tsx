import { createFileRoute } from "@tanstack/react-router";
import { InteractiveMap } from "~/components/InteractiveMap";

export const Route = createFileRoute("/map")({
  component: MapPage,
});

function MapPage() {
  return (
    <div className="py-8">
      <InteractiveMap />
    </div>
  );
}
