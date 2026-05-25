type Props = {
  onStart: () => void;
};

export function EmptyConversation({ onStart }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-8">
      {/* Icône décorative */}
      <div className="size-16 rounded-2xl bg-primary-50 grid place-items-center">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="6" width="24" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" className="text-primary-400"/>
          <path d="M10 12h12M10 17h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary-400"/>
          <path d="M10 24l2-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary-300"/>
        </svg>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-title-50">
          Commencez à générer
        </h3>
        <p className="text-sm text-foreground-soft-400 max-w-xs">
          Décrivez l'image que vous souhaitez créer et laissez l'IA travailler.
        </p>
      </div>

      <button
        onClick={onStart}
        className="px-5 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
      >
        Nouvelle conversation
      </button>
    </div>
  );
}
