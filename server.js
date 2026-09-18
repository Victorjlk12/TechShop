import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// SEU LINK DO MONGODB WEB - ATLAS
const MONGO_URI = "mongodb+srv://vitorgabrielgabriel20199_db_user:0DBYhSSKCMyRoTKs@cluster0.fq9fgj8.mongodb.net/techshop?appName=Cluster0";

mongoose.connect(MONGO_URI)
 .then(() => console.log('Conectado no MongoDB Atlas WEB!'))
 .catch(err => console.log('Erro:', err));

const Cliente = mongoose.model('Cliente', { nome: String, email: String });
const Produto = mongoose.model('Produto', { nome_produto: String, estoque: Number, preco: Number });
const Pedido = mongoose.model('Pedido', {
  id_pedido: Number,
  cliente_nome: String,
  total: Number,
  status: String,
  itens: Array
});

async function seed() {
  const count = await Produto.countDocuments();
  if (count === 0) {
    console.log('Criando dados no Atlas...');
    const produtos = await Produto.insertMany([
      { nome_produto: 'Notebook Gamer', estoque: 10, preco: 4500 },
      { nome_produto: 'Smartphone 5G', estoque: 25, preco: 2500 },
      { nome_produto: 'Mouse Sem Fio', estoque: 50, preco: 150 },
      { nome_produto: 'Teclado Mecânico', estoque: 0, preco: 350 },
      { nome_produto: 'Cadeira Ergonômica', estoque: 8, preco: 1200 }
    ]);
    await Pedido.insertMany([
      { id_pedido: 1, cliente_nome: 'Ana Silva', total: 4800, status: 'Concluído', itens: [] },
      { id_pedido: 2, cliente_nome: 'Bruno Costa', total: 2500, status: 'Concluído', itens: [] },
      { id_pedido: 3, cliente_nome: 'Carlos Souza', total: 350, status: 'Pendente', itens: [] },
      { id_pedido: 4, cliente_nome: 'Ana Silva', total: 1200, status: 'Concluído', itens: [] },
    ]);
    console.log('Dados criados no WEB!');
  }
}
seed();

const verificarAcesso = (nivel) => (req, res, next) => {
  const userLevel = req.headers['user-level'];
  if (nivel === 'Admin' && userLevel !== 'Admin') return res.status(403).json({ erro: 'Acesso negado. Apenas Administradores podem alterar dados.' });
  next();
};

app.get('/api/relatorio-vendas', async (req, res) => {
  const pedidos = await Pedido.find();
  res.json(pedidos.map(p => ({ id_pedido: p.id_pedido, nome_cliente: p.cliente_nome, total_pedido: p.total, status_pedido: p.status })));
});

app.get('/api/estoque', async (req, res) => {
  const prods = await Produto.find();
  res.json(prods.map(p => ({ id_produto: p._id, nome_produto: p.nome_produto, estoque_atual: p.estoque, total_unidades_vendidas: 0 })));
});

app.put('/api/produtos/:id', verificarAcesso('Admin'), async (req, res) => {
  await Produto.findByIdAndUpdate(req.params.id, { estoque: req.body.novoEstoque });
  res.json({ mensagem: 'Estoque atualizado com sucesso!' });
});

// no final do arquivo, TROCA ISSO:
// app.listen(PORT, () => console.log(`Rodando...`));

// POR ISSO:
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`Rodando em http://localhost:${PORT}`));
  }
  
  export default app;