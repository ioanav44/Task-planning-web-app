/*
 * Middleware pentru verificare rol
 * Se foloseste dupa authMiddleware pt a restrictiona accesul pe baza de rol
 */

// Primeste o lista de roluri permise si verifica daca userul are unul din ele
// Exemplu: roleCheck('IT_MANAGER', 'ADMINISTRATOR') - permite doar manageri si admini
const roleCheck = (...allowedRoles) => {
    return (req, res, next) => {
        // verificam ca exista user (ar trebui sa existe daca a trecut de authMiddleware)
        if (!req.user) {
            return res.status(401).json({ error: 'Neautentificat' });
        }

        // verificam daca rolul userului e in lista de roluri permise
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Nu ai permisiunea necesară' });
        }

        next();
    };
};

module.exports = roleCheck;
