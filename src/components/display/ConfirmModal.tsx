// components/modals/AssignIndicatorsModal.tsx
import { useState } from "react";
import { Close, BarChart2, User2, Check } from "@tailgrids/icons";
import { cn } from "@/utils/cn";
import type {
  InitiativeType,
  ParticipantType,
  IndicatorsType,
} from "@/types/configuration.type";
import { Button } from "../ui/Button";

type Props = {
  initiative: InitiativeType;
  participant: ParticipantType;
  indicators: IndicatorsType[]; // indicateurs sélectionnés pour ce participant
  onConfirm: () => Promise<void>;
  onClose: () => void;
  loading?: boolean;
};

export function AssignIndicatorsModal({
  initiative,
  participant,
  indicators,
  onConfirm,
  onClose,
  loading = false,
}: Props) {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground-100/40 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg rounded-2xl border border-base-200 bg-background-50 shadow-lg flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-base-200 shrink-0">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-lg bg-primary-50 text-primary-500 grid place-items-center">
              <Check className="size-5" />
            </div>
            <h2 className="text-base font-semibold text-title-50">
              Confirmer l'assignation
            </h2>
          </div>
          <Button
            variant="ghost"
            iconOnly
            onClick={onClose}
            disabled={loading}
            className="size-8 rounded-lg grid place-items-center text-text-tertiary hover:bg-background-soft-100"
          >
            <Close className="size-4" />
          </Button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Initiative */}
          <div className="rounded-xl border border-base-200 bg-background-soft-50 p-4">
            <div className="flex items-center gap-2 text-primary-600 mb-2">
              <BarChart2 className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Initiative
              </span>
            </div>
            <p className="text-base font-medium text-title-50">
              {initiative.nom}
            </p>
            <p className="text-xs text-text-tertiary">ID #{initiative.id}</p>
          </div>

          {/* Participant */}
          <div className="rounded-xl border border-base-200 bg-background-soft-50 p-4">
            <div className="flex items-center gap-2 text-primary-600 mb-2">
              <User2 className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Participant
              </span>
            </div>
            <p className="text-base font-medium text-title-50">
              {participant.name}
            </p>
            <p className="text-xs text-text-tertiary">{participant.email}</p>
          </div>

          {/* Indicateurs assignés */}
          <div className="rounded-xl border border-base-200 bg-background-soft-50 p-4">
            <div className="flex items-center gap-2 text-primary-600 mb-2">
              <BarChart2 className="size-4" />
              <span className="text-xs font-semibold uppercase tracking-wide">
                Indicateurs à assigner
              </span>
            </div>
            {indicators.length === 0 ? (
              <p className="text-sm text-text-tertiary italic">
                Aucun indicateur sélectionné
              </p>
            ) : (
              <ul className="space-y-2">
                {indicators.map((ind) => (
                  <li
                    key={ind.id}
                    className="border-b border-base-200 last:border-0 pb-2 last:pb-0"
                  >
                    <p className="text-sm font-medium text-title-50">
                      {ind.label}
                    </p>
                    <p className="text-xs text-text-tertiary">
                      {ind.code} • {ind.type}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Checkbox de confirmation */}
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="confirm-assign"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="size-4 rounded border-base-200 text-primary-500 focus:ring-primary-500"
            />
            <label
              htmlFor="confirm-assign"
              className="text-sm text-text-secondary"
            >
              Je confirme l'assignation de ces indicateurs à {participant.name}
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-base-200 bg-background-soft-50 shrink-0">
          <button
            onClick={onClose}
            disabled={loading}
            className="h-9 px-4 rounded-lg text-sm font-medium text-foreground-soft-500 border border-base-200 bg-background-50 hover:bg-background-soft-100"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={async () => {
              await onConfirm();
            }}
            disabled={loading || !confirmed}
            className={cn(
              "h-9 px-4 rounded-lg text-sm font-medium text-white transition-colors disabled:opacity-60 flex items-center gap-2",
              "bg-primary-500 hover:bg-primary-600",
            )}
          >
            {loading && (
              <svg
                className="size-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}
