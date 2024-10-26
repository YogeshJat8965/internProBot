const puppeteer = require("puppeteer");
let { id, pass } = require("./secret");
let linkeInLink = "https://www.linkedin.com/feed/";
let name = "Bogesh";
let phone = 9988776655;
let email = "jat123@gmail.com";

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

        // Wait for LinkedIn to load the feed after login
        // await page.waitForNavigation();

        // Navigate to the Jobs section
        await waitAndClick("a[href='https://www.linkedin.com/jobs/?']", page);

        // click on show all
        await waitAndClick("[class='discovery-templates-vertical-list__footer']", page);

        // go to easy apply section
        await waitAndClick("a[href='https://www.linkedin.com/jobs/collections/easy-apply?discover=recommended&discoveryOrigin=JOBS_HOME_JYMBII&start=0']", page);

        await page.waitForNavigation();



        
        const jobIds = await page.$$eval('li[data-occludable-job-id]', (listItems) => {
            return listItems.slice(0, 5).map(li => li.getAttribute('data-occludable-job-id'));
        });

        console.log("First 5 Job IDs:", jobIds);


        for (let jobId of jobIds) {
            let jobApplyUrl = `https://www.linkedin.com/jobs/collections/easy-apply/?currentJobId=${jobId}&discover=recommended&discoveryOrigin=JOBS_HOME_JYMBII`;
            console.log("Navigating to:", jobApplyUrl);
            await page.goto(jobApplyUrl);

            await applyForJob( jobId, page );
            // break;
            
        }



        
    } catch (err) {
        console.error("Error aa gya bhai:", err);
    }
})();

async function applyForJob(jobId, cpage) {
    try{
        await waitAndClick(`button[data-job-id='${jobId}']`, cpage);
        // if sometimes 2options are coming
        if(`button[data-job-id='${jobId}']`){
            await waitAndClick(`button[data-job-id='${jobId}']`, cpage);
        }

        await waitAndClick("[aria-label='Continue to next step']", cpage);
       
    }
    catch(err) {
        console.log(`Error clicking selector: ${selector}`, err);
    }
}

// Function to wait for a selector and click it
async function waitAndClick(selector, page) {
    try {
        await page.waitForSelector(selector);
        await page.click(selector);
    } catch (err) {
        console.log(`Error clicking selector: ${selector}`, err);
    }
}

