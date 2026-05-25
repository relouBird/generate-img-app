import React, { useState } from "react";
import { Button } from "../ui/Button";
import { MenuFriesLeft1 } from "@tailgrids/icons";
import { IconGhost } from "../icons/IconGhost";

interface MobileTopBarProps {
  onToggleSidebar: () => void;
  onToggleIncognito?: () => void;
}

const MobileTopBar: React.FC<MobileTopBarProps> = ({
  onToggleSidebar,
  onToggleIncognito,
}) => {
  const [isIncognito, setIsIncognito] = useState(false);

  const handleIncognitoToggle = () => {
    setIsIncognito(!isIncognito);
    onToggleIncognito?.();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 md:hidden bg-background-soft-50">
      <div
        className={`h-16 flex items-center justify-between px-4 border-b transition-colors duration-200 ${
          isIncognito ? "border-gray-800" : "border-gray-200"
        }`}
      >
        {/* Menu Burger - Gauche */}
        <Button
          iconOnly
          onClick={onToggleSidebar}
          className={`p-2 rounded-lg transition-colors duration-200 bg-transparent text-primary-500 focus-visible:hidden outline-none focus:ring-0 focus:ring-transparent`}
          aria-label="Menu"
        >
          <MenuFriesLeft1 size={24} />
        </Button>

        {/* Bouton Incognito - Droite */}
        <Button
          iconOnly
          onClick={handleIncognitoToggle}
          className={`p-2 rounded-lg transition-all duration-200 relative focus-visible:hidden outline-none focus:ring-0 focus:ring-transparent ${
            isIncognito
              ? "bg-purple-600 text-white"
              : "text-primary-500 bg-transparent"
          }`}
          aria-label={
            isIncognito ? "Désactiver le mode privé" : "Activer le mode privé"
          }
        >
          {/* <EyeDisabled size={22} /> */}

          <IconGhost size={28} />

          {/* Indicateur de mode incognito */}
          {isIncognito && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse" />
          )}
        </Button>
      </div>

      {/* Message mode incognito */}
      {isIncognito && (
        <div className="bg-primary-500 text-background-soft-400 text-xs text-center py-1.5 px-4 border-b border-gray-700">
          <span className="flex items-center justify-center gap-2">
            <IconGhost size={14} />
            Navigation privée activée
          </span>
        </div>
      )}
    </header>
  );
};

export default MobileTopBar;
