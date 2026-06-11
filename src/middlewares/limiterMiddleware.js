
import rateLimit from "express-rate-limit"

const limiterLogin = rateLimit({
    windowMs: 1 * 60 * 1000,  
    limit: 5, 
    message: { error: "demasiadas solicitudes, intenta de nuevo más tarde" },
    statusCode: 429
})
const limiterRegister = rateLimit({
    windowMs: 1 * 60 * 1000, 
    limit: 5, 
    message: { error: "demasiadas solicitudes, intenta de nuevo más tarde" },
    statusCode: 429,
    //el handler anula el message y el statusCode.
    // handler: (request, response) => {
    //     response.status(429).json({error: "ya intentaste muchas veces, espera unos minutos y volve a intentarlo"})
    //   }
})

export { limiterLogin, limiterRegister}