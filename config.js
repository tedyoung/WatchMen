/*
	ping_interval (host or url level): 
	- ping interval, in seconds.
	
	failed_ping_interval (host or url level): 
	- when site is down, ping interval, in seconds, until site is backup again

*/
var one_minute = 60 //you can set this to other value for testing the service in dev env.
var performance_test = false //set to true if you want a bulk config file to be used for testing instead of the following list of hosts

exports.database = { port: 6379, host : 'localhost', db: 'watchmen' }
	
var hosts = 
	[
		{
			name:'Google',
			host: 'www.google.com',
			port:80,
			protocol: 'http',
			timeout:10000,
			ping_interval: one_minute, //seconds
			failed_ping_interval: one_minute, //minutes
			enabled: true,
			alert_to: ['user@test.com'],
			warning_if_takes_more_than: 1500, //miliseconds
			urls : [
				{
					method: 'get',
					url : '/',
					expected: {statuscode: 200, contains: 'Google'} ,
				}
			]
		}
	]
	
exports.hosts = function(config_hosts){
	if (performance_test)
	{
		var words = [
			'google', 'yahoo', 'node', 'business', 'internet', 'hi', 'domain', 
			'test', 'sale', 'bed', 'monitor', 'computer', 'java', 'usa',
			'pc', 'linux', 'windows', 'microsoft', 'mouse', 'animal', 'zoo',
			'mobile', 'platform', 'lake', 'spain', 'zaragoza', 'table', 'rusia',
			'brazil', 'olimpiadas', 'money', 'winter', 'films', 'movies', 'spanish', 'bar',
			'runner','magazine','audio', 'video', 'cup', 'charger', 'mykeys', 'twitter',
			'php', 'python', 'camera', 'house', 'bad', 'nscoder', 'mvc', 'screen',
			'24h', 'harbor', 'mail', 'important', 'hungry', 'pizza',
			'fiesta', 'tuberia', 'boat'
		]

		function createHost (domain){
			return {
				name : domain, 
				host: domain, 
				port: '80',
				enabled :true,
				urls : [ { url: '/', method : 'get' }],
				ping_interval : one_minute,
				failed_ping_interval : one_minute / 2,
				warning_if_takes_more_than :500
			}
		}

		var hosts = [];

		for (var i=0; i<words.length;i++){
			hosts.push (createHost (words[i] + '.com'));
			hosts.push (createHost (words[i] + '.net'));
			hosts.push (createHost (words[i] + '.org'));

			hosts.push (createHost (words[i] + '.com'));
			hosts.push (createHost (words[i] + '.net'));
			hosts.push (createHost (words[i] + '.org'));
		}
		return hosts;
	}
	else{
		return config_hosts;
	}
}(hosts);

exports.notifications = {
	enabled: false, //if disabled, no email will be sent (just console messages)
	to: ['user@test.com'], //default notification list if no alert_to is specified for host or url
	service : {
		name : "mail",
		settings : {
		from: 'user@test.com',
		host : 'smtp.domain.com',
		username : 'user@test.com',
		password : 'password'
		}
	}
}


/*Example of notifications with postmark

	exports.notifications = {
		enabled: true, //if disabled, no email will be sent (just console messages)
		to: ['user@test.com'], //default notification list if no alert_to is specified for host or url
		service : {
			name : "postmark",
			settings : {
			From: 'user@test.com',
			Api_key : 'your-postmark-key-here'
			}
		}
	}
	
*/
