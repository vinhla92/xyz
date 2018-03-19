const fs = require('fs');
const request = require('request');
const crypto = require('crypto');

const { Client } = require('pg');
const DBS = {};

Object.keys(process.env).map(key => {
    if (key.split('_')[0] === 'DBS') {
        DBS[key.split('_')[1]] = new Client({ connectionString: process.env[key] });
        DBS[key.split('_')[1]].connect();
    }
});

const images = process.env.IMAGES.split(' ');

function save(req, res){
    req.setEncoding('binary');

    let ts = Date.now(),
        sig = crypto.createHash('sha1').update(`timestamp=${ts}${images[2]}`).digest('hex');
    
    request.post({
        url: `https://api.cloudinary.com/v1_1/${images[3]}/image/upload`,
        body: {
            'file': `data:image/jpeg;base64,${req.body.toString('base64')}`,
            'api_key': images[1],
            'timestamp': ts,
            'signature': sig
        },
        json: true
    },
    (err, response, body) => {
        if(err){ 
            console.log(err);

        } else {           
            let q = `UPDATE ${req.query.table} 
                     SET images = array_append(images, '${body.secure_url}')
                     WHERE ${req.query.qID} = '${req.query.id}';`;
            
            // add filename to images field
            DBS[req.query.dbs]
                .query(q)
                .then(result => res.status(200).send({
                    'image_id': body.public_id,
                    'image_url': body.secure_url
                }))
                .catch(err => console.log(err));
        }
    });
}

function remove(req, res){

    let ts = Date.now(),
        sig = crypto.createHash('sha1').update(`public_id=${req.query.image_id}&timestamp=${ts}${images[2]}`).digest('hex');

    request.post({
        url: `https://api.cloudinary.com/v1_1/${images[3]}/image/destroy`,
        body: {
            'api_key': images[1],
            'public_id': req.query.image_id,
            'timestamp': ts,
            'signature': sig
        },
        json: true
    },
    (err, response, body) => {
        if(err){ 
            console.log(err);

        } else {  
            let q = `UPDATE ${req.query.table}
                        SET images = array_remove(images, '${decodeURIComponent(req.query.image_src)}')
                        WHERE ${req.query.qID} = '${req.query.id}';`;
            
            // add filename to images field
            DBS[req.query.dbs]
                .query(q)
                .then(result => res.status(200))
                .catch(err => console.log(err));
        }
    });
}

module.exports = {
    save: save,
    remove: remove
}