import { Axiom } from '@axiomhq/js';

console.log('🔍 Diagnosticando conexión con Axiom...');

const token = process.env.AXIOM_TOKEN;
const dataset = process.env.AXIOM_DATASET;

console.log(`Token: ${token ? '***PRESENT***' : 'MISSING'}`);
console.log(`Dataset: ${dataset}`);

if (!token || !dataset) {
    console.error('❌ Error: Faltan variables de entorno AXIOM_TOKEN o AXIOM_DATASET');
    process.exit(1);
}

const axiom = new Axiom({ token });

async function checkConnection() {
    try {
        console.log('Intentando enviar evento de prueba...');
        await axiom.ingest(dataset, [{
            _time: new Date().toISOString(),
            type: 'diagnostic',
            message: 'Connection check',
            timestamp: new Date().toISOString()
        }]);

        console.log('✅ Evento enviado correctamente. La conexión funciona.');

        await axiom.flush();
        console.log('✅ Flush completado.');

    } catch (error) {
        console.error('❌ Error de conexión con Axiom:', error);
        if (error instanceof Error) {
            console.error('Mensaje:', error.message);
            // Si es un error 401 o 403, es problema de token
            if (error.message.includes('401') || error.message.includes('403')) {
                console.error('⚠️  El token parece ser inválido o no tiene permisos.');
            }
        }
    }
}

checkConnection();
