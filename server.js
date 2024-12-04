// Não precisamos mais disso...
// import http from "http";
// Mas precisamos do nosso app.js !
import app from "./src/app.js";
// Definindo a porta:
const PORT = 3000;
// Não precisaremos desse objeto rotas...
/* const rotas = {
"/": "Hello World!",
"/livros": "Entrei na rota livros",
"/autores": "Entrei na rota autores"
}; */
// Também não precisamos mais deste servidor...
/* const server = http.createServer(
(req, res) => {
res.writeHead(200, {"Content-Type": "text/plain" } );
res.end( rotas[req.url] );
}
); */
// Aqui era server.listen...
// Vira app.listen...
app.listen( PORT,
    () => {
        console.log("Servidor ativo e aguardando requisições...");
    }
);