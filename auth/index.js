const { Strategy, ExtractJwt } = require('passport-jwt')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const config = {
    passport: {
        secret: "testKalla",
        expiresIn: 100000
    }
}

const applyPassportStrategy = (passport) => {
    const options = {}
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    options.secretOrKey = config.passport.secret;

    passport.use(
        new Strategy(options, async (playload, done) => {
            if (playload.username != null) {

                try {
                    const user = await prisma.users.findUnique({
                        where: {
                            username: playload.username
                        }
                    })

                    if (user) {
                        return done(null, {
                            id: user.id,
                            username: user.username
                        })
                    } else {
                        return done(null, false)
                    }
                } catch (err) {
                    return done(err, false)
                }
            }
        })
    )
};

module.exports = {
    applyPassportStrategy,
    config
}