require('dotenv-safe').config()

const Twitter = require('twitter')
const PDFDocument = require('pdfkit')
const ipp = require('ipp')

const PAGE_SIZE = [mm(process.env.PAGE_WIDTH), mm(process.env.PAGE_HEIGHT)]
const PAPER_SIZE = `Custom.${process.env.PAGE_WIDTH}x${process.env.PAGE_HEIGHT}mm`

const client = new Twitter({
	consumer_key: process.env.TWITTER_CONSUMER_KEY,
	consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
	access_token_key: process.env.TWITTER_ACCESS_KEY,
	access_token_secret: process.env.TWITTER_ACCESS_SECRET
})

const stream = client.stream('statuses/filter', {track: process.env.TWITTER_FILTER})

stream.on('data', function(event) {
	printTweet(event)
})

stream.on('error', function(error) {
	throw error
})

function printTweet(e) {
	const doc = new PDFDocument({autoFirstPage: false})
	let buffer = []
	doc.on('data', buffer.push.bind(buffer))

	var page = doc.addPage({
		size: PAGE_SIZE,
		layout: 'landscape',
		margin: 0
	})

	page.text(e.text, mm(5), mm(5), {
		width: mm(70),
		height: mm(50),
		lineBreak: true
	})

	page.text(`@${e.user.screen_name}`, mm(5), mm(55), {
		width: mm(70),
		height: mm(10)
	})

	doc.on('end', function() {
		var file = {
			'job-attributes-tag': {
				'media': PAPER_SIZE
			},
			'operation-attributes-tag': {
				'requesting-user-name': 'tweet printer',
				'job-name': 'tweet printer',
				'requesting-user-name': 'tweet printer',
				'document-format': 'application/pdf',
			},
			data: Buffer.concat(buffer)
		}

		var printer = ipp.Printer(process.env.PRINTER_URL)
		printer.execute("Print-Job", file, function (err, res) {
			delete buffer
		})
	})

	doc.end()

	// e.text
	// e.user.screen_name
}

function mm(mm) {
	return mm * 2.834645669291
}
