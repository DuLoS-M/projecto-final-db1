// Tipos para Usuario y Autenticación
export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: number;
  fecha_registro: string;
}

export interface LoginCredentials {
  correo: string;
  contrasenia: string;
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  correo: string;
  contrasenia: string;
  telefono: number;
}

export interface AuthResponse {
  token: string;
  usuario: Usuario;
  roles: string[];
}

// Tipos para Roles
export interface Rol {
  id_rol: number;
  nombre_rol: string;
}

// Tipos para Estudiante
export interface Estudiante {
  carnet: number;
  carrera: string;
  semestre: number;
  usuario_id: number;
}

// Tipos para Profesor
export interface Profesor {
  codigo_docencia: number;
  facultad: string;
  usuario_id: number;
}

// Tipos para Personal
export interface Personal {
  codigo_empleado: number;
  puesto: string;
  usuario_id: number;
}

// Tipos para Libro
export interface Libro {
  isbn: number;
  titulo: string;
  anio_edicion: string;
  editorial_id: number;
  editorial?: Editorial;
  autores?: Autor[];
  ejemplares_disponibles?: number;
}

export interface Autor {
  id_autor: number;
  nombre: string;
  apellido: string;
  nacionalidad: string;
}

export interface Editorial {
  id_editorial: number;
  nombre: string;
  pais: string;
}

// Tipos para Préstamo
export interface Prestamo {
  id_prestamo: number;
  fecha_prestamo: string;
  fecha_devolucion_prevista: string;
  fecha_devolucion_real?: string;
  estado: string;
  usuario_id: number;
  libro?: Libro;
  ejemplar?: Ejemplar;
}

export interface Ejemplar {
  codigo: number;
  estado: string;
  libro_isbn: number;
}

// Tipos para Bitácora
export interface Bitacora {
  id_bitacora: number;
  accion: string;
  fecha_hora: string;
  detalle: string;
  entidad: string;
  usuario_id: number;
  usuario?: Usuario;
}

// Tipos para Estadísticas
export interface Estadisticas {
  total_libros: number;
  total_prestamos: number;
  prestamos_activos: number;
  prestamos_vencidos: number;
  total_usuarios: number;
}
