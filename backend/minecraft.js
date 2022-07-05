'use strict';

var path = require('path'),
    fs = require('fs'),
    byline = require('byline');

module.exports = exports = {
    status: status,
    start: start,
    stop: stop,
    command: command,
    addLogListener: addLogListener
};

var minecraft = null;
var logLineStream = null;
var logListeners = [];

const MAGIC_MEMORY_MAX = '9223372036854771712\n';

var memoryLimit = 1024;
try {
    var tmp = fs.readFileSync('/sys/fs/cgroup/memory/memory.limit_in_bytes', 'utf8');
    if (tmp !== MAGIC_MEMORY_MAX) memoryLimit = parseInt(tmp / 1024.0 / 1024.0);
    else console.log('No memory limit set. Falling back to 1024M');
} catch (e) {
    console.log('Failed to determine memory limit. Falling back to 1024M');
}

if (memoryLimit < 1024) {
    console.log('Memory limit would be lower than 1024M. Falling back to 1024M.');
    memoryLimit = 1024;
}

function status() {
    return { running: !!minecraft };
}

function start() {
    console.log('start minecraft server with memory limit', memoryLimit, 'M');

    var opts = { cwd: path.join(__dirname, '..') };
    if (process.env.CLOUDRON) opts.cwd = '/app/data';

    minecraft = require('child_process').spawn('java', [`-Xmx${memoryLimit}M`, `-Xms${memoryLimit}M`, '-XX:+UseG1GC', '-XX:+ParallelRefProcEnabled', '-XX:MaxGCPauseMillis=200', '-XX:+UnlockExperimentalVMOptions', '-XX:+DisableExplicitGC', '-XX:G1NewSizePercent=30', '-XX:G1MaxNewSizePercent=40', '-XX:G1HeapRegionSize=8M', '-XX:G1ReservePercent=20', '-XX:G1HeapWastePercent=5', '-XX:G1MixedGCCountTarget=4', '-XX:InitiatingHeapOccupancyPercent=15', '-XX:G1MixedGCLiveThresholdPercent=90', '-XX:G1RSetUpdatingPauseTimePercent=5', '-XX:SurvivorRatio=32', '-XX:+PerfDisableSharedMem', '-XX:MaxTenuringThreshold=1', '-Dusing.aikars.flags=https://mcflags.emc.gs', '-Daikars.new.flags=true', '-jar', path.join(__dirname, '../minecraft_server.jar'), 'nogui'], opts);

    logLineStream = byline(minecraft.stdout);
    logLineStream.on('data', function (line) {
        console.log(line.toString()); // also log to stdout
        logListeners.forEach(function (l) {
            l.emit('line', line.toString().split(/\[.*\]\:\s/)[1]);
        });
    });

    minecraft.stderr.pipe(process.stderr);
    // minecraft.stdout.pipe(process.stdout);
    // process.stdin.pipe(minecraft.stdin);

    minecraft.on('close', function () {
        minecraft = null;
    });
}

function stop(callback) {
    console.log('stop minecraft server');

    if (!minecraft) return callback();

    minecraft.kill();
    minecraft.on('close', function () {
        minecraft = null;
        callback();
    });
}

function command(cmd, callback) {
    if (!minecraft) return;
    minecraft.stdin.write(cmd + '\n', callback);
}

function addLogListener(socket) {
    logListeners.push(socket);
}
