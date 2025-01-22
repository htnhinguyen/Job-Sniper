


// Function to convert Markdown table to CSV
function convertMarkdownTableToCSV(markdown) {
    const lines = markdown.trim().split("\n");
    const csvLines = [];
  
    // Regular expression to remove unwanted special characters (like "↳")
    const specialCharsRegex = /[\u21B3\u00A0]/g; // Add any other special characters you want to remove
    // Regular expression to extract URLs from <a> tags
    const urlRegex = /<a href="([^"]+)">.*?<\/a>/g;
  
    // Extract table data starting from the 3rd line (after header and separator)
    for (let i = 2; i < lines.length; i++) {
      const line = lines[i].trim();
  
      // Skip empty lines
      if (!line) continue;
  
      // Replace <a> tags with their URLs only
      const cleanedLine = line.replace(urlRegex, "$1"); // Replace <a> with the URL
  
      // Match rows and remove pipes
      const row = cleanedLine
                  .split("|") // Split by pipe
                  .map((item) => item.trim()) // Trim spaces
                  .filter(Boolean) // Filter out empty items
                  .map((item) => item.replace(/(^\*{1,2}|\*{1,2}$)/g, "")) // Remove any bold markers
                  .map((item) => item.replace(specialCharsRegex, "")); // Remove special characters
  
      // Only include rows with the correct number of columns (5)
      if (row.length === 5) {
        // Fix the company name by removing commas
        const companyName = row[0].replace(/,/g, ""); // Remove all commas in company name
  
        // Fix the job title by replacing commas with hyphens
        const jobTitle = row[1].replace(/,/g, " - "); // Replace all commas in job title
  
        // Fix the location format by replacing the comma with a space
        const location = row[2].replace(/,\s+/g, " "); // Replace ", " with " " for City and State
  
        // Only push rows where the company name is not empty
        if (companyName) {
          csvLines.push(
            [companyName, jobTitle, location, row[3], row[4]].join(",")
          );
        }
      }
    }
  
    return csvLines.join("\n"); // Join all lines with newline
  }

  module.exports = convertMarkdownTableToCSV;