export const requireAuth = (req, res, next) => {
    const { userId } = req.session;

    if (!userId) {
        console.log({error: "Unauthorised" })
        return res.status(401).json({ error: "Unauthorised"});
    }

    next();
}