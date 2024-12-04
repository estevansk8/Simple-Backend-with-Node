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