import { OMEvent } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MuImage from "@/components/MuImage";
import { Badge } from "@/components/ui/badge";
import { Mic, Calendar } from "lucide-react";

interface EventsGridProps {
    events: OMEvent[];
    title: string;
    icon: React.ReactNode;
}

export default function EventsGrid({ events, title, icon }: EventsGridProps) {
    return (
        <div>
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold flex items-center justify-center">
                    {icon}
                    {title}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event) => (
                    <Card key={event.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden h-full flex flex-col">
                        <div className="h-48 bg-linear-to-br from-mulearn-trusty-blue/20 to-mulearn-duke-purple/20 flex items-center justify-center relative shrink-0">
                            {event.thumbnail ? (
                                <MuImage
                                    src={event.thumbnail}
                                    alt={`Office Hour: ${event.title}`}
                                    width={400}
                                    height={192}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <Mic className="w-16 h-16 text-mulearn-trusty-blue" />
                            )}

                            <div className="absolute top-4 right-4">
                                <Badge
                                    variant={event.isUpcoming ? "default" : "secondary"}
                                >
                                    {event.isUpcoming ? "Upcoming" : "Past Event"}
                                </Badge>
                            </div>
                        </div>

                        <CardHeader className="pb-4 grow">
                            <div className="flex flex-wrap gap-2 mb-3">
                                {event.tags.map((tag: string) => (
                                    <Badge
                                        key={tag}
                                        variant="outline"
                                        className="text-mulearn-trusty-blue bg-mulearn-trusty-blue/10"
                                    >
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            <CardTitle className="text-xl mb-2 line-clamp-2">
                                {event.title}
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="pt-0 flex flex-col">
                            <div className="flex justify-between items-center pt-4 border-t border-mulearn-gray-600/30">
                                <span className="text-sm text-mulearn-gray-500 font-medium flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {event.date}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
