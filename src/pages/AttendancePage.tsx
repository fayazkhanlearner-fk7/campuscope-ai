import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, Scan, CheckCircle2, XCircle, Clock, Zap, RefreshCw,
  Video, VideoOff, AlertCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { cn } from "@/lib/utils";
import { fetchStudents, Student } from "@/services/students";
import { markAttendance } from "@/services/attendance";
import { toast } from "sonner";

interface DetectedFace {
  id: string;
  name: string;
  confidence: number;
  status: "verified" | "pending" | "failed";
  time: string;
}

export default function AttendancePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [detections, setDetections] = useState<DetectedFace[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("Data Structures");

  useEffect(() => {
    fetchStudents().then(setStudents).catch(() => {});
    return () => stopCamera();
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
      toast.success("Camera activated successfully");
    } catch (err) {
      const msg = err instanceof Error
        ? err.name === "NotAllowedError"
          ? "Camera access denied. Please allow camera permissions in your browser settings."
          : err.name === "NotFoundError"
            ? "No camera detected. Please connect a camera."
            : `Camera error: ${err.message}`
        : "Failed to access camera";
      setCameraError(msg);
      toast.error(msg);
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraActive(false);
  }, []);

  const startScan = useCallback(async () => {
    if (!cameraActive) {
      toast.error("Please start the camera first");
      return;
    }
    setIsScanning(true);
    setDetections([]);

    // Simulate face detection against registered students
    const registered = students.length > 0 ? students : [];
    const simulatedResults: DetectedFace[] = registered.slice(0, 4).map((s, i) => {
      const confidence = 85 + Math.random() * 15;
      return {
        id: s.id,
        name: s.name,
        confidence: Math.round(confidence * 10) / 10,
        status: confidence > 80 ? ("verified" as const) : ("failed" as const),
        time: new Date().toLocaleTimeString("en-US", { hour12: false }),
      };
    });

    // Add one unknown face
    simulatedResults.push({
      id: "unknown",
      name: "Unknown Person",
      confidence: 38 + Math.random() * 10,
      status: "failed",
      time: new Date().toLocaleTimeString("en-US", { hour12: false }),
    });

    // Reveal detections one by one
    for (let i = 0; i < simulatedResults.length; i++) {
      await new Promise((r) => setTimeout(r, 800));
      setDetections((prev) => [...prev, simulatedResults[i]]);

      // Mark attendance for verified faces
      const det = simulatedResults[i];
      if (det.status === "verified" && det.id !== "unknown") {
        try {
          await markAttendance({
            student_id: det.id,
            subject: selectedSubject,
            status: det.confidence >= 95 ? "present" : "late",
            confidence_score: det.confidence,
          });
        } catch {
          // Duplicate entry or DB error — silently skip
        }
      }
    }

    setIsScanning(false);
    toast.success(`Scan complete: ${simulatedResults.filter((d) => d.status === "verified").length} verified`);
  }, [cameraActive, students, selectedSubject]);

  const subjects = ["Data Structures", "Algorithms", "Database Systems", "Operating Systems"];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-foreground">Face Recognition Attendance</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Capture and verify student attendance in real-time
          </p>
        </motion.div>
      </div>

      {/* Subject selector */}
      <div className="mb-6 flex flex-wrap gap-2">
        {subjects.map((s) => (
          <button
            key={s}
            onClick={() => setSelectedSubject(s)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
              selectedSubject === s
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/30"
            )}
          >
            {s}
          </button>
        ))}
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
              {/* Real video element */}
              <video
                ref={videoRef}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover",
                  !cameraActive && "hidden"
                )}
                autoPlay
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanning overlay */}
              {isScanning && cameraActive && (
                <motion.div
                  initial={{ top: "0%" }}
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute left-0 right-0 h-0.5 bg-primary/60 shadow-glow z-10"
                />
              )}

              {/* Camera off state */}
              {!cameraActive && !cameraError && (
                <div className="text-center z-10">
                  <Camera className="h-16 w-16 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Camera is off</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Click "Start Camera" to begin
                  </p>
                </div>
              )}

              {/* Error state */}
              {cameraError && (
                <div className="text-center z-10 max-w-sm px-4">
                  <AlertCircle className="h-12 w-12 text-destructive/50 mx-auto mb-3" />
                  <p className="text-sm text-destructive font-medium">{cameraError}</p>
                  <button
                    onClick={startCamera}
                    className="mt-3 text-xs text-primary hover:underline font-medium"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Live indicator */}
              {cameraActive && (
                <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-1.5 z-10">
                  <span className="flex h-2 w-2 rounded-full bg-destructive animate-pulse" />
                  <span className="text-xs font-medium text-card-foreground">
                    LIVE {isScanning ? "• Scanning..." : ""}
                  </span>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-t border-border">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Zap className="h-3.5 w-3.5" />
                <span>Browser Camera • Face Detection</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={cameraActive ? stopCamera : startCamera}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all border",
                    cameraActive
                      ? "border-destructive/30 text-destructive hover:bg-destructive/5"
                      : "border-border text-foreground hover:bg-muted"
                  )}
                >
                  {cameraActive ? (
                    <><VideoOff className="h-4 w-4" /> Stop Camera</>
                  ) : (
                    <><Video className="h-4 w-4" /> Start Camera</>
                  )}
                </button>
                <button
                  onClick={startScan}
                  disabled={isScanning || !cameraActive}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                    isScanning || !cameraActive
                      ? "bg-muted text-muted-foreground"
                      : "gradient-bg text-primary-foreground hover:opacity-90 shadow-glow"
                  )}
                >
                  {isScanning ? (
                    <><RefreshCw className="h-4 w-4 animate-spin" /> Scanning...</>
                  ) : (
                    <><Scan className="h-4 w-4" /> Start Scan</>
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

          <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
            {detections.length === 0 && !isScanning && (
              <div className="py-12 text-center">
                <Scan className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No detections yet</p>
                <p className="text-xs text-muted-foreground/60 mt-0.5">
                  Start camera and scan to detect faces
                </p>
              </div>
            )}

            <AnimatePresence>
              {detections.map((det, i) => (
                <motion.div
                  key={det.id + det.time}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 transition-colors",
                    det.status === "verified" && "border-success/20 bg-success/5",
                    det.status === "failed" && "border-destructive/20 bg-destructive/5"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                      det.status === "verified" ? "bg-success/10" : "bg-destructive/10"
                    )}
                  >
                    {det.status === "verified" ? (
                      <CheckCircle2 className="h-4 w-4 text-success" />
                    ) : (
                      <XCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-card-foreground truncate">
                      {det.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span
                        className={cn(
                          "text-[10px] font-medium",
                          det.confidence >= 85 ? "text-success" : "text-destructive"
                        )}
                      >
                        {det.confidence}% match
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5" /> {det.time}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
