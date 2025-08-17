//Librebria para encriptar
import bcrypt from "bcrypt";

//Importar mongoose
import mongoose from "mongoose";

//Se define el esquema de la coleccion
const ClientSchema = new mongoose.Schema(
    {
        dni: { type: Number, unique: true, require: true, trim: true },
        fullName: { type: String, require: true, trim: true },
        phoneNumber: { type: Number, require: true, unique: true, trim: true },
        email: { type: String, require: true, unique: true, trim: true },
        // password: { type: String, require: true, trim: true },
        role: {
            type: String,
            enum: ["client", "admin", "barber"],
            default: "admin",
        }, //asi se definen los roles posibles dentro de cada bbdd
    },
    { timestamps: true }
);

//Encriptar la password

//pre es para realizar algo antes del primer parametro
//El primer parametro dice lo que se va a hacer, en este caso 'save'
ClientSchema.pre("save", async function () {
    //Si la contraseña se crea o se modifica
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10); //Entonces esa contraseña se va a encriptar
    }
});

//Se exporta by default el modelo Clients que usa el esquema ClientSchema
export default mongoose.model("Client", ClientSchema);

// PREGUNTAS PARA EL PROF

//1.- Como hacer que el password sea requerido solo si el role es admin o barber?
//2.- Como hacer un contador para validar si el password se ingresa mas de 3 veces?
