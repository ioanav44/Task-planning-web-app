/*
 * Middleware de autentificare
 * Verifica daca userul e logat inainte sa acceseze rutele protejate
 */

const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

// Middleware care ruleaza inainte de fiecare request protejat
// Extrage tokenul din header si verifica daca e valid
const authMiddleware = async (req, res, next) => {
    try {
        // luam headerul Authorization (format: "Bearer <token>")
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token lipsă' });
        }

        // extragem doar tokenul (partea dupa "Bearer ")
        const token = authHeader.split(' ')[1];

        // verificam si decodam tokenul
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // cautam userul in db sa fim siguri ca exista
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId }
        });

        if (!user) {
            return res.status(401).json({ error: 'Utilizator negăsit' });
        }

        // punem userul pe request ca sa-l avem in controller
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token invalid' });
    }
};

module.exports = authMiddleware;
