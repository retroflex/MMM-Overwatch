/* Magic Mirror
 * Module: MMM-Overwatch
 *
 * By Johan Persson, https://github.com/retroflex
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const rp = require('request-promise');
const baseURL = 'https://ow-api.com/v1/stats/';

module.exports = NodeHelper.create({
	start: function() {
		//console.log('Starting node_helper for: ' + this.name);
	},

	// Extracts JSON into the relevant stats.
	// JSON contains these (amongst others):
	//   json.name
	//   json.level
	//   json.rating
	//   json.gamesWon
	//   json.quickPlayStats.games.played
	//   json.quickPlayStats.games.won
	//   json.competitiveStats.games.played
	//   json.competitiveStats.games.won
	// @param json - The full JSON for the user.
	// @return Object with stats we want to show.
	extractStats: function(json) {

		const stats = { battleTag: json.name,
		                level: json.level,
		                rating: json.rating,
		                gamesWon: json.gamesWon };
		return stats;
	},

	// Gets Overwatch user stats from API and adds them to an array.
	// The array is then sent to the client (to MMM-Overwatch.js).
	// @param userInfos - String array of user info's. Each info contains platform and battleTag.
	getStats: function(payload) {
		let identifier = payload.identifier;
		let userInfos = payload.userInfos;

		let promises = [];
		for (let i = 0; i < userInfos.length; ++i) {
			const platform = userInfos[i].platform;
			const region = 'asia';  // Should be 'us', 'eu' or 'asia' according to API doc, but it seems it can be any value.
			const battleTag = userInfos[i].battleTag;
			const userURL = baseURL + platform + '/' + region + '/' + battleTag + '/profile';
			const options = {uri: userURL};
			promises.push(rp(options));
		}

		Promise.all(promises).then((contents) => {
			let stats = [];

			for (let i = 0; i < contents.length; ++i) {
				const content = contents[i];
				const json = JSON.parse(content);

				const stat = this.extractStats(json);
				stats.push(stat);
			}

			// Always sort by rating first. Good if the column to sort on have equal values.
			stats.sort((a, b) => Number(a.rating) - Number(b.rating));
				
			if ('level' === payload.sortBy)
				stats.sort((a, b) => Number(b.level) - Number(a.level));
			if ('gamesWon' === payload.sortBy)
				stats.sort((a, b) => Number(b.gamesWon) - Number(a.gamesWon));

			this.sendSocketNotification('STATS_RESULT', {identifier: identifier, stats: stats} );
		}).catch(err => {
			console.log(this.name + ' error when fetching data: ' + err);
		});
	},

	// Listens to notifications from client (from MMM-Overwatch.js).
	// Client sends a notification when it wants download new stats.
	// @param payload - String array of user info's (where each info contains platform and battle tag).
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'GET_STATS') {
			this.getStats(payload);
		}
	}

});
