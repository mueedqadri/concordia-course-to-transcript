const fs = require("fs");
const path = require("path");

const {
  START_LESSON,
  MAX_LESSONS,
  MAX_PARTS,
  sound,
  video,
} = require("../config");

async function sortMedia() {
  for (
    let lessonNumber = START_LESSON;
    lessonNumber <= MAX_LESSONS;
    lessonNumber++
  ) {
    for (let partNumber = 1; partNumber <= MAX_PARTS; partNumber++) {
      for (const type of [sound, video]) {
        const mediaFiles = [];

        let mediaNumber = 1;
        let inputPath = path.join(
          __dirname,
          "..",
          "downloads",
          `${lessonNumber}_${partNumber}_${type.type}${mediaNumber}.${type.ext}`
        );

        while (fs.existsSync(inputPath)) {
          mediaFiles.push(inputPath);
          mediaNumber++;
          inputPath = path.join(
            __dirname,
            "..",
            "downloads",
            `${lessonNumber}_${partNumber}_${type.type}${mediaNumber}.${type.ext}`
          );
        }

        if (mediaFiles.length > 0) {
          const lessonPath = path.join(
            __dirname,
            "..",
            "sorted",
            `lesson${lessonNumber}`
          );
          const partPath = path.join(lessonPath, `part${partNumber}`);
          const mediaPath = path.join(partPath, type.type);

          for (const dir of [lessonPath, partPath, mediaPath]) {
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir);
            }
          }

          mediaFiles.forEach((mediaFile, index) => {
            const outputPath = path.join(
              mediaPath,
              `${type.type}${index + 1}.${type.ext}`
            );
            fs.renameSync(mediaFile, outputPath);
            console.log(`Moved: ${outputPath}`);
          });
        }
      }
    }
  }
}

module.exports = {
  sortMedia,
};
