import { useState } from "react";
import { motion } from "framer-motion";
import { Camera, Scan, CheckCircle2, XCircle, Clock, Zap, RefreshCw } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { cn } from "@/lib/utils";

interface DetectedFace {
  id: string;
  name: string;
  confidence: number;
  status: "verified" | "pending" | "failed";
  time: string;
}

const mockDetections: DetectedFace[] = [
  { id: "1", name: "Alex Johnson", confidence: 97.3, status: "verified", time: "09:02:15" },
  { id: "2", name: "Maria Garcia", confidence: 94.8, status: "verified", time: "09:02:18" },
  { id: "3", name: "Ryan Patel", confidence: 98.1, status: "verified", time: "09:02:22" },
  { id: "4", name: "Unknown", confidence: 42.1, status: "failed", time: "09:02:25" },
];

export default function AttendancePage() {
  const [isScanning, setIsScanning] = useState(false);
  const [detections, setDetections] = useState<DetectedFace[]>([]);

  const startScan = () => {
    setIsScanning(true);
    setDetections([]);

    // Simulate detections appearing one by one
    mockDetections.forEach((det, i) => {
      setTimeout(() => {
        setDetections((prev) => [...prev, det]);
      }, 1500 + i * 800);
    });

    setTimeout(() => setIsScanning(false), 1500 + mockDetections.length * 800 + 500);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Face Recognition Attendance</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Capture and verify student attendance in real-time
          </p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            {/* Camera viewport */}
            <div className="relative aspect-video bg-foreground/5 flex items-center justify-center overflow-hidden">
              {/* Simulated camera feed */}
              <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-foreground/10" />

              {isScanning && (
                <>
                  {/* Scanning overlay */}
                  <motion.div
                    initial={{ top: "0%" }}
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute left-0 right-0 h-0.5 bg-primary/60 shadow-glow z-10"
                  />
                  {/* Face detection boxes */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute top-[15%] left-[20%] w-24 h-28 border-2 border-success rounded-lg"
                  >
                    <div className="absolute -top-5 left-0 text-[9px] bg-success text-success-foreground px-1.5 py-0.5 rounded font-medium">
                      97.3%
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-[20%] left-[55%] w-24 h-28 border-2 border-success rounded-lg"
                  >
                    <div className="absolute -top-5 left-0 text-[9px] bg-success text-success-foreground px-1.5 py-0.5 rounded font-medium">
                      94.8%
                    </div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="absolute top-[25%] right-[15%] w-24 h-28 border-2 border-destructive rounded-lg"
                  >
                    <div className="absolute -top-5 left-0 text-[9px] bg-destructive text-destructive-foreground px-1.5 py-0.5 rounded font-medium">
                      42.1%
                    </div>
                  </motion.div>
                </>
              )}

              {/* Center icon */}
              {!isScanning && (
                <div className="text-center">
                  <Camera className="h-16 w-16 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Camera feed will appear here</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Click "Start Scan" to begin</p>
                </div>
              )}

              {isScanning && (
                <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2">
                  <span className="flex h-2 w-2 rounded-full bg-destructive animate-pulse" />
                  <span className="text-xs font-medium text-card-foreground">LIVE • Scanning</span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between p-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Zap className="h-3.5 w-3.5" />
                <span>Face-api.js • TensorFlow Backend</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={startScan}
                  disabled={isScanning}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                    isScanning
                      ? "bg-muted text-muted-foreground"
                      : "gradient-bg text-primary-foreground hover:opacity-90 shadow-glow"
                  )}
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Scanning...
                    </>
                  ) : (
                    <>
                      <Scan className="h-4 w-4" /> Start Scan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detection Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card"
        >
          <div className="px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-card-foreground">Detection Results</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {detections.length} face{detections.length !== 1 ? "s" : ""} detected
            </p>
          </div>

          <div className="p-4 space-y-2">
            {detections.length === 0 && !isScanning && (
              <div className="py-12 text-center">
                <Scan className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No detections yet</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">Start a scan to detect faces</p>
              </div>
            )}

            {detections.map((det, i) => (
              <motion.div
                key={det.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                  det.status === "verified" && "border-success/20 bg-success/5",
                  det.status === "failed" && "border-destructive/20 bg-destructive/5",
                  det.status === "pending" && "border-warning/20 bg-warning/5"
                )}
              >
                <div className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                  det.status === "verified" && "bg-success/10",
                  det.status === "failed" && "bg-destructive/10"
                )}>
                  {det.status === "verified" ? (
                    <CheckCircle2 className="h-4.5 w-4.5 text-success" />
                  ) : (
                    <XCircle className="h-4.5 w-4.5 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground">{det.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={cn(
                      "text-[10px] font-medium",
                      det.confidence >= 85 ? "text-success" : "text-destructive"
                    )}>
                      {det.confidence}% match
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Clock className="h-2.5 w-2.5" /> {det.time}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
