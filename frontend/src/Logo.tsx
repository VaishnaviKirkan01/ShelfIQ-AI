import { Box } from "lucide-react";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2 text-xl font-extrabold">
      <Box className="h-7 w-7 text-leaf" />
      <span className={light ? "text-sidebar-foreground" : "text-primary"}>
        Shelf<span className="text-leaf">IQ</span>
      </span>
    </span>
  );
}
