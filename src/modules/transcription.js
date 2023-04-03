const fs = require("fs");
const path = require("path");
const speech = require("@google-cloud/speech");
const speechClient = new speech.SpeechClient();
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
const {
  BUCKET_NAME,
  START_LESSON,
  MAX_LESSONS,
  MAX_PARTS,
} = require("../config");

async function transcribeAudioFile(filePath) {
  const gcsUri = await uploadAudioToGCS(filePath);

  const audio = {
    uri: gcsUri,
  };
  const config = {
    encoding: "MP3",
    sampleRateHertz: 16000,
    languageCode: "en-US",
  };
  const request = {
    audio: audio,
    config: config,
  };

  const [operation] = await speechClient.longRunningRecognize(request);
  const [response] = await operation.promise();
  const transcription = response.results
    .map((result) => result.alternatives[0].transcript)
    .join("\n");
  return transcription;
}

async function uploadAudioToGCS(filePath) {
  const fileName = path.basename(filePath);
  const destination = `audio-files/${fileName}`;

  await storage.bucket(BUCKET_NAME).upload(filePath, {
    destination: destination,
  });

  return `gs://${BUCKET_NAME}/${destination}`;
}

async function generateTranscriptsForSortedFiles() {
  try {
    for (
      let lessonNumber = START_LESSON;
      lessonNumber <= MAX_LESSONS;
      lessonNumber++
    ) {
      const lessonPath = path.join(
        __dirname,
        "..",
        "sorted",
        `lesson${lessonNumber}`
      );
      let lessonTranscript = "";

      for (let partNumber = 1; partNumber <= MAX_PARTS; partNumber++) {
        const partPath = path.join(lessonPath, `part${partNumber}`);
        const soundPath = path.join(partPath, "sound");

        if (fs.existsSync(soundPath)) {
          const soundFiles = fs
            .readdirSync(soundPath)
            .filter((file) => file.endsWith(".mp3"));

          for (const soundFile of soundFiles) {
            const inputPath = path.join(soundPath, soundFile);
            const transcript = await transcribeAudioFile(inputPath);

            lessonTranscript += `Part ${partNumber}, Sound ${path.basename(
              soundFile,
              ".mp3"
            )}:\n${transcript}\n\n`;
          }
        }
      }

      if (lessonTranscript.length > 0) {
        const transcriptPath = path.join(
          lessonPath,
          `lesson${lessonNumber}_transcript.txt`
        );
        fs.writeFileSync(transcriptPath, lessonTranscript, "utf8");
        console.log(`Transcript generated: ${transcriptPath}`);
      }
    }
  } catch (error) {
    console.error("An error occurred while generating transcripts:", error);
  }
}

module.exports = {
  transcribeAudioFile,
  uploadAudioToGCS,
  generateTranscriptsForSortedFiles,
};
