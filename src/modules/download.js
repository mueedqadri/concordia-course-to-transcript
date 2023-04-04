const axios = require("axios");
const fs = require("fs");
const path = require("path");
const util = require("util");
const pipeline = util.promisify(require("stream").pipeline);
const {
  START_LESSON,
  MAX_LESSONS,
  MAX_PARTS,
  BASE_URL,
  sound,
  video,
} = require("../config");
const ffmpeg = require("fluent-ffmpeg");

async function convertVideoToAudio(videoPath, audioPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .noVideo()
      .save(audioPath)
      .on("end", resolve)
      .on("error", reject);
  });
}

async function downloadFile(url, outputPath) {
  try {
    const response = await axios({
      method: "GET",
      url: url,
      responseType: "stream",
    });

    await pipeline(response.data, fs.createWriteStream(outputPath));
    console.log(`Downloaded: ${url}`);
  } catch (error) {
    console.log(`Failed to download: ${url}`);
  }
}

async function downloadLessonContent() {
  for (
    let lessonNumber = START_LESSON;
    lessonNumber <= MAX_LESSONS;
    lessonNumber++
  ) {
    for (let partNumber = 1; partNumber <= MAX_PARTS; partNumber++) {
      for (const type of [sound, video]) {
        let soundNumber = 1;
        let url = `${BASE_URL}/lesson${lessonNumber}/content/ispring/${lessonNumber}_${partNumber}/data/${type.type}${soundNumber}.${type.ext}`;

        const lessonPath = path.join(
          __dirname,
          "..",
          "downloads",
          `lesson${lessonNumber}`
        );
        const partPath = path.join(lessonPath, `part${partNumber}`);
        const mediaPath = path.join(partPath, type.type);

        for (const dir of [lessonPath, partPath, mediaPath]) {
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
          }
        }

        let outputPath = path.join(
          mediaPath,
          `${type.type}${soundNumber}.${type.ext}`
        );

        await downloadFile(url, outputPath);

        while (fs.existsSync(outputPath)) {
          if (type.ext === "mp4") {
            const audioOutputPath = path.join(
              mediaPath,
              `${type.type}${soundNumber}.mp3`
            );
            await convertVideoToAudio(outputPath, audioOutputPath);
            fs.unlinkSync(outputPath); // Remove the video file
            outputPath = audioOutputPath;
          }

          soundNumber++;
          url = `${BASE_URL}/lesson${lessonNumber}/content/ispring/${lessonNumber}_${partNumber}/data/${type.type}${soundNumber}.${type.ext}`;
          outputPath = path.join(
            mediaPath,
            `${type.type}${soundNumber}.${type.ext}`
          );
          await downloadFile(url, outputPath);
        }
      }
    }
  }
}

module.exports = {
  downloadFile,
  downloadLessonContent,
};
