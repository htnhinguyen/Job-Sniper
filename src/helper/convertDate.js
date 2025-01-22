
// Helper function to convert that date posted
function convertDate(dateString) {
    const months = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };
  
    const [monthStr, day] = dateString.split(" ");
    const month = months[monthStr];
    const currentYear = new Date().getFullYear(); // Get the current year
  
    if (month === undefined) {
      return null; // Return null if the month is invalid
    }
  
    return new Date(currentYear, month, parseInt(day));
  }
  

  module.exports = convertDate;