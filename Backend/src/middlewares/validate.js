// importo la funcion de express-validator
import { validationResult } from "express-validator";

export const validate = (chains) => async (req, res, next) => {
    //Valida cada cadena sobre el request
    //Promise.all asegura que se obtenga el resultado antes de continuar
    //Ej chains: body("email").isEmail().withMessage("Email inválido"),
    await Promise.all(chains.map((i) => i.run(req)));

    //Todos los errores se guardan en result
    const result = validationResult(req);

    //Si result no esta vacio, responde un json con los errores
    if (!result.isEmpty()) {
        return res.status(422).json({
            errors: result
                .array()
                .map(({ param, msg }) => ({ field: param, message: msg })),
        });
    }

    //Si no hay errores, continua con la siguiente funcion
    next();
};
