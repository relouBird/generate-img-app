import { cn } from "@/utils/cn";
import { Spinner } from "../ui/Spinner";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "../ui/Button";
import { LoaderAreas } from "@/constants";

type SpinnerSize = ComponentProps<typeof Spinner>["size"];
type SpinnerType = ComponentProps<typeof Spinner>["type"];

type Props = {
  visible: boolean;
  text?: string;
  size?: SpinnerSize;
  isDeleting?: boolean;
  spinnerType?: SpinnerType;
  area?: LoaderAreas;
  className?: string;
  children: ReactNode;
};

export function Overlay({
  visible,
  text = "Veuillez patienter ...",
  size = "lg",
  spinnerType = "dotted-round",
  isDeleting = false,
  area = LoaderAreas.BODY,
  className,
  children,
}: Props) {
  return (
    <>
      {visible && area === LoaderAreas.BODY && (
        <div
          className={cn(
            "inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-foreground-100/50 backdrop-blur-xs",
            LoaderAreas.BODY ? "fixed" : "absolute",
            className,
          )}
        >
          <Button className="bg-white" disabled>
            {isDeleting ? (
              <Spinner
                size={size}
                type={spinnerType}
                className="stroke-red-500 text-red-500"
              />
            ) : (
              <Spinner
                size={size}
                type={spinnerType}
                className="stroke-primary-500 text-primary-500"
              />
            )}

            <p className="text-sm text-black/60 font-medium drop-shadow">
              {text}
            </p>
          </Button>
        </div>
      )}

      {/* Loader en mode zone slot */}
      <div className="relative">
        {children}

        {visible && area === LoaderAreas.SLOT && (
          <div
            className={cn(
              "inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-foreground-100/50 backdrop-blur-xs",
              LoaderAreas.BODY ? "fixed" : "absolute",
              className,
            )}
          >
            <Button className="bg-white" disabled>
              <Spinner
                size={size}
                type={spinnerType}
                className="stroke-primary-500 text-primary-500"
              />
              <p className="text-base text-black/60 font-medium drop-shadow">
                {text}
              </p>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
