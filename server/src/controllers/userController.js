const prisma = require('../lib/prisma');
const bcrypt = require('bcryptjs');

// Get all users
exports.getAll = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, email: true, name: true, role: true, createdAt: true }

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

// Get specialists (for managers)

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

// Get user by ID

exports.getById = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.params.id },
            select: { id: true, email: true, name: true, role: true, createdAt: true }
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

// Create user
exports.create = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name, role }
        });

        res.status(201).json({
            id: user.id, email: user.email, name: user.name, role: user.role

exports.create = async (req, res) => {
    try {
        const { email, password, name, role, managerId } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);


        if (managerId) {
            const manager = await prisma.user.findUnique({ where: { id: managerId } });
            if (!manager || manager.role !== 'IT_MANAGER') {
                return res.status(400).json({ error: 'Manager invalid sau nu are rolul IT_MANAGER' });
            }
        }

        const user = await prisma.user.create({
            data: { email, password: hashedPassword, name, role, managerId }
        });

        res.status(201).json({
            id: user.id, email: user.email, name: user.name, role: user.role, managerId: user.managerId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update user
exports.update = async (req, res) => {
    try {
        const { name, role } = req.body;
        const user = await prisma.user.update({
            where: { id: req.params.id },
            data: { name, role }
        });
        res.json({ id: user.id, email: user.email, name: user.name, role: user.role });

exports.update = async (req, res) => {
    try {
        const { name, role, managerId } = req.body;


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

// Delete user

exports.delete = async (req, res) => {
    try {
        await prisma.user.delete({ where: { id: req.params.id } });
        res.json({ message: 'Utilizator șters' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
