- [ ] Evitar mensajes duplicados por doble clic en formularios.

Sobre lo de la imagen del perfil:
        lo dejamos como está por ahora. Funciona y no afecta el MVP. Después podemos agregar la mejora:
        imagen real → abre;
        logo por defecto → no abre.
        No vale la pena tocar algo que ya funciona.

Sistema de reputación basado en intercambios concretados.
Historial de intercambios.
Notificaciones cuando llega una nueva solicitud.
Chat interno (solo después de aceptar una solicitud).
Valoraciones entre usuarios

Hacer que alrededor del trueque, se genere una red social, que haya seguimiento de otro usuario para ver que publican

REFACTOR - LÓGICA DE ESTADO DE INTERCAMBIO
Actualmente el index obtiene el estado de las publicaciones consultando la tabla solicitudes_intercambio (estadosSolicitudes).
Se decidió migrar esta lógica para que la fuente de verdad sea publicaciones.estado_intercambio.
Objetivo futuro:
- disponible → publicación visible y botón "Te lo cambio" habilitado.
- pendiente → publicación visible, "Solicitud pendiente", botón deshabilitado.
- aceptado → publicación visible, "Intercambio aceptado", cuenta regresiva de 24 h.
- finalizado → publicación oculta del index.
Una vez finalizada toda la lógica del intercambio, reemplazar la consulta a solicitudes_intercambio por estado_intercambio para simplificar el código y centralizar el estado de cada publicación en la tabla publicaciones.

BUG - Resolver cierre del intercambio cuando las partes votan distinto.
Estado actual:
- Ambos "Intercambio exitoso" → publicaciones.estado_intercambio = finalizado (funciona).
- Dueño = Exitoso / Solicitante = Falló → publicaciones.estado_intercambio = disponible (funciona).
- Dueño = Falló / Solicitante = Exitoso → publicaciones.estado_intercambio queda en "aceptado" (bug).
Revisar la lógica de marcarIntercambio() y la actualización de publicaciones.estado_intercambio. El comportamiento debería ser independiente del orden en que voten las partes.