
import rateLimit from "express-rate-limit"


//LIMITER es una funcion q se ejecuta cada vez que se hace una peticion y limita esa cantidad de veces.
const limiterLogin = rateLimit({
    windowMs: 1 * 60 * 1000,  // 1 minutos 
    limit: 5,  // Limita cada IP a 100 solicitudes por `window`.
    message: { error: "ya intentaste muchas veces capo, las estas pifiando, espera un rato y volve a intentarlo" },
    statusCode: 429
})
const limiterRegister = rateLimit({
    windowMs: 1 * 60 * 1000,  // 1 minutos 
    limit: 5,  // Limita cada IP a 100 solicitudes por `window`.
    message: { error: "ya intentaste muchas veces capo, ese email no se puede usar" },
    statusCode: 429,
    //el handler anula el message y el statusCode.
    // handler: (request, response) => {
    //     response.status(429).json({error: "ya intentaste muchas veces capo, ese email no se puede usar PAVO"})
    //   }
})

export { limiterLogin, limiterRegister}