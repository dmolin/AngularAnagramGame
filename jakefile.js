/*global desc, task, jake, fail, complete */
task("default", ["lint", "test"]);

desc("Linkt code");
task("lint", [], function(){
    var lint = require('./build/lint/lint_runner'),
        files,
        opts,
        globals;

    files = new jake.FileList();
    files.include("**/*.js");
    files.exclude(["node_modules", "src/public/js/lib"]);

    opts = {
        bitwise: true,
        curly: false,
        eqeqeq: true,
        forin: true,
        immed: true,
        latedef: false,
        newcap: true,
        noarg: true,
        noempty: true,
        nonew: true,
        regexp: true,
        trailing: true,
        node: true,
        devel: true,
        strict: false,
        sub: true
    };

    globals = {
        describe: false,
        it: false,
        beforeEach: false,
        afterEach: false
    };

    return lint.validateFileList(files.toArray(), opts, globals) || fail("Lint failed");
});

desc("Testing the code");
task("test", ["lint"], function() {
    sh("jasmine-node spec", true, function(out) {
        complete();
    });
}, {async: true});

desc("Runs the Server");
task("server", ["test"], function() {
    sh("node src/server", true, function(out){
        complete();
    });
}, {async: true});


function sh(command, output, callback) {
    var stdout = "",
        proc;


    proc = jake.createExec(command, {printStdout:false, printStderr:true});
    proc.on("stdout", function(chunk) {
        stdout += chunk;
        process.stdout.write(chunk);
    });
    proc.on("cmdEnd", function() {
        if(callback && typeof callback === "function") {
            callback(stdout);
        }
    });
    proc.run();
}
