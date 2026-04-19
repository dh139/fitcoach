import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function PoseDetector({ isActive, onFeedback }) {
  const videoRef    = useRef(null);
  const canvasRef   = useRef(null);
  const poseRef     = useRef(null);
  const streamRef   = useRef(null);

  const [status,    setStatus]    = useState('idle'); // idle|loading|active|error|unsupported
  const [feedback,  setFeedback]  = useState('');
  const [repCount,  setRepCount]  = useState(0);
  const [posture,   setPosture]   = useState(null); // good|warning|bad

  const giveFeedback = (msg, quality) => {
    setFeedback(msg);
    setPosture(quality);
    onFeedback?.({ message: msg, quality });
  };

  // Basic plank/squat heuristic using landmark y-positions
  const analyzePosture = (landmarks) => {
    if (!landmarks || landmarks.length < 25) return;

    const leftShoulder = landmarks[11];
    const rightShoulder= landmarks[12];
    const leftHip      = landmarks[23];
    const rightHip     = landmarks[24];
    const leftKnee     = landmarks[25];
    const rightKnee    = landmarks[26];
    const leftAnkle    = landmarks[27];
    const rightAnkle   = landmarks[28];

    // Shoulder-hip alignment (for plank / standing posture)
    const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    const hipY      = (leftHip.y     + rightHip.y)      / 2;
    const kneeY     = (leftKnee.y    + rightKnee.y)     / 2;
    const ankleY    = (leftAnkle.y   + rightAnkle.y)    / 2;

    const hipDrop   = Math.abs(hipY - shoulderY);

    // Squat detection — knees below hips
    if (kneeY > hipY + 0.1) {
      const depth = (kneeY - hipY) / (ankleY - hipY);
      if (depth > 0.5) {
        setRepCount((c) => c + 1);
        giveFeedback('Good squat depth! Keep your chest up.', 'good');
      } else {
        giveFeedback('Go deeper — try to get thighs parallel to floor.', 'warning');
      }
    }
    // Plank / standing — check hip alignment
    else if (hipDrop < 0.05) {
      giveFeedback('Great posture — body is aligned!', 'good');
    } else if (hipDrop < 0.15) {
      giveFeedback('Watch your hips — keep them level.', 'warning');
    } else {
      giveFeedback('Hips are dropping — engage your core!', 'bad');
    }
  };

  const startCamera = async () => {
    setStatus('loading');
    try {
      // Dynamically import MediaPipe to avoid bundle bloat
      const { Pose, POSE_CONNECTIONS } = await import(
        'https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/pose.js'
      ).catch(() => null) || {};

      if (!Pose) {
        // MediaPipe not available — use camera-only mode
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setStatus('active');
        giveFeedback('Camera active — MediaPipe unavailable, basic mode.', 'warning');
        return;
      }

      const pose = new Pose({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.5.1675469404/${file}`,
      });
      pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: 0.5 });
      pose.onResults((results) => {
        if (!canvasRef.current) return;
        const ctx    = canvasRef.current.getContext('2d');
        const { width, height } = canvasRef.current;
        ctx.clearRect(0, 0, width, height);

        if (results.poseLandmarks) {
          // Draw skeleton dots
          results.poseLandmarks.forEach((lm) => {
            ctx.beginPath();
            ctx.arc(lm.x * width, lm.y * height, 4, 0, 2 * Math.PI);
            ctx.fillStyle   = '#22c55e';
            ctx.shadowBlur  = 6;
            ctx.shadowColor = '#22c55e';
            ctx.fill();
          });
          analyzePosture(results.poseLandmarks);
        }
      });
      poseRef.current = pose;

      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setStatus('active');
      giveFeedback('Pose detection active — position yourself in frame.', 'good');

      // Process frames
      const processFrame = async () => {
        if (videoRef.current && poseRef.current && status !== 'idle') {
          await poseRef.current.send({ image: videoRef.current });
        }
        if (streamRef.current) requestAnimationFrame(processFrame);
      };
      requestAnimationFrame(processFrame);

    } catch (err) {
      console.error('Camera error:', err);
      setStatus(err.name === 'NotAllowedError' ? 'error' : 'unsupported');
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStatus('idle');
    setFeedback('');
    setPosture(null);
  };

  useEffect(() => {
    if (isActive && status === 'idle') startCamera();
    if (!isActive) stopCamera();
    return () => stopCamera();
  }, [isActive]);

  const POSTURE_COLORS = {
    good:    'text-green-400  bg-green-500/20  border-green-500/30',
    warning: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
    bad:     'text-red-400    bg-red-500/20    border-red-500/30',
  };

  return (
    <div className="bg-dark-800 border border-white/10 rounded-2xl overflow-hidden">
      {/* Video + canvas overlay */}
      <div className="relative aspect-video bg-dark-900">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          style={{ display: status === 'active' ? 'block' : 'none', transform: 'scaleX(-1)' }}
        />
        <canvas
          ref={canvasRef}
          width={640} height={480}
          className="absolute inset-0 w-full h-full"
          style={{ display: status === 'active' ? 'block' : 'none', transform: 'scaleX(-1)' }}
        />

        {/* Idle / loading / error state */}
        {status !== 'active' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            {status === 'loading' && (
              <>
                <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
                <p className="text-sm text-gray-400">Starting camera...</p>
              </>
            )}
            {status === 'idle' && (
              <>
                <Camera className="w-10 h-10 text-gray-600" />
                <p className="text-sm text-gray-500">Camera off</p>
              </>
            )}
            {(status === 'error' || status === 'unsupported') && (
              <>
                <CameraOff className="w-10 h-10 text-red-500/60" />
                <p className="text-sm text-red-400">
                  {status === 'error' ? 'Camera access denied' : 'Camera not available'}
                </p>
              </>
            )}
          </div>
        )}

        {/* Rep counter */}
        {status === 'active' && repCount > 0 && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded-xl px-3 py-2">
            <p className="text-white text-sm font-bold">{repCount} reps detected</p>
          </div>
        )}
      </div>

      {/* Feedback bar */}
      {feedback && (
        <div className={`flex items-center gap-2 px-4 py-3 border-t ${
          posture ? `${POSTURE_COLORS[posture]} border-current/20` : 'border-white/5 text-gray-400'
        }`}>
          {posture === 'good'
            ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            : <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          }
          <p className="text-sm">{feedback}</p>
        </div>
      )}

      {/* Controls */}
      <div className="p-4">
        <button
          onClick={() => status === 'active' ? stopCamera() : startCamera()}
          disabled={status === 'loading'}
          className={`w-full py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            status === 'active'
              ? 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
              : 'bg-brand-500 hover:bg-brand-600 text-white'
          }`}
        >
          {status === 'loading' ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Starting...</>
          ) : status === 'active' ? (
            <><CameraOff className="w-4 h-4" /> Stop camera</>
          ) : (
            <><Camera className="w-4 h-4" /> Start form check</>
          )}
        </button>
      </div>
    </div>
  );
}