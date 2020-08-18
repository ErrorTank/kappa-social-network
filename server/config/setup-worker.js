const cluster = require("cluster");



const setupWorkerProcesses = () => {

    let numCores = require('os').cpus().length;

    for(let i = 0; i < numCores; i++) {

        cluster.fork()


    }


    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is listening');
    });


    cluster.on('exit', function(worker, code, signal) {

        cluster.fork();

    });
};
module.exports = {setupWorkerProcesses};