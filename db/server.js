const jsonServer = require('json-server')
const { v4: uuidv4 } = require('uuid')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

const redirects = require('./json-server-routes.json')

server.use(middlewares)
server.use(jsonServer.rewriter(redirects))

router.db._.id = 'guid'

server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.guid = uuidv4()
  }
  next()
})

router.render = (req, res) => {
  console.log(res.statusCode)
  if (res.statusCode == 200 || res.statusCode == 201) {
    res.jsonp({
      data: res.locals.data,
      errors: null,
    })
  } else {
    const guid = req.path.split('/').pop()
    res.jsonp({
      data: null,
      errors: [
        {
          message: 'Media record was not found.',
          details: guid,
          code: 'media-not-found',
        },
      ],
    })
  }
}

server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running, check http://localhost:3000')
})
