var mongo = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');



var debugLog = true;

mongo.connect("mongodb://localhost:27019", function (err,conn) {
    if(err){
        console.log("Connect filed" + err);
        return;
    }

    var db = conn.db("Tasker");
    var tasks = db.collection("Tasks");
    var listeningPort = 8888;

    function serverError(rep,error,message) {
        serverFile(rep,'html/error.html',error,message);
    }

    function serverFile(rep, fileName, errorCode, message) {

        if(debugLog) console.log('Serving file ' + fileName + (message ? ' with message \'' + message + '\'': ''));

        fs.readFile(fileName, function (err, data) {
           if(err){
               serverError(rep,404, 'Document ' + fileName + ' not found');
           }else{
               rep.writeHead(errorCode, message, { 'Content-Type': mime.getType(path.basename(fileName)) });
               if(message){
                   data = data.toString().replace('{errMsg}', rep.statusMessage.replace('{errCode}',rep.statusCode));
               }
               rep.end(data);
           }
        });
    }

    http.createServer().on('request', function (req, rep) {

        if(debugLog) console.log("HTTP request URL" + req.url);

        switch (req.url){
            case '/':
                serverFile(rep, 'html/index.html',200, '');
                break;
            case '/tasks':
                switch (req.method){
                    case 'GET':
                        rep.writeHead(200,'OK',{'Content-type': 'application/json'});
                        tasks.find({}).toArray(function (err, tasks) {
                            if(err){
                                console.log("Error " + err);
                            } else {
                                rep.end(JSON.stringify(tasks));
                            }
                        });
                        break;
                    default:
                        rep.writeHead(501,'Not implemeted',{'Content-type':'application/json'});
                        rep.end(JSON.stringify({error : "Not implemeted"}));
                }
                break;
            case '/task':
                switch (req.method){
                    case 'POST':
                        var data = '';
                        req.on('data', function (part) {
                            data +=part;
                        }).on('end',function () {
                            var arg = JSON.parse(data);
                            console.log(arg);
                            var newTask = {
                                _id: new ObjectId(),
                                data: new Date(),
                                task: arg.task
                            };
                            tasks.insertOne(newTask, function (error, succes) {
                                if(error){
                                    console.log("Error " +error);
                                }else{
                                    rep.end(JSON.stringify({status: 'success'}));
                                }
                            });
                            rep.writeHead(200, 'OK', {'Content-type': 'application/json'});
                        });


                        break;
                    default:
                        rep.writeHead(501,'Not implemeted',{'Content-type':'application/json'});
                        rep.end(JSON.stringify({error : "Not implemeted"}));
                }
                break;
            default:
                if(/^\/(html|css|js|fonts|img)\//.test(req.url)) {
                    var fileName = path.normalize('./' + req.url);
                    serverFile(rep,fileName,200,'');
                }else {
                    serverError(rep,403,'Access denied');
                }
        }

    }).listen(listeningPort);





});