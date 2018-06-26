const crypto = require('hypercore/lib/crypto')
const hypercore = require('hypercore')
const storage = require('./storage')

module.exports = multiKey

function multiKey (feed, keyPair, opts) {
  if (!keyPair) keyPair = crypto.keyPair()

  const key = keyPair.key || keyPair.publicKey
  const other = hypercore(storage(feed, keyPair), key, opts)

  feed.ready(function () {
    other.ready(function () {
      other.bitfield = feed.bitfield
      other.tree = feed.tree
    })
  })

  feed.on('download', function (index, data) {
    other._announce({start: index}, null)
    other.emit('download', index, data, null)
  })

  feed.on('append', function () {
    const offset = other.length
    other.length = feed.length
    other.byteLength = feed.byteLength
    if (!feed.writable) return other.emit('append')

    const message = other.length - offset > 1
      ? {start: offset, length: other.length - offset}
      : {start: offset}

    other._announce(message)
    other.emit('append')
  })

  return other
}
