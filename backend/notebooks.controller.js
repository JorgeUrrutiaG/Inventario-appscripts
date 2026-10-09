/**
 * CONTROLADOR DE NOTEBOOKS (hoja "Inventario")
 * Los índices de columna se detectan dinámicamente desde el encabezado,
 * por lo que la hoja funciona con o sin la columna "Año uso".
 *
 * "Año uso" es una columna calculada: año actual − año compra (solo número).
 *
 * Campos de solo lectura en edicion: Id y Año compra.
 */

const CAMPOS_EDITABLES_NOTEBOOK = [
  'posicion', 'marca', 'modelo', 'ram', 'pantalla', 'serie',
  'windows', 'nroInterno', 'carro', 'estado', 'observacion'
];

/** Normaliza un encabezado: minúsculas, sin acentos ni espacios sobrantes. */
function _enc(nombre) {
  return String(nombre).trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/** Índices reales de las columnas de Inventario según su fila 1. */
function _colsInventario(hoja) {
  const ultimaCol = Math.max(hoja.getLastColumn(), 1);
  const fila1 = hoja.getRange(1, 1, 1, ultimaCol).getValues()[0];
  const enc = fila1.map(_enc);
  const idx = (n) => enc.indexOf(_enc(n));

  return {
    id: idx('Id'),
    posicion: idx('Posición'),
    marca: idx('Marca'),
    modelo: idx('Modelo'),
    ram: idx('Ram'),
    pantalla: idx('Pantalla'),
    serie: idx('Serie'),
    windows: idx('Windows'),
    nroInterno: idx('Nro Interno'),
    anioCompra: idx('Año compra'),
    carro: idx('Carro'),
    anioUso: idx('Año uso'),
    estado: idx('Estado'),
    observacion: idx('Observación')
  };
}

/** Año uso calculado: año actual − año compra (solo número). */
function _calcularAnioUso(fila, cols) {
  if (cols.anioCompra === -1) return '';
  const compra = Number(fila[cols.anioCompra]);
  if (!Number.isFinite(compra) || compra === 0) return '';
  return new Date().getFullYear() - compra;
}

function obtenerNotebooksBackend() {
  const hoja = getHoja(HOJAS.inventario);
  const cols = _colsInventario(hoja);
  const datos = leerHoja(HOJAS.inventario);

  if (cols.anioUso === -1) {
    // La hoja ya no tiene la columna: se inserta calculada antes de Estado
    const pos = cols.estado !== -1 ? cols.estado : datos.cabeceras.length;
    datos.cabeceras.splice(pos, 0, 'Año uso');
    datos.filas.forEach(fila => fila.splice(pos, 0, _calcularAnioUso(fila, cols)));
  } else {
    // La hoja aún tiene la columna: se reemplaza el valor por el calculado
    datos.filas.forEach(fila => {
      fila[cols.anioUso] = _calcularAnioUso(fila, cols);
    });
  }

  return datos;
}

/**
 * Metricas del panel inicial en una sola llamada.
 */
function obtenerMetricas() {
  const cols = _colsInventario(getHoja(HOJAS.inventario));
  const inventario = leerHoja(HOJAS.inventario);
  return {
    notebooks: inventario.filas.length,
    malos: cols.estado === -1 ? 0
      : inventario.filas.filter(fila => String(fila[cols.estado]) === 'Malo').length,
    carros: leerHoja(HOJAS.carros).filas.length,
    modelos: leerHoja(HOJAS.modelos).filas.length
  };
}

function guardarNuevoNotebook(datos) {
  _permitirEscritura();
  const hoja = getHoja(HOJAS.inventario);
  const cols = _colsInventario(hoja);
  const id = crearIdProximo(hoja);
  const anioCompra = Number(datos.anioCompra) || new Date().getFullYear();

  const fila = [];
  fila[cols.id] = id;
  fila[cols.posicion] = datos.posicion || '';
  fila[cols.marca] = datos.marca || '';
  fila[cols.modelo] = datos.modelo || '';
  fila[cols.ram] = datos.ram || '';
  fila[cols.pantalla] = datos.pantalla || '';
  fila[cols.serie] = datos.serie || '';
  fila[cols.windows] = datos.windows || '';
  fila[cols.nroInterno] = datos.nroInterno || '';
  fila[cols.anioCompra] = anioCompra;
  fila[cols.carro] = datos.carro || '';
  if (cols.anioUso !== -1) {
    fila[cols.anioUso] = new Date().getFullYear() - anioCompra;
  }
  fila[cols.estado] = datos.estado || '';
  fila[cols.observacion] = datos.observacion || '';

  hoja.appendRow(fila);
  return 'Notebook creado exitosamente';
}

function editarNotebook(id, datos) {
  _permitirEscritura();
  const hoja = getHoja(HOJAS.inventario);
  const fila = buscarFilaPorId(hoja, id);
  if (!fila) throw new Error('No se encontró el notebook con Id ' + id);

  const cols = _colsInventario(hoja);
  _escribirCamposEditables(hoja, fila, datos, CAMPOS_EDITABLES_NOTEBOOK, cols);
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
 * preservando el resto de la fila.
 */
function _escribirCamposEditables(hoja, fila, datos, campos, mapaColumnas) {
  campos.forEach(campo => {
    const col = mapaColumnas[campo];
    if (col !== undefined && col !== -1 && datos[campo] !== undefined) {
      hoja.getRange(fila, col + 1).setValue(datos[campo]);
    }
  });
}
