// Configuración de Axiom
console.log('AXIOM_TOKEN:', process.env.AXIOM_TOKEN ? '***PRESENT***' : 'MISSING');
console.log('AXIOM_DATASET:', process.env.AXIOM_DATASET || 'DEFAULT');

export const AXIOM_CONFIG = {
  DATASET: process.env.AXIOM_DATASET || '',
  TOKEN: process.env.AXIOM_TOKEN || '',
};