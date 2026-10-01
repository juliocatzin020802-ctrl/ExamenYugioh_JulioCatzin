# Blue-Eyes Card Explorer

Aplicación en Angular para explorar cartas de Yu-Gi-Oh! consumiendo la API de YGOPRODeck, enfocado en el arquetipo Blue-Eyes.

## Integrantes
- [NOMBRE COMPLETO A]
- [NOMBRE COMPLETO B]

## Requerimientos Implementados
- **Buscador (RF-01):** Búsqueda reactiva con RxJS (`debounceTime`, `switchMap`).
- **Tarjetas de Resultados (RF-02):** Componente reutilizable para visualizar información básica de las cartas manejando valores dinámicos.
- **Detalle de Carta (RF-03):** Vista detallada que extrae la información a fondo incluyendo las impresiones y rarezas.
- **Blue-Eyes Collection (RF-04):** Página específica dedicada al arquetipo Blue-Eyes conectada directo con la API y visualizando datos cacheados.
- **Expansiones (RF-05):** Procesamiento de datos de la API para mostrar una lista de expansiones dinámica (sin repeticiones) y visualizar los precios de impresiones de manera inteligente.
- **Filtro (RF-06):** Filtrado dinámico en memoria, re-utilizando combinaciones de flujos reactivos.
- **Gestión de Estados (RF-07):** Representación visual clara de estados `Loading`, `Success`, `Empty` y `Error`.

## Instrucciones de Ejecución

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Ejecutar el servidor de desarrollo:
   ```bash
   npm start
   ```
   *O alternativamente usa `ng serve` si tienes el CLI de Angular global.*

Navega a `http://localhost:4200/` para ver la aplicación funcionando.

## Estructura Principal de Carpetas
```
src/app/
├─ models/        # Interfaces y tipos (card, view-state)
├─ services/      # YugiohService (conexión con API)
├─ utils/         # Operadores RxJS y funciones puras para expansiones
├─ components/    # Componentes standalone (search, card, card-detail, blue-eyes, etc.)
└─ app.routes.ts  # Configuración de navegación y rutas
```
