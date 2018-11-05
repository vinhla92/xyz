module.exports = fastify => {
  fastify.route({
    method: 'POST',
    url: '/api/location/images/upload',
    beforeHandler: fastify.auth([fastify.authAPI]),
    handler: (req, res) => {

      const images = process.env.IMAGES ? process.env.IMAGES.split(' ') : [];

      var data = [];

      req.req.on('data', chunk => data.push(chunk));

      req.req.on('end', () => {

        req.body = Buffer.concat(data);

        let
          ts = Date.now(),
          sig = require('crypto').createHash('sha1').update(`folder=${images[4]}&timestamp=${ts}${images[2]}`).digest('hex');

        require('request').post({
          url: `https://api.cloudinary.com/v1_1/${images[3]}/image/upload`,
          body: {
            'file': `data:image/jpeg;base64,${req.body.toString('base64')}`,
            'api_key': images[1],
            'folder': images[4],
            'timestamp': ts,
            'signature': sig
          },
          json: true
        }, async (err, response, body) => {

          if (err) return console.error(err);

          const token = req.query.token ?
            fastify.jwt.decode(req.query.token) : { access: 'public' };

          let
            table = req.query.table,
            field = req.query.field,
            qID = req.query.qID ? req.query.qID : 'id',
            id = req.query.id;

          // Check whether string params are found in the settings to prevent SQL injections.
          if ([table, qID]
            .some(val => (typeof val === 'string' && val.length > 0 && global.workspace[token.access].values.indexOf(val) < 0))) {
            return res.code(406).send('Parameter not acceptable.');
          }

          var q = `
          UPDATE ${table} SET ${field} = array_append(${field}, '${body.secure_url}')
          WHERE ${qID} = $1;`;

          // add filename to images field
          await global.pg.dbs[req.query.dbs](q, [id]);

          res.code(200).send({
            'image_id': body.public_id,
            'image_url': body.secure_url
          });
        });

      });
    }

  });
};