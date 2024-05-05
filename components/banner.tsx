import { AlertTriangle, CheckCircleIcon, InfoIcon } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const bannerVariants = cva(
  "border text-center p-4 text-sm flex items-center w-full",
  {
    variants: {
      variant: {
        warning: "bg-yellow-200/80 border-yellow-30 text-primary",
        success: "bg-emerald-700 border-emerald-800 text-secondary",
        info: "bg-blue-200/80 border-blue-30 text-primary",
      }
    },
    defaultVariants: {
      variant: "warning",
    }
  }
);

interface BannerProps extends VariantProps<typeof bannerVariants> {
  label: React.ReactNode;
  className?: string;
};

const iconMap = {
  warning: AlertTriangle,
  success: CheckCircleIcon,
  info: InfoIcon
};

export const Banner = ({
  label,
  variant,
  className,
}: BannerProps) => {
  const Icon = iconMap[variant || "warning"];

  return  (
    <div className={cn(bannerVariants({ variant }), className)}>
      <Icon className="h-4 w-4 mr-2" />
      {label}
    </div>
  );
};
