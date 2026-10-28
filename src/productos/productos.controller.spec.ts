import { describe, it, expect, beforeEach } from 'vitest';
import { BadRequestException } from '@nestjs/common';
import { ProductosController } from './productos.controller.js';
import { ProductosService } from './productos.service.js';
import { JsonSchemaValidationPipe } from '../common/json-schema-validation.pipe.js';
import { producto } from './producto.js';

describe('ProductosController y JsonSchemaValidationPipe', () => {
  let controller: ProductosController;
  let pipe: JsonSchemaValidationPipe;

  beforeEach(() => {
    const service = new ProductosService();
    controller = new ProductosController(service);
    pipe = new JsonSchemaValidationPipe(producto);
  });

  it('permite crear un producto válido según el JSON Schema', () => {
    const payload = { nombre: 'Teclado Mecánico', precio: 89.99 };
    const validado = pipe.transform(payload);
    const resultado = controller.crear(validado);

    expect(resultado.mensaje).toBe('Producto creado exitosamente');
    expect(resultado.producto).toMatchObject({
      nombre: 'Teclado Mecánico',
      precio: 89.99,
    });
    expect(resultado.producto.id).toBeDefined();
  });

  it('rechaza si falta el precio requerido', () => {
    const payloadInvalido = { nombre: 'Sin Precio' };
    expect(() => pipe.transform(payloadInvalido)).toThrow(BadRequestException);
  });

  it('rechaza si el precio es negativo', () => {
    const payloadInvalido = { nombre: 'Precio Negativo', precio: -5 };
    expect(() => pipe.transform(payloadInvalido)).toThrow(BadRequestException);
  });

  it('rechaza si contiene propiedades adicionales no permitidas', () => {
    const payloadInvalido = { nombre: 'Extra Prop', precio: 10, campoExtra: true };
    expect(() => pipe.transform(payloadInvalido)).toThrow(BadRequestException);
  });
});

