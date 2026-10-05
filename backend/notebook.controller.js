const HOJA_NOTEBOOKS = getHoja('Inventario');

function contarNotebooks() {
  return HOJA_NOTEBOOKS.getLastRow() - 1;
}

function contarNotebooksMalos() {
  let [headers, ...notebooks] = HOJA_NOTEBOOKS.getDataRange().getDisplayValues();
  let notebooksMalos = notebooks.filter(notebook => notebook[13] === 'Malo');
  return notebooksMalos.length;
}

function obtenerNotebooks(carro) {
  const [headers, ...registrosInfo] = HOJA_NOTEBOOKS.getDataRange().getDisplayValues();
  return { headers, registrosInfo, tipo: 'Notebook' };
}

function obtenerNotebooksPorCarro(carro) {
  const [headers, ...registros] = HOJA_NOTEBOOKS.getDataRange().getDisplayValues();
  const registrosInfo = registros.filter(registro => registro[11] === carro);
  return { headers, registrosInfo, tipo: 'Notebook' };
}

function obtenerNotebooksBackend(){
  const valores = HOJA_NOTEBOOKS.getDataRange().getValues();
  const cabeceras = valores[0].map(_normalizarCelda);
  console.log('Cabeceras obtenidas:', cabeceras);
  const filas = valores.slice(1).map(fila => fila.map(_normalizarCelda));
  return {
    cabeceras,
    filas
  };
 
}

function _normalizarCelda(celda) {
  if (celda instanceof Date) {
    return Utilities.formatDate(celda, Session.getScriptTimeZone(), "dd/MM/yyyy");
  }
  if (celda instanceof Object && typeof celda.getDataAsString === 'function') {
    return celda.getDataAsString();
  }
  return celda;
}