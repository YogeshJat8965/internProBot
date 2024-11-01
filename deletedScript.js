// const puppeteer = require("puppeteer");
// const path = require('path');
// const resumeFilePath = path.join(__dirname, 'resumeA.pdf');
// let { id, pass } = require("./secret");
// let linkeInLink = "https://www.linkedin.com/feed/";
// let name = "Bo0gesh";
// let lastName = "Jatzzzzzz";
// let phone = 9988776655;
// let email = "jat123@gmail.com";
// let cityName = "Gwalior, Madhya pradesh, iNDIA";
// let mobileNumber = "8965900973";
// let experience = 1;
// let degreeCompleted = false;

// const numericQuestions = require('./numericData.json');
// const binaryQuestions = require('./binaryData.json');
// const dropDownQuestions = require('./dropDownData.json');

// (async () => {
//     try {
//         // Launch the browser
//         const browser = await puppeteer.launch({
//             headless: false,
//             defaultViewport: null,
//             args: ["--start-maximized"]
//         });

//         // Open a new page
//         const page = await browser.newPage();
//         await page.goto(linkeInLink);

//         // Login process
//         await page.type("input[name='session_key']", id);
//         await page.type("input[aria-describedby='error-for-password']", pass);
//         await page.click("button[data-litms-control-urn='login-submit']");

//         // Wait for LinkedIn to load the feed after login
//         // await page.waitForNavigation();

//         // Navigate to the Jobs section
//         await waitAndClick("a[href='https://www.linkedin.com/jobs/?']", page);

//         // click on show all
//         await waitAndClick("[class='discovery-templates-vertical-list__footer']", page);

//         // go to easy apply section
//         await waitAndClick("a[href='https://www.linkedin.com/jobs/collections/easy-apply?discover=recommended&discoveryOrigin=JOBS_HOME_JYMBII&start=0']", page);

//         await page.waitForNavigation();



        
//         const jobIds = await page.$$eval('li[data-occludable-job-id]', (listItems) => {
//             return listItems.slice(0, 1).map(li => li.getAttribute('data-occludable-job-id'));
//         });

//         console.log("First 5 Job IDs:", jobIds);


//         for (let jobId of jobIds) {
//             let jobApplyUrl = `https://www.linkedin.com/jobs/collections/easy-apply/?currentJobId=${jobId}&discover=recommended&discoveryOrigin=JOBS_HOME_JYMBII`;
//             console.log("Navigating to:", jobApplyUrl);
//             await page.goto(jobApplyUrl);

//             await applyForJob( jobId, page );
//             // break;
//         }



        
//     } catch (err) {
//         console.error("Error aa gya bhai:", err);
//     }
// })();

// async function applyForJob(jobId, cpage) {
//     try{
//         await waitAndClick(`button[data-job-id='${jobId}']`, cpage);
//         // if sometimes 2options are coming
//         if(`button[data-job-id='${jobId}']`){
//             await waitAndClick(`button[data-job-id='${jobId}']`, cpage);
//         }
//         // await waitAndClick("[aria-label='Continue to next step']", cpage);
//         await fillFieldByLabel(cpage, name, "First name"); // Assuming `name` contains the first name you want to enter
//         // await fillFirstName(cpage, lastName); 
//         await fillFieldByLabel(cpage, lastName, "Last name");

//         await fillFieldByLabel(cpage, cityName, "Location (city)");

//         await fillFieldByLabel(cpage, mobileNumber, "Mobile phone number");

//         await waitAndClick("button[aria-label='Continue to next step']", cpage);

//          // Specify the absolute path to your resume file
//         //  const resumeFilePath = '/home/yogesh/Desktop/resume For intership/resumeA.pdf'; 

//         await cpage.waitForSelector("span[aria-label='Upload resume button. Only, DOC, DOCX, PDF formats are supported. Max file size is (2 MB).']");
//         const [fileChooser] = await Promise.all([
//             cpage.waitForFileChooser(),
//             cpage.click("span[aria-label='Upload resume button. Only, DOC, DOCX, PDF formats are supported. Max file size is (2 MB).']")
//         ]);
        
//         await fileChooser.accept([resumeFilePath]);
//         console.log("Resume uploaded successfully.");


        

// // Upload the resume from the local path

// console.log("Resume uploaded successfully.");


       



//     }
//     catch(err) {
//         console.log(`Error clicking selector: ${selector}`, err);
//     }
// }


// async function fillFieldByLabel(page, valueToFill, textToSearch) {
//     try {
//         // Wait for any form component that matches the "single-typeahead" or "single-line-text" data-test attributes
//         await page.waitForSelector('div[data-test-single-typeahead-entity-form-component], div[data-test-single-line-text-form-component]', { timeout: 5000 });

//         // Use page.evaluate to find the input ID that matches the label's "for" attribute
//         const inputId = await page.evaluate((textToSearch) => {
//             const labels = document.querySelectorAll("label");
//             for (let label of labels) {
//                 // Match the label by checking for textContent that includes textToSearch
//                 if (label.textContent.includes(textToSearch)) {
//                     return label.getAttribute("for");
//                 }
//             }
//             return null; // Return null if no matching label is found
//         }, textToSearch);

//         if (inputId) {
//             const inputSelector = `#${inputId}`;

//             // Check if the field is empty before filling
//             const currentValue = await page.$eval(inputSelector, el => el.value);
//             if (!currentValue) {
//                 await page.type(inputSelector, valueToFill);
//                 page.keyboard.press('Enter');
//                 console.log(`Filled "${textToSearch}" field with "${valueToFill}".`);
//             } else {
//                 console.log(`"${textToSearch}" field is already filled with "${currentValue}".`);
//             }
//         } else {
//             console.log(`Label "${textToSearch}" not found on the page.`);
//         }
//     } catch (err) {
//         console.log(`Error filling the "${textToSearch}" field:`, err);
//     }
// }


// // Function to wait for a selector and click it
// async function waitAndClick(selector, page) {
//     try {
//         await page.waitForSelector(selector);
//         await page.click(selector);
//     } catch (err) {
//         console.log(`Error clicking selector: ${selector}`, err);
//     }
// }