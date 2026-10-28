import { Injectable } from '@nestjs/common';
import { Producto } from './producto.js';

@Injectable()
export class ProductosService {
  private readonly productos: Producto[] = [
    { id: 1, nombre: 'Laptop Gamer', precio: 1200 },
    { id: 2, nombre: 'Mouse Inalámbrico', precio: 25 },
  ];

  crear(nuevo: Omit<Producto, 'id'>): Producto {
    const productoCreado: Producto = {
      id: this.productos.length + 1,
      ...nuevo,
    };
    this.productos.push(productoCreado);
    return productoCreado;
  }

  obtenerTodos(): Producto[] {
    return this.productos;
  }

  obtenerPorId(id: number): Producto | undefined {
    return this.productos.find((p) => p.id === id);
  }
}

