import { useState } from "react";
import { ChevronDown, ChevronUp, Clock, IndianRupee, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Treatment } from "@/data/dentists";
import { motion, AnimatePresence } from "framer-motion";

const TreatmentCard = ({ treatment }: { treatment: Treatment }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);

  return (
    <div className="rounded-xl border bg-card transition-all duration-300 card-shadow hover:card-shadow-hover">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Badge variant="outline" className="mb-2 text-xs">{treatment.category}</Badge>
            <h3 className="font-display text-lg font-bold text-foreground">{treatment.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{treatment.description}</p>
          </div>
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
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="mt-3 gap-1 text-primary"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "Hide Details" : "View Procedure & Materials"}
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
            <div className="border-t px-5 pb-5 pt-4">
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

              {treatment.materials.length > 0 && (
                <div className="mt-5">
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
