import scrape from 'website-scraper'
import ExternalDependencies from "./ext-deps.js"

if (process.argv.length !== 4) {
    console.log("Error! Enter address of website and directory for saving files.");
    process.exit(-1)
}

const site = process.argv[2]
global.dir = process.argv[3]
global.links = new Set()
const options = {
    urls: [site],
    urlFilter: function(url) {
        return url.indexOf(site) === 0; },
    directory: dir,
    sources: { selector: 'a', attr: 'href' },
    recursive: true,
    maxRecursiveDepth: 2,
    maxDepth: 2,
    plugins: [ new ExternalDependencies() ]
}

try {
    const result = await scrape(options);
}
catch (error) {
    console.log("Error!")
}
