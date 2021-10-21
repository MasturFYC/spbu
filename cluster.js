//const express = require("express")
const { createServer } = require('http')
const os = require('os')
const cluster = require('cluster')
const { URL } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })

const handle = app.getRequestHandler()
const port = process.env.PORT || 3000

const clusterWorkerSize = 2 //os.cpus().length

if (clusterWorkerSize > 1) {
  if (cluster.isMaster) {
    for (let i = 0; i < clusterWorkerSize; i++) {
      cluster.fork()
    }

    cluster.on('exit', function (worker) {
      console.log('Worker', worker.id, ' has exitted.')
    })
  } else {
    app.prepare().then(() => {
      createServer((req, res) => {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const baseUrl = req.protocol + '://' + req.headers.host + '/'
        const parsedUrl = new URL(req.url, baseUrl) //, true)
        const { pathname, query } = parsedUrl

        handle(req, res, pathname) // parsedUrl)
      }).listen(port, (err) => {
        if (err) throw err
        console.log(`> Ready on http://localhost:${port}`)
      })
    })
  }
} else {
  app.prepare().then(() => {
    createServer((req, res) => {
      // Be sure to pass `true` as the second argument to `url.parse`.
      // This tells it to parse the query portion of the URL.
      const baseUrl = req.protocol + '://' + req.headers.host + '/'
      const parsedUrl = new URL(req.url, baseUrl) //, true)
      const { pathname, query } = parsedUrl

      handle(req, res, pathname) // parsedUrl)
    }).listen(port, (err) => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
}

// welcome to the jungle
