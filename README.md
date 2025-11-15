# 📚 Sistema de Gestión de Biblioteca Universitaria

Sistema web para gestionar préstamos de libros en una biblioteca universitaria.

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18 o superior
- Backend en Go corriendo en `http://localhost:8080`

### Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Compilar para producción
npm run build
```

## 🔑 Usuarios de Prueba

**Administrador:**
- Correo: `admin@biblioteca.edu.gt`
- Contraseña: `admin123`

**Estudiante:**
- Correo: `estudiante@universidad.edu.gt`
- Contraseña: `student123`

## ✨ Funcionalidades

### Para Todos los Usuarios
- ✅ Registro e inicio de sesión
- ✅ Ver catálogo de libros
- ✅ Solicitar préstamos de libros
- ✅ Ver mis préstamos activos
- ✅ Devolver libros
- ✅ Editar perfil

### Para Administradores
- ✅ Ver estadísticas del sistema
- ✅ Gestionar libros (crear, editar, eliminar)
- ✅ Ver todos los usuarios
- ✅ Ver bitácora de actividades
- ✅ Exportar reportes a CSV

## 🛠️ Tecnologías

- **React** - Framework de UI
- **TypeScript** - Lenguaje de programación
- **Material-UI** - Componentes de interfaz
- **Vite** - Build tool
- **React Router** - Navegación

## 📁 Estructura del Proyecto

```
src/
├── components/     # Componentes reutilizables
├── pages/          # Páginas de la aplicación
├── services/       # Servicios API
├── types/          # Tipos TypeScript
├── utils/          # Utilidades
└── theme.ts        # Tema de Material-UI
```

## 🎨 Características de Diseño

- Modo oscuro profesional
- Diseño responsive
- Animaciones suaves
- Interfaz intuitiva

## 📝 Notas

- El backend debe estar corriendo antes de iniciar el frontend
- Los datos se almacenan en Oracle Database
- Todos los préstamos tienen un período de 15 días
