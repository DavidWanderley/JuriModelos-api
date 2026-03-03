const adminMiddleware = (req, res, next) => {
    if (req.user && req.user.perfil === 'admin') {
        return next();
    }

    return res.status(403).json({ 
        message: "Acesso negado. Esta ação é restrita a administradores." 
    });
};

module.exports = adminMiddleware;