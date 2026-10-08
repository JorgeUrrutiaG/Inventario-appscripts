/**
 * CONTROLADOR DE CARROS (hoja "Carros")
 * Columnas: id(0) | Carro(1) | Ubicacion(2) | Estado(3) | Carga(4) | Responsable(5)
 */

const CAMPOS_EDITABLES_CARRO = ['carro', 'ubicacion', 'estado', 'carga', 'responsable'];

function obtenerCarrosBackend() {
  return leerHoja(HOJAS.carros);
}

function guardarNuevoCarro(formData) {
  _permitirEscritura();
  const hoja = getHoja(HOJAS.carros);
  const id = crearIdProximo(hoja);

  const fila = [];
  fila[COL.carros.id] = id;
  fila[COL.carros.carro] = formData.carro || '';
  fila[COL.carros.ubicacion] = formData.ubicacion || '';
  fila[COL.carros.estado] = formData.estado || '';
  fila[COL.carros.carga] = formData.carga || '';
  fila[COL.carros.responsable] = formData.responsable || '';

  hoja.appendRow(fila);
  return 'Carro guardado exitosamente';
}

function editarCarro(id, formData) {
  _permitirEscritura();
  const hoja = getHoja(HOJAS.carros);
  const fila = buscarFilaPorId(hoja, id);
  if (!fila) throw new Error('No se encontró el carro con Id ' + id);

  CAMPOS_EDITABLES_CARRO.forEach(campo => {
    if (formData[campo] !== undefined) {
      hoja.getRange(fila, COL.carros[campo] + 1).setValue(formData[campo]);
    }
  });
  return 'Carro editado exitosamente';
}

function eliminarCarro(id) {
  _permitirEliminacion();
  const hoja = getHoja(HOJAS.carros);
  const fila = buscarFilaPorId(hoja, id);
  if (!fila) throw new Error('No se encontró el carro con Id ' + id);

  const notebooksAsociados = leerHoja(HOJAS.inventario).filas
    .filter(filaNb => filaNb[COL.inventario.carro] === hoja.getRange(fila, COL.carros.carro + 1).getValue()).length;
  if (notebooksAsociados > 0) {
    throw new Error('No se puede eliminar: el carro tiene ' + notebooksAsociados + ' notebook(s) asociados.');
  }

  hoja.deleteRow(fila);
  return 'Carro eliminado exitosamente';
}
