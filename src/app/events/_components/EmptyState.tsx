import { Calendar, type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
}

export function EmptyState({ icon: Icon = Calendar, title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-8 md:py-12">
      <Icon className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-3 md:mb-4" />
      <h3 className="text-lg md:text-xl font-semibold text-gray-600 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm md:text-base">{description}</p>
    </div>
  );
}
