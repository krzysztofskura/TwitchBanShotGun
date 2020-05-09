const tmi = require('tmi.js');

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
	`dragonmasterk`
    ]
};

//constants
username = opts.channels[0].replace('#', '');
de = 15000; // delay in miliseconds

//vars
var names = []; // list of usernames to use
var loaded = false; // check for gathering names

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
    if (us == username || us == `dragonmasterk`) {
	switch(commandName){
	case `!hello`:
	    hello(target);
	    break;
	case `!reload`:
	    reload(target);
	    break;
	case `!shot`:
	    shot(target)
	    break;
	default:
	    //client.say(target, `Incorrect command.`);
	    console.log(`* Unknown command ${commandName}`);
	    break;
      }
    } else if (loaded) {
	console.log(`* Storing usernames of chatters`);
	storeNames(us)
    } else{ // ignoring everything else
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
    console.log(`* Executed !reload command`);
}


// function that reloads the barrel
async function reload(target){
    //client.say(target, `Loading the barrel...`);
    console.log(`* Executed !reload command`);
    loaded = true;
    await sleep(de);
    names = [];
    //remove perivous enteries that were timeouts
    //console.log(`* the logs have been cleared of last timeouts`);
}

// function that purges users that spoke since reload
async function shot(target){
    loaded = false;
    //console.log(`* Executed !shot command`);
    client.say(target, `/me SHOTGUN'd!!`);
    for (let usnm in names) {
	if (Math.random() < 0.4){
	    client.say(`timeout ${usnm} 1`);
	}
    }
    names = [];
}

// function test
async function hello(target){
    client.say(target, `hello! I'm a bot.`);
    console.log(`* Executed !hello command`);
    await sleep(de);
}

//sets the time when the command can be called used again
const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}
