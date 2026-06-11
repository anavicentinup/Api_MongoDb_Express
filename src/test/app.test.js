import request from 'supertest';
import { server } from '../app.js'; // Ajustá los puntos si hace falta subir carpetas
import mongoose from 'mongoose';

describe('Pruebas básicas de la API', () => {
  
  // LE DECIMOS AL TEST QUE ESPERE A QUE MONGOOSE ESTÉ CONECTADO REALMENTE
  beforeAll(async () => {
    // Si todavía no está conectado (readyState !== 1), esperamos un momento
    if (mongoose.connection.readyState !== 1) {
      await new Promise(resolve => mongoose.connection.once('connected', resolve));
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // TEST 1: Probar la ruta base "/"
  test('GET / debería responder con un 200 OK y el mensaje de la API', async () => {
    const response = await request(server).get('/');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Api rest con Mongo db y Bruno"
    });
  });

  // TEST 2: Probar que los productos están protegidos
  test('GET /products debería rebotar con 401 si no mandamos el Token', async () => {
    const response = await request(server).get('/products');
    
    expect(response.statusCode).toBe(401);
  });

});