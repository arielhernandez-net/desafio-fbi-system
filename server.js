const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const agents = require('./agentes').results;

const app = express();
const port = 3000;
const SECRET_KEY = '834c2d467ac978a8554efc152d1a4e5df8ca33345c413b1092643def6cc25a2b';

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const agent = agents.find(a => a.email === email && a.password === password);

    if (agent) {
        const token = jwt.sign({ email: agent.email }, SECRET_KEY, { expiresIn: '2m' });
        console.log('Token generado:', token);
        res.json({ token });
    } else {
        res.status(401).send('Credenciales inválidas');
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(403).send('Token requerido');

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).send('Token inválido');
        req.user = user;
        next();
    });
}

app.get('/user.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user.html'));
});

app.get('/user', authenticateToken, (req, res) => {
    res.send(`Bienvenido, ${req.user.email}`);
});

app.listen(port, () => {
    console.log(`Servidor funcionando en http://localhost:${port}`);
});
