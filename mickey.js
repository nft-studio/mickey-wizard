const puppeteer = require('puppeteer');
const argv = require('minimist')(process.argv.slice(2));
let browser
let link
let start
let end

function refresh(what) {
    console.log('Refreshing NFT #' + what)
    return new Promise(async response => {
        const page = await browser.newPage();
        let finalLink = link + '/' + what
        console.log('Going to: ' + finalLink)
        await page.goto(finalLink, {
            timeout: 60000
        });
        setTimeout(function () {
            console.log('Setting up 60s timeout..')
            response(true)
        }, 20000)
        await page.waitForSelector('[value="refresh"]', { visible: true });
        console.log('Page loaded, clicking..')
        await page.click('[value="refresh"]');
        setTimeout(function () {
            page.close()
        }, 3000)
    })
}

async function mickey() {
    if (argv._ !== undefined && argv._[0] !== undefined && argv._[1] !== undefined && argv._[0].indexOf('https://') !== -1 && argv._[1].indexOf('-') !== -1) {
        link = argv._[0]
        start = argv._[1].split('-')[0]
        end = argv._[1].split('-')[1]
        console.log('Fetching from collection: ' + link)
        browser = await puppeteer.launch({ headless: false });
        for (let i = start; i <= end; i++) {
            await refresh(i)
        }
    }else{
        console.log('Malformed request, please use me like:')
        console.log('npm start https://opensea.io/assets/matic/0xe0a52be1c766ffee0bd72296c78d86fa7f48aa07 1-50')
    }
}

mickey()