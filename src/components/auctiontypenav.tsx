import React from "react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { IconDeselect, IconPanoramaVertical } from "@tabler/icons-react";

export function FloatingDockDemo() {
  const links = [
    {
      title: "Standard",
      icon: (
        <IconPanoramaVertical className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/standard",
    },

    {
      title: "Sealed",
      icon: (
        <IconDeselect className="h-full w-full text-neutral-500 dark:text-neutral-300" />
      ),
      href: "/sealed",
    },
  ];
  return (
    <div className="flex items-center justify-center h-[35rem] w-full">
      <FloatingDock
        mobileClassName="translate-y-20" // only for demo, remove for production
        items={links}
      />
    </div>
  );
}
