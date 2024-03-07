import fs from 'fs';
import * as process from 'process';
import 'dotenv/config';
import { execa } from 'execa';

const {
  AUDIO_BITRATE = '64k',
  AUDIO_IN_EXT = 'mp3,wav',
  AUDIO_OUT_EXT = 'aac',
  IN_PATH = './',
  OUT_PATH = './',
  VIDEO_BITRATE = '1536k',
  VIDEO_IN_EXT = 'avi,mp4',
  VIDEO_OUT_EXT = 'mp4',
} = process.env;

const FFMPEG_COMMAND = 'ffmpeg';

try {
  const { stdout } = await execa(FFMPEG_COMMAND, ['-version']);
  const ffmpegInfo = stdout.split('\n').shift();
  ffmpegInfo && console.log(`\n${ffmpegInfo}\n`);
} catch (e) {
  console.warn('FFmpeg not found! Please install FFmpeg to run this script.');
  process.exit(0);
}

const mapExtStringToArray = (extAsString = '') =>
  extAsString
    .split(',')
    .map((ext) => ext.trim().toLowerCase())
    .filter((ext) => ext);

const testExt = (extList: string[] = [], fileNameWithExt = '') => {
  const splitFileName = fileNameWithExt.split('.');
  const fileExt = splitFileName.pop() || '';
  return extList.some((ext) => fileExt.toLowerCase() === ext);
};

try {
  const allFiles = fs.readdirSync(IN_PATH);
  const audioExt = mapExtStringToArray(AUDIO_IN_EXT);
  const videoExt = mapExtStringToArray(VIDEO_IN_EXT);
  const audioFiles = allFiles.filter((file) => testExt(audioExt, file));
  const videoFiles = allFiles.filter((file) => testExt(videoExt, file));
  const filesNumber = audioFiles.length + videoFiles.length;

  console.log(`Reading files from ${IN_PATH}`);
  console.log(`Found ${filesNumber} file${filesNumber === 1 ? '' : 's'}.\n`);

  let i = 0;

  for (const file of audioFiles) {
    i++;
    console.log(`Processing file ${i} of ${filesNumber} (${file})`);
    const splitFileName = file.split('.');
    splitFileName.pop();
    const fileName = splitFileName.join('');

    await execa(FFMPEG_COMMAND, [
      '-i',
      `${IN_PATH}/${file}`,
      '-b:a',
      AUDIO_BITRATE.toLowerCase(),
      '-y',
      `${OUT_PATH}/${fileName}.${AUDIO_OUT_EXT.toLowerCase()}`,
    ]);
  }

  for (const file of videoFiles) {
    i++;
    console.log(`Processing file ${i} of ${filesNumber} (${file})`);
    const splitFileName = file.split('.');
    splitFileName.pop();
    const fileName = splitFileName.join('');

    await execa(FFMPEG_COMMAND, [
      '-i',
      `${IN_PATH}/${file}`,
      '-b:a',
      AUDIO_BITRATE.toLowerCase(),
      '-b:v',
      VIDEO_BITRATE.toLowerCase(),
      '-y',
      `${OUT_PATH}/${fileName}.${VIDEO_OUT_EXT.toLowerCase()}`,
    ]);
  }

  console.log('\nDone!');
  console.log(`Files saved in ${OUT_PATH}`);
} catch (e) {
  console.error(e);
  console.warn('The operation was stopped because an error occurred.');
}
