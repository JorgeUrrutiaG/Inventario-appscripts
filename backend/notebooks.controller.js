/**
 * CONTROLADOR DE NOTEBOOKS (hoja "Inventario")
 * Columnas: Id(0) Posición(1) Marca(2) Modelo(3) Ram(4) Pantalla(5) Serie(6)
 *           Windows(7) Nro Interno(8) Año compra(9) Carro(10) Año uso(11)
 *           Estado(12) Observación(13)
 *
 * Campos de solo lectura en edicion: Id y Año compra.
 */

const CAMPOS_EDITABLES_NOTEBOOK = [
  'posicion', 'marca', 'modelo', 'ram', 'pantalla', 'serie',
  'windows', 'nroInterno', 'carro', 'estado', 'observacion'
];

function obtenerNotebooksBackend() {
  return leerHoja(HOJAS.inventario);
}

/**
 * Metricas del panel inicial en una sola llamada.
 */
function obtenerMetricas() {
  const inventario = leerHoja(HOJAS.inventario);
  return {
    notebooks: inventario.filas.length,
    malos: inventario.filas.filter(fila => fila[COL.inventario.estado] === 'Malo').length,
    carros: leerHoja(HOJAS.carros).filas.length,
    modelos: leerHoja(HOJAS.modelos).filas.length
  };
}

function guardarNuevoNotebook(datos) {
  _permitirEscritura();
  const hoja = getHoja(HOJAS.inventario);
  const id = crearIdProximo(hoja);
  const anioCompra = Number(datos.anioCompra) || new Date().getFullYear();
  const anioUso = (new Date().getFullYear() - anioCompra) + ' años';

  const fila = [];
  fila[COL.inventario.id] = id;
  fila[COL.inventario.posicion] = datos.posicion || '';
  fila[COL.inventario.marca] = datos.marca || '';
  fila[COL.inventario.modelo] = datos.modelo || '';
  fila[COL.inventario.ram] = datos.ram || '';
  fila[COL.inventario.pantalla] = datos.pantalla || '';
  fila[COL.inventario.serie] = datos.serie || '';
  fila[COL.inventario.windows] = datos.windows || '';
  fila[COL.inventario.nroInterno] = datos.nroInterno || '';
  fila[COL.inventario.anioCompra] = anioCompra;
  fila[COL.inventario.carro] = datos.carro || '';
  fila[COL.inventario.anioUso] = anioUso;
  fila[COL.inventario.estado] = datos.estado || '';
  fila[COL.inventario.observacion] = datos.observacion || '';

  hoja.appendRow(fila);
  return 'Notebook creado exitosamente';
}

function editarNotebook(id, datos) {
  _permitirEscritura();
  const hoja = getHoja(HOJAS.inventario);
  const fila = buscarFilaPorId(hoja, id);
  if (!fila) throw new Error('No se encontró el notebook con Id ' + id);

  _escribirCamposEditables(hoja, fila, datos, CAMPOS_EDITABLES_NOTEBOOK, COL.inventario);
  return 'Notebook editado exitosamente';
}

function eliminarNotebook(id) {
  _permitirEliminacion();
  const hoja = getHoja(HOJAS.inventario);
  const fila = buscarFilaPorId(hoja, id);
  if (!fila) throw new Error('No se encontró el notebook con Id ' + id);

  hoja.deleteRow(fila);
  return 'Notebook eliminado exitosamente';
}

/**
 * Escribe solo los campos editables indicados (celda por celda),
 * preservando formulas de columnas calculadas (ej: Año uso).
 */
function _escribirCamposEditables(hoja, fila, datos, campos, mapaColumnas) {
  campos.forEach(campo => {
    if (datos[campo] !== undefined) {
      hoja.getRange(fila, mapaColumnas[campo] + 1).setValue(datos[campo]);
    }
  });
}
