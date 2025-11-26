import { Axiom } from '@axiomhq/js';

export class AxiomLogger {
  private axiom: Axiom;
  private dataset: string;

  constructor(dataset: string, token: string) {
    this.dataset = dataset;
    this.axiom = new Axiom({
      token: token,
    });
    console.log(`AxiomLogger initialized with dataset: ${dataset}`);
  }

  async logEvent(event: Record<string, any>) {
    try {
      // Asegurarnos de que el evento tenga una estructura consistente
      const structuredEvent = {
        _time: new Date().toISOString(),
        service: 'proyecto-final-devops',
        environment: process.env.NODE_ENV || 'development',
        ...event
      };
      
      console.log('Sending event to Axiom:', structuredEvent);
      await this.axiom.ingest(this.dataset, [structuredEvent]);
      console.log('Event sent to Axiom successfully');
    } catch (error) {
      console.error('Error enviando evento a Axiom:', error);
    }
  }

  async logRequest(method: string, url: string, statusCode: number, duration: number) {
    const event = {
      type: 'http_request',
      method,
      url,
      statusCode,
      duration,
      timestamp: new Date().toISOString(),
    };
    
    await this.logEvent(event);
  }

  async logError(error: Error, context?: Record<string, any>) {
    const event = {
      type: 'error',
      name: error.name,
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date().toISOString(),
    };
    
    await this.logEvent(event);
  }

  async flush() {
    try {
      await this.axiom.flush();
    } catch (error) {
      console.error('Error flushing Axiom events:', error);
    }
  }
}