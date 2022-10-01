import { load } from 'cheerio'
import fs from 'fs'
import whois from 'whois'

const country = "Registrant Country:"
const registrar = "registrar:"
const admin_country = "Admin Country:"

class ExternalDependencies {
    apply(registerAction) {
        registerAction('afterResponse', async ({response}) => {
            let extensions = ['.png', '.pdf', '.odt', '.docx', '.zip', '.jpg', '.jpeg', '.pptx'];
            if (response.statusCode === 404)
                return null;
            for (let ext of extensions) {
                if (response.url.includes(ext)) {
                    return null
                }
            }
            return Promise.resolve(response.body)
            // return {
            //     body: response.body,
            //     metadata: {},
            //     encoding: 'utf8'
            // }
        });
        registerAction('onResourceSaved', ({resource}) => {
            const $ = load(fs.readFileSync(dir + resource.filename))
            let scripts = $('script')
            scripts.each(function() {
                let source = $(this).attr('src')
                if (typeof(source) !== undefined) {
                    try {
                        const url = new URL(source)
                        const host = url.host
                        if (!links.has(host)) {
                            links.add(host)
                            let parts = host.split('.')
                            let domain = parts[parts.length - 2] + '.' +  parts[parts.length - 1]
                            console.log(domain)
                            whois.lookup(domain, function (err, data) {
                                if (err) {
                                    console.log("Couldn't find the information about registrar due to error.")
                                } else {
                                    console.log("Information for host: " + host)
                                    let pos_country = data.indexOf(country)
                                    let pos_registrar = data.indexOf(registrar)
                                    let pos_admin = data.indexOf(admin_country)
                                    if (pos_country !== -1) {
                                        console.log(data.slice(pos_country, pos_country + country.length + 3))
                                    }
                                    if (pos_registrar !== -1) {
                                        console.log(data.slice(pos_registrar, pos_registrar + 27))
                                    }
                                    if (pos_admin !== -1) {
                                        console.log(data.slice(pos_admin, pos_admin + admin_country.length + 3))
                                    }
                                    if (pos_country === -1 && pos_registrar === -1 && pos_admin === -1) {
                                        console.log("No information")
                                    }
                                }
                            })
                        }

                    }
                    catch (_) {}
                }
            })
        });
    }
}

export default ExternalDependencies