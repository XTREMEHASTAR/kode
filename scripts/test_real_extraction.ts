import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path;

console.log('Using FFmpeg at:', ffmpegPath);
console.log('Using FFprobe at:', ffprobePath);

// Test metadata extraction command
try {
  const probeOutput = execSync(`"${ffprobePath}" -version`, { encoding: 'utf8' });
  console.log('FFprobe version output:\n', probeOutput.split('\n')[0]);
} catch (e: any) {
  console.error('Error running ffprobe:', e.message);
}
