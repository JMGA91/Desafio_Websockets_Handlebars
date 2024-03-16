const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuración de Handlebars sin archivo de diseño
app.engine('.hbs', exphbs.engine({ extname: '.hbs', defaultLayout: null }));
app.set('view engine', '.hbs');

// vista del index
app.get('/', (req, res) => {
    res.render('index');
});

// vista de realtimeproducts y manejo de conexiones de socket
app.get('/realtimeproducts', (req, res) => {
    // Leer los datos de los productos
    const productos = leerProductos();
    res.render('realtimeproducts', { productos });
    
    // conexiones de socket
    io.on('connection', (socket) => {
        console.log('Cliente conectado a través de websocket');
    
        // Envió datos de productos cuando se conecta un cliente
        const productos = leerProductos();
        socket.emit('productos', productos);
    });
});

// Función para leer los datos de los productos desde un json
function leerProductos() {
    const data = fs.readFileSync('productos.json', 'utf8');
    return JSON.parse(data);
}

// Iniciar el server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});