const tmi = require('tmi.js'); // Twitch IRC library
const Wiimote = require(`node-wiimote`); // Require in library to work with wii mote


// Define configuration options
const opts = {
    connection: {
		reconnect: true,
		secure: true
    },
    identity: {
		username: `twitchshotgun_bot`,
		password: `oauth:jojygkeldhnnz6jhuc92o8g809g6k7`
    },
    channels: [
		`giantwaffle`
    ]
};

//constants
channel = opts.channels[0].replace('#', '');
de = 15000; // delay in miliseconds

//vars
var names = []; // list of usernames to use
var loaded = false; // check for gathering names
var wii = new Wiimote(); // Initialize wiimote library 

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on(`message`, onMessageHandler);
client.on(`connected`, onConnectedHandler);

// Connect to Twitch:
client.connect();

// Called every time a message comes in
// target is the channel, context has a bunch of stuff, msg is message
function onMessageHandler (target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot
    
    // Remove whitespace from chat message
    const commandName = msg.trim();
    
    // finds usersname of who sent the message
    const us = context['username'];

    //const channel = target.replace(`#`, ``);
    
    // executing commands
    if (us == channel || us == `dragonmasterk`) {
		switch(commandName){
			case `hello`:
				hello(target);
				break;
			case `reload`:
				reload(target);
				break;
			case `shot`:
				shoot(target)
				break;
			default:
				//client.say(target, `Incorrect command.`);
				console.log(`* Unknown command ${commandName}`);
				break;
			  }
    } else if (loaded) {
		console.log(`* Storing usernames of chatters ${us}`);
		storeNames(us)
    } else { // ignoring everything else
		//console.log(msg);	
    }

}
	
// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
    console.log(`& Hello I am your Shutgun Ban bot. \n` +
                `& Prepare for trouble. \n` +
                `& Connected to channel: ` + opts.channels + `\n`);
}

//stores usernames of people who have chatted in the past minute
function storeNames(username){
    if (names.length == 0){
		names.push(username)
    } else if (names[names.length-1] != username){
		names.push(username)
    }
	// console.log(`* Executed storeNames function`);
}


// function that reloads the barrel
async function reload(target){
    //client.say(target, `Loading the barrel...`);
    console.log(`* Executed !reload command`);
    loaded = true;
    await sleep(de);
    names = [];
}

// function that purges users that spoke since reload
async function shoot(target){
	if (loaded == true) {
		loaded = false;
		console.log(`* Executed !shot command`);
		//client.say(target, `/me SHOTGUN'd!!`);
		
		for (let usnm of names) {
			if (Math.random() < 0.6){
				//client.say(`timeout ${usnm} 1`);
				//client.timeout(channel, usnm, 1, `Shotgun ban`);
				console.log(`timeout ${channel}, ${usnm}, 1, Shotgun ban`);
			}
		}
		names = [];
	} else {
		console.log(`You need to reload before shooting`);
	}
}

// function test
async function hello(){
    //client.say(target, `hello! I'm a bot.`);
    console.log(`* Executed !hello command`);
    await sleep(de);
}

//sets the time when the command can be called used again
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// wii compotents
// b to reload and z or c to shoot
if (wii.exists) {  
	wii.setLights(true, false, false, false);
    var releaseAToken = wii.on(`button_a`, `released`, shoot); // Returns listener token used to remove listeners.  
    var releaseBToken = wii.on(`button_b`, `released`, reload);
	
    //wii.off(pressAToken); // Takes listener token and removes listener
}  