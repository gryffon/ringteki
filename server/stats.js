/*eslint no-console: 0*/

const _ = require('underscore');
const monk = require('monk');

const GameService = require('./services/GameService.js');
const config = require('config');

let db = monk(config.dbPath);
let gameService = new GameService(db);

let args = process.argv.slice(2);

if(_.size(args) < 2) {
    console.error('Must provide start and end date');

    db.close();
}

console.info('Running stats between', args[0], 'and', args[1]);

gameService.getAllGames(args[0], args[1]).then(games => {
    let rejected = { singlePlayer: 0, noWinner: 0 };

    console.info('' + _.size(games), 'total games');

    let players = {};
    let factions = {};
    let alliances = {};
    let factionAlliances = {};

    _.each(games, game => {
        if(_.size(game.players) !== 2) {
            rejected.singlePlayer++;

            return;
        }

        if(!game.winner) {
            rejected.noWinner++;

            return;
        }

        _.each(game.players, player => {
            if(!players[player.name]) {
                players[player.name] = { name: player.name, wins: 0, losses: 0 };
            }

            if(!factions[player.faction]) {
                factions[player.faction] = { name: player.faction, wins: 0, losses: 0 };
            }

            if(!alliances[player.alliance]) {
                alliances[player.alliance] = { name: player.alliance, wins: 0, losses: 0 };
            }

            if(!factionAlliances[player.faction + player.agenda]) {
                factionAlliances[player.faction + player.agenda] = { name: player.faction + ' / ' + player.agenda, wins: 0, losses: 0 };
            }

            var playerStat = players[player.name];
            var factionStat = factions[player.faction];
            var allianceStat = alliances[player.alliance];
            var factionAllianceStat = factionAlliances[player.faction + player.agenda];

            if(player.name === game.winner) {
                playerStat.wins++;
                factionStat.wins++;
                allianceStat.wins++;
                factionAllianceStat.wins++;
            } else {
                playerStat.losses++;
                factionStat.losses++;
                allianceStat.losses++;
                factionAllianceStat.losses++;
            }
        });
    });

    let winners = _.chain(players).sortBy(player => {
        return -player.wins;
    }).first(10).value();

    let winRates = _.map(winners, player => {
        let games = player.wins + player.losses;

        return { name: player.name, wins: player.wins, losses: player.losses, winRate: Math.round(((player.wins / games) * 100)) };
    });

    let winRateStats = _.chain(winRates).sortBy(player => {
        return -player.winRate;
    }).first(10).value();

    // let factionWinners = _.sortBy(factions, faction => {
    //     return -faction.wins;
    // });

    let factionWinRates = _.map(factions, faction => {
        let games = faction.wins + faction.losses;

        return { name: faction.name, wins: faction.wins, losses: faction.losses, winRate: Math.round(((faction.wins / games) * 100)) };
    });

    let allianceWinRates = _.map(alliances, faction => { // eslint-disable-line no-unused-vars
        let games = alliances.wins + alliances.losses;

        return { name: faction.name, wins: faction.wins, losses: faction.losses, winRate: Math.round(((faction.wins / games) * 100)) };
    });

    let factionWinRateStats = _.sortBy(factionWinRates, faction => {
        return - faction.winRate;
    });

    let factionAllianceWinners = _.chain(factionAlliances).sortBy(faction => {
        return -faction.wins;
    }).first(10).value();

    let factionAllianceWinRates = _.map(factionAllianceWinners, faction => {
        let games = faction.wins + faction.losses;

        return { name: faction.name, wins: faction.wins, losses: faction.losses, winRate: Math.round(((faction.wins / games) * 100)) };
    });

    let factionAllianceWinRateStats = _.chain(factionAllianceWinRates).sortBy(faction => {
        return - faction.winRate;
    }).first(10).value();

    console.info('### Top 10\n\nName | Number of wins\n----|----------------');

    _.each(winners, winner => {
        console.info(winner.name, ' | ', winner.wins);
    });

    console.info('### Top 10 by winrate\n\nName | Number of wins | Number of losses | Win Rate\n----|-------------|------------------|--------');

    _.each(winRateStats, winner => {
        console.info(winner.name, ' | ', winner.wins, ' | ', winner.losses, ' | ', winner.winRate + '%');
    });

    console.info('### Faction win rates\n\nFaction | Number of wins | Number of losses | Win Rate\n----|-------------|------------------|--------');

    _.each(factionWinRateStats, winner => {
        console.info(winner.name, ' | ', winner.wins, ' | ', winner.losses, ' | ', winner.winRate + '%');
    });

    console.info('### Faction/Alliance combination win rates\n\nFaction/Alliance | Number of wins | Number of losses | Win Rate\n----|-------------|------------------|--------');

    _.each(factionAllianceWinRateStats, winner => {
        console.info(winner.name, ' | ', winner.wins, ' | ', winner.losses, ' | ', winner.winRate + '%');
    });

    console.info(rejected);
})
    .then(() => db.close())
    .catch(() => db.close());
