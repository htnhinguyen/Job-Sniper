const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const markdownDownloadUrl = process.env.SIMPLIFY_URL;

// Import helper functions
const convertDate = require("../../helper/convertDate");
const saveJobsToJSON = require("../../helper/jobsToJSON");
const convertMarkdownTableToCSV = require("../../helper/markdownToCSV");



/**
 * Function to filter jobs that are posted today fit with Simplify
 * @param {string} filepath - Path to the CSV file containing Simplify job data
 * @returns {Array} - Array of jobs posted today
 */
function filteredJobs(filepath) {
  const today = new Date(); // Initialize today as a Date object

  // Read CSV file as a string
  const csvData = fs.readFileSync(filepath, "utf-8");
  const lines = csvData.trim().split("\n"); // Split file into lines

  const headers = lines[0].split(","); // Extract headers
  const jobs = [];

  // Loop through the CSV rows (skip the header row)
  for (let i = 2; i < lines.length; i++) {
    const row = lines[i].split(","); // Split the row by commas
    const postDateStr = row[4].trim();
    const postDate = convertDate(postDateStr);

    // Compare the post date with today's date
    if (postDate && postDate.toDateString() === (today.toDateString()) ) {
      jobs.push({
        company: row[0].trim(), // Company
        jobTitle: row[1].trim(), // Job Title
        location: row[2].trim(), // Location
        applyLink: row[3].trim(), // Apply link
        datePosted: postDateStr, // Date Posted
      });
    } else {
      // Incase of no job for today, break
      break 
    }
  }

  return jobs;
}


/**
 * Download the Simplify Markdown file and convert it to CSV then filter it and save to JSON file
 * @returns - JSON file with jobs posted today
 */
async function simplifyDownloadMarkdown() {

  const filePath = path.resolve("../Job-Sniper/src/data/simplified/source.txt"); // Specify where to save the downloaded file
  console.log("Simplify  __dirname", __dirname, "\n") ;
  
  try {
    const response = await axios.get(markdownDownloadUrl);
    fs.writeFileSync(filePath, response.data);
    console.log("Simplified job fetched successfully \n");

    // Convert the downloaded Markdown to CSV
    const csvContent = convertMarkdownTableToCSV(response.data);

    // Save the CSV content to a file
    const csvFilePath = path.resolve("../Job-Sniper/src/data/simplified/jobs.csv");
    fs.writeFileSync(csvFilePath, csvContent);
    console.log("CSV file created successfully");

    // Save filtered jobs to JSON file
    const jsonFilePath = path.resolve("../Job-Sniper/src/data/simplified/todayJobs.json");
    const filteredJobData = filteredJobs(csvFilePath);

    /**
     * TODO : Send the message to Discord
     */

    saveJobsToJSON(filteredJobData, jsonFilePath);
    console.log("Filtered jobs saved to JSON file");
  } catch (error) {
    console.error("Error downloading Markdown file:", error);
  }
}

module.exports = simplifyDownloadMarkdown;