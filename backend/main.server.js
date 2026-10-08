const BD_ID = '1BOIg3fU1UCxcXx7t2X9JKzyMyU6yV9wb6L2ZZi1yeto';

// Acceso diferido (lazy): evita abrir la hoja en cada carga de script.
let _ss = null;
const _hojas = {};

function getSS() {
  if (_ss === null) _ss = SpreadsheetApp.openById(BD_ID);
  return _ss;
}

function getHoja(nombreHoja) {
  if (!_hojas[nombreHoja]) {
    const hoja = getSS().getSheetByName(nombreHoja);
    if (!hoja) {
      throw new Error('No se encontró la pestaña "' + nombreHoja + '". Revisa que el nombre en Google Sheets sea exactamente igual.');
    }
    _hojas[nombreHoja] = hoja;
  }
  return _hojas[nombreHoja];
}

function doGet() {
  const email = Session.getActiveUser().getEmail();
  if (esUsuarioAutorizado(email)) {
    return HtmlService.createTemplateFromFile('frontend/index')
      .evaluate()
      .setTitle('Sistema Inventario');
  }
  const plantilla = HtmlService.createTemplateFromFile('frontend/error');
  plantilla.email = email;
  return plantilla.evaluate().setTitle('Usuario no autorizado');
}

function include(archivo) {
  return HtmlService.createHtmlOutputFromFile(archivo).getContent();
}

/**
 * Devuelve el proximo Id disponible de una hoja (max + 1).
 */
function crearIdProximo(hoja) {
  const ultimaFila = hoja.getLastRow();
  if (ultimaFila < 2) return 1;
  const ids = hoja.getRange(2, 1, ultimaFila - 1, 1).getValues().flat();
  let maxId = 0;
  ids.forEach(id => {
    const numero = Number(id);
    if (numero > maxId) maxId = numero;
  });
  return maxId + 1;
}

/**
 * Busca la fila fisica (1-indexada) de un registro por su columna Id.
 * Devuelve 0 si no existe.
 */
function buscarFilaPorId(hoja, id) {
  const ids = hoja.getRange(2, 1, hoja.getLastRow() - 1, 1).getValues().flat();
  const indice = ids.findIndex(valor => String(valor) === String(id));
  return indice === -1 ? 0 : indice + 2;
}

/**
 * Normaliza celdas de Apps Script (Date, RichText) a texto plano.
 */
function normalizarCelda(celda) {
  if (celda instanceof Date) {
    return Utilities.formatDate(celda, Session.getScriptTimeZone(), 'dd/MM/yyyy');
  }
  if (celda !== null && typeof celda === 'object' && typeof celda.getDataAsString === 'function') {
    return celda.getDataAsString();
  }
  return celda;
}

/**
 * Lee una hoja completa y devuelve { cabeceras, filas } con valores normalizados.
 */
function leerHoja(nombreHoja) {
  const valores = getHoja(nombreHoja).getDataRange().getValues();
  if (valores.length === 0) return { cabeceras: [], filas: [] };
  const cabeceras = valores[0].map(normalizarCelda);
  const filas = valores.slice(1)
    .map(fila => fila.map(normalizarCelda))
    .filter(fila => String(fila[0]) !== '');
  return { cabeceras, filas };
}
