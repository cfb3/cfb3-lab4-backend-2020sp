const API_KEY = process.env.PHISH_DOT_NET_KEY

//express is the framework we're going to use to handle requests
const express = require('express')

//request module is needed to make a request to a web service
const request = require('request')

const https = require('https')

const crypto = require('crypto')
const { time } = require('console')

var router = express.Router()

/**
 * @api {get} /phish/blog/get Request a list of Phish.net Blogs
 * @apiName GetPhishBlogGet
 * @apiGroup Phish
 * 
 * @apiHeader {String} authorization JWT provided from Auth get
 * 
 * @apiDescription This end point is a pass through to the Phish.net API. 
 * All parameters will pass on to https://api.phish.net/v3/blog/get.
 * See the <a href="https://phishnet.api-docs.io/v3/blog/blog-get">Phish.net documentation</a>
 * for a list of optional paramerters and expected results. You do not need a 
 * Phish.net api key with this endpoint. Enjoy!
 */ 
router.get("/characters", (request, response) => {

    let public_key = "29d6f0940bc494d38d918a29b2216239"
    let private_key = "9c16c20e45ac1e82ec07dba169d5a3bf10eee27e"
    let time_stamp = Date.now()

    let hash = crypto.createHash('md5').update(time_stamp + private_key + public_key).digest("hex")
    
    let params = `?ts=${time_stamp}&apikey=${public_key}&hash=${hash}`

    const options = {
        hostname: 'gateway.marvel.com',
        port: 443,
        path: '/v1/public/characters' + params,
        method: 'GET'
    }

    const req = https.request(options, res => {
        
        // console.log(`statusCode: ${res.statusCode}`)

        let data = ""

        res.on('data', d => {
            data += d
            // process.stdout.write(d)
            // response.send("done")
        })

        res.on('end', () => {
            // console.log(res)
            console.log(data)

            let results = JSON.parse(data).data.results

            let characters = []
            results.forEach(element => {
                let character = {
                    id:element.id,
                    name:element.name,
                    description:element.description,
                    thumbnail:element.thumbnail
                }
                characters.push(character)
            });

            // console.log(characters);
            response.send({
                count:characters.length,
                characters:characters
            })
        })
    })

    req.on('error', error => {
        console.error(error)
        response.send({message:"error"})
    })

    req.end()

    

})

module.exports = router