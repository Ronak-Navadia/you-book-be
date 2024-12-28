export const validateRequest = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ code: 0, message: error.details[0].message });
    }
    next();
};