
const fs = require("fs");

// Function to save filtered jobs to a JSON file
function saveJobsToJSON(jobs, outputPath) {
    fs.writeFileSync(outputPath, JSON.stringify(jobs, null, 2), "utf-8");
  }


module.exports = saveJobsToJSON;