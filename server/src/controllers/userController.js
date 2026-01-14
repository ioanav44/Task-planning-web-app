/*
 * Controller pentru utilizatori
 * CRUD pe useri - folosit de admin pt gestiunea conturilor
 */

const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');


// ia toti userii din baza de date
// nu returnam parola din motive de securitate
exports.getAll = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                managerId: true,
                manager: { select: { id: true, name: true } }
            }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// returneaza doar specialistii - folosit la dropdown cand aloci taskuri
exports.getSpecialists = async (req, res) => {
    try {
        const specialists = await prisma.user.findMany({
            where: { role: 'IT_SPECIALIST' },
            select: { id: true, email: true, name: true }
        });
        res.json(specialists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// ia un user dupa id
exports.getById = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                managerId: true,
                manager: { select: { id: true, name: true } }
            }
        });
        if (!user) {
            return res.status(404).json({ error: 'Utilizator negăsit' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// creaza user nou (pt admin)
exports.create = async (req, res) => {
    try {
        const { email, password, name, role, managerId } = req.body;

        // hash parola
        const hashedPassword = await bcrypt.hash(password, 10);

        // daca are manager setat, verificam sa existe
        if (managerId) {
            const manager = await prisma.user.findUnique({ where: { id: managerId } });
            if (!manager || manager.role !== 'IT_MANAGER') {
                return res.status(400).json({ error: 'Manager invalid sau nu are rolul IT_MANAGER' });
            }
        }

        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name, role, managerId }
        });

        // nu returnam parola
        res.status(201).json({
            id: user.id, email: user.email, name: user.name, role: user.role, managerId: user.managerId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// update user - poate schimba nume, rol si manager
exports.update = async (req, res) => {
    try {
        const { name, role, managerId } = req.body;

        // validam managerul daca e trimis
        if (managerId) {
            const manager = await prisma.user.findUnique({ where: { id: managerId } });
            if (!manager || manager.role !== 'IT_MANAGER') {
                return res.status(400).json({ error: 'Manager invalid sau nu are rolul IT_MANAGER' });
            }
        }

        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: { name, role, managerId }
        });
        res.json({ id: user.id, email: user.email, name: user.name, role: user.role, managerId: user.managerId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// sterge user
exports.delete = async (req, res) => {
    try {
        await prisma.user.delete({ where: { id: req.params.id } });
        res.json({ message: 'Utilizator șters' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
