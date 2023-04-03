# Concordia Course to Transcript

This project aims to download, sort, and transcribe course content (audio and video files) from the Concordia University's Renewable Energy course. The course content is downloaded from the eConcordia website, sorted into appropriate directories, and transcribed using Google Cloud Speech-to-Text API.

## Directory Structure

```concordia-course-to-transcript/
│
├─ src/
│   ├─ modules/
│   │   ├─ download.js
│   │   ├─ sort.js
│   │   ├─ extractAudio.js
│   │   └─ transcription.js
│   │
│   ├─ config.js
│   └─ index.js
│
├─ downloads/
│
├─ sorted/
│
└─ README.md
```

## Dependencies

- axios
- fluent-ffmpeg
- @google-cloud/speech
- @google-cloud/storage
- stream
- util
- fs
- path

## Installation

1.  Clone the repository:

```bash
git clone https://github.com/your-username/concordia-course-to-transcript.git
cd concordia-course-to-transcript
```

1.  Install the required dependencies:

```bash

 npm install
```

1.  Set up your Google Cloud API credentials by following [these instructions](https://cloud.google.com/docs/authentication/getting-started).

2.  Update the `src/modules/config.js` file with your desired configuration, including the number of lessons, parts, and base URL.

## Usage

1.  Download the course content:

```bash
node src/index.js download
```

1.  Sort the downloaded media files:

```bash
node src/index.js sort
```

1.  Generate transcripts for the sorted files:

```bash
node src/index.js transcribe
```

## Output

The downloaded files will be stored in the `downloads/` directory. After sorting, the files will be organized into the `sorted/` directory, structured by lesson and part numbers. Finally, after generating transcripts, a text file containing the transcriptions will be created for each lesson in the corresponding `sorted/lessonX/` directory.
