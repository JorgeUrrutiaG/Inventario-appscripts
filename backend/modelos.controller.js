/**
 * CONTROLADOR DE MODELOS (hoja "Modelos")
 * Columnas: id(0) Dispositivo(1) Marca(2) Modelo(3) Color(4) Procesador(5)
 *           Touch(6) LAN(7) Pantalla(8) RAM(9) Windows(10) Año(11)
 *
 * Campo de solo lectura en edicion: id.
 */

const CAMPOS_EDITABLES_MODELO = [
  'dispositivo', 'marca', 'modelo', 'color', 'procesador',
  'touch', 'lan', 'pantalla', 'ram', 'windows', 'anio'
];

function obtenerModelosBackend() {
  return leerHoja(HOJAS.modelos);
}

function guardarNuevoModelo(formData) {
  _permitirEscritura();
  const hoja = getHoja(HOJAS.modelos);
  const id = crearIdProximo(hoja);

  const fila = [];
  fila[COL.modelos.id] = id;
  fila[COL.modelos.dispositivo] = formData.dispositivo || 'Notebook';
  fila[COL.modelos.marca] = formData.marca || '';
  fila[COL.modelos.modelo] = formData.modelo || '';
  fila[COL.modelos.color] = formData.color || '';
  fila[COL.modelos.procesador] = formData.procesador || '';
  fila[COL.modelos.touch] = formData.touch || '';
  fila[COL.modelos.lan] = formData.lan || '';
  fila[COL.modelos.pantalla] = formData.pantalla || '';
  fila[COL.modelos.ram] = formData.ram || '';
  fila[COL.modelos.windows] = formData.windows || '';
  fila[COL.modelos.anio] = formData.anio || '';

  hoja.appendRow(fila);
  return 'Modelo guardado exitosamente';
}

function editarModelo(id, formData) {
  _permitirEscritura();
  const hoja = getHoja(HOJAS.modelos);
  const fila = buscarFilaPorId(hoja, id);
  if (!fila) throw new Error('No se encontró el modelo con Id ' + id);

  CAMPOS_EDITABLES_MODELO.forEach(campo => {
    if (formData[campo] !== undefined) {
      hoja.getRange(fila, COL.modelos[campo] + 1).setValue(formData[campo]);
    }
  });
  return 'Modelo editado exitosamente';
}

function eliminarModelo(id) {
  _permitirEliminacion();
  const hoja = getHoja(HOJAS.modelos);
  const fila = buscarFilaPorId(hoja, id);
  if (!fila) throw new Error('No se encontró el modelo con Id ' + id);

  const registro = hoja.getRange(fila, 1, 1, 12).getValues()[0];
  const enUso = leerHoja(HOJAS.inventario).filas.filter(filaNb =>
    filaNb[COL.inventario.marca] === registro[COL.modelos.marca] &&
    filaNb[COL.inventario.modelo] === registro[COL.modelos.modelo]
  ).length;
  if (enUso > 0) {
    throw new Error('No se puede eliminar: el modelo está en uso por ' + enUso + ' notebook(s).');
  }

  hoja.deleteRow(fila);
  return 'Modelo eliminado exitosamente';
}
