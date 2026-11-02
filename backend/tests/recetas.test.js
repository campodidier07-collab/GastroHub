const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../server');
const { activarModoMemoria } = require('../config/database');
const { resetearMemoriaRecetas } = require('../App/Http/Controllers/recetaController');

let server;
let baseUrl;

before(async () => {
    activarModoMemoria(true);
    await new Promise((resolve) => {
        server = app.listen(0, () => {
            const { port } = server.address();
            baseUrl = `http://127.0.0.1:${port}`;
            resolve();
        });
    });
});

beforeEach(() => {
    resetearMemoriaRecetas();
});

after(async () => {
    if (server) {
        await new Promise((resolve) => server.close(resolve));
    }
});

test('GET /api/health responde 200 con estado ok', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.status, 'ok');
    assert.equal(body.service, 'GastroHub API');
});

test('GET /api/recetas devuelve las recetas iniciales pre-cargadas', async () => {
    const res = await fetch(`${baseUrl}/api/recetas`);
    assert.equal(res.status, 200);
    const recetas = await res.json();
    assert.ok(Array.isArray(recetas));
    assert.equal(recetas.length, 6);
    assert.ok(recetas[0].titulo);
    assert.ok(recetas[0].categoria);
});

test('GET /api/recetas/estadisticas calcula KPIs del catálogo', async () => {
    const res = await fetch(`${baseUrl}/api/recetas/estadisticas`);
    assert.equal(res.status, 200);
    const stats = await res.json();
    assert.equal(stats.totalRecetas, 6);
    assert.equal(stats.totalFavoritas, 4);
    assert.ok(stats.categoriasActivas >= 4);
});

test('POST /api/recetas crea una receta completa con campos gourmet y valida payload', async () => {
    const nueva = {
        titulo: 'Tartar de Atún Rojo con Aguacate y Sésamo',
        descripcion: 'Dados de atún de aleta amarilla marinados en ponzu y aceite de sésamo tostado.',
        categoria: 'Entrada',
        dificultad: 'Fácil',
        tiempo: '20 minutos',
        porciones: 2,
        calorias: 310,
        favorito: true,
        ingredientes: [
            { nombre: 'Atún rojo fresco', cantidad: 250, unidad: 'gr' },
            { nombre: 'Aguacate Hass', cantidad: 1, unidad: 'unidad' }
        ],
        pasos: [
            'Cortar el atún y el aguacate en cubos pequeños uniformes.',
            'Emplatar con aro metálico y coronar con semillas de sésamo tostado.'
        ]
    };

    const res = await fetch(`${baseUrl}/api/recetas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nueva)
    });

    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.mensaje, 'Receta Creada');
    assert.equal(data.receta.titulo, nueva.titulo);
    assert.equal(data.receta.categoria, 'Entrada');
    assert.equal(data.receta.porciones, 2);
});

test('POST /api/recetas rechaza campos no permitidos con 400', async () => {
    const res = await fetch(`${baseUrl}/api/recetas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            titulo: 'Receta Inválida',
            tiempo: '15 min',
            campoHack: 'no-permitido'
        })
    });

    assert.equal(res.status, 400);
    const data = await res.json();
    assert.match(data.error, /Campos no permitidos/);
});

test('PUT /api/recetas/:id reemplaza la receta y restablece campos opcionales omitidos', async () => {
    const idExistente = '6726a1000000000000000001';
    const res = await fetch(`${baseUrl}/api/recetas/${idExistente}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            titulo: 'Risotto Simplificado',
            tiempo: '25 minutos'
        })
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.receta.titulo, 'Risotto Simplificado');
    assert.equal(data.receta.favorito, false);
    assert.deepEqual(data.receta.ingredientes, []);
});

test('PATCH /api/recetas/:id/favorito alterna el estado favorito', async () => {
    const idExistente = '6726a1000000000000000003'; // inicialmente favorito: false
    const res = await fetch(`${baseUrl}/api/recetas/${idExistente}/favorito`, {
        method: 'PATCH'
    });

    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.receta.favorito, true);
});

test('DELETE /api/recetas/:id elimina la receta correctamente', async () => {
    const idExistente = '6726a1000000000000000006';
    const res = await fetch(`${baseUrl}/api/recetas/${idExistente}`, {
        method: 'DELETE'
    });

    assert.equal(res.status, 200);

    const check = await fetch(`${baseUrl}/api/recetas/${idExistente}`);
    assert.equal(check.status, 404);
});
