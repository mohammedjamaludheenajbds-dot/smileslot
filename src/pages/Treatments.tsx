import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import TreatmentCard from "@/components/TreatmentCard";
import { treatments } from "@/data/dentists";

const categories = ["All", ...Array.from(new Set(treatments.map((t) => t.category)))];

const Treatments = () => {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");

  const filtered = treatments.filter((t) => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = cat === "All" || t.category === cat;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto max-w-4xl">
        <h1 className="font-display text-3xl font-bold text-foreground">Dental Treatments & Costs</h1>
        <p className="mt-1 text-muted-foreground">
          All costs as per Indian Dental Association (IDA) fixed fee guidelines. Select materials to customize your treatment.
        </p>

        <div className="mt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search treatments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <Badge key={c} variant={cat === c ? "default" : "outline"} className="cursor-pointer" onClick={() => setCat(c)}>
                {c}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {filtered.map((t) => (
            <TreatmentCard key={t.id} treatment={t} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="mt-12 text-center text-muted-foreground">No treatments found.</div>
        )}
      </div>
    </div>
  );
};

export default Treatments;
