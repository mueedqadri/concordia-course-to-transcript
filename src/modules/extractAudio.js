const ffmpeg = require("fluent-ffmpeg");

function extractAudioFromVideo(videoPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(outputPath)
      .on("end", () => {
        console.log(`Extracted audio from ${videoPath}`);
        resolve(outputPath);
      })
      .on("error", (error) => {
        console.error(`Error extracting audio from ${videoPath}:`, error);
        reject(error);
      })
      .run();
  });
}

module.exports = {
  extractAudioFromVideo,
};
