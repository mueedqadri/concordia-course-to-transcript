const fs = require("fs");
const path = require("path");
const { downloadLessonContent } = require("./modules/download");
const { sortMedia } = require("./modules/sort");
const {
  generateTranscriptsForSortedFiles,
} = require("./modules/transcription");

["downloads", "sorted"].forEach((dir) => {
  if (!fs.existsSync(path.join(__dirname, dir))) {
    fs.mkdirSync(path.join(__dirname, dir));
  }
});

// Uncomment the desired function to execute
downloadLessonContent();
// sortMedia();
// generateTranscriptsForSortedFiles();
