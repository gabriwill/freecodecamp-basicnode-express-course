
var express = require('express');
var app = express();
const absPath =__dirname + '/views/index.html';
const cssPath = __dirname + '/public';
//Middleware que ler o body de requisiçoes
const bodyParser= require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
//Middleware logger que diz as conexoes feitas no servidor, as requisiçoes
app.use((req,res,next)=>{
  console.log(req.method,req.path,'-',req.ip);
  next();//metodo que joga a exeuçao para proxima funçao da fila, necessario, pois sem ele a requisiçao fica estacionada neste Middleware.
});
//metodo abaixo disponibiliza os arquivos da pasta do cssPath quando recebe uma requisição para a rota /public, neste caso, quando o html solicita o arquivo css
app.use('/public', express.static(cssPath));
//metodo que envia o arquivo index.html que estar no absPath para o cliente quando este faz a requisição para a rota root, /.
app.get('/',(req, res)=>res.sendFile(absPath));
//metodo envia para o cliente um json dependendo do valor da variavel de ambiente MESSAGE_STYLE que esta no arquivo .env. Isto quando o cliente faz a requisição para rota /json
app.get('/json',(req, res)=>{
  if(process.env.MESSAGE_STYLE!='uppercase')
  res.json({"message": "Hello json"});
  else res.json({"message": "HELLO JSON"});
  
});
//quando o client faz a requisiçao get para rota /now a primeira função seta o time da requisiçao para o tempo atual e passa para proxima funçao que envia esse time como um json pro cliente
app.get('/now',(req, res,next)=>{
  req.time=new Date().toString();
  next();//passa para proxima funcao
},(req,res)=>{
  res.json({time: req.time});
});
//uma forma de obter dados do lado do client quando os dados são colocados no nome das rotas no formato /:variavel/. O valor é acessado nos params da requisiçao
app.get('/:word/echo',(req, res,next)=>res.json({echo: req.params.word}));
//aqui a funçao acessa os query params que vem com a url, asdj.asda.ds/sdsds?variavel=x&variavel2=y, acessa por meio do query da requisiçao
app.get('/name',(req, res,next)=>{
  const {first,last} = req.query;
  res.json({name: `${first} ${last}`})
});
//metodo acessa o body da requisiçao post feita pelo cliente e responde com um json os dados em uma string unica
app.post('/name',(req, res,next)=>{
  const {first,last} = req.body;
  res.json({name: `${first} ${last}`})
});

console.log('Hello World!');

































module.exports = app;
