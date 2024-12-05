import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

const users = [];

const alunos = [
    {
        id:1,
        nome: "Asdrubal",
        ra: "11111",
        nota1: 10.0,
        nota2: 7.0
    },
    {
        id:2,
        nome: "Lupita",
        ra: "22222",
        nota1: 8.7,
        nota2: 7.2
    },
    {
        id:3,
        nome: "caboquinho",
        ra: "33333",
        nota1: 5.8,
        nota2: 9.2
    },
]

// Rota register, para criar o usuário:

app.post('/register', async(req,res) => {

    const {username, password} = req.body;

    const hashedPassword = await bcrypt.hash(password,10);

    users.push( {username, password: hashedPassword} );
    console.log(users);

    res.status(201).send('User registered');

});



// Rota login, para retornar o jwt:
app.post('/login', async(req,res) => {

    const {username, password} = req.body;

    // Procurar o usuário e senha na "base de dados":
    const user = users.find( user => user.username === username );

    // Se não achou, ou a senha decriptografada não é a correta,
    // retorna erro:

    if ( !user || !( await bcrypt.compare(password, user.password) ) ) {

        return res.status(401).send('Login Incorreto!');
    }

    // Se está tudo ok, crie e retorna o jwt:

    const token = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1h', algorithm: 'HS256' }
    );

    res.json(token);
    console.log('Login efetuado pelo usuário ' + user.username);

});



// Middleware para verificar o jwt.
// O token vem no 'authorization header', na forma
// bearer blablabla.
// Vamos quebrar no espaço e pegar o elemento [1] (o token).

const authenticateJWT = (req, res, next) => {

    const authHeader = req.header('Authorization');
    console.log('Authorization: ' + authHeader);

    let token;
    
    if (authHeader) {
        const parts = authHeader.split(' ');
        if (parts.length === 2) {
            token = parts[1];
        }
    }
    
    if (!token) {
        return res.status(401).json('Acesso negado. Token não fornecido.');
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

        if (err) {

            if (err.name === 'TokenExpiredError') {
                return res.status(401).send('Acesso negado. Token expirado.');

            } else if (err.name === 'JsonWebTokenError') {
                return res.status(403).send('Acesso negado. Token inválido.');

            } else {
                return res.status(403).send('Acesso negado. Erro na verificação do token.');
            }
        }

        req.user = user;

        const issuedAtISO = new Date(user.iat * 1000).toISOString();
        const expiresAtISO = new Date(user.exp * 1000).toISOString();

        console.log(`Token validado para usuário: ${user.username}
            Emitido em: ${issuedAtISO}
            Expira em: ${expiresAtISO}
        `);

        next();
    });

}



/* / AQUI O MIDDLEWARE ESTÁ SENDO APLICADO APENAS PARA ESTA ROTA.
// SE QUISER QUE SEJA APLICADO EM TODAS, PRECISA USAR O APP.USE

app.get('/protected', authenticateJWT, (req,res) => {

    console.log("Usuário autorizado:" + req.user);
    res.send('Você conseguiu acessar uma rota protegida');
});*/


// Aplica o middleware em todas as rotas que vierem depois:
app.use(authenticateJWT);


app.post("/alunos", (req, res) => {
    alunos.push(req.body);
    res.status(201).send("Aluno cadastrado com sucesso!");
} );


app.get("/alunos", (req, res) => {
    res.status(200).json(alunos);
} );

app.get("/alunos/aprovados", (req, res) => {
    const status = alunos.map(aluno => {
        const media = (aluno.nota1 + aluno.nota2) / 2; // Calcula a média
        return {
            nome: aluno.nome,
            status: media >= 6 ? "aprovado" : "reprovado" // Define o status
        };
    });

    res.status(200).json(status);
});


app.get("/alunos/medias", (req, res) => {
    const medias = alunos.map(aluno => {
        const media = ((aluno.nota1 + aluno.nota2) / 2).toFixed(2); 
        return {
            nome: aluno.nome,
            media: Number(media),
        };
    });

    res.status(200).json(medias);
});


app.get("/alunos/:id", (req, res) => {
    const index = buscaAluno(req.params.id);

    if (index === -1) {
        return res.status(404).json( { message: "Aluno não encontrado" } );
    }

    res.status(200).json( alunos[index] );
});


app.put("/alunos/:id", (req, res) => {
    const index = buscaAluno(req.params.id);

    if (index === -1) {
        return res.status(404).json( { message: "Aluno não encontrado!" } );
    }

    alunos[index].nome = req.body.nome;
    alunos[index].ra = req.body.ra;
    alunos[index].nota1 = req.body.nota1;
    alunos[index].nota2 = req.body.nota2;

    res.status(200).json( alunos[index] );
});

app.delete("/alunos/:id", (req, res) => {
    const index = buscaAluno(req.params.id);

    if (index === -1) {
        return res.status(404).json( { message: "Aluno não encontrado!" } );
    }

    alunos.splice( index, 1 );
    res.status(200).json( { message: "Aluno removido!" } );
    console.log(alunos);
})

function buscaAluno(id) {
    return alunos.findIndex( aluno => {
        return aluno.id === Number(id);
    });
}

export default app;