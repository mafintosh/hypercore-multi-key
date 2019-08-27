const ras = require('random-access-storage')
const ram = require('random-access-memory')
const crypto = require('hypercore-crypto')

module.exports = storage

function storage (feed, keyPair) {
  return function createFile (name) {
    if (name === 'data') return feed._storage.data
    if (name === 'bitfield') return feed._storage.bitfield
    if (name === 'tree') return feed._storage.tree
    if (name === 'signatures') return createSignature(feed, keyPair)
    if (name === 'key') return ram(keyPair.key || keyPair.publicKey)
    return ras({ write: nullWrite })
  }
}

function nullWrite (req) {
  req.callback(null, null)
}

function createSignature (feed, keyPair) {
  const secretKey = keyPair.secretKey

  return ras({
    write: nullWrite,
    read: function (req) {
      const offset = req.offset
      const i = (offset - 32) / 64

      feed.rootHashes(i, function (err, roots) {
        if (err) return req.callback(err)
        req.callback(null, crypto.sign(crypto.tree(roots), secretKey))
      })
    }
  })
}
