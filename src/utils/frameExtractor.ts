export interface ExtractedFrame {
  timestamp: number;
  dataUrl: string;
  width: number;
  height: number;
  brightness: number;
  contrast: number;
  difference: number;
  activity: number;
}

export interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  aspectRatio: string;
  aspectRatioNumeric: number;
  orientation: 'portrait' | 'landscape' | 'square';
  size: number;
}

export function getAspectRatio(width: number, height: number): { ratio: string; numeric: number; orientation: 'portrait' | 'landscape' | 'square' } {
  const numeric = width / height;
  let ratio = `${width}:${height}`;
  let orientation: 'portrait' | 'landscape' | 'square' = 'square';
  if (width > height) orientation = 'landscape';
  if (width < height) orientation = 'portrait';
  
  const tolerance = 0.05;
  if (Math.abs(numeric - 16/9) < tolerance) ratio = '16:9';
  else if (Math.abs(numeric - 9/16) < tolerance) ratio = '9:16';
  else if (Math.abs(numeric - 4/3) < tolerance) ratio = '4:3';
  else if (Math.abs(numeric - 3/4) < tolerance) ratio = '3:4';
  else if (Math.abs(numeric - 1) < tolerance) {
    ratio = '1:1';
    orientation = 'square';
  }
  return { ratio, numeric, orientation };
}

function calculateFrameMetrics(imgData: Uint8ClampedArray, prevImgData: Uint8ClampedArray | null) {
  let totalLuminance = 0;
  const len = imgData.length;
  const step = 16; 
  let count = 0;
  
  for (let i = 0; i < len; i += step) {
    const r = imgData[i];
    const g = imgData[i+1];
    const b = imgData[i+2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    totalLuminance += lum;
    count++;
  }
  const brightness = count > 0 ? totalLuminance / count : 128;
  
  let sqDiffSum = 0;
  for (let i = 0; i < len; i += step) {
    const r = imgData[i];
    const g = imgData[i+1];
    const b = imgData[i+2];
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    sqDiffSum += Math.pow(lum - brightness, 2);
  }
  const contrast = count > 0 ? Math.sqrt(sqDiffSum / count) : 0;
  
  let difference = 0;
  if (prevImgData) {
    let diffSum = 0;
    let diffCount = 0;
    for (let i = 0; i < len; i += step) {
      const rDiff = Math.abs(imgData[i] - prevImgData[i]);
      const gDiff = Math.abs(imgData[i+1] - prevImgData[i+1]);
      const bDiff = Math.abs(imgData[i+2] - prevImgData[i+2]);
      diffSum += (rDiff + gDiff + bDiff) / 3;
      diffCount++;
    }
    difference = diffCount > 0 ? diffSum / diffCount : 0;
  }
  
  return { brightness, contrast, difference };
}

export async function extractFramesFromVideo(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ metadata: VideoMetadata; frames: ExtractedFrame[] }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const objectUrl = URL.createObjectURL(file);
    video.src = objectUrl;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    
    video.onloadedmetadata = async () => {
      try {
        const duration = video.duration;
        const width = video.videoWidth;
        const height = video.videoHeight;
        const { ratio, numeric, orientation } = getAspectRatio(width, height);
        
        const metadata: VideoMetadata = {
          duration,
          width,
          height,
          aspectRatio: ratio,
          aspectRatioNumeric: numeric,
          orientation,
          size: file.size
        };
        
        const rawTimestamps = [
          0,
          1,
          2,
          3,
          duration * 0.25,
          duration * 0.50,
          duration * 0.75,
          Math.max(0, duration - 0.5)
        ];
        
        const timestamps = Array.from(new Set(rawTimestamps))
          .filter(t => t >= 0 && t <= duration)
          .sort((a, b) => a - b);
        
        const canvas = document.createElement('canvas');
        const maxDim = 320;
        let thumbW = width;
        let thumbH = height;
        if (width > height) {
          thumbW = maxDim;
          thumbH = Math.round(maxDim * (height / width));
        } else {
          thumbH = maxDim;
          thumbW = Math.round(maxDim * (width / height));
        }
        canvas.width = thumbW;
        canvas.height = thumbH;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
        
        const frames: ExtractedFrame[] = [];
        let prevImgData: Uint8ClampedArray | null = null;
        
        for (let i = 0; i < timestamps.length; i++) {
          const t = timestamps[i];
          video.currentTime = t;
          await new Promise<void>((resSeek) => {
            const onSeeked = () => {
              video.removeEventListener('seeked', onSeeked);
              resSeek();
            };
            video.addEventListener('seeked', onSeeked);
          });
          
          ctx.drawImage(video, 0, 0, thumbW, thumbH);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          const imgData = ctx.getImageData(0, 0, thumbW, thumbH).data;
          
          const { brightness, contrast, difference } = calculateFrameMetrics(imgData, prevImgData);
          prevImgData = imgData;
          
          frames.push({
            timestamp: t,
            dataUrl,
            width: thumbW,
            height: thumbH,
            brightness: Math.round(brightness),
            contrast: Math.round(contrast),
            difference: Math.round(difference),
            activity: Math.round(t <= 3 ? difference * 1.5 : difference)
          });
          
          if (onProgress) {
            onProgress(Math.round(((i + 1) / timestamps.length) * 100));
          }
        }
        
        URL.revokeObjectURL(objectUrl);
        resolve({ metadata, frames });
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };
    
    video.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load video file.'));
    };
  });
}
