/* Magic Mirror
 * Module: MMM-Overwatch
 *
 * By Johan Persson, https://github.com/retroflex
 * MIT Licensed.
 */

Module.register('MMM-Overwatch', {
	// Default configuration.
	defaults: {
		showLevel: true,
		showRating: true,
		showGamesWon: true,
		sortBy: 'rating',  // 'rating', 'level', or 'gamesWon'.
		userInfos: [ { platform: 'pc', battleTag: 'Fury-31609' },
		             { platform: 'pc', battleTag: 'HanBin-31186' } ],  // Must replace # with - in battle tag.
		fetchInterval: 10 * 60 * 1000  // In millisecs. Default every ten minutes.
	},

	getStyles: function() {
		return [ 'modules/MMM-Overwatch/MMM-Overwatch.css' ];
	},

	getTranslations: function () {
		return {
			en: 'translations/en.json',
			sv: 'translations/sv.json'
		}
	},

	// Notification from node_helper.js.
	// The stats is received here. Then module is redrawn.
	// @param notification - Notification type.
	// @param payload - payload.stats contains an array of stats. Each item contains battleTag / level / rating / gamesWon.
	socketNotificationReceived: function(notification, payload) {
		if (notification === 'STATS_RESULT') {
			if (null == payload)
				return;

			if (null == payload.identifier)
				return;

			if (payload.identifier !== this.identifier)  // To make sure the correct instance is updated, since they share node_helper.
				return;

			if (null == payload.stats)
				return;

			if (0 === payload.stats.length)
				return;

			this.stats = payload.stats;
			this.updateDom(0);
		}
	},

	// Override dom generator.
	getDom: function () {
		let wrapper = document.createElement('table');
		if (null == this.stats) {
			wrapper.innerHTML = this.translate('LOADING');
			wrapper.className = 'loading dimmed xsmall';
			return wrapper;
		}

		wrapper.className = 'bright xsmall';

		let headerRow = document.createElement('tr');
		headerRow.className = 'normal header-row';
		this.createTableCell(headerRow, this.translate('BATTLE_TAG'), true, 'battle-tag-header', 'center');
		this.createTableCell(headerRow, this.translate('LEVEL'), this.config.showLevel, 'level-header', 'center');
		this.createTableCell(headerRow, this.translate('RATING'), this.config.showRating, 'rating-header', 'center');
		this.createTableCell(headerRow, this.translate('GAMES_WON'), this.config.showGamesWon, 'games-won-header', 'center');
		wrapper.appendChild(headerRow);

		for (let i = 0; i < this.stats.length; ++i) {
			let row = document.createElement('tr');
			row.className = 'normal bright stats-row';

			const stat = this.stats[i];
			this.createTableCell(row, stat.battleTag, true, 'battle-tag', 'left');
			this.createNumberTableCell(row, stat.level, this.config.showLevel, 'level');
			this.createNumberTableCell(row, stat.rating, this.config.showRating, 'rating');
			this.createNumberTableCell(row, stat.gamesWon, this.config.showGamesWon, 'games-won');

			wrapper.appendChild(row);
		}

		return wrapper;
	},

	// Override start to init stuff.
	start: function() {
		this.stats = null;

		// Tell node_helper to load stats at startup.
		this.sendSocketNotification('GET_STATS', { identifier: this.identifier,
		                                           userInfos: this.config.userInfos,
		                                           sortBy: this.config.sortBy });

		// Make sure stats are reloaded at user specified interval.
		let interval = Math.max(this.config.fetchInterval, 1000);  // In millisecs. < 1 min not allowed.
		let self = this;
		setInterval(function() {
			self.sendSocketNotification('GET_STATS', { identifier: self.identifier,
			                                           userInfos: self.config.userInfos,
		                                             sortBy: self.config.sortBy });
		}, interval); // In millisecs.
	},

	// Creates a table row cell.
	// @param row - The table row to add cell to.
	// @param number - The number to show.
	// @param show - Whether to actually show.
	createNumberTableCell: function(row, number, show, className)
	{
		if (!show)
			return;

		const text = new Intl.NumberFormat().format(number);
		this.createTableCell(row, text, show, className);
	},

	// Creates a table row cell.
	// @param row - The table row to add cell to.
	// @param text - The text to show.
	// @param show - Whether to actually show.
	// @param align - Text align: 'left', 'center' or 'right'.
	createTableCell: function(row, text, show, className, align = 'right')
	{
		if (!show)
			return;

		let cell = document.createElement('td');
		cell.innerHTML = text;
		cell.className = className;

		cell.style.cssText = 'text-align: ' + align + ';';

		row.appendChild(cell);
	}
});
