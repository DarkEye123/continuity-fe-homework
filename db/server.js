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
  // Continue to JSON Server router
  next()
})

server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running, check http://localhost:3000')
})
