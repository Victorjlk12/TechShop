const mongoose = require('mongoose');
require('dotenv').config();

const produtoSchema = new mongoose.Schema({
  nome: String,
  preco: Number,
  categoria: String,
  estoque: Number
});

const Produto = mongoose.model('Produto', produtoSchema);

const produtos = [
  { nome: "Notebook Dell i7", preco: 4500, categoria: "Notebooks", estoque: 10 },
  { nome: "Mouse Gamer RGB", preco: 150, categoria: "Perifericos", estoque: 50 },
  { nome: "Teclado Mecânico", preco: 300, categoria: "Perifericos", estoque: 30 },
  { nome: "Monitor 24 pol", preco: 800, categoria: "Monitores", estoque: 15 },
  { nome: "Headset Gamer", preco: 250, categoria: "Perifericos", estoque: 40 }
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Produto.deleteMany();
  await Produto.insertMany(produtos);
  console.log("Tabelas criadas com sucesso no Atlas!");
  process.exit();
});