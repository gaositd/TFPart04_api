require('dotenv').config();
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const { userInfo } = require('os');
const { DB_USER ,DB_PASSWORD ,DB_HOST,DB_NAME,DB_DIALECT } = process.env;

let sequelize;
if(process.env.NODE_ENV !== 'production'){
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    port:process.env.PORT,
    host: DB_HOST,
    dialect: DB_DIALECT,
  });
}else{
  sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    port:process.env.PG_PORT,
    host: DB_HOST,
    dialect: DB_DIALECT,
    dialectOptions: {
      ssl: {
        require: true, // This will help you. But you will see nw error
        rejectUnauthorized: false // This line will fix new error
      }
    },
  });
}

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);

let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Category, Product, User, Review, User_product, Orders_head, Orders_pos } = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);

Product.belongsToMany(Category, { through: "productTOcategory" });
Category.belongsToMany(Product, { through: "productTOcategory" });

User.hasMany(Orders_head,{foreignKey:'userEmail'});
Orders_head.belongsTo(User)

Orders_head.hasMany(Orders_pos,{foreignKey:'ordersHeadId'})
Orders_pos.belongsTo(Orders_head)

User.hasMany(Review,{foreignKey: 'userEmail'})
Review.belongsTo(User)

User.belongsToMany(Product,{ through: User_product })
Product.belongsToMany(User,{ through: User_product })

Product.hasMany(Review,{foreignKey: 'productId'})
Review.belongsTo(Product)



module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};
