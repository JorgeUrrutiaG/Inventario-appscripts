/**
 * CONTROLADOR DE USUARIOS
 * Responde a: UserService / AppScriptService.obtenerUsuarioLogueado()
 * Hoja "Usuarios": Correo(0) | Usuario(1) | Perfil(2)
 */

function obtenerUsuarioLogueado() {
  const email = Session.getActiveUser().getEmail();
  const usuario = _buscarUsuario(email);
  return {
    email,
    nombre: usuario ? usuario[COL.usuarios.nombre] : 'Usuario Externo',
    perfil: usuario ? usuario[COL.usuarios.perfil] : '',
    autorizado: Boolean(usuario)
  };
}

function esUsuarioAutorizado(email) {
  return Boolean(_buscarUsuario(email));
}

/**
 * Lee la hoja Usuarios y devuelve la fila del correo indicado (o null).
 */
function _buscarUsuario(email) {
  const hoja = getHoja(HOJAS.usuarios);
  const ultimaFila = hoja.getLastRow();
  if (ultimaFila < 2) return null;

  const filas = hoja.getRange(2, 1, ultimaFila - 1, 3).getValues();
  return filas.find(fila => String(fila[COL.usuarios.email]).trim() === email) || null;
}

/**
 * Devuelve el perfil del usuario activo.
 */
function _perfilActual() {
  return obtenerUsuarioLogueado().perfil;
}

/**
 * Valida permisos de creacion/edicion (Informático o Supervisor).
 */
function _permitirEscritura() {
  const perfil = _perfilActual();
  if (perfil !== PERFILES.admin && perfil !== PERFILES.supervisor) {
    throw new Error('Tu perfil "' + (perfil || 'sin perfil') + '" no tiene permisos para modificar registros.');
  }
}

/**
 * Valida permisos de eliminacion (solo Supervisor).
 */
function _permitirEliminacion() {
  if (_perfilActual() !== PERFILES.supervisor) {
    throw new Error('Solo un Supervisor puede eliminar registros.');
  }
}
