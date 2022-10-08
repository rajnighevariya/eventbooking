let JwtToken = (user, statusCode, res) => {
    const token = user.getJwtToken();

    const options = {
        path: "/",
        expires: new Date(
            Date.now() + 2500 * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        sameSite: "lax",
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        message: user,
        token
    })

}

module.exports = JwtToken;