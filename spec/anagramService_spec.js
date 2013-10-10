var AnagramGame = require('../src/services/anagramService'),
    fs = require('fs'),
    mockDictionaryFile = __dirname + "/mock_wordfile.txt";

beforeEach(function() {
    //write the mock dictionary file
    fs.appendFileSync(mockDictionaryFile, "no\nword\nlong", "utf8");
});

afterEach(function() {
    //remove the dictionary file
    fs.unlinkSync(mockDictionaryFile);
});

describe("Anagram Game Interface", function () {
    it("Constructor must exist", function () {
        console.log("test");
        expect(AnagramGame).toBeDefined();
    });

    describe("game logic", function() {
        var game;
        beforeEach(function(){
            game = new AnagramGame("reallylongword", mockDictionaryFile);
        });

        afterEach(function(){
            game = null;
        });

        it("must contains expected interface methods", function() {
            expect(game.submitWord).toBeDefined();
            expect(game.getWordEntryAtPosition).toBeDefined();
            expect(game.getScoreAtPosition).toBeDefined();
        });

        it("given 'no' as input should lend 2 as score", function() {
            expect(game.submitWord("no").result).toBe("success");
            expect(game.highscores.length).toBe(1);
        });

        it("given a word not in the dictionary should lend 0 as result", function() {
            expect(game.submitWord("notfound").result).toBe("failure");
            //game should not be reflected into the highscores
            expect(game.highscores.length).toBe(0);
        });

        it("given an invalid anagram, the word should not be accounted for", function() {
            expect(game.submitWord("abacas").result).toBe("failure");
            expect(game.highscores.length).toBe(0);
        });

        it("given a valid anagram, its score should be in te highscore list",function() {
            expect(game.submitWord("no").result).toBe("success");
            //check for position in the highscore list
            expect(game.getWordEntryAtPosition(0)).toBe("no");
            expect(game.getScoreAtPosition(0)).toBe(2);
        });

        it("a valid word cannot be submitted more than once", function() {
            expect(game.submitWord("word").result).toBe("success");
            expect(game.submitWord("word").error).toBe("entered word has been already provided.");
        });

        it("a valid letter in a word cannot occur more than its presence in the masterword", function() {
            expect(game.submitWord("array").result).toBe("failure");
            expect(game.submitWord("reel").result).toBe("failure");
            expect(game.submitWord("long").result).toBe("success");
        });

        it("a valid word will be discarded if it's the lowest score in a full hisghscore list", function() {
            var i, result;

            //fill the highscore
            for(i = 0; i < 10; i++) {
                game.highscores[i] = {word: "someword", score:"10"};
            }
            result = game.submitWord("long");
            expect(result.result).toBe("failure");
            expect(result.error).toBe("highscore roster is full. No more space for low valued words");
        });
    });

});