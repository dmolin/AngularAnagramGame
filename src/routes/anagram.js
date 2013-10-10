/*jshint devel:true, undef:true, latedef:false*/
/*global require:true exports:true */

var AnagramGame = require('../services/anagramService');

//this will be used to access the application-wide in-memory scope
var scope;

function initMasterword(req, res) {
    var masterword = req.params.masterword;
    scope.game = new AnagramGame(masterword, __dirname + "/wordlist.txt");
    console.log("highscores now", scope.game.highscores );
    res.send({result:'success'});
}

function findHighscores(req, res) {
    res.send({result:'success', items: scope.game.highscores});
}

function findHighscoreByIndex(req, res) {
    var index = req.params.index;
    var score = scope.game.getScoreAtPosition(index);
    if(score < 0) {
        res.send({result:'failure', error:'index overflow. actual highscore length = ' + scope.game.highscores.length});
    } else {
        res.send({result:'success', item:score});
    }
}

function checkWord(req, res) {
    var word = req.params.word;
    res.send(scope.game.submitWord(word));
}

function getGameConfig(req, res) {
    //console.log(scope.game);
    var cfg = {
        masterword: scope.game ? scope.game.masterword : '',
        highscores: scope.game ? scope.game.highscores : []
    };

    res.send({result:'success', item: cfg});
}



exports.init = function (app, data) {
    scope = data ? data : {game:{masterword:'', highscores:[]}};
    if(!scope.game) {
        scope.game = {masterword:'', highscores:[]};
    }

    app.post('/anagram/init/:masterword', initMasterword);
    app.get('/anagram/highscores', findHighscores );
    app.get('/anagram/highscores/:index', findHighscoreByIndex );
    app.post('/anagram/check/:word', checkWord);
    app.get('/anagram/config', getGameConfig);
    return this;
};