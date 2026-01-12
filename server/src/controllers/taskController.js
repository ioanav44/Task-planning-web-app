const prisma = require('../lib/prisma');


exports.getAll = async (req, res) => {
    try {
        let where = {};


        if (req.user.role === 'IT_SPECIALIST') {
            where.assignedToId = req.user.id;
        }

        const tasks = await prisma.task.findMany({
            where,
            include: {
                createdBy: { select: { id: true, name: true, email: true } },
                assignedTo: { select: { id: true, name: true, email: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getById = async (req, res) => {
    try {
        const task = await prisma.task.findUnique({
            where: { id: req.params.id },
            include: {
                createdBy: { select: { id: true, name: true, email: true } },
                assignedTo: { select: { id: true, name: true, email: true } }
            }
        });
        if (!task) {
            return res.status(404).json({ error: 'Task negăsit' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.create = async (req, res) => {
    try {
        const { title, description, priority } = req.body;

        const task = await prisma.task.create({
            data: {
                title,
                description,
                priority,
                createdById: req.user.id,
                status: 'OPEN'
            },
            include: {
                createdBy: { select: { id: true, name: true } }
            }
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.update = async (req, res) => {
    try {
        const { title, description, priority } = req.body;
        const task = await prisma.task.update({
            where: { id: req.params.id },
            data: { title, description, priority }
        });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.delete = async (req, res) => {
    try {
        await prisma.task.delete({ where: { id: req.params.id } });
        res.json({ message: 'Task șters' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.assign = async (req, res) => {
    try {
        const { assignedToId } = req.body;
        const task = await prisma.task.findUnique({ where: { id: req.params.id } });

        if (!task) {
            return res.status(404).json({ error: 'Task negăsit' });
        }
        if (task.status !== 'OPEN') {
            return res.status(400).json({ error: 'Doar task-urile OPEN pot fi alocate' });
        }

        const updatedTask = await prisma.task.update({
            where: { id: req.params.id },
            data: { assignedToId, status: 'PENDING' },
            include: { assignedTo: { select: { id: true, name: true } } }
        });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.complete = async (req, res) => {
    try {
        const task = await prisma.task.findUnique({ where: { id: req.params.id } });

        if (!task) {
            return res.status(404).json({ error: 'Task negăsit' });
        }
        if (task.status !== 'PENDING') {
            return res.status(400).json({ error: 'Doar task-urile PENDING pot fi completate' });
        }
        if (task.assignedToId !== req.user.id) {
            return res.status(403).json({ error: 'Doar specialistul asignat poate completa' });
        }

        const updatedTask = await prisma.task.update({
            where: { id: req.params.id },
            data: { status: 'COMPLETED' }
        });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.close = async (req, res) => {
    try {
        const task = await prisma.task.findUnique({ where: { id: req.params.id } });

        if (!task) {
            return res.status(404).json({ error: 'Task negăsit' });
        }
        if (task.status !== 'COMPLETED') {
            return res.status(400).json({ error: 'Doar task-urile COMPLETED pot fi închise' });
        }

        const updatedTask = await prisma.task.update({
            where: { id: req.params.id },
            data: { status: 'CLOSED', closedAt: new Date() }
        });
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getHistory = async (req, res) => {
    try {
        const tasks = await prisma.task.findMany({
            where: { assignedToId: req.params.userId },
            include: {
                createdBy: { select: { id: true, name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
