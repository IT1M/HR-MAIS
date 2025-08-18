
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  Mic, 
  MicOff, 
  Square, 
  Play, 
  Pause, 
  Volume2,
  Clock,
  AlertCircle 
} from 'lucide-react';

interface VoiceRecorderProps {
  onRecordingComplete?: (audioData: any) => void;
  maxDuration?: number;
  className?: string;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ 
  onRecordingComplete, 
  maxDuration = 120, // 2 minutes default
  className = "" 
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    checkMicrophonePermission();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setDuration(prev => {
          if (prev >= maxDuration) {
            handleStopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, maxDuration]);

  const checkMicrophonePermission = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
    } catch (error) {
      setHasPermission(false);
      console.error('Microphone permission denied:', error);
    }
  };

  const requestMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setHasPermission(true);
      return stream;
    } catch (error) {
      setHasPermission(false);
      throw error;
    }
  };

  const handleStartRecording = async () => {
    try {
      let stream = streamRef.current;
      
      if (!stream) {
        stream = await requestMicrophonePermission();
      }

      if (!stream) return;

      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        if (onRecordingComplete) {
          onRecordingComplete({
            blob: audioBlob,
            url: url,
            duration: duration,
            timestamp: new Date().toISOString()
          });
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      setAudioUrl(null);

    } catch (error) {
      console.error('Error starting recording:', error);
      setHasPermission(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handlePlayback = () => {
    if (!audioUrl) return;

    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (!audioRef.current) {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.addEventListener('ended', () => {
          setIsPlaying(false);
        });
      }
      
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (duration >= maxDuration * 0.9) return 'text-red-600';
    if (duration >= maxDuration * 0.7) return 'text-yellow-600';
    return 'text-gray-600';
  };

  if (hasPermission === false) {
    return (
      <div className={`bg-red-50 border border-red-200 p-4 rounded-lg ${className}`}>
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold text-red-800">يتطلب إذن الوصول للميكروفون</h4>
            <p className="text-red-700 text-sm mt-1">
              يرجى السماح بالوصول للميكروفون لتسجيل الإجابات الصوتية
            </p>
            <Button
              onClick={requestMicrophonePermission}
              size="sm"
              className="mt-2 bg-red-600 hover:bg-red-700"
            >
              طلب الإذن
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Recording Interface */}
      <div className="flex items-center justify-center gap-4">
        <AnimatePresence mode="wait">
          {!isRecording ? (
            <motion.div
              key="start-button"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <Button
                onClick={handleStartRecording}
                size="lg"
                className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-full"
                disabled={hasPermission === null}
              >
                <Mic className="w-5 h-5 ml-2" />
                بدء التسجيل
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="recording-controls"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-4"
            >
              {/* Recording Animation */}
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-4 h-4 bg-red-500 rounded-full"
              />
              
              {/* Timer */}
              <div className={`font-mono text-lg font-semibold ${getTimeColor()}`}>
                {formatTime(duration)}
              </div>
              
              {/* Stop Button */}
              <Button
                onClick={handleStopRecording}
                variant="destructive"
                size="lg"
                className="rounded-full"
              >
                <Square className="w-5 h-5 ml-2" />
                إيقاف
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Duration Indicator */}
      {isRecording && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-gray-50 p-3 rounded-lg"
        >
          <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
            <span>مدة التسجيل</span>
            <span>{formatTime(maxDuration)} حد أقصى</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${
                duration >= maxDuration * 0.9 ? 'bg-red-500' :
                duration >= maxDuration * 0.7 ? 'bg-yellow-500' :
                'bg-blue-500'
              }`}
              animate={{ width: `${(duration / maxDuration) * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.div>
      )}

      {/* Playback Controls */}
      <AnimatePresence>
        {audioUrl && !isRecording && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-green-50 border border-green-200 p-4 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  onClick={handlePlayback}
                  variant="outline"
                  size="sm"
                  className="rounded-full border-green-300 hover:bg-green-100"
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </Button>
                <div className="flex items-center gap-2 text-green-700">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    تم التسجيل ({formatTime(duration)})
                  </span>
                </div>
              </div>
              
              <Button
                onClick={handleStartRecording}
                variant="outline"
                size="sm"
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                تسجيل جديد
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      {!isRecording && !audioUrl && (
        <div className="text-center text-sm text-gray-500 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Clock className="w-4 h-4" />
            <span>الحد الأقصى للتسجيل: {formatTime(maxDuration)}</span>
          </div>
          <p>اضغط على زر التسجيل وتحدث بوضوح</p>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
