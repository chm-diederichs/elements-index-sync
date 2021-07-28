const Hypercore = require('hypercore-x')
const ram = require('random-access-memory')
const Hyperbee = require('hyperbee')
const Hyperswarm = require('hyperswarm')

const swarm = new Hyperswarm()

async function main() {
	const core = new Hypercore(ram, Buffer.from("5a8519ffa5e9ca8e22848429ef4baf0d8cfd5562e1c2f06fbb34d7a6b6e7ff5e","hex"))
	await core.ready()

	// It accepts LevelDB-style key/value encoding options.
	const db = new Hyperbee(core, {
		keyEncoding: 'utf-8',
		valueEncoding: 'binary'
	})

	await db.ready()

  swarm.on('connection', async socket => {
    console.log('connection')
    core.replicate(socket)

	  console.log(await db.peek())
    const str = db.createHistoryStream({ live: true })
    str.on('data', console.log)
  })

  swarm.join(core.discoveryKey, { server: false, client: true  })
  await swarm.flush()
	console.log(core)
}

main()
