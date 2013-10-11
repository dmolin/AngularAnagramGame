# Very Simple Anagram Game with AngularJS #

A very basic and simple Web game implemented with AngularJS as a take home test

[![ScreenShot](https://raw.github.com/dmolin/AngularAnagramGame/master/assets/anagram-game.png)](https://vimeo.com/60903466)

## Architecture ##

### Server Side ###

* Node.js
* Express
* in-memory DB

### Front End ###

* AngularJS
* jQuery (should be ideally avoided)
* SASS/Compass for CSS pre-processing


## Running the Game ##

In order to run the game you have first to compile it.
Simply run

<code>
    npm install
</code>

This will install all the dependencies specified in the package.json file.
To run the application, then, issue the command:

<code>
    jake server
</code>

This command will lint the code, run the Unit tests and then run the server.
Finally, simply point your browser to http://localhost:3000 to play

### Playing the game ###

The game is very simple.
You first have to create a "masterword", a word from which the player will have to draw all the possible anagram word to input in the game
For each correct word issued by the player, whose letter are in the masterword, a score is awarded proportional to the number of letter in the word.
Correct words to use are determined by a dictionary file used by the server (loaded from ./routes/wordlist.txt).
