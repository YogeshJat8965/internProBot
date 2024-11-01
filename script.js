const puppeteer = require("puppeteer");
const path = require("path");
const natural = require("natural");
const resumeFilePath = path.join(__dirname, "resumeA.pdf");
let { id, pass } = require("./secret");
const experienceDetails = require("./experienceDetails.json");


let linkeInLink = "https://www.linkedin.com/feed/";
let name = "Bo0gesh";
let lastName = "Jatzzzzzz";
let phone = 9988776655;
let email = "jat123@gmail.com";
let cityName = "Gwalior, Madhya Pradesh, India";
let mobileNumber = "8965900973";
let experience = 1;
let degreeCompleted = false;

// const numericQuestions = require("./numericData.json");
const binaryQuestions = require("./binaryData.json");
const dropDownQuestions = require("./dropDownData.json");

// Function to answer questions using natural language processing
function findBestAnswer(question, questionData) {
    if (!Array.isArray(questionData)) {
        questionData = [];
    }

    // Check for an exact match first
    for (let dataItem of questionData) {
        if (dataItem.question.toLowerCase() === question.toLowerCase()) {
            return dataItem.answer;
        }
    }

    // Use fuzzy matching as a fallback
    let bestMatch = null;
    let highestScore = 0.7; // Minimum score threshold

    questionData.forEach(dataItem => {
        const score = natural.JaroWinklerDistance(question.toLowerCase(), dataItem.question.toLowerCase());
        if (score > highestScore) {
            highestScore = score;
            bestMatch = dataItem.answer;
        }
    });

    return bestMatch || "Not Applicable";
}



(async () => {
    try {
        // Launch the browser
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });

        // Open a new page
        const page = await browser.newPage();
        await page.goto(linkeInLink);

        // Login process
        await page.type("input[name='session_key']", id);
        await page.type("input[aria-describedby='error-for-password']", pass);
        await page.click("button[data-litms-control-urn='login-submit']");

        // Navigate to the Jobs section
        await waitAndClick("a[href='https://www.linkedin.com/jobs/?']", page);
        await waitAndClick("[class='discovery-templates-vertical-list__footer']", page);
        await waitAndClick(
            "a[href='https://www.linkedin.com/jobs/collections/easy-apply?discover=recommended&discoveryOrigin=JOBS_HOME_JYMBII&start=0']",
            page
        );

        await page.waitForNavigation();

        const jobIds = await page.$$eval("li[data-occludable-job-id]", listItems =>
            listItems.slice(0, 1).map(li => li.getAttribute("data-occludable-job-id"))
        );

        console.log("First Job ID:", jobIds);

        for (let jobId of jobIds) {
            let jobApplyUrl = `https://www.linkedin.com/jobs/collections/easy-apply/?currentJobId=${jobId}&discover=recommended&discoveryOrigin=JOBS_HOME_JYMBII`;
            console.log("Navigating to:", jobApplyUrl);
            await page.goto(jobApplyUrl);

            await applyForJob(4053311622, page);
            // await applyForJob(jobId, page);
        }
    } catch (err) {
        console.error("Error:", err);
    }
})();

async function applyForJob(jobId, cpage) {
    try {
        await waitAndClick(`button[data-job-id='${jobId}']`, cpage);
        if (`button[data-job-id='${jobId}']`) {
            await waitAndClick(`button[data-job-id='${jobId}']`, cpage);
        }

        await fillFieldByLabel(cpage, name, "First name");
        await fillFieldByLabel(cpage, lastName, "Last name");
        await fillFieldByLabel(cpage, mobileNumber, "Mobile phone number");
        await fillFieldByLabel(cpage, cityName, "Location (city)");

        await waitAndClick("button[aria-label='Continue to next step']", cpage);

        // Upload the resume
        await cpage.waitForSelector(
            "span[aria-label='Upload resume button. Only, DOC, DOCX, PDF formats are supported. Max file size is (2 MB).']"
        );
        const [fileChooser] = await Promise.all([
            cpage.waitForFileChooser(),
            cpage.click(
                "span[aria-label='Upload resume button. Only, DOC, DOCX, PDF formats are supported. Max file size is (2 MB).']"
            )
        ]);

        await fileChooser.accept([resumeFilePath]);
        console.log("Resume uploaded successfully.");

        // Add a delay of 6 seconds (6000 milliseconds)
        await delay(3000); // Delay for 6 seconds

        await waitAndClick("button[aria-label='Continue to next step']", cpage);

        await delay(2000);

        // Handle job questions
        await handleJobQuestions(cpage);
    } catch (err) {
        console.log("Error in applyForJob:", err);
    }
}

// Function to extract questions and provide answers
async function handleJobQuestions(page) {
    try {
        // Extract all question labels from the page
        const questionLabels = await page.$$eval(
            "label.artdeco-text-input--label",
            labels => labels.map(label => label.innerText.trim())
        );

        console.log("Extracted Questions:");
        questionLabels.forEach((question, index) => {
            console.log(`${index + 1}: ${question}`);

            // Use getBestAnswer to find the most appropriate answer
            let answer = getBestAnswer(question);

            console.log(`Best Answer: ${answer}`);
        });
    } catch (err) {
        console.error("Error in handleJobQuestions:", err);
    }
}
// Function to get the best answer using exact or fuzzy matching
function getBestAnswer(question) {
    // Check for an exact match in experienceDetails
    if (experienceDetails.hasOwnProperty(question)) {
        return experienceDetails[question];
    }

    // If no exact match, use fuzzy matching
    let bestMatch = null;
    let highestScore = 0;
    const threshold = 0.7; // Adjust the threshold as needed

    for (let key in experienceDetails) {
        const similarity = natural.JaroWinklerDistance(question.toLowerCase(), key.toLowerCase());
        if (similarity > highestScore && similarity >= threshold) {
            highestScore = similarity;
            bestMatch = experienceDetails[key];
        }
    }

    // Return the best fuzzy match or a default answer if no match is found
    return bestMatch || "Software Engineer"; // Customize the default answer as needed
}


    async function fillFieldByLabel(page, valueToFill, textToSearch) {
        try {
            await page.waitForSelector(
                "div[data-test-single-typeahead-entity-form-component], div[data-test-single-line-text-form-component]",
                { timeout: 5000 }
            );
    
            const inputId = await page.evaluate(textToSearch => {
                const labels = document.querySelectorAll("label");
                for (let label of labels) {
                    if (label.textContent.includes(textToSearch)) {
                        return label.getAttribute("for");
                    }
                }
                return null;
            }, textToSearch);
    
            if (inputId) {
                const inputSelector = `#${inputId}`;
                const currentValue = await page.$eval(inputSelector, el => el.value);
                if (!currentValue) {
                    await page.type(inputSelector, valueToFill);
                    await page.keyboard.press('Enter');
    
    
    
                   console.log(`Filled "${textToSearch}" field with "${valueToFill}".`);
                } else {
                    console.log(`"${textToSearch}" field is already filled with "${currentValue}".`);
                }
            } else {
                console.log(`Label "${textToSearch}" not found on the page.`);
            }
        } catch (err) {
            console.log(`Error filling the "${textToSearch}" field:`, err);
        }
    }
    
    async function waitAndClick(selector, page) {
        try {
            await page.waitForSelector(selector);
            await page.click(selector);
        } catch (err) {
            console.log(`Error clicking selector: ${selector}`, err);
        }
    }
      // Introducing a delay using setTimeout wrapped in a Promise
      async function delay(milliseconds) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }