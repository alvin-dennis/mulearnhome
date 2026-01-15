import { MotionDiv } from "@/components/MuFramer";
import { Button } from "@/components/ui/button";
import { galleryCategories } from "@/data/impact-gallery";

interface FilterButtonsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function FilterButtons({ activeFilter, onFilterChange }: FilterButtonsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {galleryCategories.map((category) => (
        <MotionDiv key={category.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={activeFilter === category.id ? "default" : "outline"}
            onClick={() => onFilterChange(category.id)}
            className="px-4 py-2 md:px-6 md:py-3 rounded-full font-semibold"
          >
            {category.label}
            <span
              className={`ml-2 sm:text-xs md:text-sm ${
                activeFilter === category.id ? "text-mulearn-whitish/80" : "text-mulearn-gray-600"
              }`}
            >
              ({category.count})
            </span>
          </Button>
        </MotionDiv>
      ))}
    </div>
  );
}
