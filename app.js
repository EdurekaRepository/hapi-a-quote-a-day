var Hapi = require('hapi');
var mysql= require('mysql');

var connection = mysql.createConnection({
  host     : 'hapi-mysql.cpvjqdyqzqz1.us-west-2.rds.amazonaws.com',
  user     : 'jason',
  password : '12345678',
  port     : '3306',
  database : 'edureka'
});

var server = new Hapi.Server();
server.connection({ host:'localhost', port: 8080 });
connection.connect();

server.register(require('inert'));
server.register(require('vision'),function(err){

    if(err){
      throw err;
    }

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
       connection.query('SELECT quote,credit from quotes order by rand() limit 1', function(err, rows, fields) {
       if (err) throw err;
       reply.view('index',{quote:rows[0].quote,credit:rows[0].credit});
       });
    }
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'public'
        }
    }
});


server.views({
     engines: {
         html: require('handlebars')
     },
     relativeTo: __dirname,
     path: 'templates'
 });


});

server.start( function(){
     console.log('Catch the action at : '+server.info.uri);
});
