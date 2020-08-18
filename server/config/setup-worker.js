const cluster = require("cluster");



const setupWorkerProcesses = () => {

    let numCores = require('os').cpus().length;

    for(let i = 0; i < 2; i++) {

        cluster.fork()


    }


    cluster.on('fork', function(worker) {
        console.log('worker:' + worker.id + " is forked");
    });
    cluster.on('online', function(worker) {
        console.log('worker:' + worker.id + " is online");
    });
    cluster.on('listening', function(worker) {
        console.log('worker:' + worker.id + " is listening");
    });
    cluster.on('disconnect', function(worker) {
        console.log('worker:' + worker.id + " is disconnected");
    });
    cluster.on('exit', function(worker) {
        cluster.fork()
        console.log('worker:' + worker.id + " is dead");
    });
};
module.exports = {setupWorkerProcesses};