import { ArrowRight, Calendar } from "lucide-react";
import { MotionDiv } from "@/components/MuFramer";
import MuImage from "@/components/MuImage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Event } from "@/lib/types";

interface Props {
  event: Event;
}

export default function EventCard({ event }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <MotionDiv
          whileHover={{ y: -8, scale: 1.01 }}
          transition={{ duration: 0.3, ease: [0.25, 0.8, 0.25, 1] }}
          className="group relative bg-mulearn-whitish rounded-tl-[32px] rounded-br-[32px] rounded-tr-xl rounded-bl-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-mulearn-greyish/30 hover:border-mulearn/40 w-full sm:w-[380px] h-[460px] flex flex-col cursor-pointer select-none before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1.5 before:bg-gradient-to-b before:from-mulearn-trusty-blue before:to-mulearn-duke-purple before:rounded-l-full"
        >
          {/* Asymmetric Image Frame */}
          <div className="relative w-full h-48 overflow-hidden p-3 flex items-center justify-center">
            <div className="w-full h-full rounded-[20px] overflow-hidden relative flex items-center justify-center">
              <MuImage
                src={event.image || "/assets/events/fallback.webp"}
                alt={event.title}
                width={800}
                height={400}
                className="object-contain w-full h-full group-hover:scale-104 transition-transform duration-500"
              />
            </div>

            {/* Pulsing Live indicator */}
            {event.isLive && (
              <div className="absolute top-5 left-5 bg-mulearn-trusty-blue text-mulearn-whitish text-[10px] font-black tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm animate-pulse">
                <span className="w-1 h-1 bg-mulearn-whitish rounded-full" />
                LIVE
              </div>
            )}
          </div>

          {/* Event Content Details */}
          <div className="px-6 pb-6 pt-2 flex-1 flex flex-col justify-between">
            <div className="space-y-3">
              {/* Date badge inline with calendar icon */}
              {event.date && (
                <div className="flex items-center gap-1.5 text-mulearn-gray-600 text-xs font-semibold">
                  <Calendar className="w-3.5 h-3.5 text-mulearn" />
                  <span>{event.date}</span>
                </div>
              )}

              <h3 className="text-mulearn-blackish font-extrabold text-lg leading-snug line-clamp-2 group-hover:text-mulearn transition-colors duration-200">
                {event.title}
              </h3>

              <p className="text-mulearn-gray-600 text-sm leading-relaxed line-clamp-3">
                {event.description}
              </p>
            </div>

            {/* Custom Interactive Explore Strip */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-mulearn-greyish/20">
              <span className="text-xs font-bold uppercase tracking-wider text-mulearn-gray-600/80 group-hover:text-mulearn transition-colors duration-300">
                Explore Event
              </span>
              <div className="w-10 h-10 rounded-xl bg-mulearn/5 group-hover:bg-mulearn text-mulearn group-hover:text-mulearn-whitish flex items-center justify-center transition-all duration-300 shadow-inner group-hover:shadow-lg group-hover:shadow-mulearn/20">
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </div>
            </div>
          </div>
        </MotionDiv>
      </DialogTrigger>

      {/* Pop-up Dialog Details */}
      <DialogContent className="max-w-lg rounded-tl-[32px] rounded-br-[32px] rounded-tr-xl rounded-bl-xl p-6 border-mulearn-greyish/40 bg-mulearn-whitish">
        <DialogHeader className="space-y-4">
          <DialogTitle className="text-2xl font-black text-mulearn-blackish leading-tight">
            {event.title}
          </DialogTitle>
          {event.date && (
            <div className="inline-flex items-center gap-2 bg-mulearn-greyish/10 text-mulearn-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full w-fit">
              <Calendar className="w-3.5 h-3.5 text-mulearn" />
              <span>{event.date}</span>
            </div>
          )}
          <div className="w-full h-64 overflow-hidden rounded-[20px]">
            <MuImage
              src={event.image || "/assets/events/fallback.webp"}
              alt={event.title}
              width={800}
              height={400}
              className="object-contain w-full h-full"
            />
          </div>
          <DialogDescription className="text-mulearn-gray-600 text-sm leading-relaxed pt-2">
            {event.description}
          </DialogDescription>
        </DialogHeader>
        {event.link && (
          <DialogFooter className="mt-6 pt-4 border-t border-mulearn-greyish/20">
            <Button
              asChild
              size="icon"
              className="w-full bg-mulearn hover:bg-mulearn-trusty-blue text-mulearn-whitish rounded-xl py-6 font-semibold text-sm transition-all duration-300"
            >
              <a target="_blank" href={event.link} rel="noopener noreferrer">
                Go to Event
              </a>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
