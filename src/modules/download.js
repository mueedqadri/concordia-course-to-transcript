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
        let outputPath = path.join(
          __dirname,
          "..",
          "downloads",
          `${lessonNumber}_${partNumber}_${type.type}${soundNumber}.${type.ext}`
        );

        await downloadFile(url, outputPath);

        while (fs.existsSync(outputPath)) {
          soundNumber++;
          url = `${BASE_URL}/lesson${lessonNumber}/content/ispring/${lessonNumber}_${partNumber}/data/${type.type}${soundNumber}.${type.ext}`;
          outputPath = path.join(
            __dirname,
            "..",
            "downloads",
            `${lessonNumber}_${partNumber}_${type.type}${soundNumber}.${type.ext}`
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
