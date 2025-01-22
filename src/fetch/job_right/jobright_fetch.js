const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Load environment variables
require("dotenv").config({ path: path.resolve(__dirname, "../../../.env") });
const markdownDownloadUrl = process.env.JOBRIGHT_URL;

// Import helper functions
const convertDate = require("../../helper/convertDate");
const saveJobsToJSON = require("../../helper/jobsToJSON");
const convertMarkdownTableToCSV = require("../../helper/markdownToCSV");
const jobNotify = require("../../discord_msg/jobNotify");


function filteredJobs(filepath) {
  const today = new Date(); // Initialize today as a Date object
  today.setDate(today.getDate() - 1 ); // Subtract 4 days from today's date

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
    if (postDate && postDate.toDateString() === today.toDateString()) {
      jobs.push({
        company: row[0].trim(), // Company
        jobTitle: row[1].trim(), // Job Title
        location: row[2].trim(), // Location
        applyLink: row[3].trim(), // Apply link
        datePosted: postDateStr, // Date Posted
      });
    }
  }


  return jobs;
}


/**
 * Download the JobRight Markdown file and convert it to CSV then filter it and save to JSON file
 * @returns - JSON file with jobs posted today
 */
async function jobrightDownloadMarkdown() {
  const filePath = path.resolve("../Job-Sniper/src/data/job_right/source.txt"); // Specify where to save the downloaded file
  console.log("jobRight  __dirname", __dirname, "\n");
  
  try {
    const response = await axios.get(markdownDownloadUrl);
    fs.writeFileSync(filePath, response.data);
    console.log("JobRight job fetched successfully \n");

    // Convert the downloaded Markdown to CSV
    const csvContent = convertMarkdownTableToCSV(response.data);

    // Save the CSV content to a file
    const csvFilePath = path.resolve("../Job-Sniper/src/data/job_right/jobs.csv");
    fs.writeFileSync(csvFilePath, csvContent);
    console.log("CSV file created successfully");

    // Save filtered jobs to JSON file
    const jsonFilePath = path.resolve("../Job-Sniper/src/data/job_right/todayJobs.json");
    const filteredJobData = filteredJobs(csvFilePath);

    /**
     * Send the message to Discord
     */

    //Formating and call the message right here !
    for (let i = 0; i < filteredJobData.length; i++){
      console.log("filteredJobData[i] is actually ", filteredJobData[i]);
      let companyName = filteredJobData[i].company;
      let companyURL = companyName.match(/\(([^)]+)\)/)[1]; 
      let jobTitle = filteredJobData[i].jobTitle;
      let updatedJobTitle = jobTitle.replace('jobright-internal.com', 'jobright.ai');
      let jobLocation = filteredJobData[i].location;
      let datePosted = filteredJobData[i].datePosted;
      
      jobNotify(companyName, updatedJobTitle, jobLocation, companyURL);
    }
    
    saveJobsToJSON(filteredJobData, jsonFilePath);
    console.log("Filtered jobs saved to JSON file successfully");
  } catch (error) {
    console.error("Error downloading Markdown file:", error);
  }
}

module.exports = jobrightDownloadMarkdown;