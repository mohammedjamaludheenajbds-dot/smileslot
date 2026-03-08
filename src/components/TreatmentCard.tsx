import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, IndianRupee, Layers, Play, Image as ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import type { Treatment } from "@/data/dentists";
import { motion, AnimatePresence } from "framer-motion";

const TreatmentCard = ({ treatment }: { treatment: Treatment }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <div className="rounded-xl border bg-card transition-all duration-300 card-shadow hover:card-shadow-hover">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <Badge variant="outline" className="mb-2 text-xs">{treatment.category}</Badge>
            <h3 className="font-display text-lg font-bold text-foreground">{treatment.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{treatment.description}</p>
          </div>
          {/* Thumbnail preview */}
          {treatment.images.length > 0 && (
            <div className="hidden shrink-0 sm:block">
              <img
                src={treatment.images[0]}
                alt={treatment.name}
                className="h-20 w-28 rounded-lg object-cover border"
                loading="lazy"
              />
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center gap-1.5 text-sm">
            <IndianRupee className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">₹{treatment.idaFixedCost.min.toLocaleString()} - ₹{treatment.idaFixedCost.max.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">(IDA Fixed)</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            {treatment.duration}
          </div>
          {treatment.materials.length > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Layers className="h-4 w-4 text-primary" />
              {treatment.materials.length} material options
            </div>
          )}
          {treatment.images.length > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <ImageIcon className="h-4 w-4 text-primary" />
              {treatment.images.length} photos
            </div>
          )}
          {treatment.youtubeId && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Play className="h-4 w-4 text-primary" />
              Video
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="mt-3 gap-1 text-primary"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Hide Details" : "View Photos, Video & Details"}
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="border-t px-5 pb-5 pt-4 space-y-6">
              {/* Photos Gallery */}
              {treatment.images.length > 0 && (
                <div>
                  <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-primary" /> Treatment Photos
                  </h4>
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {treatment.images.map((img, i) => (
                      <Dialog key={i}>
                        <DialogTrigger asChild>
                          <button className="group relative overflow-hidden rounded-lg border aspect-[4/3]">
                            <img
                              src={img}
                              alt={`${treatment.name} photo ${i + 1}`}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                              loading="lazy"
                            />
                            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl p-2">
                          <img
                            src={img}
                            alt={`${treatment.name} photo ${i + 1}`}
                            className="w-full rounded-lg object-contain max-h-[80vh]"
                          />
                        </DialogContent>
                      </Dialog>
                    ))}
                  </div>
                </div>
              )}

              {/* Video */}
              {treatment.youtubeId && (
                <div>
                  <h4 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                    <Play className="h-4 w-4 text-primary" /> Treatment Video
                  </h4>
                  <div className="mt-2 overflow-hidden rounded-lg border aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${treatment.youtubeId}`}
                      title={`${treatment.name} video`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

              {/* Procedure */}
              <div>
                <h4 className="font-display text-sm font-bold text-foreground">Treatment Procedure</h4>
                <ol className="mt-2 space-y-2">
                  {treatment.procedure.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {i + 1}
                      </span>
                      <span className="text-muted-foreground">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Materials */}
              {treatment.materials.length > 0 && (
                <div>
                  <h4 className="font-display text-sm font-bold text-foreground">Choose Material</h4>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    {treatment.materials.map((mat) => (
                      <button
                        key={mat.name}
                        onClick={() => setSelectedMaterial(mat.name)}
                        className={`rounded-lg border p-3 text-left transition-all ${
                          selectedMaterial === mat.name
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground">{mat.name}</span>
                          <Badge variant={mat.type === "Premium" ? "default" : "secondary"} className="text-xs">
                            {mat.type}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{mat.description}</p>
                        {mat.costAddon > 0 && (
                          <p className="mt-1 text-xs font-medium text-primary">+₹{mat.costAddon.toLocaleString()}</p>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TreatmentCard;
