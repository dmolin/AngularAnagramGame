var fs = require('fs');

//max entries in the highscore list
var MAXENTRIES = 10;

function loadDictionary(wordfile) {
    var wordlist = fs.readFileSync(wordfile, "utf8"),
        lut = {};

    //read line by line
    var lines = wordlist.split('\n');
    for( var i = 0; i < lines.length; i++ ) {
        if(lines[i].length === 0) {
            continue;
        }
        lut[lines[i]] = lines[i].length;
    }
    return lut;
}

function buildIndex(word) {
    var it,
        charAt,
        index = {};

    for(it = 0; it < word.length; it++) {
        charAt = word.charAt(it);
        if(index[charAt]) {
            index[charAt] += 1;
        } else {
            index[charAt] = 1;
        }
    }
    return index;
}

var AnagramGame = function(masterword, wordfile) {

    this.masterword = masterword;
    this.masterwordIndex = buildIndex(this.masterword);
    this.highscores = [];
    this.lut = loadDictionary(wordfile);

    this.submitWord = function (word) {
        var cIt,
            hsIt,
            wordIndex = buildIndex(word);

        //check if the word is admitted (present in wordlist)
        if(!this.lut[word]) {
            //console.log("word not in lut");
            //Submission not present in global dictionary
            return {result:'failure', error:"submission not present in global dictionary"};
        }

        for(cIt in wordIndex) {
            if(wordIndex.hasOwnProperty(cIt)) {
                if(!this.masterwordIndex[cIt] ||
                    wordIndex[cIt] > this.masterwordIndex[cIt]) {
                    return {result:'failure', error:"invalid anagram"};
                }
            }
        }

        //check if the word is not already in the highscores
        if(this.getWordPositionInScores(word) >= 0) {
            //duplicate entry. discard
            return {result:'failure', error:"entered word has been already provided."};
        }

        if(this.highscores.length &&
            word.length <= this.highscores[this.highscores.length-1].score &&
            this.highscores.length === MAXENTRIES) {
            //lowest score, with an already full highscore list.. discard it.
            return {result:'failure', error:"highscore roster is full. No more space for low valued words"};
        }

        //find where to insert the score in the highscore array
        for(hsIt = 0; hsIt < this.highscores.length; hsIt++) {
            if(this.highscores[hsIt].score < word.length) {
                break;
            }
        }
        this.highscores.splice(hsIt, 0, {word:word, score:word.length});

        //truncate the highscores to 10 entries
        if(this.highscores.length > 10) {
            this.highscores.splice(10);
        }

        return {result:'success', item:{word:word, score:word.length}};
    };

    /**
    * Return word entry at given position in the high score list, 0 being the
    * highest (best score) and 9 the lowest. You may assume that this method
    * will never be called with position > 9.
    *
    * @parameter position Index on high score list
    * @return word entry at given position in the high score list, or null if
    *         there is no entry at that position
    */
    this.getWordEntryAtPosition = function (position) {
       return position > (this.highscores.length - 1) ? null : this.highscores[position].word;
    };

    /**
    * Return score at given position in the high score list, 0 being the
    * highest (best score) and 9 the lowest. You may assume that this method
    * will never be called with position > 9.
    *
    * @parameter position Index on high score list
    * @return score at given position in the high score list, or null if there
    *         is no entry at that position
    */
    this.getScoreAtPosition = function (position) {
       return position > (this.highscores.length - 1) ? null : this.highscores[position].score;
    };

    /**
    * Return position of a given word into the scorelist.
    *
    * @parameter word to look for position in the scorelist
    * @return position of given word, or -1 if there
    *         is no entry with that value
    */
    this.getWordPositionInScores = function(word) {
        var hsIt;

        for(hsIt = 0; hsIt < this.highscores.length; hsIt++) {
            if(this.highscores[hsIt].word === word) {
                return hsIt;
            }
        }
        return -1;
    };
};


module.exports = AnagramGame;