const path = require('path');


const simplifyFetch = require('./src/fetch/simplified/simplified_fetch');
const jobRightFetch = require('./src/fetch/job_right/jobright_fetch');


async function main(){
    try{
        jobRightFetch();

        const todayJobRightJSON = path.resolve('./src/data/job_right/todayJobs.json');

        console.log("todayJobRightJSON", todayJobRightJSON);

    } catch(error){
        console.error("error with jobRightFetch", error);
    }
}

main();