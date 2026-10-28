import fs from 'node:fs';

function esCompatibleBackward(schemaViejo, schemaNuevo) {
  const problemas = [];
  const reqNuevo = new Set(schemaNuevo.required || []);
  const reqViejo = new Set(schemaViejo.required || []);

  for (const campo of reqNuevo) {
    if (!reqViejo.has(campo) && !(campo in (schemaViejo.properties || {}))) {
      problemas.push(`Campo requerido nuevo sin default: ${campo}`);
    }
  }
  for (const campo of Object.keys(schemaViejo.properties || {})) {
    if (!(campo in (schemaNuevo.properties || {}))) {
      problemas.push(`Campo eliminado: ${campo}`);
    }
  }
  for (const campo of Object.keys(schemaViejo.properties || {})) {
    const tViejo = schemaViejo.properties[campo]?.type;
    const tNuevo = schemaNuevo.properties?.[campo]?.type;
    if (tNuevo && tViejo !== tNuevo) {
      problemas.push(`Tipo cambiado en ${campo}: ${tViejo} -> ${tNuevo}`);
    }
  }
  return { compatible: problemas.length === 0, problemas };
}

if (!process.argv[2] || !process.argv[3]) {
  console.error('Uso: node check-compatibility.js <schemaViejo.json> <schemaNuevo.json>');
  process.exit(1);
}

const viejo = JSON.parse(fs.readFileSync(process.argv[2], 'utf-8'));
const nuevo = JSON.parse(fs.readFileSync(process.argv[3], 'utf-8'));
console.log(JSON.stringify(esCompatibleBackward(viejo, nuevo), null, 2));
