/**
 * CONTROLADOR DE USUARIOS
 * Responde a: UserService / AppScriptService.obtenerUsuarioLogueado()
 *
 * Mapeo de columnas de la hoja "Usuarios".
 * IMPORTANTE: mantener sincronizado con la estructura real de la hoja.
 */
const HOJA_USUARIOS = getHoja('Usuarios');

const COL_USUARIO_EMAIL = 0;
const COL_USUARIO_NOMBRE = 1;

function obtenerUsuarioLogueado() {
  const email = Session.getActiveUser().getEmail();
  const usuarios = getUsuarios();
  const user = usuarios.dataInfo.find(prof => prof[COL_USUARIO_EMAIL] === email);
  let nombre = "Usuario Externo";
  if (user) nombre = user[COL_USUARIO_NOMBRE];
  return {
    email,
    nombre
  };
}

function getUsuarios() {
  const [headers, ...dataInfo] = HOJA_USUARIOS.getDataRange().getDisplayValues();
  return { headers, dataInfo };
}

function esUsuarioAutorizado(email) {
  if (!HOJA_USUARIOS) {
    throw new Error(`No se pudo encontrar la pestaña llamada "${HOJA_USUARIOS.getName()}" . Revisa que el nombre en Google Sheets sea exactamente igual.`);

  }
  const ultimaFila = HOJA_USUARIOS.getLastRow();

  if (ultimaFila < 2) return false;

  return HOJA_USUARIOS
    .getRange(2, 1, ultimaFila - 1, 1)
    .getValues().flat().filter(String)
    .includes(email);
}

