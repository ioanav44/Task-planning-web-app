/*
 * Controller pentru autentificare
 * Aici avem toate functiile legate de login, register si verificare user
 */

const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Functie pentru inregistrare user nou
// Primeste datele din formular si creeaza contul in baza de date
exports.register = async (req, res) => {
    try {
        const { email, password, name, role, managerId } = req.body;

        // verificam daca exista deja un user cu emailul asta
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email deja înregistrat' });
        }

        // daca e specialist, verificam ca managerul sa existe si sa aiba rol corect
        if (managerId) {
            const manager = await prisma.user.findUnique({ where: { id: managerId } });
            if (!manager || manager.role !== 'IT_MANAGER') {
                return res.status(400).json({ error: 'Manager invalid sau nu are rolul IT_MANAGER' });
            }
        }

        // hash la parola - nu salvam parola in clar ca e unsafe
        const hashedPassword = await bcrypt.hash(password, 10);

        // cream userul in db
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: role || 'IT_SPECIALIST',
                managerId
            }
        });

        // generam token pt autentificare - expira in 24h
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({
            message: 'Utilizator creat cu succes',
            user: { id: user.id, email: user.email, name: user.name, role: user.role, managerId: user.managerId },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Functie pt login
// verifica emailul si parola, returneaza token daca e ok
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // cautam userul dupa email
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Credențiale invalide' });
        }

        // comparam parola cu hash-ul din baza de date
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Credențiale invalide' });
        }

        // parola e buna, generam token
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.json({
            message: 'Autentificare reușită',
            user: { id: user.id, email: user.email, name: user.name, role: user.role },
            token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// returneaza datele userului curent (cel logat)
// userul vine din middleware-ul de auth
exports.me = async (req, res) => {
    res.json({
        user: {
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
            role: req.user.role
        }
    });
};
