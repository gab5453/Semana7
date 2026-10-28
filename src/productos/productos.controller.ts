import { Controller, Post, Body, Get, Param, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { JsonSchemaValidationPipe } from '../common/json-schema-validation.pipe.js';
import { producto } from './producto.js';
import type { Producto } from './producto.js';
import { ProductosService } from './productos.service.js';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  crear(@Body(new JsonSchemaValidationPipe(producto)) body: any) {
    const nuevoProducto = this.productosService.crear(body);
    return {
      mensaje: 'Producto creado exitosamente',
      producto: nuevoProducto,
    };
  }

  @Get()
  obtenerTodos(): Producto[] {
    return this.productosService.obtenerTodos();
  }

  @Get(':id')
  obtenerPorId(@Param('id', ParseIntPipe) id: number) {
    const item = this.productosService.obtenerPorId(id);
    if (!item) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return item;
  }
}
