<?php
// ============================================================
// contacto.php — recibe el formulario de contacto de salixweb.com y lo manda por correo.
//
// El sitio es estático (Astro en Hostinger): esto es lo único que corre del lado del
// servidor. Antes el formulario mostraba «Mensaje enviado» sin mandar nada.
//
//   POST /contacto.php   cuerpo JSON: producto, nombre, email, whatsapp, preferencia,
//                        mensaje, pagina, demora (ms desde que se abrió el formulario),
//                        sitio_web (trampa: una persona lo deja vacío)
//   200 {ok:true} · 400 {ok:false,error:'campo',campo:'email'} · 405 · 429 · 500
//
// Compatible con PHP 7.4 (el que tiene el hosting).
// ============================================================

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

const DESTINO = 'hola@salixweb.com';
// El remitente es del propio dominio: si no, el correo sale sin SPF y cae en spam.
const REMITENTE = 'hola@salixweb.com';
const PREFERENCIAS = ['email' => 'correo', 'whatsapp' => 'WhatsApp', 'cualquiera' => 'correo o WhatsApp'];
const MAX_POR_HORA = 5;
const DEMORA_MINIMA_MS = 2500;

function responder(int $codigo, array $cuerpo): void
{
    http_response_code($codigo);
    echo json_encode($cuerpo, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Texto de una línea: sin saltos ni caracteres de control (evita inyectar cabeceras). */
function linea($valor, int $max): string
{
    $texto = is_string($valor) ? $valor : '';
    $texto = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $texto) ?? '';
    return mb_substr(trim($texto), 0, $max);
}

/** Texto de varias líneas: conserva los saltos, saca el resto de los caracteres de control. */
function parrafo($valor, int $max): string
{
    $texto = is_string($valor) ? str_replace("\r\n", "\n", $valor) : '';
    $texto = preg_replace('/[\x00-\x09\x0B-\x1F\x7F]+/u', ' ', $texto) ?? '';
    return mb_substr(trim($texto), 0, $max);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    responder(405, ['ok' => false, 'error' => 'metodo']);
}

$origen = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origen !== '' && !preg_match('#^https://(www\.)?salixweb\.com$#', $origen)) {
    responder(403, ['ok' => false, 'error' => 'origen']);
}

$datos = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($datos)) {
    responder(400, ['ok' => false, 'error' => 'formato']);
}

// Un robot completa todo y lo manda enseguida. Se le contesta que salió bien, para que no insista.
if (linea($datos['sitio_web'] ?? '', 200) !== '' || (int) ($datos['demora'] ?? 0) < DEMORA_MINIMA_MS) {
    responder(200, ['ok' => true]);
}

$producto = linea($datos['producto'] ?? '', 60);
$nombre = linea($datos['nombre'] ?? '', 120);
$email = linea($datos['email'] ?? '', 200);
$whatsapp = linea($datos['whatsapp'] ?? '', 40);
$preferencia = linea($datos['preferencia'] ?? 'email', 20);
$mensaje = parrafo($datos['mensaje'] ?? '', 5000);
$pagina = linea($datos['pagina'] ?? '/', 200);

if ($producto === '') {
    responder(400, ['ok' => false, 'error' => 'campo', 'campo' => 'producto']);
}
if ($nombre === '') {
    responder(400, ['ok' => false, 'error' => 'campo', 'campo' => 'nombre']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    responder(400, ['ok' => false, 'error' => 'campo', 'campo' => 'email']);
}
if (!array_key_exists($preferencia, PREFERENCIAS)) {
    $preferencia = 'email';
}
if ($preferencia === 'whatsapp' && strlen(preg_replace('/\D+/', '', $whatsapp) ?? '') < 8) {
    responder(400, ['ok' => false, 'error' => 'campo', 'campo' => 'whatsapp']);
}
if (!preg_match('#^/[\w\-/]*$#', $pagina)) {
    $pagina = '/';
}

// Límite por conexión: cinco consultas por hora alcanzan para una persona y frenan una ráfaga.
$ip = $_SERVER['REMOTE_ADDR'] ?? 'desconocida';
$archivo = sys_get_temp_dir() . '/salixweb-contacto-' . sha1($ip);
$ahora = time();
$recientes = [];
if (is_file($archivo)) {
    $previos = json_decode((string) file_get_contents($archivo), true);
    if (is_array($previos)) {
        $recientes = array_values(array_filter($previos, function ($t) use ($ahora) {
            return is_int($t) && $t > $ahora - 3600;
        }));
    }
}
if (count($recientes) >= MAX_POR_HORA) {
    responder(429, ['ok' => false, 'error' => 'limite']);
}

$zona = new DateTimeZone('America/Argentina/Buenos_Aires');
$cuando = (new DateTime('now', $zona))->format('d/m/Y H:i');

$cuerpo = implode("\n", [
    'Nueva consulta desde salixweb.com',
    '',
    'Producto: ' . $producto,
    'Nombre: ' . $nombre,
    'Correo: ' . $email,
    'WhatsApp: ' . ($whatsapp !== '' ? $whatsapp : '—'),
    'Prefiere que le respondan por: ' . PREFERENCIAS[$preferencia],
    'Desde la página: https://salixweb.com' . $pagina,
    '',
    'Mensaje:',
    $mensaje !== '' ? $mensaje : '(sin mensaje)',
    '',
    '— ' . $cuando . ' (hora de Argentina). Respondé este correo para contestarle.',
]);

$asunto = 'Consulta web · ' . $producto . ' · ' . $nombre;
$cabeceras = implode("\r\n", [
    'From: Formulario salixweb <' . REMITENTE . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

$enviado = mail(DESTINO, '=?UTF-8?B?' . base64_encode($asunto) . '?=', $cuerpo, $cabeceras, '-f' . REMITENTE);
if (!$enviado) {
    responder(500, ['ok' => false, 'error' => 'envio']);
}

$recientes[] = $ahora;
@file_put_contents($archivo, json_encode($recientes), LOCK_EX);

responder(200, ['ok' => true]);
