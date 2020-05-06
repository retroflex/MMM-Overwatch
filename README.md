# MMM-Overwatch
A [MagicMirror²](https://github.com/MichMich/MagicMirror) module that shows player stats for [Overwatch](https://playoverwatch.com/).

The stats are fetched from [Ow-API](https://ow-api.com/) (an unofficial Overwatch API). The link says Blizzard's API sometimes goes down and that will affect the API and this module as well.

![screenshot](https://user-images.githubusercontent.com/25268023/57649792-697a2680-75c9-11e9-80fb-cb7fd9d1907c.png)

# Installation
1. Clone repo:
```
	cd MagicMirror/modules/
	git clone https://github.com/retroflex/MMM-Overwatch
```
2. Install dependencies:
```
	cd MMM-Overwatch/
	npm install
```
3. Add the module to the ../MagicMirror/config/config.js, example:
```
		{
			module: 'MMM-Overwatch',
			header: 'Overwatch',
			position: 'bottom_right',
			config: {
  		  userInfos: [ { platform: 'pc', battleTag: 'xappyFan1-2240' },
  	                 { platform: 'pc', battleTag: 'itsGGood-1256' } ],
			}
		},
```
# Configuration
| Option                        | Description
| ------------------------------| -----------
| `showLevel`                   | Whether to show level column.<br />**Default value:** true
| `showRating`                  | Whether to show rating column.<br />**Default value:** true
| `showGamesWon`                | Whether to show column with total games won (all game modes).<br />**Default value:** true
| `sortBy`                      | Which column to sort by. Possible values: 'level', 'rating' or 'gamesWon'.<br />**Default value:** rating
| `fetchInterval`               | How often to fetch stats (milliseconds).<br />**Default value:** 10 * 60 * 1000 (every ten minutes)
| `userInfos`                   | Array of user info. Each item contains platform and battle tag.<br />Platform can be 'pc' etc. (this is how it's described in the API docs, so you'll have to figure out this yourself.<br />Note that the hash (#) in the battle tag must be replaced with a dash (-)!<br />Your battle tag can be found inside the game.<br />**Default value:** Fury-31609 + HanBin-31186.

# Customize Looks
The following class names can be used in 'MagicMirror/css/custom.css' to customize looks (see [MMM-Overwatch.css](https://github.com/retroflex/MMM-Overwatch/blob/master/MMM-Overwatch.css) for example):

| CSS name                      | Description
| ------------------------------| -----------
| header-row                    | Header (whole row).
| stats-row                     | The players' stats (whole rows).
| username-header               | Username header.
| level-header                  | Level header.
| rating-header                 | Rating header.
| games-won-header              | Games won header.
| level                         | Level.
| rating                        | Rating.
| games-won                     | Games won (total for all game modes).
