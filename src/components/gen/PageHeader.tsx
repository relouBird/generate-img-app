import { Button } from "@/components/ui/Button";
import { Plus } from "@tailgrids/icons";
import type { ReactNode } from "react";

export type HeaderProps = {
  title: string;
  description: string;
  buttonName?: string;
  children?: ReactNode;
  onView: () => void;
};

export function PageHeader({
  title,
  description,
  onView,
  buttonName,
  children,
}: HeaderProps) {
  return (
    <>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-title-50">{title}</h1>
          <p className="text-sm text-text-secondary mt-1">{description}</p>
        </div>

        {/* Bouton création — à remplacer par ton composant */}
        <div id="create-cat-slot" className="shrink-0">
          <Button size="sm" className="rounded-lg" onClick={onView}>
            <span>{buttonName ? buttonName : "Créer"}</span>
            {children ? children : <Plus />}
          </Button>
        </div>
      </div>
    </>
  );
}
