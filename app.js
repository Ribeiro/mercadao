var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


var server = http.createServer(app);
var io = require('socket.io').listen(server);
var port = app.get('port');

server.listen(port, function(){
    console.log('Express server listening on port ' + port);
});

//otimização para produção - minificação de todos os .js
//io.enable('browser client minification');

//otimização para produção - cache de dados no cliente
//io.enable('browser client etag');

//otimização para produção - envio/recebimento de dados compactados
//io.enable('browser client gzip');



io.on('connection', function(client){

    client.on('disconnect', function(){

        if(client.usuario){
            console.log('Usuario disconectou : ' + client.usuario.email);
            client.broadcast.emit('logout', client.usuario.email);
        }

    });

    client.on('novo-produto', function(produto){
        console.log('Recebi um novo produto!');

        //recupera a propriedade client.usuario.email setada no evento de 'login' para setar o email do dono do produto
        produto.email = client.usuario.email;

        //recupera a propriedade client.usuario.categoria setada no evento de 'login' para setar a categoria de produto do usuario
        produto.categoria = client.usuario.categoria;

        console.log(produto);

        //emitir evento apenas para determinada categoria de produto
        io.sockets.in(produto.categoria).emit('novo-produto-disponivel', produto);

    });

    client.on('login', function(usuario, callback){
        if(usuario.senha.length >= 6){

            //setando o usuario como propriedade do socket cliente para usar no evento 'novo-produto'
            client.usuario = usuario;

            //adicionando o usuario À uma categoria conforme o login
            client.join(usuario.categoria);

            callback({
                sucesso:true,
                mensagem: "Logado como " + usuario.email + " na categoria " + usuario.categoria
            });

        }else {
            callback({
                sucesso:false,
                mensagem: "Senha muito curta!"
            });

        }

        console.log('Usuario logado ');
        console.log(usuario);

    });

});

module.exports = app;