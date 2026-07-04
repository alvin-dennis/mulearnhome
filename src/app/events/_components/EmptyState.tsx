import { Calendar, type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  isError?: boolean;
}

export function EmptyState({
  icon: Icon = Calendar,
  title,
  description,
  isError = false,
}: EmptyStateProps) {
  return (
    <div className="text-center py-8 md:py-12">
      <Icon
        className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 ${isError ? "text-destructive" : "text-mulearn-gray-600"}`}
      />
      <h3
        className={`text-lg md:text-xl font-semibold mb-2 ${isError ? "text-destructive" : "text-mulearn-gray-600"}`}
      >
        {title}
      </h3>
      <p className="text-mulearn-gray-600 text-sm md:text-base">{description}</p>
    </div>
  );
}
