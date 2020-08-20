const cluster = require("cluster");


let workers = [];
const setupWorkerProcesses = () => {

    let numCores = require('os').cpus().length;
    cluster.schedulingPolicy = cluster.SCHED_RR
    for(let i = 0; i <numCores; i++) {

        workers.push(cluster.fork());


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
        workers.push(cluster.fork())
        console.log('worker:' + worker.id + " is dead");
    });

};
module.exports = {setupWorkerProcesses};