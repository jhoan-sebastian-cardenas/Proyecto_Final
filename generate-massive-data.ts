// Script para generar MUCHOS eventos de prueba para Axiom
// Esto asegurará que tengas suficientes datos para crear el dashboard

import { Axiom } from '@axiomhq/js';

console.log('='.repeat(70));
console.log('🚀 GENERANDO DATOS DE PRUEBA PARA AXIOM DASHBOARD');
console.log('='.repeat(70));

const AXIOM_TOKEN = Bun.env.AXIOM_TOKEN!;
const AXIOM_DATASET = Bun.env.AXIOM_DATASET!;

const axiom = new Axiom({ token: AXIOM_TOKEN });

// Generar timestamps variados (últimas 24 horas)
// Generar timestamps actuales para ver los datos inmediatamente
function getRandomTimestamp(hoursAgo: number): string {
    return new Date().toISOString();
}

// Generar duración aleatoria
function getRandomDuration(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function generateMassiveTestData() {
    const events = [];

    console.log('\n📊 Generando eventos de prueba...\n');

    // Endpoints específicos para cada método
    const getEndpoints = [
        '/api/computers',
        '/api/computers/frequent',
        '/api/medicaldevices',
        '/api/devices/entered',
    ];

    const postEndpoints = [
        '/api/computers/checkin',
        '/api/medicaldevices/checkin',
        '/api/computers/frequent',
    ];

    const patchEndpoints = [
        '/api/computers/frequent/checkin/123e4567-e89b-12d3-a456-426614174000',
        '/api/computers/frequent/checkin/223e4567-e89b-12d3-a456-426614174001',
        '/api/computers/frequent/checkin/323e4567-e89b-12d3-a456-426614174002',
        '/api/devices/checkout/423e4567-e89b-12d3-a456-426614174003',
        '/api/devices/checkout/523e4567-e89b-12d3-a456-426614174004',
    ];

    const statusCodes = [200, 200, 200, 200, 201, 400, 404, 500]; // Más 200s

    // 1. Generar 25 GET requests
    console.log('1️⃣ Generando 25 GET requests...');
    for (let i = 0; i < 25; i++) {
        const endpoint = getEndpoints[Math.floor(Math.random() * getEndpoints.length)];
        const statusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];

        events.push({
            _time: getRandomTimestamp(24),
            type: 'http_request',
            method: 'GET',
            url: endpoint,
            statusCode,
            duration: getRandomDuration(10, 200),
            service: 'proyecto-final-devops',
            environment: 'production',
            timestamp: getRandomTimestamp(24),
        });
    }
    console.log('   ✅ 25 GET requests generados');

    // 2. Generar 25 POST requests
    console.log('2️⃣ Generando 25 POST requests...');
    for (let i = 0; i < 25; i++) {
        const endpoint = postEndpoints[Math.floor(Math.random() * postEndpoints.length)];
        const statusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];

        events.push({
            _time: getRandomTimestamp(24),
            type: 'http_request',
            method: 'POST',
            url: endpoint,
            statusCode,
            duration: getRandomDuration(50, 500),
            service: 'proyecto-final-devops',
            environment: 'production',
            timestamp: getRandomTimestamp(24),
        });
    }
    console.log('   ✅ 25 POST requests generados');

    // 3. Generar 25 PATCH requests
    console.log('3️⃣ Generando 25 PATCH requests...');
    for (let i = 0; i < 25; i++) {
        const endpoint = patchEndpoints[Math.floor(Math.random() * patchEndpoints.length)];
        const statusCode = statusCodes[Math.floor(Math.random() * statusCodes.length)];

        events.push({
            _time: getRandomTimestamp(24),
            type: 'http_request',
            method: 'PATCH',
            url: endpoint,
            statusCode,
            duration: getRandomDuration(30, 300),
            service: 'proyecto-final-devops',
            environment: 'production',
            timestamp: getRandomTimestamp(24),
        });
    }
    console.log('   ✅ 25 PATCH requests generados');

    // 4. Generar 10 Errores variados
    console.log('4️⃣ Generando 10 Error events...');
    const errorTypes = [
        { name: 'ValidationError', message: 'Invalid input data' },
        { name: 'DatabaseError', message: 'Connection timeout' },
        { name: 'NotFoundError', message: 'Device not found' },
        { name: 'AuthenticationError', message: 'Invalid token' },
        { name: 'ServiceError', message: 'External service unavailable' },
    ];

    const allEndpoints = [...getEndpoints, ...postEndpoints, ...patchEndpoints];

    for (let i = 0; i < 10; i++) {
        const error = errorTypes[Math.floor(Math.random() * errorTypes.length)];
        events.push({
            _time: getRandomTimestamp(24),
            type: 'error',
            name: error.name,
            message: error.message,
            stack: `Error: ${error.message}\n    at handler (controller.ts:${Math.floor(Math.random() * 200)}:15)`,
            context: {
                endpoint: allEndpoints[Math.floor(Math.random() * allEndpoints.length)],
                userId: `user-${Math.floor(Math.random() * 100)}`,
            },
            service: 'proyecto-final-devops',
            environment: 'production',
            timestamp: getRandomTimestamp(24),
        });
    }
    console.log('   ✅ 10 Error events generados');

    // 3. Generar 15 Info logs
    console.log('3️⃣ Generando 15 Info events...');
    const infoMessages = [
        'Application started successfully',
        'Database connection established',
        'Photo uploaded successfully',
        'Device registered',
        'Frequent computer checked in',
        'Device checked out',
        'Cache cleared',
        'Configuration reloaded',
    ];

    for (let i = 0; i < 15; i++) {
        events.push({
            _time: getRandomTimestamp(24),
            type: 'info',
            message: infoMessages[Math.floor(Math.random() * infoMessages.length)],
            data: {
                port: 3000,
                version: '1.0.0',
                uptime: Math.floor(Math.random() * 86400),
            },
            service: 'proyecto-final-devops',
            environment: 'production',
            timestamp: getRandomTimestamp(24),
        });
    }
    console.log('   ✅ 15 Info events generados');

    // 5. Enviar todos los eventos a Axiom
    console.log('\n📤 Enviando 100 eventos a Axiom...');

    try {
        // Enviar en lotes de 25
        for (let i = 0; i < events.length; i += 25) {
            const batch = events.slice(i, i + 25);
            await axiom.ingest(AXIOM_DATASET, batch);
            console.log(`   ✅ Lote ${Math.floor(i / 25) + 1}/4 enviado (${batch.length} eventos)`);
            // Pequeña pausa entre lotes
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        console.log('\n⏳ Haciendo flush final...');
        await axiom.flush();
        console.log('✅ Flush completado!');

        console.log('\n' + '='.repeat(70));
        console.log('🎉 ¡ÉXITO! 100 eventos enviados a Axiom');
        console.log('='.repeat(70));
        console.log('\n📊 Resumen de datos generados:');
        console.log('   • 25 GET requests');
        console.log('   • 25 POST requests');
        console.log('   • 25 PATCH requests');
        console.log('   • 10 Errores (varios tipos)');
        console.log('   • 15 Info logs');
        console.log('   • Total: 100 eventos');
        console.log('\n⏰ Datos distribuidos en las últimas 24 horas');
        console.log('\n📈 Próximos pasos:');
        console.log('   1. Espera 30-60 segundos para que Axiom procese los datos');
        console.log('   2. Ve a https://app.axiom.co');
        console.log(`   3. Abre el dataset: ${AXIOM_DATASET}`);
        console.log('   4. Verifica que veas ~100 eventos nuevos');
        console.log('   5. ¡Crea tu dashboard con datos balanceados!');
        console.log('\n💡 Ahora tienes 25 peticiones de cada método HTTP (GET, POST, PATCH)');
        console.log('   perfecto para visualizar en tu dashboard.\n');

    } catch (error) {
        console.error('\n❌ Error enviando eventos:', error);
        throw error;
    }
}

generateMassiveTestData();
