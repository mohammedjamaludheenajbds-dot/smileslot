import { useState } from "react";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import DentistCard from "@/components/DentistCard";
import { dentists } from "@/data/dentists";

const areas = ["All", "Perundurai Road", "EVN Road", "Erode Fort", "Erode Town", "Brough Road", "Gandhiji Road", "Mettur Road", "Sathy Road", "Surampatti", "Karungalpalayam", "Bhavani", "Gobichettipalayam", "Anthiyur", "Dharapuram", "Perundurai", "Komarapalayam", "Salem"];
const specs = ["All", "General", "Endodontics", "Orthodontics", "Prosthodontics", "Oral Surgery", "Periodontics", "Pediatric", "Implantology", "Cosmetic", "Laser", "Diagnostics"];

const DentistListing = () => {
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("All");
  const [spec, setSpec] = useState("All");
  const [emiOnly, setEmiOnly] = useState(false);

  const filtered = dentists.filter((d) => {
    const matchSearch = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.clinicName.toLowerCase().includes(search.toLowerCase());
    const matchArea = area === "All" || d.area === area;
    const matchSpec = spec === "All" || d.specialization.toLowerCase().includes(spec.toLowerCase());
    const matchEmi = !emiOnly || d.emiAvailable;
    return matchSearch && matchArea && matchSpec && matchEmi;
  });

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="container mx-auto">
        <h1 className="font-display text-3xl font-bold text-foreground">Find Dentists in Erode</h1>
        <p className="mt-1 text-muted-foreground">Browse verified dental professionals across Erode district</p>

        <div className="mt-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by name or clinic..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" /> Area
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {areas.map((a) => (
                <Badge key={a} variant={area === a ? "default" : "outline"} className="cursor-pointer" onClick={() => setArea(a)}>
                  {a}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-muted-foreground">Specialization</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {specs.map((s) => (
                <Badge key={s} variant={spec === s ? "default" : "outline"} className="cursor-pointer" onClick={() => setSpec(s)}>
                  {s}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Badge
              variant={emiOnly ? "default" : "outline"}
              className="cursor-pointer gap-1"
              onClick={() => setEmiOnly(!emiOnly)}
            >
              💳 EMI Available Only
            </Badge>
          </div>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <DentistCard key={d.id} dentist={d} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="mt-12 text-center text-muted-foreground">No dentists found matching your criteria.</div>
        )}
      </div>
    </div>
  );
};

export default DentistListing;
