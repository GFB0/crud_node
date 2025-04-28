const express = require("express"); //Crianção de uma constante de uma viriavel que recebe o express
const app = express(); //Criação de uma constante de uma variavel que recebe o express
const handlebars = require("express-handlebars").engine; //Criação de uma constante de uma variavel que recebe o express-handlebars
const bodyParser = require("body-parser");
const post = require("./models/post"); //Criação de uma constante de uma variavel que recebe o post

// Importa o objeto 'handlebars' para que seja possível registrar helpers personalizados usados nas views
const handlebarsHelper = require("handlebars");

app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.render("home");
});

// Rota para consulta de todos os agendamentos salvos
app.get("/consulta", async function (req, res) {
  try {
    const agendamentos = await post.findAll(); // Busca todos os registros no banco
    res.render("consultar", {
      agendamentos: agendamentos.map((a) => a.toJSON()), // Converte cada registro para JSON para usar na view
    });
  } catch (error) {
    res.send("Erro ao buscar agendamentos: " + error);
  }
});

// Rota para carregar os dados de um agendamento específico e permitir edição
app.get("/editar/:id", async function (req, res) {
  try {
    const agendamento = await post.findByPk(req.params.id); // Busca o agendamento pelo ID
    if (!agendamento) {
      return res.send("Agendamento não encontrado.");
    }
    res.render("editar", { agendamento: agendamento.toJSON() });
  } catch (error) {
    res.send("Erro ao buscar agendamento: " + error);
  }
});

// Rota para atualizar um agendamento com base no ID
app.post("/editar/:id", async function (req, res) {
  try {
    await post.update(
      {
        nome: req.body.nome,
        telefone: req.body.telefone,
        origem: req.body.origem,
        data_contato: req.body.data_contato,
        observacao: req.body.observacao,
      },
      {
        where: { id: req.params.id }, // Define qual registro será atualizado
      }
    );
    res.redirect("/consulta"); // Redireciona para página de consulta após atualização
  } catch (error) {
    res.send("Erro ao atualizar agendamento: " + error);
  }
});

// Rota para excluir um agendamento com base no ID
app.get("/excluir/:id", async function (req, res) {
  try {
    await post.destroy({
      where: { id: req.params.id },
    });
    res.redirect("/consulta"); // Redireciona após exclusão
  } catch (error) {
    res.send("Erro ao excluir agendamento: " + error);
  }
});

// Registro de um helper personalizado no Handlebars para comparar valores
handlebarsHelper.registerHelper("eq", function (a, b) {
  return a === b;
});

// Rota para cadastrar um novo agendamento
app.post("/cadastrar", function (req, res) {
  post
    .create({
      nome: req.body.nome,
      telefone: req.body.telefone,
      origem: req.body.origem,
      data_contato: req.body.data_contato,
      observacao: req.body.observacao,
    })
    .then(function () {
      res.redirect("/"); // Redireciona após cadastro com sucesso
    })
    .catch(function (erro) {
      res.send("Erro ao criar post: " + erro);
    });
});

// Inicializa o servidor na porta 8081
app.listen(8081, function () {
  console.log("HTTP://localhost:8081");
});
