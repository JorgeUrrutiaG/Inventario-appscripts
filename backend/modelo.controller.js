const HOJA_MODELOS = getHoja('Modelos');

function guardarNuevoModelo(formData) {
  const id = crearIdModelo();
  HOJA_MODELOS.appendRow([id, formData.marca, formData.modelo, formData.color, formData.procesador, formData.tactil, formData.lan, formData.pantalla, formData.ram, formData.windows, formData.anio]);
  return "Modelo guardado exitosamente";
}

function obtenerRegistrosModelos() {
  let [headers, ...registrosModelos] = HOJA_MODELOS.getDataRange().getDisplayValues();
  let [headersNotebooks, ...registrosNotebooks] = HOJA_NOTEBOOKS.getDataRange().getDisplayValues();
  let registrosLimpios = registrosModelos.filter(registro => registro[0] !== '');
  registrosLimpios.forEach(registro => {
    let cantidad = registrosNotebooks.filter(registroNotebook => registroNotebook[3] === registro[1] && registroNotebook[4] === registro[2]).length;
    registro.push(cantidad);
  });
  headers.push('Cantidad');
  let registrosInfo = registrosLimpios;
  return { headers, registrosInfo, tipo: 'Modelo' };
}

function guardarModeloEditado(formData) {
  HOJA_MODELOS.getRange(formData.id, 1, 1, 8).setValues([[formData.marca, formData.modelo, formData.color, formData.procesador, formData.tactil, formData.lan, formData.ram, formData.windows, formData.anio]]);
  return "Modelo editado exitosamente";
}

function crearIdModelo() {
  let id = 1;
  if (HOJA_MODELOS.getLastRow() === 1) {
    return id;
  }
  const ids = HOJA_MODELOS.getRange(2, 1, HOJA_MODELOS.getLastRow() - 1, 1).getValues().map(id => id[0]);
  let maxId = 0;
  ids.forEach(id => {
    if (id > maxId) {
      maxId = id;
    }
  });
  return maxId + 1;

}