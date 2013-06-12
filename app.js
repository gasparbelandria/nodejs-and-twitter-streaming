/**
 * Stream Twitter with NodeJS.
 *
 * Node v0.8.17
 *
 * (http://www.nodejs.org)
 *
 * @author        Gaspar Belandria (http://www.gasparbelandria.com)
 * @link          http://nodejstwitter.rs.af.cm/
 * @package       nodejs
 * @license       http://opensource.org/licenses/gpl-3.0.html GNU General Public License, version 3 (GPL-3.0)
 *
 */

 /**
 * Modules dependencies
 */
 var app = require('http').createServer(handler)
	, io = require('socket.io').listen(app)
	, fs = require('fs')
	, twitter = require('ntwitter')

/**
* If use "localhost" the next line is: 
* app.listen(8080);
*/	
app.listen(process.env.VMC_APP_PORT || 1337, null);



/**
* API Stream Twitter
* OAuth credentials
* Put your Twitter Credentials: dev.twitter.com
*/
var twit = new twitter({
	consumer_key: 'you consumer key here',
	consumer_secret: 'you consumer secret here',
	access_token_key: 'you access token key here',
	access_token_secret: 'yoy access token secret here'
});

/**
* Handler statics
*/
function handler (req, res){
	fs.readFile(__dirname + '/index.html', 
	function(err, data){
		if(err){
			res.writeHead(500);
			return res.end('Error loading index.html');
		}
		res.writeHead(200);
		res.end(data);
	});
}

io.sockets.on("connection", startSearch);
function startSearch(usuario){
	usuario.on("newWord", emitTwitter);
}

function emitTwitter(searchTwitter){
	twit.stream('statuses/filter', {'track':searchTwitter}, function(stream) {
		stream.on('data', function(data){
			/**
			* Emit Socket with Json Stream from Twitter
			*/
			io.sockets.volatile.emit("serverName", data);
		})
	})
}