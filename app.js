const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

mongoose.connect('mongodb://localhost:27017/todolist', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Todo = require('./models/todo');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// LISTE DES TÂCHES
app.get('/', async (req, res) => {
    const { status, priority } = req.query;
    const filter = {};
    if (status && status !== 'Tous') filter.status = status;
    if (priority && priority !== 'Toutes') filter.priority = priority;
  
    const todos = await Todo.find(filter).sort({ dueDate: 1 }).lean();
    res.render('index', { todos, selectedStatus: status || 'Tous', selectedPriority: priority || 'Toutes' });
  });
  

// AJOUTER UNE TÂCHE
app.post('/add', async (req, res) => {
  const { task, description, status, priority, dueDate } = req.body;
  await Todo.create({ task, description, status, priority, dueDate });
  res.redirect('/');
});

// SUPPRIMER UNE TÂCHE
app.post('/delete/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.redirect('/');
});

// AFFICHER FORMULAIRE MODIFICATION
app.get('/edit/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id).lean();
    if (!todo) return res.status(404).send("Tâche non trouvée");
    res.render('edit', { todo });
  });
  

// METTRE À JOUR UNE TÂCHE AVEC HISTORIQUE
app.post('/update/:id', async (req, res) => {
  const { task, description, status, priority, dueDate } = req.body;
  const todo = await Todo.findById(req.params.id);

  const changes = [];
  ['task', 'description', 'status', 'priority', 'dueDate'].forEach(field => {
    const newValue = field === 'dueDate' ? new Date(req.body[field]) : req.body[field];
    if (todo[field]?.toString() !== newValue?.toString()) {
      changes.push({
        field,
        oldValue: todo[field]?.toString(),
        newValue: newValue?.toString(),
        changedAt: new Date()
      });
      todo[field] = newValue;
    }
  });

  todo.history = todo.history.concat(changes);
  await todo.save();
  res.redirect('/');
});

app.get('/history/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id).lean();
    if (!todo) return res.status(404).send("Tâche non trouvée");
    res.render('history', { todo });
  });
  

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
