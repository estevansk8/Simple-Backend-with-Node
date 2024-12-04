import express from "express";

const app = express();
app.use(express.json());

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

app.get("/alunos", (req, res) => {
    res.status(200).json(alunos);
} );

app.post("/alunos", (req, res) => {
    alunos.push(req.body);
    res.status(201).send("Aluno cadastrado com sucesso!");
} );

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