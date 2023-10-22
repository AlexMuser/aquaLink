import { Sequelize } from "sequelize"
/*Aqui se realiza la conexion a la base de datos, en Sequelize se le dan los siguientes parametros
    'database_app' - el nombre de la base de datos
    'root' - nombre del usuario
    '' - contraseña*/
const db = new Sequelize('database_app', 'root', '', {
    host: 'localhost', //Camabiar si la base de datos esta en otra dirección
    dialect: 'mariadb'
})

export default db