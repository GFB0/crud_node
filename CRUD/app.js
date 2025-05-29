const express = require("express"); //Crianção de uma constante de uma viriavel que recebe o express
const app = express(); //Criação de uma constante de uma variavel que recebe o express
const handlebars = require("express-handlebars").engine; //Criação de uma constante de uma variavel que recebe o express-handlebars
const bodyParser = require("body-parser");
const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');

const serviceAccount = require('./crud-agendamento-fc52b-firebase-adminsdk-fbsvc-83b0fefd14.json');

initializeApp({
  credential: cert(serviceAccount) // Inicializa o Firebase Admin SDK com as credenciais do serviço
});

const db = getFirestore(); // Obtém uma instância do Firestore

// Importa o objeto 'handlebars' para que seja possível registrar helpers personalizados usados nas views
const handlebarsHelper = require("handlebars");

app.engine("handlebars", handlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Página inicial (formulário de cadastro)
app.get("/", (req, res) => {
  res.render("home");
});

// Rota para cadastrar um novo agendamento
app.post("/cadastrar", async function (req, res) {
  try {
    await db.collection("agendamentos").add({
      nome: req.body.nome,
      telefone: req.body.telefone,
      origem: req.body.origem,
      data_contato: req.body.data_contato,
      observacao: req.body.observacao,
    });
    res.redirect("/");
  } catch (erro) {
    res.send("Erro ao criar agendamento: " + erro);
  }
});

// Rota para consultar todos os agendamentos
app.get("/consulta", async function (req, res) {
  try {
    const snapshot = await db.collection("agendamentos").get();
    const agendamentos = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.render("consultar", { agendamentos });
  } catch (error) {
    res.send("Erro ao buscar agendamentos: " + error);
  }
});

// Rota para carregar dados de um agendamento específico (edição)
app.get("/editar/:id", async function (req, res) {
  try {
    const doc = await db.collection("agendamentos").doc(req.params.id).get();
    if (!doc.exists) {
      return res.send("Agendamento não encontrado.");
    }
    const agendamento = { id: doc.id, ...doc.data() };
    res.render("editar", { agendamento });
  } catch (error) {
    res.send("Erro ao buscar agendamento: " + error);
  }
});

// Rota para atualizar um agendamento
app.post("/editar/:id", async function (req, res) {
  try {
    await db.collection("agendamentos").doc(req.params.id).update({
      nome: req.body.nome,
      telefone: req.body.telefone,
      origem: req.body.origem,
      data_contato: req.body.data_contato,
      observacao: req.body.observacao,
    });
    res.redirect("/consulta");
  } catch (error) {
    res.send("Erro ao atualizar agendamento: " + error);
  }
});

// Rota para excluir um agendamento
app.get("/excluir/:id", async function (req, res) {
  try {
    await db.collection("agendamentos").doc(req.params.id).delete();
    res.redirect("/consulta");
  } catch (error) {
    res.send("Erro ao excluir agendamento: " + error);
  }
});

// Helper para comparação em Handlebars
handlebarsHelper.registerHelper("eq", function (a, b) {
  return a === b;
});

// Inicializa o servidor
app.listen(8081, function () {
  console.log("Servidor rodando em: http://localhost:8081");
});