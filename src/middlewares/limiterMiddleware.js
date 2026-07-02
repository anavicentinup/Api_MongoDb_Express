
import rateLimit from "express-rate-limit"

const limiterLogin = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 3,
    // message: { error: "demasiadas solicitudes, intenta de nuevo más tarde" },
    // statusCode: 429
    handler: (request, response) => {
        response.status(429).json({
            "success": false,
            "message": "ya intentaste demasiadas veces, aguarda 5 minutos y volve a intentarlo"
        })
    }

})
const limiterRegister = rateLimit({
    windowMs: 1 * 60 * 1000,
    limit: 3,
    // message: { error: "demasiadas solicitudes, intenta de nuevo más tarde" },
    // statusCode: 429,
    //el handler anula el message y el statusCode.
    handler: (request, response) => {
        response.status(429).json({
            "success": false,
            "message": "ya intentaste demasiadas veces, aguarda 5 minutos y volve a intentarlo"
        })
    }
})

export { limiterLogin, limiterRegister }