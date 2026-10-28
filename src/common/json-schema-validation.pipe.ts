import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const AjvClass = (Ajv2020 as any).default ?? Ajv2020;
const addFormatsFn = (addFormats as any).default ?? addFormats;

const ajv = new AjvClass({ allErrors: true });
addFormatsFn(ajv);

@Injectable()
export class JsonSchemaValidationPipe implements PipeTransform {
  constructor(private schema: object) {}

  transform(value: any) {
    const validate = ajv.compile(this.schema);
    const valido = validate(value);
    if (!valido) {
      throw new BadRequestException({
        mensaje: 'El cuerpo de la peticion no cumple el contrato JSON Schema',
        errores: validate.errors,
      });
    }
    return value;
  }
}
