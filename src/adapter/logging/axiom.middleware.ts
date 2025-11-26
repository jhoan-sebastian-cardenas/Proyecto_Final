import { AxiomLogger } from './axiom.logger';
import { AXIOM_CONFIG } from './axiom.config';
import Elysia from 'elysia';

// Crear instancia del logger de Axiom
let axiomLogger: AxiomLogger | null = null;

if (AXIOM_CONFIG.TOKEN) {
  axiomLogger = new AxiomLogger(AXIOM_CONFIG.DATASET, AXIOM_CONFIG.TOKEN);
}

// Middleware para logging de requests - versión compatible con Elysia
export const createAxiomMiddleware = () => {
  if (!axiomLogger) {
    // Si no hay logger configurado, retornar middleware vacío
    return new Elysia();
  }

  return new Elysia()
    .onBeforeHandle(({ request }) => {
      // Registrar inicio del request
      (request as any)._startTime = Date.now();
    })
    .onAfterHandle(({ request, set }) => {
      // Registrar fin del request
      const startTime = (request as any)._startTime || Date.now();
      const duration = Date.now() - startTime;
      
      axiomLogger!.logRequest(
        request.method,
        request.url,
        set.status as number,
        duration
      ).catch(console.error);
    })
    .onError(({ error, request }) => {
      // Registrar errores
      // Convertir el error a un objeto Error estándar si no lo es
      const standardError = error instanceof Error ? error : new Error(String(error));
      
      const context = {
        url: request.url,
        method: request.method,
      };
      
      axiomLogger!.logError(standardError, context).catch(console.error);
    });
};