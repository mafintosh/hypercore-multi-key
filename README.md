# hypercore-multi-key

Function that takes a hypercore and returns a new one
that is signed by a new key pair but backed by the same data.

```
npm install hypercore-multi-key
```

Useful if you want to do one-off sharing of a hypercore

## Usage

``` js
const multiKey = require('hypercore-multi-key')

// returns a new feed that is identical as the one passed
// but signed by a new key pair
const newFeed = multiFeed(feed)

feed.append('hello')
newFeed.get(0, console.log) // returns 'hello'
```

## API

#### `newFeed = multiFeed(feed, [keyPair], [options])`

Create a new hypercore that is backed by the same data as another
one but signed by a new key pair.

You can replicate this new one to other people just like you would
any other hypercore.

If you want to use a specific new key pair pass it in as the 2nd arguments.
Otherwise a random one is generated.

All options are passed to the hypercore constructor.

## License

MIT
