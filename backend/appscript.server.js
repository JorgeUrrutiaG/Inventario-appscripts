const BD_ID = '1BOIg3fU1UCxcXx7t2X9JKzyMyU6yV9wb6L2ZZi1yeto';
// Acceso diferido (lazy): evita abrir la hoja en cada carga de script,
// mejorando la latencia de arranque.
let _ss = null;
let _hoja = null;
let _nombreHojaActual = null;

function getSS() {
  if (_ss === null) _ss = SpreadsheetApp.openById(BD_ID);
  return _ss;
}

function getHoja(nombreHoja) {
  if (_hoja === null || _nombreHojaActual !== nombreHoja) {
    _hoja = getSS().getSheetByName(nombreHoja);
    _nombreHojaActual = nombreHoja;
  }
  return _hoja;
}

function doGet() {
  const userEmail = Session.getActiveUser().getEmail();
  esUsuarioAutorizado(userEmail);
  if (esUsuarioAutorizado(userEmail)) {
    return HtmlService.createTemplateFromFile('frontend/index')
      .evaluate()
      .setTitle('Sistema Inventario');
  }
  return HtmlService.createTemplateFromFile('frontend/error')
    .evaluate()
    .setTitle('Usuario no autorizado');
}

function include(archivo) { return HtmlService.createHtmlOutputFromFile(archivo).getContent(); }
