//MODELO BASICO DE USUARIOS

//Librebria para encriptar
import bcrypt from "bcrypt";

//Importar mongoose
import mongoose from "mongoose";

//Se define el esquema de la coleccion
const UserSchema = new mongoose.Schema(
    {
        dni: { type: String, unique: true, required: true, trim: true },
        fullName: { type: String, required: true, trim: true, maxlength: 120 },
        phoneNumber: { type: String, required: true, unique: true, trim: true },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        //Contraseña ya encriptada
        passwordHash: {
            type: String,
            trim: true,
            required: true,
        },

        //asi se definen los roles posibles dentro de cada coleccion
        role: {
            type: String,
            enum: ["CLIENT", "BARBER", "ADMIN"],
            default: "CLIENT",
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

//Encriptar la password

//pre es para realizar algo antes del primer parametro
//El primer parametro dice lo que se va a hacer, en este caso 'save'
UserSchema.pre("save", async function () {
    //Si la contraseña se crea o se modifica
    if (this.isModified("passwordHash")) {
        this.passwordHash = await bcrypt.hash(this.passwordHash, 10); //Entonces esa contraseña se va a encriptar
    }
});

//Crea un index en mongoDB para acelerar las busquedas y asegura que no existan 2 correos iguales
UserSchema.index({ email: 1 }, { unique: true });

//Se exporta by default el modelo Clients que usa el esquema UserSchema
export default mongoose.model("User", UserSchema);

// PREGUNTAS PARA EL PROF

//1.- Como hacer que el password sea requerido solo si el role es admin o barber?
//2.- Como hacer un contador para validar si el password se ingresa mas de 3 veces?
