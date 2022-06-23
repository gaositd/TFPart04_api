// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const { Router } = require('express');
const router = Router();
const Product = require('./product.js');
const User = require('./user.js');
const Category = require('./category');
const Order = require('./order.js');
const MercadoPago = require('./mercadopago.js');
const Password = require('./password.js');
const Review = require('./review.js');


// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use('/review', Review);
router.use('/product', Product);
router.use('/category', Category);
router.use('/user', User);
router.use('/order',Order);
router.use('/mercadopago',MercadoPago);
router.use('/password', Password);
// router.use('/', (req, res) => {
//     res.send('APP is running');
// })




module.exports = router;