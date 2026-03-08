import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText, Upload, Trash2, Image, FileImage, File } from "lucide-react";
import { useRecordStore } from "@/stores/recordStore";
import { useLanguageStore } from "@/stores/languageStore";
import { toast } from "sonner";
import { motion } from "framer-motion";

const PatientRecords = () => {
  const { records, addRecord, removeRecord } = useRecordStore();
  const { t } = useLanguageStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fileName: "", type: "xray" as const, notes: "" });
  const [fileData, setFileData] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("File size must be under 5MB"); return; }
    setForm({ ...form, fileName: file.name });
    const reader = new FileReader();
    reader.onload = () => setFileData(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleUpload = () => {
    if (!fileData || !form.fileName) { toast.error("Please select a file"); return; }
    addRecord({ ...form, dataUrl: fileData });
    toast.success("Record uploaded successfully!");
    setForm({ fileName: "", type: "xray", notes: "" });
    setFileData(null);
    setShowForm(false);
  };

  const typeIcon = (type: string) => {
    switch (type) {
      case "xray": return <FileImage className="h-4 w-4 text-primary" />;
      case "prescription": return <FileText className="h-4 w-4 text-success" />;
      default: return <File className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const typeLabel = (type: string) => {
    const map: Record<string, string> = { xray: t("records.xray"), prescription: t("records.prescription"), report: t("records.report"), other: t("records.other") };
    return map[type] || type;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" /> {t("records.title")}
        </h3>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1">
          <Upload className="h-4 w-4" /> {t("records.upload")}
        </Button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border p-4 space-y-3 bg-secondary/30">
          <div>
            <Label>{t("records.type")}</Label>
            <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="xray">{t("records.xray")}</SelectItem>
                <SelectItem value="prescription">{t("records.prescription")}</SelectItem>
                <SelectItem value="report">{t("records.report")}</SelectItem>
                <SelectItem value="other">{t("records.other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Select File</Label>
            <Input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleFileChange} />
          </div>
          <div><Label>{t("records.notes")}</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Add notes about this record..." /></div>
          {fileData && (
            <div className="rounded-lg border p-2">
              {fileData.startsWith("data:image") ? (
                <img src={fileData} alt="Preview" className="max-h-40 rounded object-contain mx-auto" />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">📄 {form.fileName}</p>
              )}
            </div>
          )}
          <Button onClick={handleUpload} className="w-full">{t("records.upload")}</Button>
        </motion.div>
      )}

      {records.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <Image className="mx-auto h-10 w-10 text-muted-foreground/40" />
          <p className="mt-3 font-display font-semibold text-foreground">{t("records.noRecords")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("records.noRecordsDesc")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((rec) => (
            <motion.div key={rec.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="rounded-lg border p-3 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {rec.dataUrl.startsWith("data:image") ? (
                  <img src={rec.dataUrl} alt={rec.fileName} className="h-12 w-12 rounded object-cover border shrink-0" />
                ) : (
                  <div className="h-12 w-12 rounded border flex items-center justify-center bg-secondary shrink-0">
                    {typeIcon(rec.type)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{rec.fileName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="secondary" className="text-xs">{typeLabel(rec.type)}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(rec.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  {rec.notes && <p className="text-xs text-muted-foreground mt-0.5 truncate">{rec.notes}</p>}
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => { removeRecord(rec.id); toast.success("Record deleted"); }} className="h-8 w-8 text-destructive hover:text-destructive shrink-0">
                <Trash2 className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientRecords;
