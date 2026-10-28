import productoSchema from './schemas/producto.schema.v3-breaking.json' with { type: 'json' };

export const producto = productoSchema;

export interface Producto {
  id?: number;
  nombre: string;
  precio: number;
  categoria?: string;
}

