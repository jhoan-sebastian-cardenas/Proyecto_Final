import { AxiomLogger } from "@/adapter/logging/axiom.logger";
import { AXIOM_CONFIG } from "@/adapter/logging/axiom.config";

export class LoggingService {
  private static instance: LoggingService;
  private axiomLogger: AxiomLogger | null = null;

  private constructor() {
    // Inicializar Axiom logger si las credenciales están disponibles
    if (AXIOM_CONFIG.TOKEN) {
      console.log('Initializing AxiomLogger with token and dataset');
      this.axiomLogger = new AxiomLogger(AXIOM_CONFIG.DATASET, AXIOM_CONFIG.TOKEN);
    }
  }

  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  async logRequest(method: string, url: string, statusCode: number, duration: number) {
    if (this.axiomLogger) {
      const event = {
        _time: new Date().toISOString(),
        type: 'http_request',
        method,
        url,
        statusCode,
        duration,
        timestamp: new Date().toISOString(),
        // Campos adicionales para mejor visualización en dashboards
        service: 'proyecto-final-devops',
        environment: process.env.NODE_ENV || 'development'
      };

      try {
        await this.axiomLogger.logEvent(event);
      } catch (error) {
        console.error('Error logging request to Axiom:', error);
      }
    }
  }

  async logError(error: Error, context?: Record<string, any>) {
    if (this.axiomLogger) {
      const event = {
        _time: new Date().toISOString(),
        type: 'error',
        name: error.name,
        message: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        // Campos adicionales para mejor visualización en dashboards
        service: 'proyecto-final-devops',
        environment: process.env.NODE_ENV || 'development'
      };

      try {
        await this.axiomLogger.logEvent(event);
      } catch (logError) {
        console.error('Error logging error to Axiom:', logError);
      }
    }
  }

  async logInfo(message: string, data?: Record<string, any>) {
    if (this.axiomLogger) {
      const event = {
        _time: new Date().toISOString(),
        type: 'info',
        message,
        data,
        timestamp: new Date().toISOString(),
        // Campos adicionales para mejor visualización en dashboards
        service: 'proyecto-final-devops',
        environment: process.env.NODE_ENV || 'development'
      };

      try {
        await this.axiomLogger.logEvent(event);
      } catch (error) {
        console.error('Error logging info to Axiom:', error);
      }
    }
  }

  async flush() {
    if (this.axiomLogger) {
      try {
        await this.axiomLogger.flush();
      } catch (error) {
        console.error('Error flushing Axiom events:', error);
      }
    }
  }
}