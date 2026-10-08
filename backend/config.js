/**
 * CONFIGURACION CENTRAL DE LA BASE DE DATOS
 * Unica fuente de verdad: nombres de hojas e indices de columna.
 * IMPORTANTE: mantener sincronizado con la estructura real de Google Sheets.
 */
const HOJAS = {
  usuarios: 'Usuarios',
  inventario: 'Inventario',
  carros: 'Carros',
  modelos: 'Modelos'
};

const COL = {
  usuarios: {
    email: 0,
    nombre: 1,
    perfil: 2
  },
  inventario: {
    id: 0,
    posicion: 1,
    marca: 2,
    modelo: 3,
    ram: 4,
    pantalla: 5,
    serie: 6,
    windows: 7,
    nroInterno: 8,
    anioCompra: 9,
    carro: 10,
    anioUso: 11,
    estado: 12,
    observacion: 13
  },
  carros: {
    id: 0,
    carro: 1,
    ubicacion: 2,
    estado: 3,
    carga: 4,
    responsable: 5
  },
  modelos: {
    id: 0,
    dispositivo: 1,
    marca: 2,
    modelo: 3,
    color: 4,
    procesador: 5,
    touch: 6,
    lan: 7,
    pantalla: 8,
    ram: 9,
    windows: 10,
    anio: 11
  }
};

const PERFILES = {
  admin: 'Informático',
  supervisor: 'Supervisor'
};
