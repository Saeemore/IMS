const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const userRoleRoutes = require('./routes/userRoleRoutes');
const authRoutes = require('./routes/authRoutes'); 
const inventoryRoutes = require('./routes/inventoryRoutes'); 
const productRoutes = require('./routes/productRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes'); // Assuming you have an invoiceRoutes file
const app = express();
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/userroles', userRoleRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes); // Assuming you have an inventoryRoutes file
app.use('/api/products', productRoutes); // Assuming you have a productRoutes file
app.use('/api/invoices', invoiceRoutes); // Assuming you have an invoiceRoutes file
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error(err));
