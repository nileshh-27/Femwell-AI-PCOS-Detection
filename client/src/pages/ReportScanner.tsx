import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Image as ImageIcon, UploadCloud } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type SelectedFile = {
  file: File;
  kind: "image" | "report";
};

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const idx = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / Math.pow(1024, idx);
  return `${value.toFixed(idx === 0 ? 0 : 1)} ${units[idx]}`;
}

export default function ReportScanner() {
  const [selected, setSelected] = useState<SelectedFile | null>(null);
  const [analysisMessage, setAnalysisMessage] = useState<string | null>(null);

  const previewUrl = useMemo(() => {
    if (!selected) return null;
    if (selected.kind !== "image") return null;
    return URL.createObjectURL(selected.file);
  }, [selected]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const onChoose = (kind: SelectedFile["kind"]) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelected({ file, kind });
    setAnalysisMessage(null);
  };

  const analyze = () => {
    if (!selected) {
      setAnalysisMessage("Please upload a file first.");
      return;
    }

    setAnalysisMessage(
      selected.kind === "image"
        ? "CNN model unavailable currently ."
        : "Report scanning unavailable currently ."
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 sm:py-20 space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-medium">
          <UploadCloud className="w-4 h-4 mr-2" />
          Upload-only 
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold">CNN & Report Scanner</h1>
        <p className="text-xl text-muted-foreground">Upload an ultrasound image or a lab report to scan for PCOS markers.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card p-8 rounded-3xl space-y-6"
        >
          <h3 className="text-xl font-bold font-display flex items-center gap-2">
            <ImageIcon className="text-primary w-5 h-5" />
            CNN Image Scan
          </h3>

          <p className="text-muted-foreground">
            Upload an image (JPG/PNG).
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={onChoose("image")}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary/10 file:text-primary file:font-semibold hover:file:bg-primary/15"
          />

          {selected?.kind === "image" ? (
            <div className="rounded-2xl border border-border bg-background/50 p-4 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium truncate">{selected.file.name}</p>
                  <p className="text-sm text-muted-foreground">{formatBytes(selected.file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={analyze}
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all"
                >
                  Analyze
                </button>
              </div>

              {analysisMessage ? (
                <Alert className="mt-3">
                  <AlertTitle>Analysis</AlertTitle>
                  <AlertDescription>{analysisMessage}</AlertDescription>
                </Alert>
              ) : null}

              {previewUrl ? (
                <div className="rounded-2xl overflow-hidden border border-border">
                  <img src={previewUrl} alt="Selected" className="w-full h-64 object-cover" />
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
              No image selected
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 rounded-3xl space-y-6"
        >
          <h3 className="text-xl font-bold font-display flex items-center gap-2">
            <FileText className="text-primary w-5 h-5" />
            Report Scanner
          </h3>

          <p className="text-muted-foreground">
            Upload a PDF or image report. We’ll plug OCR + extraction later.
          </p>

          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={onChoose("report")}
            className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-primary/10 file:text-primary file:font-semibold hover:file:bg-primary/15"
          />

          {selected?.kind === "report" ? (
            <div className="rounded-2xl border border-border bg-background/50 p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="font-medium truncate">{selected.file.name}</p>
                  <p className="text-sm text-muted-foreground">{formatBytes(selected.file.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={analyze}
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all"
                >
                  Analyze
                </button>
              </div>

              {analysisMessage ? (
                <Alert className="mt-4">
                  <AlertTitle>Analysis</AlertTitle>
                  <AlertDescription>{analysisMessage}</AlertDescription>
                </Alert>
              ) : null}

              <div className="mt-4 rounded-xl bg-muted/40 border border-border/50 p-4 text-sm text-muted-foreground">
                Preview will appear here after OCR is implemented.
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
              No report selected
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
