# node-avshrink

A small script to convert and shrink in size big audio and video assets,
so that they can be easily used in web apps.

### Requirements

- [Node.js](https://nodejs.org/) 
- [FFmpeg](https://ffmpeg.org/)

### Setup

On macOS, you can install FFmpeg with [Homebrew](https://brew.sh/):

```shell
brew install ffmpeg
```

Install dependencies:

```shell
npm i
```

Create your configuration file (`.env`):

```shell
cp .env.example .env
```

Configure your `.env` file. Example:

```text
AUDIO_BITRATE=64k
AUDIO_IN_EXT=mp3,wav
AUDIO_OUT_EXT=aac
IN_PATH=/Users/yourname/in
OUT_PATH=/Users/yourname/out
VIDEO_BITRATE=1536k
VIDEO_IN_EXT=mp4
VIDEO_OUT_EXT=mp4
```

Place the source files to be converted in the `IN_PATH` path.  
Only the files with the extensions listed in `AUDIO_IN_EXT` (e.g.: `mp3,wav`) are considered.  
The output bitrates for audio and video can be specified in `AUDIO_BITRATE` and `VIDEO_BITRATE`.  
For instance, `64k` means 64 Kbps (good for speech).
`1536k` (1.5 Mbps) is OK for 720p videos.

### Start conversion

```shell
npm start
```

The converted files will be placed in the `OUT_PATH` path.  
The formats specified in `AUDIO_OUT_EXT` and `VIDEO_OUT_EXT` will be used for audio and video.
