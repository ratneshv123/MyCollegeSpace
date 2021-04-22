// if user trying to get private routes authenticate the route first then allow user to enter in
module.exports.auth = async function(req, res, next) {
    let token = req.cookies.auth_token;
    if(!token) {
        return res.status(401).json({ok: false, message: 'Unauthorized'});
    }
    try {
        const { email } = jwt.verify(token, process.env.JWT_PRIVATE_TOKEN || "UNSECURED_JWT_PRIVATE_TOKEN");
        const query = "";
        
        const patient = (await Patient.find({email: email}, ["id", "email", "phoneNo", "firstName", "lastName", "gender", "dob"]))[0];
        if (!patient) {
            return res.status(401).json({ok: false, message: 'Sorry, you are not allowed to access this page'});
        }
        req.patient = patient;
        return next();
    } catch (error) {
        return next(error);
    }
}

