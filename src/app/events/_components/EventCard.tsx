import { MotionButton, MotionDiv } from "@/components/MuFramer";
import Link from "next/link";

import { ArrowRight, Calendar } from "lucide-react";
import { Event } from "@/lib/types";
import MuImage from "@/components/MuImage";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  event: Event;
}

export default function EventCard({ event }: Props) {
  return (
    <MotionDiv
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={`group relative bg-mulearn-whitish rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border/50 hover:border-mulearn-trusty-blue w-full sm:w-[380px] h-[360px] flex flex-col`}
    >
      {event.image && (
        <div className="relative w-full h-44 sm:h-52">
          <MuImage
            src={event.image}
            alt={event.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover w-full h-full rounded-t-2xl"
          />
          <div className="absolute inset-0 rounded-t-2xl pointer-events-none bg-gradient-to-t from-[rgba(0,0,0,0.22)] to-transparent" />
        </div>
      )}

      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="bg-linear-to-r from-mulearn-trusty-blue to-mulearn-duke-purple bg-clip-text text-transparent transition-colors duration-300 line-clamp-2 text-xl">
              {event.title}
            </h3>
            {event.date && (
              <Badge className="bg-mulearn-greyish/20 text-mulearn-trusty-blue hover:bg-mulearn-greyish/20 text-xs px-2 py-1 rounded-full flex items-center gap-1 whitespace-nowrap shrink-0">
                <Calendar className="w-3 h-3 shrink-0" />
                <span className="whitespace-nowrap">{event.date}</span>
              </Badge>
            )}
          </div>

          <p
            className="text-mulearn-blackish text-sm leading-relaxed overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: "6",
            }}
          >
            {event.description}
          </p>
        </div>

        {event.link && (
          <Dialog>
            <DialogTrigger asChild>
              <MotionButton
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-linear-to-r from-mulearn-trusty-blue to-mulearn-duke-purple hover:bg-mulearn-duke-purple text-mulearn-whitish rounded-xl px-4 py-3 font-semibold text-sm shadow-sm hover:shadow-md transition-all duration-300"
              >
                Check it out! <ArrowRight className="w-4 h-4" />
              </MotionButton>
            </DialogTrigger>

            <DialogContent className="max-w-lg rounded-2xl">
              <DialogHeader>
                <DialogTitle>{event.title}</DialogTitle>
                {event.date && (
                  <div className="flex items-center gap-2 text-mulearn-blackish text-sm mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                )}
                {event.image && (
                  <MuImage
                    src={event.image}
                    alt={event.title}
                    width={800}
                    height={400}
                    className="rounded-lg object-cover w-full mb-4"
                  />
                )}
                <DialogDescription className="text-mulearn-blackish text-sm leading-relaxed">
                  {event.description}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <a href={event.link}>
                <Button
                  variant="mulearn"
                  className="w-full flex items-center justify-center gap-3 text-mulearn-whitish rounded-xl px-5 py-3 font-semibold text-sm shadow-sm hover:shadow-md"
                >
                  Go to Event
                </Button>
                </a>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </MotionDiv>
  );
}
