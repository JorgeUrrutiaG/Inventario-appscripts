const HOJA_CARROS = getHoja('Carros');

function obtenerRegistrosCarros() {
  let [headers, ...registros] = HOJA_CARROS.getDataRange().getDisplayValues();
  let [headersNotebooks, ...registrosNotebooks] = getHoja('Notebooks').getDataRange().getDisplayValues();
  let registrosInfo = registros.filter(registro => registro[0] !== '');
  registrosInfo.forEach(registro => {
    let cantidad = registrosNotebooks.filter(registroNotebook => registroNotebook[11] === registro[1]).length;
    registro.push(cantidad);
  });
  headers.push('Cantidad');
  return { headers, registrosInfo, tipo: 'Carro' };
  
}

function obtenerMisCarros(usuario) {
  console.log("Usuario: " + usuario);
  let [headers, ...registros] = HOJA_CARROS.getDataRange().getDisplayValues();
  let [headersNotebooks, ...registrosNotebooks] = HOJA_NOTEBOOKS.getDataRange().getDisplayValues();
  let registrosInfo = registros.filter(registro => registro[5] === usuario);
  registrosInfo.forEach(registro => {
    let cantidad = registrosNotebooks.filter(registroNotebook => registroNotebook[11] === registro[1]).length;
    registro.push(cantidad);
  });
  headers.push('Cantidad');
  return { headers, registrosInfo };
}

function guardarNuevoCarro(formData) {
  const id = crearIdCarro();
  HOJA_CARROS.appendRow([id, formData.carro, formData.ubicacion, formData.estado, formData.carga, formData.responsable]);
  return "Carro guardado exitosamente";
}

function contarCarros() {
  return HOJA_CARROS.getLastRow() - 1;
}

function crearIdCarro() {
  let id = 1;
  if (HOJA_CARROS.getLastRow() === 1) {
    return id;
  }
  const ids = HOJA_CARROS.getRange(2, 1, HOJA_CARROS.getLastRow() - 1, 1).getValues().map(id => id[0]);
  let maxId = 0;
  ids.forEach(id => {
    if (id > maxId) {
      maxId = id;
    }
  });
  return maxId + 1;

}