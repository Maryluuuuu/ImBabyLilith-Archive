
(function () {
  'use strict';
  var SKELETON_OPEN = "<!doctype html><html><head><meta charset=utf8><meta name=viewport content=\"width=device-width,initial-scale=1,viewport-fit=cover\"><style>:root{color-scheme:light;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}html{scroll-padding-top:env(safe-area-inset-top,0px)}body{margin:0;padding:0;font:14px -apple-system,BlinkMacSystemFont,sans-serif;background:#fff;color:#000}img{max-width:100%}[hidden]:not([hidden=until-found i]){display:none!important}<\/style><\/head><body>\n";
  var SKELETON_CLOSE = '\n</body></html>';
  var HEAD_HTML = "<title>Lilith’s Archive<\/title>\n<meta name=\"claude:viewport-fit-sides\" content=\"cover\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Cinzel:wght@500;600;700&family=Cormorant+SC:wght@500;600;700&family=Lora:ital,wght@0,400;0,600;1,400&family=Pirata+One&display=swap\">\n";

  var ORIGINAL = document.getElementById('fic-data').textContent;
  var DATA = parseData(ORIGINAL);
  function parseData(txt) {
    var d;
    try { d = JSON.parse(txt); } catch (e) { d = {}; }
    d.recs = Array.isArray(d.recs) ? d.recs : [];
    d.autoras = Array.isArray(d.autoras) ? d.autoras : [];
    d.pendientes = Array.isArray(d.pendientes) ? d.pendientes : [];
    d.meta = d.meta || {};
    if (d.adelanto) migrateAdelanto(d);
    if (!Array.isArray(d.cartas)) d.cartas = [];
    d.cartas.forEach(function (c) { if (c.tipo === 'capitulo' && !Array.isArray(c.frags)) c.frags = []; });
    return d;
  }

  /* ---------- idioma ---------- */
  var I18N = {
    es: {
      htmlLang: 'es', title: 'Lilith’s Archive', eyebrow: 'mis recs · AO3', cv_on: 'Vista comunidad', cv_off: 'Volver a mi vista', cv_banner: 'Estás viendo el archivo como lo ve la comunidad.', cv_unsaved: 'Incluye cambios que aún no guardas.', updated_on: 'actualizado el {d}',
      lede: '¡Hola! Qué gusto que pases por mi pequeño archivo. Aquí están los fics que recomiendo, los que estoy leyendo y los que tengo pendientes. Pero sobre todo, aquí vive Medieval MiChaeng: adelantos de los capítulos nuevos y, muy pronto, más sobre su worldbuilding. ¡Feliz lectura!',
      lang: 'Idioma', palette: 'Paleta',
      nav_lib: 'Biblioteca', nav_idx: 'Índice', nav_bm: 'Marcadores', nav_rec: 'Suma un fic', nav_scribe: 'Escriba',
      pal_auto: 'Automática', pal_pergamino: 'Pergamino', pal_castillo: 'Castillo de noche', pal_lapis: 'Lapislázuli', pal_bosque: 'Bosque', pal_purpura: 'Púrpura real', pal_once: 'Estandarte ONCE',
      notice: 'Varios de estos fics son Mature o Explicit (+18). Cada folio lleva su sello de clasificación y las advertencias de AO3.',
      search: 'Buscar', search_ph: 'Título, autora, ship, trope…', fandom: 'Fandom', ship: 'Ship', rating: 'Clasificación', list: 'Lista', sort: 'Orden', all_m: 'Todos', all_f: 'Todas',
      l_all: 'Todas', l_fav: 'Favoritos de la archivista', l_read: 'Leídos', l_reading: 'Leyendo', l_toread: 'En mi lista', l_comm: 'De la comunidad', l_hidden: 'Ocultas (solo tú)', hid_tag: 'Oculta', hide: 'Ocultar', unhide: 'Mostrar', hide_t: 'Esconder este folio: nadie más lo verá', unhide_t: 'Volver a mostrar este folio a todos', m_hidden: 'Folio oculto. Falta guardar.', m_unhidden: 'Folio visible otra vez. Falta guardar.',
      s_fav: 'Favoritos primero', s_new: 'Más nuevos', s_az: 'A a Z', only_complete: 'Solo completos', hide18: 'Ocultar +18',
      showing: 'Mostrando {a} de {b} folios', surprise: 'La biblioteca sugiere', pick_lilith: 'La biblioteca sugiere una rec de Lilith', pick_by: 'La biblioteca sugiere una rec de @{u}', no_results: 'Ningún folio coincide con esos filtros.', clear: 'Quitar filtros', empty_lib: 'Todavía no hay folios en la biblioteca.',
      authors_h: 'Autoras que sigo', authors_sub: 'Si te gustó uno de sus folios, lo demás que escriben vale la pena.', fics_n: '{n} fics',
      fol: 'Fol.', by: 'por', m_fandom: 'Fandom', m_ship: 'Ship', m_len: 'Largo', m_status: 'Estado', cap: 'cap.', caps: 'caps.',
      about: 'De qué trata', why: 'Por qué lo recomiendan', why_by: 'Por qué lo recomienda @{u}', note: 'Nota de la archivista', rec_by: 'Rec de @{u}', inscribed: 'Inscrito el {d}',
      copyx: 'Copiar para X', read_ao3: 'Leer en AO3', wb: 'Buscar en Wayback', ats: 'Buscar en archive.today', nav_peek: 'Adelanto', pk_kicker: 'Adelanto', pk_teaser: 'Lee un adelanto de {f}', pk_cap_card: 'Capítulo', pk_prof_card: 'Perfil', pk_read: 'Romper el sello', pk_again: 'Volver a leer', pk_seeprof: 'Ver perfil', pk_back: 'Volver al adelanto', pk_draft_short: 'Borrador', ad_prof_h: 'Perfil (segunda tarjeta)', ad_pnom: 'Nombre', ad_ptit: 'Título', ad_pdat: 'Datos: uno por línea, “Clave: valor”', ad_ptxt: 'Texto del perfil', pk_hello: 'Happy reading! We survived the AO3 shutdown… mostly sane', pk_in_en: 'escrito en inglés', pk_in_es: 'escrito en español', pk_draft: 'Borrador: puede cambiar antes de publicarse', pk_more: 'To be continued…', pk_note_by: 'Nota de la autora', pk_prev: 'Lee los capítulos anteriores', pk_x: 'Si quieres platicar de la historia, ando por X:', pk_hidden: 'Solo tú ves esta página: el adelanto está oculto. Revísalo y muéstralo a la comunidad desde Escriba.', pk_hidden_p: 'El perfil está oculto: solo tú lo ves. La comunidad solo ve el capítulo.', pk_hidden_c: 'El capítulo está oculto: solo tú lo ves. La comunidad solo ve el perfil.', pk_hidden_one: 'Solo tú ves esto: está oculto para la comunidad.', pk_edit: 'Editar en Escriba', ad_h: 'Adelanto de tu fic', ad_sub_off: 'Oculto: solo tú lo ves. Revisa el texto, aplica tus cambios y, cuando esté listo, muéstralo a la comunidad y guarda.', ad_sub_on: 'Visible para todos en la pestaña Adelanto.', ad_fic: 'Fic', ad_cap: 'Capítulo', ad_link: 'Link a tu fic en AO3 (opcional)', ad_lang: 'Idioma del texto', ad_draft: 'Mostrar la etiqueta de borrador', ad_note: 'Nota para quienes lean (opcional)', ad_text: 'Texto del adelanto', ad_help: 'Cada línea es un párrafo. *cursiva*, **negrita** y --- en su propia línea para una línea horizontal.', ad_apply: 'Aplicar cambios', ad_view: 'Ver cómo se ve', ad_show: 'Mostrar el capítulo', ad_hide: 'Ocultar el capítulo', ad_pshow: 'Mostrar el perfil', ad_phide: 'Ocultar el perfil', ad_vis: 'visible para todos', ad_hid: 'oculto', ad_state: 'Capítulo: {c} · Perfil: {p}.', m_ad: 'Adelanto actualizado. Falta guardar.', fh: 'Descargar el fic completo con FicHub (EPUB funciona mejor)', read_in: 'Leer en', ao3_down_h: 'Un archivo por mientras', ao3_down: 'AO3 está caído desde el 29 de octubre por un incidente de seguridad. Este archivo es de todes: mientras vuelve, aquí juntamos nuestras recs, y cada folio trae botones para leer: “FicHub” descarga el fic completo (EPUB es lo que mejor funciona; está muy cargado, ten paciencia), y “Wayback” o “archive.today” buscan una copia guardada, aunque no todos los fics tienen copia y archive.today a veces pide resolver un captcha.', follow_line: 'Lo cuido yo, @{u}; sígueme en X para novedades.', eta_h: 'Regreso estimado de AO3', eta_range: 'Entre el {a} y el {b}', eta_until: 'Faltan aprox. {d} para la fecha más temprana.', eta_window: 'Ya estamos en el rango: puede volver en cualquier momento. A más tardar en unos {d}.', eta_past: 'Ya pasó la fecha estimada. Revisa el estado oficial.', eta_note: 'Es la estimación aproximada de AO3 (de 2 a 4 semanas). Podría volver antes en modo limitado o de solo lectura.', eta_progress: 'Ha pasado el {p}% del tiempo estimado', eta_start: 'Se cayó: {a}', eta_end: 'A más tardar: {a}', d_day: 'día', d_days: 'días', d_h: 'h', d_min: 'min', d_s: 's', d_and: ' y ', author_ao3: 'Perfil de {a} en AO3', by_x: 'Perfil de @{u} en X', eta_from: 'Regreso más temprano', eta_to: 'Regreso más tardío', eta_use: 'Usar estas fechas', eta_owner_sub: 'Actualízalas si AO3 cambia su estimación en otwstatus.org.', l_vetted: 'Leídos por la archivista', selection: 'Selección', follow_btn: '@{u} en X', x_profile: '@{u} en X', ao3_status: 'Estado oficial de AO3', ao3_h: 'Aviso “por mientras”', ao3_sub: 'Quítalo cuando AO3 vuelva. El botón de Wayback se queda en cada folio.', ao3_on: 'Mostrar aviso', ao3_off: 'Ocultar aviso', pk_t_capitulo: 'Capítulo', pk_t_perfil: 'Perfil', pk_t_mundo: 'Worldbuilding', pk_tp_capitulo: 'Capítulos', pk_tp_perfil: 'Perfiles', pk_tp_mundo: 'Worldbuilding', pk_f_type: 'Tipo de carta', pk_f_capl: 'Capítulo', pk_f_all: 'Todo', pk_f_allcaps: 'Todos los capítulos', pk_f_cap: 'Cap. {n}', pk_new_frag: 'Nuevo fragmento', pk_frag: 'Fragmento {n}', pk_frags_n: '{n} fragmentos', pk_frags_1: '1 fragmento', pk_none: 'No hay cartas con ese filtro.', pk_full: 'Leer el capítulo completo en AO3', ca_h: 'Cartas del sneak peek', ca_sub: 'Cada carta se edita por separado. Las de capítulo crecen por fragmentos: cuando publicas uno nuevo, la carta se vuelve a sellar para quien ya la había leído. Las cartas nuevas empiezan ocultas.', ca_type: 'Tipo', ca_new: 'Nueva carta', ca_edit: 'Editar', ca_show: 'Mostrar', ca_hide: 'Ocultar', ca_del: 'Quitar', ca_del_q: '¿Quitar? Toca otra vez', ca_vis: 'visible', ca_hid: 'oculta', ca_none: 'Todavía no hay cartas.', ca_editing: 'Editando: {t}', ca_save: 'Guardar carta', ca_close: 'Cerrar', ca_capn: 'Número de capítulo', ca_title_cap: 'Título del capítulo', ca_fin: 'Capítulo terminado (ya no habrá más fragmentos)', ca_title: 'Título', ca_name: 'Nombre', ca_role: 'Título o rol', ca_sub2: 'Subtítulo (opcional)', ca_capopt: 'Capítulo relacionado (opcional)', ca_text: 'Texto', ca_need: 'Ponle un título (o número de capítulo) a la carta.', fr_h: 'Fragmentos', fr_none: 'Todavía no hay fragmentos.', fr_new: 'Nuevo fragmento', fr_editing: 'Editando el fragmento {n}', fr_add: 'Agregar fragmento', fr_save: 'Guardar fragmento', fr_words: '{n} palabras', au_h: 'Autoras que sigo', au_sub: 'Aparecen al final de la biblioteca. Pega el link de su perfil de AO3; si dejas el nombre vacío, lo tomo del link.', au_name: 'Nombre', au_link: 'Link a su perfil de AO3', au_fandom: 'Fandom', au_works: 'Número de fics', au_add: 'Agregar autora', au_save: 'Guardar cambios', au_edit: 'Editar', au_del: 'Quitar', au_need: 'Falta el nombre o un link de AO3 con su usuario.', au_editing: 'Editando a {a}.', meme_h: 'Meme del momento', meme_sub: 'Pega el código para insertar del post (en X: ··· → Insertar post → Copiar código) o solo su link, y aparece arriba, debajo del saludo. Con el código, aunque el navegador de alguien bloquee a X, igual se lee el texto y quién lo publicó.', meme_lbl: 'Código para insertar o link del post', meme_set: 'Ponerlo', meme_clear: 'Quitarlo', meme_bad: 'Eso no parece un link ni un código de un post de X.', meme_open: 'Ver el post en X', open: 'Abrir', details: 'Ver folio', bm_add: 'Marcar', bm_on: 'Marcado', edit: 'Editar', remove: 'Quitar', confirm_rm: '¿Quitar este folio?', yes_rm: 'Sí, quitar', no: 'No', copied: 'Copiado',
      r_G: 'General', r_T: 'Teen', r_M: 'Mature', r_E: 'Explicit', 'r_?': 'Sin clasificar',
      'st_Completed': 'Completo', 'st_In Progress': 'En progreso', 'st_Paused': 'En pausa', 'st_Dropped': 'Abandonado',
      'm_Favorite': 'Favorito', 'm_Read': 'Leído', 'm_Reading': 'Leyendo', 'm_To read': 'Por leer', 'm_Dropped': 'Lo dejé',
      'len_One-Shot': 'One-shot', 'len_Corto': 'Corto', 'len_Mediano': 'Mediano', 'len_Largo': 'Largo',
      idx_h: 'Índice del archivo', idx_sub: 'Todos los folios en una sola lista. Toca un título para abrirlo.', group: 'Agrupar por', g_ship: 'Ship', g_fandom: 'Fandom', g_author: 'Autora', g_az: 'A a Z', col_title: 'Título', col_author: 'Autora', no_value: 'Sin dato',
      bm_h: 'Tus marcadores', bm_sub: 'Se guardan solo en este navegador. Úsalos como tu lista de pendientes.', bm_empty: 'Todavía no marcas ningún folio. Usa “Marcar” en cualquier folio para guardarlo aquí.',
      close: 'Cerrar', same_ship: 'Del mismo ship', same_author: 'De la misma autora', random_pick: 'La biblioteca te recomienda',
      rec_h: 'Suma un fic al archivo', rec_sub: 'Llena lo que sepas. Con el link y el título basta; lo demás ayuda a que la gente lo encuentre.',
      f_link: 'Link al fic', f_title: 'Título', f_author: 'Autora', f_fandom: 'Fandom', f_ship: 'Ship', f_rating: 'Clasificación', f_status: 'Estado', f_len: 'Largo', f_dk: 'No sé', f_by: 'Tu @ en X',
      f_about: 'De qué trata', f_about_ph: 'En una o dos frases, sin spoilers.', f_why: 'Por qué lo recomiendas', f_why_ph: '¿Qué lo hace especial?', f_tropes: 'Tropes o vibe', f_tropes_ph: 'ej. slow burn', f_tropes_hint: 'Escribe uno y presiona Enter o coma para agregarlo. Puedes agregar varios.', remove_tag: 'Quitar {x}', filters: 'Filtros', tropes_h: 'Tropes', tropes_sub: 'Muestra los folios que tienen todos los tropes que elijas.', no_tropes: 'Todavía no hay tropes en el archivo.', filter_by: 'Filtrar por {x}', clear_all: 'Quitar todos los filtros', f_warn: 'Advertencias', f_warn_ph: 'Las de AO3, si tiene', f_ta: 'Teen And Up',
      prev_h: 'Tu pergamino', step1: 'Llena el pergamino del fic.', step2: 'Cópialo con el botón.', step3: 'Mándalo por DM a @{u} o publícalo en X con {tag}. La archivista lo suma al archivo con tu @.', to: ' a @{u}', hashtag: '#LilithsArchive', open_dm: 'Mandar DM a @{u}', post_x: 'Publicarlo en X', tw_head: 'Rec para el {tag}:', contrib_h: 'Quienes han sumado recs', contrib_sub: 'Gracias por compartir. Cada folio dice quién lo recomendó.', archivist: 'archivista', recs_n: '{n} recs', recs_1: '1 rec',
      copy_scroll: 'Copiar pergamino', new_scroll: 'Empezar otro', see_text: 'Ver el texto que se copia',
      err_link: 'Falta el link al fic (tiene que empezar con https://).', err_title: 'Falta el título del fic.',
      sc_head: '📜 Pergamino para Lilith’s Archive', sc_about: 'De qué trata: ', sc_why: 'Por qué lo recomiendo: ', sc_tropes: 'Tropes: ', sc_warn: 'Advertencias: ', sc_by: '— recomendado por @{u}', untitled: '(sin título)',
      x_by: ' de {a}', x_from: 'Rec de @{u}',
      imp_h: 'Importar pergaminos', imp_sub: 'Pega aquí los DMs con pergaminos. Puedes pegar varios a la vez; se leen por su código #ficha:.', imp_ph: '📜 Pergamino para Lilith’s Archive…', read_scrolls: 'Leer pergaminos', add_all: 'Agregar todos', added: 'Agregado', dup: 'Ya está en el archivo', add_to: 'Agregar al archivo',
      imp_none: 'No encontré ningún pergamino. Pega el mensaje completo, con la línea que empieza con #ficha:',
      of_add: 'Agregar un folio', of_edit: 'Editar folio: {t}', cataloging: 'Catalogando un link pendiente.', save_folio: 'Guardar cambios en el folio', cancel: 'Cancelar',
      f_chapters: 'Capítulos', f_mylist: 'Mi lista', f_myscore: 'Mi calificación', unrated: 'Sin calificar', f_recby: 'Recomendado por (@)', f_recby_ph: 'vacío si es tuyo', f_why_o: 'Por qué lo recomiendan', f_notes: 'Mis notas',
      pend_h: 'Links por catalogar ({n})', pend_sub: 'Venían en tu Excel sin título. Catalógalos o quítalos.', catalog: 'Catalogar', no_pend: 'No hay links pendientes.',
      ct_h: 'Tu @ de X', ct_sub: 'Se usa para los botones de X del aviso y del encabezado, y para que sepan a quién mandarle los pergaminos por DM.', ct_label: 'Usuario en X', ct_use: 'Usar este @',
      err_title_o: 'Falta el título.', err_link_o: 'Falta el link (tiene que empezar con https://).',
      unsaved1: '1 cambio sin guardar.', unsavedN: '{n} cambios sin guardar.', others_see: 'Los demás lo verán cuando guardes.', saving: 'Guardando…', save: 'Guardar en el archivo', discard: 'Descartar', gotit: 'Entendido',
      e_conflict: 'Había una versión más nueva y la página se recargó. Vuelve a hacer tus cambios.', e_ro: 'Desde esta vista no se puede guardar. Abre el archivo desde tu cuenta de Claude.', e_rate: 'Guardaste varias veces seguidas. Espera un minuto y vuelve a intentar.', e_big: 'El archivo quedó demasiado grande para guardarse.', e_gen: 'No se pudo guardar. Intenta otra vez en un momento.',
      gh_login: 'Acceso de la archivista', gh_sub: 'Pega tu token de GitHub. Se guarda solo en este navegador y solo se usa para hablar con GitHub.', gh_tok: 'Token de GitHub', gh_how: '¿Cómo creo uno?',
      gh_enter: 'Entrar', gh_cancel: 'Cancelar', gh_checking: 'Revisando…', gh_bad: 'Ese token no puede escribir en este repositorio. Revisa que tenga acceso a los dos repos con “Contents: Read and write”.',
      gh_net: 'No pude hablar con GitHub. Revisa tu conexión e inténtalo otra vez.', gh_out: 'Cerrar sesión de archivista', gh_unsaved: 'Tienes cambios sin guardar. Guárdalos o descártalos antes de salir.',
      gh_nopriv: 'No encuentro tu repositorio privado “{r}”. Puedes ver y editar, pero no voy a guardar hasta encontrarlo, para no perder lo oculto.', m_saved_gh: 'Guardado en GitHub. La página pública se actualiza en un minuto.',
      e_gh_auth: 'GitHub no dejó guardar. Revisa que tu token pueda escribir en los dos repositorios.', e_gh_conflict: 'Hubo cambios desde otro lado. Recarga la página para traer lo más nuevo y vuelve a guardar.',
      e_gh_nopriv: 'No guardé nada: no encuentro tu repositorio privado “{r}” y lo oculto se perdería.',
      m_copied: 'Copiado al portapapeles.', m_removed: 'Folio quitado. Falta guardar.', m_updated: 'Folio actualizado. Falta guardar.', m_added: 'Folio agregado. Falta guardar.', m_nadded: '{n} agregados. Falta guardar.', m_ready: 'Listo. Falta guardar.', m_saved: 'Guardado. La página se recarga con los cambios.',
      copy_h: 'Copia este texto', copy_sub: 'Tu navegador no dejó copiar automáticamente. Ya está seleccionado: cópialo con Ctrl+C o mantén presionado en el celular.', done: 'Listo'
    },
    en: {
      htmlLang: 'en', title: 'Lilith’s Archive', eyebrow: 'my recs · AO3', cv_on: 'Community view', cv_off: 'Back to my view', cv_banner: 'You’re seeing the archive the way the community does.', cv_unsaved: 'It includes changes you haven’t saved yet.', updated_on: 'updated {d}',
      lede: 'Hi, welcome to my little archive! Here you’ll find the fics I recommend, the ones I’m reading and the ones on my to-read list. But mostly, this is home for Medieval MiChaeng: sneak peeks of new chapters and, soon, more about its worldbuilding. Happy reading!',
      lang: 'Language', palette: 'Palette',
      nav_lib: 'Library', nav_idx: 'Index', nav_bm: 'Bookmarks', nav_rec: 'Add a fic', nav_scribe: 'Scribe',
      pal_auto: 'Automatic', pal_pergamino: 'Parchment', pal_castillo: 'Castle at night', pal_lapis: 'Lapis lazuli', pal_bosque: 'Forest', pal_purpura: 'Royal purple', pal_once: 'ONCE banner',
      notice: 'Several of these fics are rated Mature or Explicit (18+). Each folio carries its rating seal and AO3 warnings.',
      search: 'Search', search_ph: 'Title, author, ship, trope…', fandom: 'Fandom', ship: 'Ship', rating: 'Rating', list: 'List', sort: 'Sort', all_m: 'All', all_f: 'All',
      l_all: 'All', l_fav: 'Archivist’s favorites', l_read: 'Read', l_reading: 'Reading', l_toread: 'On my list', l_comm: 'From the community', l_hidden: 'Hidden (only you)', hid_tag: 'Hidden', hide: 'Hide', unhide: 'Show', hide_t: 'Hide this folio: no one else will see it', unhide_t: 'Show this folio to everyone again', m_hidden: 'Folio hidden. Remember to save.', m_unhidden: 'Folio visible again. Remember to save.',
      s_fav: 'Favorites first', s_new: 'Newest', s_az: 'A to Z', only_complete: 'Complete only', hide18: 'Hide 18+',
      showing: 'Showing {a} of {b} folios', surprise: 'The library suggests', pick_lilith: 'The library suggests one of Lilith’s recs', pick_by: 'The library suggests @{u}’s rec', no_results: 'No folios match those filters.', clear: 'Clear filters', empty_lib: 'There are no folios in the library yet.',
      authors_h: 'Authors I follow', authors_sub: 'If you liked one of their folios, the rest of their work is worth it.', fics_n: '{n} fics',
      fol: 'Fol.', by: 'by', m_fandom: 'Fandom', m_ship: 'Ship', m_len: 'Length', m_status: 'Status', cap: 'ch.', caps: 'chs.',
      about: 'What it’s about', why: 'Why they recommend it', why_by: 'Why @{u} recommends it', note: 'Archivist’s note', rec_by: 'Rec from @{u}', inscribed: 'Inscribed {d}',
      copyx: 'Copy for X', read_ao3: 'Read on AO3', wb: 'Find on Wayback', ats: 'Find on archive.today', nav_peek: 'Sneak peek', pk_kicker: 'Sneak peek', pk_teaser: 'Read a sneak peek of {f}', pk_cap_card: 'Chapter', pk_prof_card: 'Profile', pk_read: 'Break the seal', pk_again: 'Read it again', pk_seeprof: 'See profile', pk_back: 'Back to the sneak peek', pk_draft_short: 'Draft', ad_prof_h: 'Profile (second card)', ad_pnom: 'Name', ad_ptit: 'Title', ad_pdat: 'Facts: one per line, “Label: value”', ad_ptxt: 'Profile text', pk_hello: 'Happy reading! We survived the AO3 shutdown… mostly sane', pk_in_en: 'written in English', pk_in_es: 'written in Spanish', pk_draft: 'Draft: it may change before it’s published', pk_more: 'To be continued…', pk_note_by: 'A note from the author', pk_prev: 'Read the earlier chapters', pk_x: 'If you want to talk about the story, I’m around on X:', pk_hidden: 'Only you can see this page: the sneak peek is hidden. Review it and show it to the community from Scribe.', pk_hidden_p: 'The profile is hidden: only you can see it. The community only sees the chapter.', pk_hidden_c: 'The chapter is hidden: only you can see it. The community only sees the profile.', pk_hidden_one: 'Only you can see this: it’s hidden from the community.', pk_edit: 'Edit in Scribe', ad_h: 'Sneak peek of your fic', ad_sub_off: 'Hidden: only you can see it. Review the text, apply your changes and, when it’s ready, show it to the community and save.', ad_sub_on: 'Visible to everyone in the Sneak peek tab.', ad_fic: 'Fic', ad_cap: 'Chapter', ad_link: 'Link to your fic on AO3 (optional)', ad_lang: 'Language of the text', ad_draft: 'Show the draft label', ad_note: 'Note for readers (optional)', ad_text: 'Sneak peek text', ad_help: 'Each line is a paragraph. *italics*, **bold**, and --- on its own line for a horizontal line.', ad_apply: 'Apply changes', ad_view: 'Preview it', ad_show: 'Show the chapter', ad_hide: 'Hide the chapter', ad_pshow: 'Show the profile', ad_phide: 'Hide the profile', ad_vis: 'visible to everyone', ad_hid: 'hidden', ad_state: 'Chapter: {c} · Profile: {p}.', m_ad: 'Sneak peek updated. Remember to save.', fh: 'Download the whole fic with FicHub (EPUB works best)', read_in: 'Read on', ao3_down_h: 'A stopgap archive', ao3_down: 'AO3 has been down since October 29 because of a security incident. This archive belongs to all of us: while it’s down, we gather our recs here, and each folio has buttons to read: “FicHub” downloads the whole fic (EPUB works best; it’s under heavy load, so be patient), and “Wayback” or “archive.today” look for a saved copy, though not every fic has one and archive.today sometimes asks you to solve a captcha.', follow_line: 'It’s kept by me, @{u}; follow me on X for news.', eta_h: 'AO3 estimated return', eta_range: 'Between {a} and {b}', eta_until: 'About {d} until the earliest estimate.', eta_window: 'We are inside the window: it could come back any time. At the latest in about {d}.', eta_past: 'The estimated date has passed. Check the official status.', eta_note: 'This is AO3’s rough estimate (2 to 4 weeks). It may come back earlier in a limited or read-only mode.', eta_progress: '{p}% of the estimated time has passed', eta_start: 'Went down: {a}', eta_end: 'At the latest: {a}', d_day: 'day', d_days: 'days', d_h: 'h', d_min: 'min', d_s: 's', d_and: ', ', author_ao3: '{a}’s AO3 profile', by_x: '@{u} on X', eta_from: 'Earliest return', eta_to: 'Latest return', eta_use: 'Use these dates', eta_owner_sub: 'Update them if AO3 changes its estimate on otwstatus.org.', l_vetted: 'Read by the archivist', selection: 'Selection', follow_btn: '@{u} on X', x_profile: '@{u} on X', ao3_status: 'Official AO3 status', ao3_h: 'Stopgap notice', ao3_sub: 'Turn it off when AO3 is back. The Wayback button stays on every folio.', ao3_on: 'Show notice', ao3_off: 'Hide notice', pk_t_capitulo: 'Chapter', pk_t_perfil: 'Profile', pk_t_mundo: 'Worldbuilding', pk_tp_capitulo: 'Chapters', pk_tp_perfil: 'Profiles', pk_tp_mundo: 'Worldbuilding', pk_f_type: 'Letter type', pk_f_capl: 'Chapter', pk_f_all: 'All', pk_f_allcaps: 'All chapters', pk_f_cap: 'Ch. {n}', pk_new_frag: 'New fragment', pk_frag: 'Fragment {n}', pk_frags_n: '{n} fragments', pk_frags_1: '1 fragment', pk_none: 'No letters match that filter.', pk_full: 'Read the full chapter on AO3', ca_h: 'Sneak peek letters', ca_sub: 'Each letter is edited on its own. Chapter letters grow by fragments: when you publish a new one, the letter is sealed again for anyone who had read it. New letters start hidden.', ca_type: 'Type', ca_new: 'New letter', ca_edit: 'Edit', ca_show: 'Show', ca_hide: 'Hide', ca_del: 'Remove', ca_del_q: 'Remove? Tap again', ca_vis: 'visible', ca_hid: 'hidden', ca_none: 'No letters yet.', ca_editing: 'Editing: {t}', ca_save: 'Save letter', ca_close: 'Close', ca_capn: 'Chapter number', ca_title_cap: 'Chapter title', ca_fin: 'Chapter finished (no more fragments)', ca_title: 'Title', ca_name: 'Name', ca_role: 'Title or role', ca_sub2: 'Subtitle (optional)', ca_capopt: 'Related chapter (optional)', ca_text: 'Text', ca_need: 'Give the letter a title (or a chapter number).', fr_h: 'Fragments', fr_none: 'No fragments yet.', fr_new: 'New fragment', fr_editing: 'Editing fragment {n}', fr_add: 'Add fragment', fr_save: 'Save fragment', fr_words: '{n} words', au_h: 'Authors I follow', au_sub: 'They show up at the end of the library. Paste the link to their AO3 profile; if you leave the name empty, I take it from the link.', au_name: 'Name', au_link: 'Link to their AO3 profile', au_fandom: 'Fandom', au_works: 'Number of fics', au_add: 'Add author', au_save: 'Save changes', au_edit: 'Edit', au_del: 'Remove', au_need: 'The name is missing, or an AO3 link with their username.', au_editing: 'Editing {a}.', meme_h: 'Meme of the moment', meme_sub: 'Paste the post’s embed code (on X: ··· → Embed post → Copy code) or just its link, and it shows up top, under the greeting. With the code, even if someone’s browser blocks X, they still see the text and who posted it.', meme_lbl: 'Embed code or link to the post', meme_set: 'Show it', meme_clear: 'Take it down', meme_bad: 'That doesn’t look like a link or embed code for a post on X.', meme_open: 'See the post on X', open: 'Open', details: 'View folio', bm_add: 'Bookmark', bm_on: 'Bookmarked', edit: 'Edit', remove: 'Remove', confirm_rm: 'Remove this folio?', yes_rm: 'Yes, remove', no: 'No', copied: 'Copied',
      r_G: 'General', r_T: 'Teen', r_M: 'Mature', r_E: 'Explicit', 'r_?': 'Not rated',
      'st_Completed': 'Complete', 'st_In Progress': 'In progress', 'st_Paused': 'On hiatus', 'st_Dropped': 'Abandoned',
      'm_Favorite': 'Favorite', 'm_Read': 'Read', 'm_Reading': 'Reading', 'm_To read': 'To read', 'm_Dropped': 'Dropped',
      'len_One-Shot': 'One-shot', 'len_Corto': 'Short', 'len_Mediano': 'Medium', 'len_Largo': 'Long',
      idx_h: 'Archive index', idx_sub: 'Every folio in one list. Tap a title to open it.', group: 'Group by', g_ship: 'Ship', g_fandom: 'Fandom', g_author: 'Author', g_az: 'A to Z', col_title: 'Title', col_author: 'Author', no_value: 'Unknown',
      bm_h: 'Your bookmarks', bm_sub: 'Saved only in this browser. Use them as your to-read list.', bm_empty: 'You haven’t bookmarked any folios yet. Use “Bookmark” on any folio to keep it here.',
      close: 'Close', same_ship: 'Same ship', same_author: 'Same author', random_pick: 'The library suggests',
      rec_h: 'Add a fic to the archive', rec_sub: 'Fill in what you know. A link and a title are enough; the rest helps people find it.',
      f_link: 'Link to the fic', f_title: 'Title', f_author: 'Author', f_fandom: 'Fandom', f_ship: 'Ship', f_rating: 'Rating', f_status: 'Status', f_len: 'Length', f_dk: 'Not sure', f_by: 'Your @ on X',
      f_about: 'What it’s about', f_about_ph: 'One or two sentences, no spoilers.', f_why: 'Why you recommend it', f_why_ph: 'What makes it special?', f_tropes: 'Tropes or vibe', f_tropes_ph: 'e.g. slow burn', f_tropes_hint: 'Type one and press Enter or comma to add it. You can add several.', remove_tag: 'Remove {x}', filters: 'Filters', tropes_h: 'Tropes', tropes_sub: 'Shows folios that have every trope you pick.', no_tropes: 'No tropes in the archive yet.', filter_by: 'Filter by {x}', clear_all: 'Clear all filters', f_warn: 'Warnings', f_warn_ph: 'AO3 warnings, if any', f_ta: 'Teen And Up',
      prev_h: 'Your scroll', step1: 'Fill in the scroll for the fic.', step2: 'Copy it with the button.', step3: 'DM it to @{u} or post it on X with {tag}. The archivist adds it to the archive with your @.', to: ' at @{u}', hashtag: '#LilithsArchive', open_dm: 'DM @{u}', post_x: 'Post it on X', tw_head: 'Rec for the {tag}:', contrib_h: 'Who has added recs', contrib_sub: 'Thank you for sharing. Every folio says who recommended it.', archivist: 'archivist', recs_n: '{n} recs', recs_1: '1 rec',
      copy_scroll: 'Copy scroll', new_scroll: 'Start another', see_text: 'See the text that gets copied',
      err_link: 'The link is missing (it must start with https://).', err_title: 'The title is missing.',
      sc_head: '📜 Scroll for Lilith’s Archive', sc_about: 'About: ', sc_why: 'Why I recommend it: ', sc_tropes: 'Tropes: ', sc_warn: 'Warnings: ', sc_by: '— recommended by @{u}', untitled: '(untitled)',
      x_by: ' by {a}', x_from: 'Rec from @{u}',
      imp_h: 'Import scrolls', imp_sub: 'Paste DMs with scrolls here. You can paste several at once; they are read by their #ficha: code.', imp_ph: '📜 Scroll for Lilith’s Archive…', read_scrolls: 'Read scrolls', add_all: 'Add all', added: 'Added', dup: 'Already in the archive', add_to: 'Add to archive',
      imp_none: 'I couldn’t find any scroll. Paste the whole message, including the line that starts with #ficha:',
      of_add: 'Add a folio', of_edit: 'Edit folio: {t}', cataloging: 'Cataloging a pending link.', save_folio: 'Save folio changes', cancel: 'Cancel',
      f_chapters: 'Chapters', f_mylist: 'My list', f_myscore: 'My rating', unrated: 'Unrated', f_recby: 'Recommended by (@)', f_recby_ph: 'leave empty if it’s yours', f_why_o: 'Why they recommend it', f_notes: 'My notes',
      pend_h: 'Links to catalog ({n})', pend_sub: 'These came from your spreadsheet without a title. Catalog them or remove them.', catalog: 'Catalog', no_pend: 'No pending links.',
      ct_h: 'Your X handle', ct_sub: 'Used for the X buttons in the notice and header, and so people know who to DM their scrolls to.', ct_label: 'X username', ct_use: 'Use this @',
      err_title_o: 'The title is missing.', err_link_o: 'The link is missing (it must start with https://).',
      unsaved1: '1 unsaved change.', unsavedN: '{n} unsaved changes.', others_see: 'Others will see it once you save.', saving: 'Saving…', save: 'Save to archive', discard: 'Discard', gotit: 'Got it',
      e_conflict: 'There was a newer version and the page reloaded. Please redo your changes.', e_ro: 'This view can’t save. Open the archive from your Claude account.', e_rate: 'You saved several times in a row. Wait a minute and try again.', e_big: 'The archive got too large to save.', e_gen: 'Couldn’t save. Try again in a moment.',
      gh_login: 'Archivist access', gh_sub: 'Paste your GitHub token. It stays in this browser only and is only used to talk to GitHub.', gh_tok: 'GitHub token', gh_how: 'How do I make one?',
      gh_enter: 'Sign in', gh_cancel: 'Cancel', gh_checking: 'Checking…', gh_bad: 'That token can’t write to this repository. Make sure it can reach both repos with “Contents: Read and write”.',
      gh_net: 'I couldn’t reach GitHub. Check your connection and try again.', gh_out: 'Sign out of archivist mode', gh_unsaved: 'You have unsaved changes. Save or discard them before signing out.',
      gh_nopriv: 'I can’t find your private repository “{r}”. You can look and edit, but I won’t save until I find it, so nothing hidden gets lost.', m_saved_gh: 'Saved to GitHub. The public page updates in about a minute.',
      e_gh_auth: 'GitHub didn’t allow the save. Make sure your token can write to both repositories.', e_gh_conflict: 'Something changed somewhere else. Reload the page to get the newest version and save again.',
      e_gh_nopriv: 'Nothing was saved: I can’t find your private repository “{r}” and the hidden items would be lost.',
      m_copied: 'Copied to clipboard.', m_removed: 'Folio removed. Remember to save.', m_updated: 'Folio updated. Remember to save.', m_added: 'Folio added. Remember to save.', m_nadded: '{n} added. Remember to save.', m_ready: 'Done. Remember to save.', m_saved: 'Saved. The page reloads with your changes.',
      copy_h: 'Copy this text', copy_sub: 'Your browser didn’t allow automatic copying. The text is selected: copy it with Ctrl+C, or long-press on your phone.', done: 'Done'
    }
  };
  var PALETTES = [
    ['auto', 'linear-gradient(135deg, #f7f0e1 50%, #1d2029 50%)'],
    ['pergamino', 'linear-gradient(135deg, #f7f0e1 55%, #a3301c 55%)'],
    ['castillo', 'linear-gradient(135deg, #1d2029 55%, #d9b45a 55%)'],
    ['lapis', 'linear-gradient(135deg, #15214a 55%, #8ab4f8 55%)'],
    ['bosque', 'linear-gradient(135deg, #162a21 55%, #93c98a 55%)'],
    ['purpura', 'linear-gradient(135deg, #2a1624 55%, #cfa6f0 55%)'],
    ['once', 'linear-gradient(135deg, #fcc89b 55%, #ff5fa2 55%)']
  ];
  function store(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  var LANG = load('archivo-fanfics-idioma');
  if (LANG !== 'es' && LANG !== 'en') { var nl = ''; try { nl = (navigator.language || '').toLowerCase(); } catch (e) {} LANG = nl.indexOf('en') === 0 ? 'en' : 'es'; }
  var PAL = load('archivo-fanfics-paleta') || 'auto';
  if (!PALETTES.some(function (p) { return p[0] === PAL; })) PAL = 'auto';
  function palBg(v) { for (var i = 0; i < PALETTES.length; i++) if (PALETTES[i][0] === v) return PALETTES[i][1]; return PALETTES[0][1]; }
  function setPalMenu(open, refocus) {
    var pp = document.querySelector('.palpick'); if (!pp) return;
    if (open) { var mn = pp.querySelector('.pal-menu'), tr = pp.getBoundingClientRect(); pp.classList.toggle('to-left', mn && tr.right - mn.offsetWidth < 8); }
    pp.classList.toggle('open', open);
    var tg = pp.querySelector('.pal-toggle'); if (tg) { tg.setAttribute('aria-expanded', String(open)); if (refocus) tg.focus(); }
    if (open) { var cur = pp.querySelector('.pal-opt[aria-pressed="true"]'); if (cur) setTimeout(function () { try { cur.focus({ preventScroll: true }); } catch (e) {} }, 30); }
  }
  function applyPalette() { var r = document.documentElement; if (PAL === 'auto') r.removeAttribute('data-paleta'); else r.setAttribute('data-paleta', PAL); }
  applyPalette();
  function t(k, vars) {
    var s = (I18N[LANG] && I18N[LANG][k] != null) ? I18N[LANG][k] : (I18N.es[k] != null ? I18N.es[k] : k);
    if (vars) Object.keys(vars).forEach(function (v) { s = s.split('{' + v + '}').join(vars[v]); });
    return s;
  }

  var OWNER = false, IS_OWNER = false, AS_VISITOR = false, ART = null, dirty = 0, saving = false, saveErr = '', saveOk = '', saveOkTimer = 0;
  var F = { q: '', fandom: '', ship: '', rating: '', mine: '', completos: false, sin18: false, sort: 'fav', tropes: [] };
  var filtersOpen = false;
  var VIEWS = ['archivo', 'indice', 'marcadores', 'recomendar', 'adelanto', 'archivista'];
  var view = 'archivo', detailId = null, detailPick = false, groupBy = 'ship';
  var confirmDel = null, editingId = null, catalogLink = null, importList = [], auEdit = null;
  var draft = loadJSON('archivo-fanfics-borrador', {});
  var BM = loadJSON('archivo-fanfics-marcadores', []);
  if (!Array.isArray(BM)) BM = [];
  function loadJSON(k, def) { var s = load(k); if (!s) return def; try { return JSON.parse(s); } catch (e) { return def; } }

  var RATINGS = ['G', 'T', 'M', 'E', '?'];
  var RK = { G: 'g', T: 't', M: 'm', E: 'e', '?': 'n' };
  var STS = ['Completed', 'In Progress', 'Paused', 'Dropped'];
  var MINES = ['Favorite', 'Read', 'Reading', 'To read', 'Dropped'];
  var MINEK = { 'Favorite': 'fav', 'Read': 'read', 'Reading': 'reading', 'To read': 'toread', 'Dropped': 'dropped' };
  var LENS = ['One-Shot', 'Corto', 'Mediano', 'Largo'];
  var MES = { es: ['ene.', 'feb.', 'mar.', 'abr.', 'may.', 'jun.', 'jul.', 'ago.', 'sept.', 'oct.', 'nov.', 'dic.'], en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] };
  var reduced = false;
  try { reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  /* ---------- utilidades ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function safeUrl(u) { u = String(u || '').trim(); return /^https?:\/\/[^\s]+$/i.test(u) ? u : ''; }
  function cleanAo3(u) { var m = /^https?:\/\/(?:www\.)?archiveofourown\.org\/works\/(\d+)/i.exec(u || ''); return m ? 'https://archiveofourown.org/works/' + m[1] : u; }
  function isAo3(u) { return /archiveofourown\.org/i.test(u || ''); }
  function fshort(f) { return String(f || '').replace(/\s*\((Band|TV)\)\s*$/i, ''); }
  function tropes(s) { return String(s || '').split(/\s*[,;]\s*/).filter(Boolean).slice(0, 6); }
  function tropesAll(s) { var seen = {}, out = []; String(s || '').split(/\s*[,;]\s*/).forEach(function (x) { x = x.trim(); var k = x.toLowerCase(); if (x && !seen[k]) { seen[k] = 1; out.push(x); } }); return out; }
  function allTropes() { var seen = {}, out = []; seenRecs().forEach(function (r) { tropesAll(r.tr).forEach(function (x) { var k = x.toLowerCase(); if (!seen[k]) { seen[k] = 1; out.push(x); } }); }); return out.sort(cmp); }
  function hasTrope(r, x) { x = x.toLowerCase(); return tropesAll(r.tr).some(function (y) { return y.toLowerCase() === x; }); }
  function troped(x) { x = String(x).toLowerCase(); return F.tropes.some(function (y) { return y.toLowerCase() === x; }); }
  function toggleTrope(x) { if (troped(x)) F.tropes = F.tropes.filter(function (y) { return y.toLowerCase() !== x.toLowerCase(); }); else F.tropes.push(x); }
  function activeCount() { return (F.fandom ? 1 : 0) + (F.ship ? 1 : 0) + (F.rating ? 1 : 0) + (F.mine ? 1 : 0) + (F.completos ? 1 : 0) + (F.sin18 ? 1 : 0) + F.tropes.length; }
  function tagChip(x) { return '<span class="tag">' + esc(x) + '<button type="button" class="tag-x" data-act="tag-x" data-v="' + esc(x) + '" aria-label="' + esc(t('remove_tag', { x: x })) + '">\u00d7</button></span>'; }
  function tagField(prefix, value) {
    var tags = tropesAll(value);
    return '<div class="field full"><label for="' + prefix + 'tr-in">' + esc(t('f_tropes')) + '</label>' +
      '<div class="tagbox" data-prefix="' + prefix + '"><span class="tags" id="' + prefix + 'tr-tags">' + tags.map(tagChip).join('') + '</span>' +
      '<input type="text" id="' + prefix + 'tr-in" class="tag-in" placeholder="' + esc(t('f_tropes_ph')) + '" list="' + prefix + 'tropes" maxlength="60" autocomplete="off" enterkeyhint="enter"></div>' +
      '<input type="hidden" id="' + prefix + 'tr" value="' + esc(tags.join(', ')) + '">' +
      '<span class="hint">' + esc(t('f_tropes_hint')) + '</span>' +
      '<datalist id="' + prefix + 'tropes">' + allTropes().map(function (x) { return '<option value="' + esc(x) + '">'; }).join('') + '</datalist></div>';
  }
  function setTags(prefix, tags) {
    var h = document.getElementById(prefix + 'tr'); if (h) h.value = tags.join(', ');
    var box = document.getElementById(prefix + 'tr-tags'); if (box) box.innerHTML = tags.map(tagChip).join('');
    if (prefix === 'rf-') updateScroll();
  }
  function addTags(prefix, text) {
    var tags = tropesAll(val(prefix + 'tr'));
    String(text || '').split(/[,;\n]/).forEach(function (x) {
      x = x.replace(/\s+/g, ' ').trim().slice(0, 60);
      if (!x || tags.length >= 12) return;
      if (tags.some(function (y) { return y.toLowerCase() === x.toLowerCase(); })) return;
      if (tags.concat([x]).join(', ').length > LIMITS.tr) return;
      tags.push(x);
    });
    setTags(prefix, tags);
  }
  function commitTag(prefix) { var i = document.getElementById(prefix + 'tr-in'); if (i && i.value.trim()) { var v = i.value; i.value = ''; addTags(prefix, v); } }
  function roman(n) { n = n | 0; if (n <= 0) return '—'; var r = '', map = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]; map.forEach(function (m) { while (n >= m[0]) { r += m[1]; n -= m[0]; } }); return r; }
  function rOf(r) { return RK[r.r] ? r.r : '?'; }
  function stName(s) { return s ? t('st_' + s) : ''; }
  function mineName(m) { return m ? t('m_' + m) : ''; }
  function lenName(l) { return l ? t('len_' + l) : ''; }
  function dateTxt(d) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ''); if (!m) return ''; var mm = MES[LANG][+m[2] - 1]; return LANG === 'en' ? mm + ' ' + (+m[3]) + ', ' + m[1] : (+m[3]) + ' ' + mm + ' ' + m[1]; }
  function eyebrowTxt() { var u = DATA.meta && DATA.meta.updated; return t('eyebrow', { n: roman(pubRecs().length) }) + (u ? ' \u00b7 ' + t('updated_on', { d: dateTxt(u) }) : ''); }
  function today() { var d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
  function stars(n) { n = Math.max(0, Math.min(5, n | 0)); if (!n) return ''; return '<span class="stars" aria-label="' + n + '/5">' + '★'.repeat(n) + '<span class="off">' + '★'.repeat(5 - n) + '</span></span>'; }
  function cmp(a, b) { return String(a || '').localeCompare(String(b || ''), LANG, { sensitivity: 'base' }); }
  function uniq(key) { var s = {}; seenRecs().forEach(function (r) { if (r[key]) s[r[key]] = 1; }); return Object.keys(s).sort(cmp); }
  function bmCount() { return BM.filter(function (id) { return shown(byId(id)); }).length; }
  function shown(r) { return !!r && (OWNER || !r.h); }
  function pubRecs() { return DATA.recs.filter(function (r) { return !r.h; }); }
  function seenRecs() { return DATA.recs.filter(shown); }
  function byId(id) { for (var i = 0; i < DATA.recs.length; i++) if (DATA.recs[i].id === id) return DATA.recs[i]; return null; }
  function nextN() { var m = 0; DATA.recs.forEach(function (r) { if ((r.n | 0) > m) m = r.n | 0; }); return m + 1; }
  function say(s) { var el = document.getElementById('live'); if (el) { el.textContent = ''; setTimeout(function () { el.textContent = s; }, 30); } }
  function val(id) { var el = document.getElementById(id); return el ? el.value : ''; }
  function opts(list, cur, first) { return (first != null ? '<option value="">' + esc(first) + '</option>' : '') + list.map(function (o) { var v = Array.isArray(o) ? o[0] : o, l = Array.isArray(o) ? o[1] : o; return '<option value="' + esc(v) + '"' + (v === cur ? ' selected' : '') + '>' + esc(l) + '</option>'; }).join(''); }
  function b64e(str) { var bytes = new TextEncoder().encode(str), bin = ''; for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]); return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  function b64d(s) { s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '='; var bin = atob(s), bytes = new Uint8Array(bin.length); for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i); return new TextDecoder().decode(bytes); }
  function splitTitle(s) {
    s = String(s || '').trim();
    var m = /^[^A-Za-z\u00C0-\u00FF0-9]*([A-Za-z\u00C0-\u00FF0-9])([\s\S]*)$/.exec(s);
    return m ? { cap: m[1].toUpperCase(), rest: m[2] } : { cap: '\u2766', rest: s };
  }
  function capOf(r) { return r.t ? splitTitle(r.t).cap : '\u2766'; }
  function titleHtml(r) { if (!r.t) return esc(t('untitled')); return '<span class="sr">' + esc(r.t) + '</span><span aria-hidden="true">' + esc(splitTitle(r.t).rest) + '</span>'; }
  function initialOf(s) { var m = /[A-Za-zÀ-ÿ0-9]/.exec(String(s || '')); return m ? m[0].toUpperCase() : '❦'; }

  var LIMITS = { t: 200, a: 120, f: 80, s: 80, ab: 600, w: 600, tr: 200, wa: 200, by: 30, l: 400, no: 400 };
  function clean(d) {
    d = d || {};
    var r = {};
    Object.keys(LIMITS).forEach(function (k) {
      var v = String(d[k] == null ? '' : d[k]);
      v = (k === 'ab' || k === 'w' || k === 'no') ? v.trim().replace(/\n{3,}/g, '\n\n') : v.replace(/\s+/g, ' ').trim();
      r[k] = v.slice(0, LIMITS[k]);
    });
    r.by = r.by.replace(/^@+/, '').replace(/[^A-Za-z0-9_]/g, '');
    r.l = safeUrl(r.l) ? cleanAo3(r.l) : '';
    r.r = RK[d.r] ? d.r : '?';
    r.st = STS.indexOf(d.st) >= 0 ? d.st : '';
    r.len = LENS.indexOf(d.len) >= 0 ? d.len : '';
    return r;
  }
  var KEYS = ['t', 'l', 'a', 'f', 's', 'r', 'st', 'len', 'ab', 'w', 'tr', 'wa', 'by'];
  function compact(d) { var o = {}; KEYS.forEach(function (k) { if (d[k] && d[k] !== '?') o[k] = d[k]; }); return o; }

  /* ---------- folios ---------- */
  function sealHtml(r, mini) { var L = rOf(r); return '<span class="seal r-' + RK[L] + (mini ? ' mini' : '') + '" title="' + esc(t('r_' + L)) + '"><b>' + (L === '?' ? '?' : L) + '</b>' + (mini ? '' : esc(t('r_' + L))) + '</span>'; }
  function metaHtml(r) {
    function md(k, v) { return v ? '<div><dt>' + k + '</dt><dd>' + esc(v) + '</dd></div>' : ''; }
    var lenTxt = [lenName(r.len), r.ch ? (r.ch + ' ' + (r.ch == 1 ? t('cap') : t('caps'))) : ''].filter(Boolean).join(' · ');
    var h = md(t('m_fandom'), fshort(r.f)) + md(t('m_ship'), r.s) + md(t('m_len'), lenTxt) + md(t('m_status'), stName(r.st));
    return h ? '<dl class="meta">' + h + '</dl>' : '';
  }
  function chipsHtml(r, live) {
    var c = sealHtml(r);
    tropes(r.tr).forEach(function (x) { c += live ? '<button type="button" class="chip" data-act="ftrope" data-v="' + esc(x) + '" aria-pressed="' + troped(x) + '" title="' + esc(t('filter_by', { x: x })) + '">' + esc(x) + '</button>' : '<span class="chip">' + esc(x) + '</span>'; });
    if (r.wa) c += '<span class="chip warn">⚠ ' + esc(r.wa) + '</span>';
    return '<div class="chips">' + c + '</div>';
  }
  function textsHtml(r) {
    var b = '';
    if (r.ab) b += '<p class="text about"><span class="lbl">' + esc(t('about')) + '</span>' + esc(r.ab) + '</p>';
    if (r.w) b += '<p class="text why"><span class="lbl">' + esc(r.by ? t('why_by', { u: r.by }) : t('why')) + '</span>“' + esc(r.w) + '”</p>';
    if (r.no) b += '<p class="text note"><span class="lbl">' + esc(t('note')) + '</span>“' + esc(r.no) + '”</p>';
    return b;
  }
  function authorUrl(name) {
    name = String(name || '').trim();
    var m = /^(.+?)\s*\(([A-Za-z0-9_]+)\)$/.exec(name);
    if (m) return 'https://archiveofourown.org/users/' + m[2] + '/pseuds/' + encodeURIComponent(m[1].trim());
    if (/^[A-Za-z0-9_]+$/.test(name)) return 'https://archiveofourown.org/users/' + name;
    return '';
  }
  function authorHtml(r) {
    var ao3 = !r.l || isAo3(r.l);
    return String(r.a || '').split(/\s*,\s*|\s+&\s+/).filter(Boolean).map(function (n) {
      var u = ao3 ? authorUrl(n) : '';
      return u ? '<a class="author" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer" title="' + esc(t('author_ao3', { a: n })) + '">' + esc(n) + '</a>' : '<b>' + esc(n) + '</b>';
    }).join(', ');
  }
  function headTag(r) { return r.by ? '<a class="who" href="https://x.com/' + esc(r.by) + '" target="_blank" rel="noopener noreferrer" title="' + esc(t('by_x', { u: r.by })) + '">' + esc(t('rec_by', { u: r.by })) + '</a>' : (r.m ? '<span class="mine mine-' + (MINEK[r.m] || 'toread') + '">' + esc(mineName(r.m)) + (r.m === 'Favorite' ? ' ❦' : '') + '</span>' : ''); }
  function bmBtn(r) { var on = BM.indexOf(r.id) >= 0; return '<button type="button" class="btn-small" data-act="bm" data-id="' + esc(r.id) + '" aria-pressed="' + on + '">' + (on ? '✓ ' + esc(t('bm_on')) : esc(t('bm_add'))) + '</button>'; }
  function ao3Down() { return DATA.meta.ao3Down === true; }
  function xHandle() { return String(DATA.meta.contacto || '').replace(/^@+/, '').replace(/[^A-Za-z0-9_]/g, ''); }
  function xUrl() { return 'https://x.com/' + xHandle(); }
  function setVisitorView(on) {
    AS_VISITOR = !!on; OWNER = IS_OWNER && !AS_VISITOR; confirmDel = null; setPalMenu(false);
    // switching views reseals the letters, so the seal can be broken again
    OPENED = {}; store('archivo-fanfics-cartas', null);
    var h = (location.hash || '').replace('#', '');
    route(); renderShell();
    // a tab or a folio the community can't open sends the preview back to the library
    if ((h === 'archivista' && !OWNER) || (h.indexOf('adelanto') === 0 && view !== 'adelanto') || (h.indexOf('fic-') === 0 && !detailId)) history.replaceState(null, '', '#' + view);
  }
  function cvBannerHtml() {
    if (!AS_VISITOR) return '';
    return '<div class="cv-banner" role="status"><span>' + esc(t('cv_banner')) + (dirty ? ' ' + esc(t('cv_unsaved')) : '') + '</span><button type="button" class="btn-small" data-act="as-visitor">' + esc(t('cv_off')) + '</button></div>';
  }
  function xLinkSmall() { return xHandle() ? '<a class="btn-small" href="' + esc(xUrl()) + '" target="_blank" rel="noopener noreferrer">' + esc(t('x_profile', { u: xHandle() })) + ' ↗</a>' : ''; }
  function fmtDay(ms) { try { return new Date(ms).toLocaleDateString(LANG === 'es' ? 'es-MX' : 'en-US', { day: 'numeric', month: 'long' }); } catch (e) { return new Date(ms).toISOString().slice(0, 10); } }
  function dur(ms) {
    var sec = Math.max(0, Math.floor(ms / 1000)), d = Math.floor(sec / 86400), h = Math.floor(sec % 86400 / 3600), mi = Math.floor(sec % 3600 / 60), se = sec % 60, p = [];
    function two(n) { return n < 10 ? '0' + n : String(n); }
    if (d) p.push(d + ' ' + (d === 1 ? t('d_day') : t('d_days')));
    if (d || h) p.push(h + ' ' + t('d_h'));
    p.push((d || h ? two(mi) : mi) + ' ' + t('d_min'));
    p.push(two(se) + ' ' + t('d_s'));
    return p.slice(0, -1).join(', ') + t('d_and') + p[p.length - 1];
  }
  function etaLine() {
    var from = Date.parse(DATA.meta.ao3From || ''), to = Date.parse(DATA.meta.ao3To || '');
    if (isNaN(from)) return '';
    if (isNaN(to) || to < from) to = from;
    var now = Date.now();
    return now < from ? t('eta_until', { d: dur(from - now) }) : (now < to ? t('eta_window', { d: dur(to - now) }) : t('eta_past'));
  }
  function etaHtml() {
    var from = Date.parse(DATA.meta.ao3From || ''), to = Date.parse(DATA.meta.ao3To || ''), since = Date.parse(DATA.meta.ao3Since || '');
    if (isNaN(from)) return '';
    if (isNaN(to) || to < from) to = from;
    var now = Date.now();
    var range = to === from ? fmtDay(from) : t('eta_range', { a: fmtDay(from), b: fmtDay(to) });
    var line = now < from ? t('eta_until', { d: dur(from - now) }) : (now < to ? t('eta_window', { d: dur(to - now) }) : t('eta_past'));
    var bar = '';
    if (!isNaN(since) && to > since) {
      var pct = Math.max(0, Math.min(100, (now - since) / (to - since) * 100)), mark = Math.max(0, Math.min(100, (from - since) / (to - since) * 100));
      bar = '<div class="candle" role="img" aria-label="' + esc(t('eta_progress', { p: Math.round(pct) })) + '"><span class="burn" style="width:' + pct.toFixed(1) + '%"></span><span class="mark" style="left:' + mark.toFixed(1) + '%"></span></div>' +
        '<div class="candle-l"><span>' + esc(t('eta_start', { a: fmtDay(since) })) + '</span><span>' + esc(t('eta_end', { a: fmtDay(to) })) + '</span></div>';
    }
    return '<span class="eta-h">' + esc(t('eta_h')) + '</span><span class="eta-date">' + esc(range) + '</span><span class="eta-line" id="eta-line">' + esc(etaLine()) + '</span>' + bar + '<span class="eta-note">' + esc(t('eta_note')) + '</span>';
  }
  var etaTick = 0;
  setInterval(function () { etaTick++; if (etaTick % 60 === 0) { var el = document.getElementById('eta'); if (el) el.innerHTML = etaHtml(); } else { var ln = document.getElementById('eta-line'); if (ln) ln.textContent = etaLine(); } }, 1000);
  function stopgapHtml() {
    if (!ao3Down()) return '';
    var h = xHandle();
    return '<div class="alert" role="note"><b>' + esc(t('ao3_down_h')) + '</b><span>' + esc(t('ao3_down')) + (h ? ' ' + esc(t('follow_line', { u: h })) : '') + '</span>' +
      '<div class="row">' + (h ? '<a class="btn-small" href="' + esc(xUrl()) + '" target="_blank" rel="noopener noreferrer">' + esc(t('follow_btn', { u: h })) + ' ↗</a>' : '') +
      '<a href="https://otwstatus.org/" target="_blank" rel="noopener noreferrer">' + esc(t('ao3_status')) + ' ↗</a></div>' +
      (etaHtml() ? '<div class="eta" id="eta">' + etaHtml() + '</div>' : '') + '</div>';
  }
  function atUrl(l) { var m = /archiveofourown\.org\/(works|series)\/(\d+)/i.exec(l || ''); return m ? 'https://archive.ph/search/?q=' + encodeURIComponent('archiveofourown.org/' + m[1] + '/' + m[2]) : ''; }
  function fhUrl(l) { var m = /archiveofourown\.org\/works\/(\d+)/i.exec(l || ''); return m ? 'https://fichub.net/?b=1&q=' + encodeURIComponent('https://archiveofourown.org/works/' + m[1]) : ''; }
  function wbUrl(l) { var m = /archiveofourown\.org\/(works|series)\/(\d+)/i.exec(l || ''); return m ? 'https://web.archive.org/web/*/archiveofourown.org/' + m[1] + '/' + m[2] + '*' : ''; }
  function linkBtn(r) {
    var l = safeUrl(r.l); if (!l) return '';
    function a(href, label, title) { return '<a class="btn-small" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer"' + (title ? ' title="' + esc(title) + '"' : '') + '>' + esc(label) + ' ↗</a>'; }
    var w = wbUrl(l);
    if (!w) return a(l, isAo3(l) ? t('read_ao3') : t('open'));
    var fh = fhUrl(l), main = a(l, 'AO3', t('read_ao3')).replace('class="btn-small"', 'class="btn-small ao3-btn"'), copies = !ao3Down() ? a(w, 'Wayback', t('wb')) : (fh ? a(fh, 'FicHub', t('fh')) : '') + a(w, 'Wayback', t('wb')) + a(atUrl(l), 'archive.today', t('ats'));
    return '<span class="readvia"><span class="lbl">' + esc(t('read_in')) + '</span>' + main + copies + '</span>';
  }

  function hideBtn(r) { return '<button type="button" class="btn-small hide-btn" data-act="hide" data-id="' + esc(r.id) + '" aria-pressed="' + !!r.h + '" title="' + esc(r.h ? t('unhide_t') : t('hide_t')) + '">' + esc(r.h ? t('unhide') : t('hide')) + '</button>'; }
  function card(r, o) {
    o = o || {};
    var actions = '';
    if (!o.preview) {
      if (OWNER && confirmDel === r.id) {
        actions = '<span class="confirm">' + esc(t('confirm_rm')) + '</span><button type="button" class="btn-small danger" data-act="del-yes" data-id="' + esc(r.id) + '">' + esc(t('yes_rm')) + '</button><button type="button" class="btn-small" data-act="del-no">' + esc(t('no')) + '</button>';
      } else {
        actions = '<button type="button" class="btn-small" data-act="open" data-id="' + esc(r.id) + '">' + esc(t('details')) + '</button>' + bmBtn(r) + linkBtn(r) +
          (OWNER ? hideBtn(r) + '<button type="button" class="btn-small" data-act="edit" data-id="' + esc(r.id) + '">' + esc(t('edit')) + '</button><button type="button" class="btn-small danger" data-act="del" data-id="' + esc(r.id) + '">' + esc(t('remove')) + '</button>' : '');
      }
    }
    var title = titleHtml(r);
    if (!o.preview) title = '<a href="#fic-' + esc(r.id) + '">' + title + '</a>';
    var foot = stars(r.sc) + (r.d ? '<span class="inscr">' + esc(t('inscribed', { d: dateTxt(r.d) })) + '</span>' : '');
    return '<article class="folio cs-' + ((r.n | 0) % 8) + (r.h && OWNER ? ' is-hidden' : '') + '" id="rec-' + esc(r.id || 'preview') + '"' + (o.preview ? '' : ' data-open="' + esc(r.id) + '"') + '>' +
      '<div class="folio-head"><span class="folno">' + esc(t('fol')) + ' ' + roman(r.n) + '</span>' + (r.h && OWNER ? '<span class="hid-tag">' + esc(t('hid_tag')) + '</span>' : '') + headTag(r) + '</div>' +
      '<div class="folio-body"><div class="headline"><span class="initial" aria-hidden="true">' + esc(capOf(r)) + '</span><h3 class="title">' + title + '</h3>' +
      (r.a ? '<p class="byline">' + esc(t('by')) + ' ' + authorHtml(r) + '</p>' : '') + '</div>' +
      metaHtml(r) + chipsHtml(r, !o.preview) + textsHtml(r) + '</div>' +
      ((foot || actions) ? '<div class="folio-foot"><div class="foot-l">' + foot + '</div><div class="actions">' + actions + '</div></div>' : '') +
      '</article>';
  }

  function xText(r) {
    var L = rOf(r);
    var lines = ['📚 Rec: “' + (r.t || '') + '”' + (r.a ? t('x_by', { a: r.a }) : '')];
    var l2 = [fshort(r.f), r.s, t('r_' + L)].filter(Boolean).join(' · '); if (l2) lines.push(l2);
    var l3 = [lenName(r.len), stName(r.st)].filter(Boolean).join(' · '); if (l3) lines.push(l3);
    if (r.sc) lines.push('★'.repeat(r.sc));
    if (r.by) lines.push(t('x_from', { u: r.by }));
    var link = safeUrl(r.l); if (link) lines.push(link);
    return lines.join('\n');
  }
  function scrollText(d) {
    var L = RK[d.r] ? d.r : '?';
    var lines = [t('sc_head'), '“' + (d.t || t('untitled')) + '”' + (d.a ? t('x_by', { a: d.a }) : '')];
    var l = [d.f, d.s, t('r_' + L), stName(d.st), lenName(d.len)].filter(Boolean).join(' · '); if (l) lines.push(l);
    if (d.ab) lines.push(t('sc_about') + d.ab);
    if (d.w) lines.push(t('sc_why') + d.w);
    if (d.tr) lines.push(t('sc_tropes') + d.tr);
    if (d.wa) lines.push(t('sc_warn') + d.wa);
    if (d.l) lines.push(d.l);
    if (d.by) lines.push(t('sc_by', { u: d.by }));
    lines.push('#ficha:' + b64e(JSON.stringify(compact(d))));
    return lines.join('\n');
  }

  function copy(text, btn) {
    var done = function () {
      if (btn) { var o = btn.innerHTML; btn.textContent = t('copied'); btn.classList.add('ok'); setTimeout(function () { btn.innerHTML = o; btn.classList.remove('ok'); }, 1800); }
      say(t('m_copied'));
    };
    var fail = function () { showText(text); };
    try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(done, fail); return; } } catch (e) {}
    fail();
  }
  function showText(text) {
    var ov = document.createElement('div');
    ov.className = 'overlay';
    ov.innerHTML = '<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="ov-t"><h2 id="ov-t">' + esc(t('copy_h')) + '</h2><p class="sub">' + esc(t('copy_sub')) + '</p><textarea id="ov-txt" rows="9" readonly></textarea><div class="row"><button type="button" class="btn" id="ov-close">' + esc(t('done')) + '</button></div></div>';
    document.body.appendChild(ov);
    var ta = ov.querySelector('#ov-txt'); ta.value = text; ta.focus(); ta.select();
    ov.querySelector('#ov-close').addEventListener('click', function () { ov.remove(); });
  }

  /* ---------- filtros ---------- */
  function filtered() {
    var q = F.q.trim().toLowerCase();
    var list = DATA.recs.filter(function (r) {
      if (!shown(r)) return false;
      if (F.mine === 'hidden' && !r.h) return false;
      if (F.fandom && r.f !== F.fandom) return false;
      if (F.ship && r.s !== F.ship) return false;
      if (F.rating && r.r !== F.rating) return false;
      if (F.mine === 'community') { if (!r.by) return false; }
      else if (F.mine === 'vetted') { if (r.by || (r.m !== 'Read' && r.m !== 'Favorite')) return false; }
      else if (F.mine && F.mine !== 'hidden' && r.m !== F.mine) return false;
      if (F.completos && r.st !== 'Completed') return false;
      if (F.sin18 && (r.r === 'M' || r.r === 'E')) return false;
      if (F.tropes.length && !F.tropes.every(function (x) { return hasTrope(r, x); })) return false;
      if (q) { var hay = [r.t, r.a, r.f, r.s, r.tr, r.ab, r.w, r.no, r.by, r.len, lenName(r.len)].join(' ').toLowerCase(); if (hay.indexOf(q) < 0) return false; }
      return true;
    });
    return sortRecs(list, F.sort);
  }
  function sortRecs(list, how) {
    var rank = { 'Favorite': 0, 'Read': 1, 'Reading': 2, 'To read': 4, 'Dropped': 5 };
    return list.sort(function (a, b) {
      if (how === 'az') return cmp(a.t, b.t);
      if (how === 'new') return (b.d || '').localeCompare(a.d || '') || ((b.n | 0) - (a.n | 0));
      var ra = a.by ? 3 : (rank[a.m] != null ? rank[a.m] : 6), rb = b.by ? 3 : (rank[b.m] != null ? rank[b.m] : 6);
      return ra - rb || (b.sc | 0) - (a.sc | 0) || (b.d || '').localeCompare(a.d || '') || ((b.n | 0) - (a.n | 0));
    });
  }

  /* ---------- vistas ---------- */
  function renderShell() {
    document.documentElement.lang = t('htmlLang');
    var app = document.getElementById('app');
    var n = pubRecs().length;
    var tabs = '<nav class="tabs" aria-label="' + esc(t('title')) + '">' +
      tab('archivo', t('nav_lib'), '<span class="count">' + roman(n) + '</span>') +
      tab('indice', t('nav_idx'), '') +
      tab('marcadores', t('nav_bm'), '<span class="count" id="bm-count">' + (bmCount() ? roman(bmCount()) : '') + '</span>') +
      (OWNER ? tab('recomendar', t('nav_rec'), '') : '') +
      ((OWNER && cartas().length) || peekOn() ? tab('adelanto', t('nav_peek'), '<span class="count" aria-hidden="true">\u2726</span>') : '') +
      (OWNER ? tab('archivista', t('nav_scribe'), DATA.pendientes.length ? '<span class="count">' + roman(DATA.pendientes.length) + '</span>' : '') : '') +
      '</nav>';
    var palName = t('pal_' + PAL);
    var settings = '<div class="settings">' + (IS_OWNER ? '<button type="button" class="btn-small com-view" data-act="as-visitor" aria-pressed="' + AS_VISITOR + '">' + esc(AS_VISITOR ? t('cv_off') : t('cv_on')) + '</button>' : '') + xLinkSmall() +
      '<div class="seg" role="group" aria-label="' + esc(t('lang')) + '"><button type="button" data-act="lang" data-v="es" aria-pressed="' + (LANG === 'es') + '" lang="es">ES</button><button type="button" data-act="lang" data-v="en" aria-pressed="' + (LANG === 'en') + '" lang="en">EN</button></div>' +
      '<div class="palpick"><button type="button" class="pal-toggle" data-act="pal-toggle" aria-expanded="false" aria-controls="pal-menu" title="' + esc(t('palette')) + '">' +
      '<span class="swatch" id="pal-cur" aria-hidden="true" style="background:' + palBg(PAL) + '"></span><span class="sr">' + esc(t('palette')) + ': </span><span class="pal-name" id="pal-name">' + esc(palName) + '</span><span class="chev" aria-hidden="true"></span></button>' +
      '<div class="pal-menu" id="pal-menu" role="group" aria-label="' + esc(t('palette')) + '">' + PALETTES.map(function (p) {
        return '<button type="button" class="pal-opt" data-act="pal" data-v="' + p[0] + '" aria-pressed="' + (PAL === p[0]) + '"><span class="swatch" aria-hidden="true" style="background:' + p[1] + '"></span>' + esc(t('pal_' + p[0])) + '</button>';
      }).join('') + '</div></div></div>';
    var title = t('title');
    if (!document.getElementById('shell-top')) {
      app.innerHTML = '<div class="wrap"><div id="shell-top"></div><div class="hero-grid" id="hero-grid"><div id="shell-hero"></div><div id="meme-root"></div></div><div id="shell-rest"></div></div><div id="shell-over"></div>';
      memeKey = null;
    }
    document.getElementById('shell-top').innerHTML = '<div class="top"><p class="eyebrow">' + esc(eyebrowTxt()) + '</p>' + settings + '</div>';
    document.getElementById('shell-hero').innerHTML = '<header class="hero"><h1><span class="cap">' + esc(title.charAt(0)) + '</span>' + esc(title.slice(1)) + '</h1>' +
      '<p class="lede">' + esc(t('lede')) + '</p></header>';
    document.getElementById('shell-rest').innerHTML = '<div class="hero hero-tail">' + stopgapHtml() + peekLinkHtml() + '<p class="fleuron" aria-hidden="true">❦</p></div>' +
      tabs + '<main class="panel" id="panel"></main><div id="savebar"></div><p class="sr" aria-live="polite" id="live"></p>' +
      '<footer class="site-foot">' + ghFootHtml() + '</footer>';
    document.getElementById('shell-over').innerHTML = cvBannerHtml() + ghDialogHtml();
    renderMeme();
    renderView();
    renderDetail();
  }
  // a post from X embedded under the greeting; it's only rebuilt when the post, the theme or the language changes
  var memeKey = null, xLoading = false;
  function memeId(u) { var m = /^https?:\/\/(?:www\.|mobile\.)?(?:x|twitter)\.com\/[^\/?#]+\/status\/(\d+)/i.exec(String(u || '').trim()); return m ? m[1] : ''; }
  function parseMeme(v) {
    v = String(v || '').trim();
    if (/<blockquote/i.test(v)) {
      var doc = new DOMParser().parseFromString(v, 'text/html'), bq = doc.querySelector('blockquote');
      if (!bq) return null;
      var st = [].slice.call(bq.querySelectorAll('a[href]')).filter(function (a) { return memeId(a.getAttribute('href')); }).pop();
      if (!st) return null;
      var p = bq.querySelector('p'), txt = (p ? p.textContent : '').replace(/\s*(https?:\/\/t\.co\/\S+|pic\.(twitter|x)\.com\/\S+)/g, ' ').replace(/\s+/g, ' ').trim();
      var whole = bq.textContent.replace(/\s+/g, ' ').trim(), dash = whole.lastIndexOf('\u2014'), date = st.textContent.replace(/\s+/g, ' ').trim();
      var by = dash >= 0 ? whole.slice(dash + 1).replace(date, '').trim() : '';
      return { url: st.getAttribute('href').split(/[?#]/)[0], text: txt.slice(0, 500), by: by.slice(0, 120), date: date.slice(0, 40), lang: ((p && p.getAttribute('lang')) || '').slice(0, 8) };
    }
    var u = v.split(/[?#]/)[0];
    return memeId(u) ? { url: u, text: '', by: '', date: '', lang: '' } : null;
  }
  function renderMeme() {
    var root = document.getElementById('meme-root'); if (!root) return;
    var M = DATA.meta, id = memeId(M.meme), dark = /dark/.test(getComputedStyle(document.documentElement).colorScheme || ''),
      key = id ? [id, dark ? 'd' : 'l', LANG, M.memeText || '', M.memeBy || ''].join('|') : '';
    var grid = document.getElementById('hero-grid'); if (grid) grid.classList.toggle('has-meme', !!id);
    if (key === memeKey) return;
    memeKey = key;
    if (!id) { root.innerHTML = ''; return; }
    root.innerHTML = '<figure class="meme"><div class="meme-frame"><blockquote class="twitter-tweet" data-dnt="true" data-align="center" data-theme="' + (dark ? 'dark' : 'light') + '" data-lang="' + esc(LANG) + '">' +
      (M.memeText ? '<p lang="' + esc(M.memeLang || 'en') + '" dir="auto">' + esc(M.memeText) + '</p>' : '') +
      (M.memeBy ? '<span class="meme-by">\u2014 ' + esc(M.memeBy) + '</span> ' : '') +
      '<a href="' + esc(safeUrl(M.meme) || ('https://x.com/i/status/' + id)) + '">' + esc(M.memeDate || t('meme_open')) + ' ↗</a></blockquote></div></figure>';
    if (window.twttr && window.twttr.widgets) { window.twttr.widgets.load(root); return; }
    if (xLoading) return;
    xLoading = true;
    var sc = document.createElement('script'); sc.src = 'https://platform.x.com/widgets.js'; sc.async = true; sc.charset = 'utf-8';
    sc.onerror = function () { xLoading = false; };
    document.head.appendChild(sc);
  }
  function tab(id, label, extra) { return '<a class="tab" href="#' + id + '"' + (view === id ? ' aria-current="page"' : '') + '>' + esc(label) + extra + '</a>'; }
  function renderView() {
    if (view === 'recomendar') renderRecomendar();
    else if (view === 'indice') renderIndice();
    else if (view === 'marcadores') renderMarcadores();
    else if (view === 'archivista' && OWNER) renderArchivista();
    else if (view === 'adelanto' && (OWNER || peekOn())) renderAdelanto();
    else { view = 'archivo'; renderArchivo(); }
    updateSaveBar();
  }

  function peekLinkHtml() {
    if (!peekOn()) return '';
    // already on the sneak peek tab: the link keeps its space (so the tabs don't jump) but isn't shown
    var here = view === 'adelanto';
    return '<a class="teaser-link' + (here ? ' is-here" aria-hidden="true" tabindex="-1' : '') + '" href="#adelanto"><span class="st" aria-hidden="true">✦</span>' + esc(t('pk_teaser', { f: peekFic() })) + ' <span aria-hidden="true">→</span></a>';
  }
  function proseHtml(txt) {
    // a small, safe subset of Markdown: every line is a paragraph, *italics*, **bold**, --- for a horizontal line, # for a subheading
    function inline(x) {
      x = esc(x.replace(/\\\*/g, '\u0001').replace(/\\([\\`_{}\[\]()#+\-.!>~|"'])/g, '$1'));
      x = x.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
      return x.replace(/\u0001/g, '*');
    }
    return String(txt || '').replace(/\r\n?/g, '\n').split(/\n+/).map(function (b) {
      b = b.trim();
      if (!b) return '';
      if (/^(-{3,}|\*{3,}|(\* ){2,}\*|_{3,}|[—–⸻]{2,})$/.test(b)) return '<hr class="scene-rule">';
      if (/^#{1,6}\s/.test(b)) return '<h3>' + inline(b.replace(/^#{1,6}\s+/, '').replace(/^\*\*(.*)\*\*$/, '$1')) + '</h3>';
      return '<p>' + inline(b) + '</p>';
    }).join('');
  }
  function peekExcerpt(txt, n) {
    var w = String(txt || '').replace(/\*\*[^*]*\*\*\s*/g, '').replace(/[*_#]/g, '').replace(/^-{3,}$/gm, '').split(/\s+/).filter(Boolean);
    return w.slice(0, n).join(' ') + (w.length > n ? '…' : '');
  }
  function scribbleSvg(seed) {
    // illegible handwriting: rows of looped strokes, a red flourish for the initial and a signature
    var n = (seed || 1) * 7919 % 233280;
    function rnd() { n = (n * 9301 + 49297) % 233280; return n / 233280; }
    function f(v) { return Math.round(v * 10) / 10; }
    var W = 216, rows = '', y = 20, L = 9;
    for (var li = 0; li < L; li++) {
      var d = '', x = li < 2 ? 34 : 6 + (li === 2 ? 0 : rnd() * 3), end = li === L - 1 ? 70 + rnd() * 50 : W - 4 - rnd() * 8;
      while (x < end - 10) {
        var k = 2 + Math.floor(rnd() * 6), base = y + (rnd() - .5) * 1.2;
        d += 'M' + f(x) + ' ' + f(base);
        for (var i = 0; i < k && x < end - 4; i++) {
          var w = 3.3 + rnd() * 2.3, r = rnd(), h = r < .2 ? 7.2 + rnd() * 2 : 2.8 + rnd() * 1.6;
          if (r > .93) d += 'C' + f(x + w * .5) + ' ' + f(base) + ' ' + f(x + w * .85) + ' ' + f(base + 6) + ' ' + f(x + w * .45) + ' ' + f(base + 6) +
            'C' + f(x + w * .05) + ' ' + f(base + 6) + ' ' + f(x + w * .45) + ' ' + f(base) + ' ' + f(x + w) + ' ' + f(base);
          else d += 'C' + f(x + w * .55) + ' ' + f(base - h * .15) + ' ' + f(x + w * 1.05) + ' ' + f(base - h) + ' ' + f(x + w * .62) + ' ' + f(base - h) +
            'C' + f(x + w * .22) + ' ' + f(base - h) + ' ' + f(x + w * .3) + ' ' + f(base) + ' ' + f(x + w) + ' ' + f(base);
          x += w;
        }
        x += 4 + rnd() * 4;
      }
      rows += '<path transform="translate(0 ' + y + ') skewX(-14) translate(0 -' + y + ')" d="' + d + '"/>';
      y += 13.2;
    }
    return '<svg viewBox="0 0 220 150" preserveAspectRatio="xMidYMin meet" aria-hidden="true">' +
      '<path class="ini" d="M10 37C13 27 20 9 27 6C31 4 31 10 27 14C22 19 14 22 9 21M17 15C15 24 13 31 11 36C10 39 14 40 18 36M21 25C24 23 27 24 28 26"/>' +
      '<g class="ink">' + rows + '</g>' +
      '<path class="ink sig" d="M140 ' + f(y + 6) + 'C146 ' + f(y - 2) + ' 150 ' + f(y + 8) + ' 156 ' + f(y + 2) + 'C160 ' + f(y - 6) + ' 162 ' + f(y + 10) + ' 168 ' + f(y + 3) + 'C174 ' + f(y - 3) + ' 178 ' + f(y + 6) + ' 196 ' + f(y + 2) + '"/></svg>';
  }
  function envelopeHtml(mark, seed) {
    var b = '<b>' + esc(mark) + '</b>';
    return '<div class="envelope" aria-hidden="true"><div class="env-back"></div><div class="paper">' + scribbleSvg(seed) + '</div><div class="env-front"></div>' +
      '<div class="flap-wrap"><div class="flap-sh"><div class="flap"></div></div><span class="hi-sh"><span class="wax half hi"><i></i>' + b + '</span></span></div>' +
      '<div class="cord"></div><div class="seal"><span class="wax whole"><i></i>' + b + '</span><span class="wax half lo edge"><i></i>' + b + '</span><span class="wax half lo"><i></i>' + b + '</span>' +
      '<i class="crumb c1"></i><i class="crumb c2"></i><i class="crumb c3"></i></div></div>';
  }
  function peekVeil(A, txt) {
    // the first two sentences in the clear, then a few blurred lines that fade into the dark
    var plain = String(txt == null ? A.texto || '' : txt).replace(/\*\*?/g, '').replace(/^-{3,}$/gm, '').replace(/\s+/g, ' ').trim();
    var sents = plain.match(/[^.!?…]+[.!?…]+["”’']?\s*/g) || [plain];
    var clear = sents.slice(0, 2).join('').trim(), rest = plain.slice(clear.length).trim().split(' ').slice(0, 46).join(' ');
    return '<div class="peek-ex mystery"' + (A.lang ? ' lang="' + esc(A.lang) + '"' : '') + '><p>' + esc(clear) + '</p>' + (rest ? '<p class="veiled" aria-hidden="true">' + esc(rest) + '</p>' : '') + '</div>';
  }
  function peekFacts(datos) {
    var rows = String(datos || '').split(/\n+/).map(function (l) { return l.trim(); }).filter(Boolean).map(function (l) {
      var i = l.indexOf(':');
      return '<div><dt>' + esc(i > 0 ? l.slice(0, i).trim() : '') + '</dt><dd>' + esc(i > 0 ? l.slice(i + 1).trim() : l) + '</dd></div>';
    }).join('');
    return rows ? '<dl class="meta peek-facts">' + rows + '</dl>' : '';
  }
  function capTitle(x) { var sp = splitTitle(x); return '<span class="initial" aria-hidden="true">' + esc(sp.cap) + '</span><h3 class="title"><span class="sr">' + esc(x) + '</span><span aria-hidden="true">' + esc(sp.rest) + '</span></h3>'; }
  /* ---------- cartas del sneak peek: cada una se edita por separado; los capítulos crecen por fragmentos ---------- */
  var CTYPES = ['capitulo', 'perfil', 'mundo'];
  function cuid(p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function cartas() { return DATA.cartas || (DATA.cartas = []); }
  function cartaById(id) { return cartas().filter(function (c) { return c.id === id; })[0] || null; }
  function visFrags(c) { return (c.frags || []).filter(function (f) { return f.on !== false && String(f.texto || '').trim(); }); }
  function cartaVisible(c) { return !!(c && c.on && (c.tipo === 'capitulo' ? visFrags(c).length : String(c.texto || '').trim())); }
  function cartaHasContent(c) { return c.tipo === 'capitulo' ? (c.frags || []).some(function (f) { return String(f.texto || '').trim(); }) : !!String(c.texto || '').trim(); }
  function shownCartas() { return cartas().filter(function (c) { return OWNER ? true : cartaVisible(c); }); }
  function peekOn() { return cartas().some(cartaVisible); }
  function peekFic() { var c = cartas().filter(cartaVisible)[0] || cartas()[0]; return (c && c.fic) || 'Medieval MiChaeng'; }
  function capLabel(c) { var es = (c.lang || LANG) === 'es'; return (c.cap ? (es ? 'Capítulo ' : 'Chapter ') + c.cap : '') + (c.titulo ? (c.cap ? ' — ' : '') + '“' + c.titulo + '”' : ''); }
  function cartaTitle(c) { return c.tipo === 'capitulo' ? capLabel(c) || t('pk_t_capitulo') : (c.titulo || t('pk_t_' + c.tipo)); }
  function sealMark(c) {
    if (c.tipo === 'capitulo') return c.cap ? roman(+c.cap) : '✦';
    var w = String(c.titulo || '').trim().split(/\s+/);
    return ((c.tipo === 'perfil' ? w.pop() : w[0]) || '✦').charAt(0).toUpperCase() || '✦';
  }
  var OPENED = loadJSON('archivo-fanfics-cartas', {});
  function letterKey(c) { if (c.tipo !== 'capitulo') return c.id; var vf = visFrags(c), last = vf[vf.length - 1]; return c.id + ':' + (last ? last.id : ''); }
  function readOlder(c) { var k = letterKey(c), pre = c.id + ':'; return c.tipo === 'capitulo' && !OPENED[k] && Object.keys(OPENED).some(function (x) { return x !== k && x.indexOf(pre) === 0; }); }
  function letterAttrs(c) {
    var key = letterKey(c), href = '#adelanto/' + encodeURIComponent(c.id);
    if (OPENED[key]) return ' letter opened" href="' + href + '"';
    var vf = visFrags(c), jump = readOlder(c) && vf.length > 1 ? vf[vf.length - 1].id : '';
    return ' letter" href="' + href + '" data-act="break-seal" data-seal="' + esc(key) + '"' + (jump ? ' data-jump="' + esc(jump) + '"' : '');
  }
  var peekType = '', peekCap = '', peekJump = '';
  function migrateAdelanto(d) {
    // the old single sneak peek (one chapter + one profile) becomes two letters
    var A = d.adelanto; delete d.adelanto;
    if (Array.isArray(d.cartas) || !A || typeof A !== 'object') return;
    d.cartas = [];
    if (String(A.texto || '').trim()) {
      var m = /\d+/.exec(A.cap || ''), tit = String(A.cap || '').replace(/^\s*(chapter|cap[ií]tulo|cap\.?|ch\.?)\s*\d+\s*[—–:\-.]?\s*/i, '').replace(/^[“"']+|[”"']+$/g, '').trim();
      d.cartas.push({ id: 'c-cap' + (m ? m[0] : ''), tipo: 'capitulo', on: !!A.on, fic: A.fic || 'Medieval MiChaeng', cap: m ? +m[0] : '', titulo: tit, lang: A.lang === 'es' ? 'es' : 'en',
        borrador: !!A.borrador, link: A.link || '', nota: A.nota || '', fin: false, frags: [{ id: 'f1', on: true, fecha: '', texto: A.texto }] });
    }
    var P = A.perfil || {};
    if (String(P.texto || '').trim()) d.cartas.push({ id: 'c-perfil-' + String(P.nombre || 'perfil').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), tipo: 'perfil', on: !!P.on,
      fic: A.fic || 'Medieval MiChaeng', cap: '', titulo: P.nombre || '', sub: P.titulo || '', datos: P.datos || '', texto: P.texto, lang: A.lang === 'es' ? 'es' : 'en' });
  }
  function renderAdelanto() {
    var p = document.getElementById('panel'), all = shownCartas();
    var cur = peekItem ? cartaById(peekItem) : null;
    if (cur && (OWNER || cartaVisible(cur))) {
      var note = OWNER && !cartaVisible(cur) ? '<p class="peek-owner">' + esc(t('pk_hidden_one')) + ' <a href="#archivista">' + esc(t('pk_edit')) + '</a></p>' : '';
      return cur.tipo === 'capitulo' ? renderPeekChapter(p, cur, note) : renderPeekProfile(p, cur, note);
    }
    // the newest chapter first, then everything else by chapter
    var order = { capitulo: 0, perfil: 1, mundo: 2 };
    all = all.slice().sort(function (a, b) { return (+b.cap || 0) - (+a.cap || 0) || order[a.tipo] - order[b.tipo]; });
    var types = CTYPES.filter(function (x) { return all.some(function (c) { return c.tipo === x; }); });
    var caps = all.map(function (c) { return +c.cap || 0; }).filter(function (n, i, a) { return n && a.indexOf(n) === i; }).sort(function (a, b) { return a - b; });
    if (peekType && types.indexOf(peekType) < 0) peekType = '';
    if (peekCap && caps.indexOf(+peekCap) < 0) peekCap = '';
    function chip(act, v, label, on) { return '<button type="button" class="chip" data-act="' + act + '" data-v="' + esc(v) + '" aria-pressed="' + on + '">' + esc(label) + '</button>'; }
    var filters = '';
    if (types.length > 1) filters += '<div class="chips" role="group" aria-label="' + esc(t('pk_f_type')) + '">' + chip('pk-type', '', t('pk_f_all'), !peekType) + types.map(function (x) { return chip('pk-type', x, t('pk_tp_' + x), peekType === x); }).join('') + '</div>';
    if (caps.length > 1) filters += '<div class="chips" role="group" aria-label="' + esc(t('pk_f_capl')) + '">' + chip('pk-cap', '', t('pk_f_allcaps'), !peekCap) + caps.map(function (n) { return chip('pk-cap', String(n), t('pk_f_cap', { n: roman(n) }), +peekCap === n); }).join('') + '</div>';
    var list = all.filter(function (c) { return (!peekType || c.tipo === peekType) && (!peekCap || +c.cap === +peekCap); });
    var tag = '<span class="hid-tag">' + esc(t('hid_tag')) + '</span>';
    var cards = list.map(function (c, i) {
      var hidden = !cartaVisible(c), vf = visFrags(c), fresh = readOlder(c);
      var head = c.tipo === 'capitulo' ? t('pk_t_capitulo') + (c.cap ? ' ' + roman(+c.cap) : '') : t('pk_t_' + c.tipo);
      var side = c.tipo !== 'capitulo' && c.cap ? t('pk_f_cap', { n: roman(+c.cap) }) : (c.fic || '');
      var title = c.tipo === 'capitulo' ? (c.titulo || capLabel(c)) : c.titulo;
      var sub = c.tipo === 'capitulo' ? (vf.length > 1 ? t('pk_frags_n', { n: vf.length }) : '') : (c.sub || '');
      return '<a class="folio peek-card cs-' + (c.tipo === 'capitulo' ? 3 : c.tipo === 'perfil' ? 6 : 4) + (hidden ? ' is-hidden' : '') + letterAttrs(c) + '>' +
        (fresh ? '<span class="new-frag">' + esc(t('pk_new_frag')) + '</span>' : '') +
        '<div class="folio-head"><span class="folno">' + esc(head) + '</span><span class="mine">' + esc(side) + '</span></div>' +
        envelopeHtml(sealMark(c), (i + 3) * 7) +
        '<div class="folio-body"><h3 class="letter-title">' + esc(title || '') + '</h3>' + (sub ? '<p class="letter-sub">' + esc(sub) + '</p>' : '') + '</div>' +
        '<div class="folio-foot"><div class="foot-l">' + (c.tipo === 'capitulo' && c.borrador ? '<span class="inscr">' + esc(t('pk_draft_short')) + '</span>' : '') + (hidden ? tag : '') + '</div>' +
        '<div class="actions"><span class="btn-small">' + esc(t(OPENED[letterKey(c)] ? 'pk_again' : 'pk_read')) + ' →</span></div></div></a>';
    }).join('');
    var fics = all.map(function (c) { return c.fic; }).filter(function (f, i, a) { return f && a.indexOf(f) === i; });
    p.innerHTML = '<div class="peek-intro"><h2>' + esc(t('nav_peek')) + (fics.length === 1 ? ' · ' + esc(fics[0]) : '') + '</h2></div>' +
      (filters ? '<div class="peek-filters">' + filters + '</div>' : '') +
      (cards ? '<div class="grid peek-grid">' + cards + '</div>' : '<p class="empty">' + esc(t('pk_none')) + '</p>');
  }
  function readerEnd(c, me, link, full) {
    return '<div class="row">' + (link ? '<a class="btn-ghost" href="' + esc(link) + '" target="_blank" rel="noopener noreferrer">' + esc(t(full ? 'pk_full' : 'pk_prev')) + ' ↗</a>' : '') +
      '</div>' + (me ? '<p class="reader-x">' + esc(t('pk_x')) + ' <a href="https://x.com/' + esc(me) + '" target="_blank" rel="noopener noreferrer">@' + esc(me) + '</a></p>' : '') +
      '<a class="back-link" href="#adelanto">← ' + esc(t('pk_back')) + '</a>';
  }
  function fragDate(d) { var x = /^(\d{4})-(\d{2})-(\d{2})/.exec(d || ''); return x ? fmtDay(new Date(+x[1], +x[2] - 1, +x[3]).getTime()) : ''; }
  function renderPeekChapter(p, c, hidden) {
    var me = xHandle(), link = safeUrl(c.link), frs = OWNER ? (c.frags || []).filter(function (f) { return String(f.texto || '').trim(); }) : visFrags(c);
    var otherLang = c.lang && c.lang !== LANG ? t(c.lang === 'en' ? 'pk_in_en' : 'pk_in_es') : '';
    var many = frs.length > 1;
    var idx = many ? '<nav class="frag-index" aria-label="' + esc(t('fr_h')) + '">' + frs.map(function (f, i) {
      return '<button type="button" class="chip" data-act="pk-frag" data-v="' + esc(f.id) + '">' + esc(t('pk_frag', { n: roman(i + 1) })) + '</button>';
    }).join('') + '</nav>' : '';
    var body = frs.map(function (f, i) {
      var d = fragDate(f.fecha), off = f.on === false;
      return (many ? '<div class="frag-head" id="frag-' + esc(f.id) + '"><span>' + esc(t('pk_frag', { n: roman(i + 1) })) + (d ? ' · ' + esc(d) : '') + '</span>' + (off ? ' <span class="hid-tag">' + esc(t('hid_tag')) + '</span>' : '') + '</div>' : '') +
        '<div class="reader-body' + (off ? ' is-hidden' : '') + '"' + (c.lang ? ' lang="' + esc(c.lang) + '"' : '') + '>' + proseHtml(f.texto) + '</div>';
    }).join('<p class="fleuron frag-sep" aria-hidden="true">❦</p>');
    p.innerHTML = hidden + '<div id="read-prog" aria-hidden="true"></div>' +
      '<article class="reader" aria-labelledby="pk-title"><a class="back-link top" href="#adelanto">← ' + esc(t('pk_back')) + '</a>' +
        '<header class="reader-head"><p class="reader-kicker">' + esc(t('pk_kicker')) + (c.fic ? ' · ' + esc(c.fic) : '') + '</p>' +
          '<h2 class="reader-title" id="pk-title">' + esc(capLabel(c)) + '</h2>' +
          '<p class="reader-hello">' + esc(t('pk_hello')) + '</p>' + (otherLang ? '<p class="reader-meta">' + esc(otherLang) + '</p>' : '') +
          (c.borrador ? '<p class="draft-tag">' + esc(t('pk_draft')) + '</p>' : '') + idx +
          '<p class="fleuron" aria-hidden="true">❦</p></header>' + body +
        '<footer class="reader-end"><p class="fleuron" aria-hidden="true">❦</p>' + (c.fin ? '' : '<p class="more">' + esc(t('pk_more')) + '</p>') +
          (c.nota ? '<div class="reader-note"><b>' + esc(t('pk_note_by')) + '</b><p>' + esc(c.nota) + '</p></div>' : '') + readerEnd(c, me, link, c.fin) + '</footer>' +
      '</article>';
    readProgress();
  }
  function jumpToFrag() {
    if (!peekJump) return;
    var el = document.getElementById('frag-' + peekJump); peekJump = '';
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 24);
  }
  function renderPeekProfile(p, c, hidden) {
    var me = xHandle(), link = safeUrl(c.link);
    p.innerHTML = hidden + '<div id="read-prog" aria-hidden="true"></div>' +
      '<article class="reader reader-profile" aria-labelledby="pk-title"><a class="back-link top" href="#adelanto">← ' + esc(t('pk_back')) + '</a>' +
        '<header class="reader-head"><p class="reader-kicker">' + esc(t('pk_t_' + c.tipo)) + (c.cap ? ' · ' + esc(t('pk_f_cap', { n: roman(+c.cap) })) : '') + (c.fic ? ' · ' + esc(c.fic) : '') + '</p>' +
          '<h2 class="reader-title" id="pk-title">' + esc(c.titulo || '') + '</h2>' +
          (c.sub ? '<p class="reader-hello">' + esc(c.sub) + '</p>' : '') +
          '<p class="fleuron" aria-hidden="true">❦</p></header>' +
        peekFacts(c.datos) +
        '<div class="reader-body"' + (c.lang ? ' lang="' + esc(c.lang) + '"' : '') + '>' + proseHtml(c.texto) + '</div>' +
        '<footer class="reader-end"><p class="fleuron" aria-hidden="true">❦</p>' + readerEnd(c, me, link) + '</footer>' +
      '</article>';
    readProgress();
  }
  function readProgress() {
    var bar = document.getElementById('read-prog'), art = document.querySelector('.reader');
    if (!bar || !art) return;
    var r = art.getBoundingClientRect(), total = Math.max(1, r.height - window.innerHeight * .6);
    bar.style.transform = 'scaleX(' + Math.max(0, Math.min(1, (window.innerHeight * .4 - r.top) / total)) + ')';
  }
  window.addEventListener('scroll', function () { if (view === 'adelanto') readProgress(); }, { passive: true });

  function contribHtml() {
    var me = xHandle(), counts = {};
    pubRecs().forEach(function (r) { var h = r.by || me; if (h) counts[h] = (counts[h] || 0) + 1; });
    var hs = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a] || cmp(a, b); });
    if (!hs.length || (hs.length === 1 && hs[0] === me)) return '';
    return '<section class="autoras" aria-labelledby="con-h"><h2 id="con-h">' + esc(t('contrib_h')) + '</h2><p class="sub">' + esc(t('contrib_sub')) + '</p><ul>' +
      hs.map(function (h) { return '<li><a href="https://x.com/' + esc(h) + '" target="_blank" rel="noopener noreferrer">@' + esc(h) + ' \u2197</a><span>' + esc((counts[h] === 1 ? t('recs_1') : t('recs_n', { n: counts[h] })) + (h === me ? ' \u00b7 ' + t('archivist') : '')) + '</span></li>'; }).join('') + '</ul></section>';
  }
  function renderArchivo() {
    var p = document.getElementById('panel');
    var mineOpts = [['', t('l_all')], ['Favorite', t('l_fav')], ['vetted', t('l_vetted')], ['community', t('l_comm')]].concat(OWNER ? [['hidden', t('l_hidden')]] : []);
    var ratingOpts = ['G', 'T', 'M', 'E'].map(function (x) { return [x, t('r_' + x)]; });
    var aut = DATA.autoras.length ? '<section class="autoras" aria-labelledby="aut-h"><h2 id="aut-h">' + esc(t('authors_h')) + '</h2><p class="sub">' + esc(t('authors_sub')) + '</p><ul>' +
      DATA.autoras.map(function (a) { var l = safeUrl(a.l); return '<li>' + (l ? '<a href="' + esc(l) + '" target="_blank" rel="noopener noreferrer">' + esc(a.a) + ' ↗</a>' : '<b>' + esc(a.a) + '</b>') + '<span>' + esc([fshort(a.f), a.works ? t('fics_n', { n: a.works }) : ''].filter(Boolean).join(' · ')) + '</span></li>'; }).join('') + '</ul></section>' : '';
    p.innerHTML =
      '<p class="notice"><span class="seal r-e"><b>E</b></span><span>' + esc(t('notice')) + '</span></p>' +
      '<div class="searchbar" role="search">' +
        '<div class="field grow"><label for="q">' + esc(t('search')) + '</label><input type="search" id="q" placeholder="' + esc(t('search_ph')) + '" value="' + esc(F.q) + '"></div>' +
        '<button type="button" class="btn-ghost filters-btn" data-act="filters" aria-expanded="' + filtersOpen + '" aria-controls="filters-panel">' + esc(t('filters')) + '<span class="fcount" id="fcount">' + (activeCount() || '') + '</span><span aria-hidden="true" id="farrow">' + (filtersOpen ? '\u25b4' : '\u25be') + '</span></button>' +
      '</div>' +
      '<div class="active-filters" id="active-filters"></div>' +
      '<div class="filters" id="filters-panel"' + (filtersOpen ? '' : ' hidden') + '><div class="toolbar">' +
        '<div class="field"><label for="f-fandom">' + esc(t('fandom')) + '</label><select id="f-fandom">' + opts(uniq('f').map(function (f) { return [f, fshort(f)]; }), F.fandom, t('all_m')) + '</select></div>' +
        '<div class="field"><label for="f-ship">' + esc(t('ship')) + '</label><select id="f-ship">' + opts(uniq('s'), F.ship, t('all_m')) + '</select></div>' +
        '<div class="field"><label for="f-rating">' + esc(t('rating')) + '</label><select id="f-rating">' + opts(ratingOpts, F.rating, t('all_f')) + '</select></div>' +
        '<div class="field"><label for="f-mine">' + esc(t('selection')) + '</label><select id="f-mine">' + opts(mineOpts, F.mine, null) + '</select></div>' +
        '<div class="field"><label for="f-sort">' + esc(t('sort')) + '</label><select id="f-sort">' + opts([['fav', t('s_fav')], ['new', t('s_new')], ['az', t('s_az')]], F.sort, null) + '</select></div>' +
        '<label class="check"><input type="checkbox" id="f-completos"' + (F.completos ? ' checked' : '') + '>' + esc(t('only_complete')) + '</label>' +
        '<label class="check"><input type="checkbox" id="f-sin18"' + (F.sin18 ? ' checked' : '') + '>' + esc(t('hide18')) + '</label>' +
      '</div><div class="trope-filter" id="trope-filter"></div></div>' +
      '<div class="results-head"><p id="count" class="sc"></p><button type="button" class="btn-ghost" data-act="random">❦ ' + esc(t('surprise')) + '</button></div>' +
      '<div id="results" class="grid"></div>' + aut + contribHtml();
    renderResults();
  }
  function renderFilterBits() {
    var fc = document.getElementById('fcount'); if (fc) fc.textContent = activeCount() || '';
    var tf = document.getElementById('trope-filter');
    if (tf) {
      var all = allTropes();
      F.tropes.forEach(function (x) { if (!all.some(function (y) { return y.toLowerCase() === x.toLowerCase(); })) all.push(x); });
      tf.innerHTML = '<span class="lbl">' + esc(t('tropes_h')) + '</span>' + (all.length ? '<div class="chips">' + all.map(function (x) { return '<button type="button" class="chip" data-act="ftrope" data-v="' + esc(x) + '" aria-pressed="' + troped(x) + '">' + esc(x) + '</button>'; }).join('') + '</div><span class="hint">' + esc(t('tropes_sub')) + '</span>' : '<span class="hint">' + esc(t('no_tropes')) + '</span>');
    }
    var af = document.getElementById('active-filters');
    if (af) {
      var chips = [];
      function ch(k, v, label) { chips.push('<button type="button" class="chip x" data-act="unfilter" data-k="' + k + '" data-v="' + esc(v) + '" aria-label="' + esc(t('remove_tag', { x: label })) + '">' + esc(label) + '</button>'); }
      if (F.fandom) ch('fandom', F.fandom, t('fandom') + ': ' + fshort(F.fandom));
      if (F.ship) ch('ship', F.ship, t('ship') + ': ' + F.ship);
      if (F.rating) ch('rating', F.rating, t('rating') + ': ' + t('r_' + F.rating));
      if (F.mine) ch('mine', F.mine, t('selection') + ': ' + ({ Favorite: t('l_fav'), vetted: t('l_vetted'), community: t('l_comm'), hidden: t('l_hidden') }[F.mine] || F.mine));
      if (F.completos) ch('completos', '', t('only_complete'));
      if (F.sin18) ch('sin18', '', t('hide18'));
      F.tropes.forEach(function (x) { ch('trope', x, x); });
      af.innerHTML = chips.length ? chips.join('') + '<button type="button" class="btn-small" data-act="clear">' + esc(t('clear_all')) + '</button>' : '';
    }
  }
  function renderResults() {
    renderFilterBits();
    var list = filtered();
    var c = document.getElementById('count');
    var total = seenRecs().length;
    if (c) c.textContent = t('showing', { a: list.length, b: total });
    var g = document.getElementById('results');
    if (!g) return;
    g.innerHTML = list.length ? list.map(function (r) { return card(r); }).join('') :
      '<div class="empty"><p class="fleuron" aria-hidden="true">❦</p><p>' + esc(total ? t('no_results') : t('empty_lib')) + '</p>' + (total ? '<button type="button" class="btn-ghost" data-act="clear">' + esc(t('clear')) + '</button>' : '') + '</div>';
  }

  function renderIndice() {
    var p = document.getElementById('panel');
    var key = { ship: 's', fandom: 'f', author: 'a' }[groupBy];
    var list = sortRecs(seenRecs(), 'az');
    var rows = '';
    if (key) {
      var groups = {};
      list.forEach(function (r) { var g = r[key] || ''; (groups[g] = groups[g] || []).push(r); });
      Object.keys(groups).sort(function (a, b) { if (!a) return 1; if (!b) return -1; return cmp(a, b); }).forEach(function (g) {
        var label = g ? (key === 'f' ? fshort(g) : g) : t('no_value');
        rows += '<tr class="group"><td colspan="6">' + esc(label) + '<span class="n">' + roman(groups[g].length) + '</span></td></tr>' + groups[g].map(idxRow).join('');
      });
    } else rows = list.map(idxRow).join('');
    p.innerHTML = '<div class="results-head"><div><h2>' + esc(t('idx_h')) + '</h2><p class="sub" style="margin:0">' + esc(t('idx_sub')) + '</p></div>' +
      '<div class="field"><label for="g-by">' + esc(t('group')) + '</label><select id="g-by">' + opts([['ship', t('g_ship')], ['fandom', t('g_fandom')], ['author', t('g_author')], ['az', t('g_az')]], groupBy, null) + '</select></div></div>' +
      '<div class="idx-wrap"><table class="idx"><thead><tr><th>' + esc(t('fol')) + '</th><th>' + esc(t('col_title')) + '</th><th>' + esc(t('col_author')) + '</th><th>' + esc(t('rating')) + '</th><th>' + esc(t('m_len')) + '</th><th>' + esc(t('m_status')) + '</th></tr></thead><tbody>' + rows + '</tbody></table></div>';
  }
  function idxRow(r) {
    return '<tr' + (r.h ? ' class="is-hidden"' : '') + '><td class="num">' + roman(r.n) + '</td><td class="t"><button type="button" data-act="open" data-id="' + esc(r.id) + '">' + esc(r.t || t('untitled')) + '</button>' + (r.h ? ' <span class="hid-tag">' + esc(t('hid_tag')) + '</span>' : '') + '</td><td>' + authorHtml(r) + '</td><td>' + sealHtml(r, true) + '</td><td>' + esc(lenName(r.len)) + '</td><td>' + esc(stName(r.st)) + '</td></tr>';
  }

  function renderMarcadores() {
    var p = document.getElementById('panel');
    var list = BM.map(byId).filter(shown);
    p.innerHTML = '<div><h2>' + esc(t('bm_h')) + '</h2><p class="sub">' + esc(t('bm_sub')) + '</p></div>' +
      '<div class="grid">' + (list.length ? list.map(function (r) { return card(r); }).join('') : '<div class="empty"><p class="fleuron" aria-hidden="true">❦</p><p>' + esc(t('bm_empty')) + '</p></div>') + '</div>';
  }

  var detailFade = 0;
  function renderDetail() {
    var root = document.getElementById('detail-root');
    if (!root) { root = document.createElement('div'); root.id = 'detail-root'; document.body.appendChild(root); }
    var r = detailId ? byId(detailId) : null;
    if (r && !shown(r)) r = null;
    var isOpen = root.querySelector('.overlay:not(.closing)');
    clearTimeout(detailFade);
    if (!r) {
      document.body.style.overflow = '';
      // let the sheet sink and fade before it is removed
      if (isOpen && !reduced) { isOpen.classList.add('closing'); detailFade = setTimeout(function () { if (!detailId) root.innerHTML = ''; }, 460); }
      else root.innerHTML = '';
      return;
    }
    var sameShip = r.s ? sortRecs(seenRecs().filter(function (x) { return x.id !== r.id && x.s === r.s; }), 'fav') : [];
    var sameAuthor = r.a ? sortRecs(seenRecs().filter(function (x) { return x.id !== r.id && x.a === r.a; }), 'fav') : [];
    function relList(h, arr) { return arr.length ? '<section class="rel"><h3>' + esc(h) + '</h3><ul>' + arr.slice(0, 8).map(function (x) { return '<li><button type="button" data-act="open" data-id="' + esc(x.id) + '">' + esc(x.t) + '</button> <span>' + esc([x.a, t('r_' + rOf(x))].filter(Boolean).join(' · ')) + '</span></li>'; }).join('') + '</ul></section>' : ''; }
    var rels = relList(t('same_ship') + (r.s ? ' · ' + r.s : ''), sameShip) + relList(t('same_author'), sameAuthor);
    var actions = bmBtn(r) + '<button type="button" class="btn-small" data-act="copyx" data-id="' + esc(r.id) + '">' + esc(t('copyx')) + '</button>' + linkBtn(r) +
      (OWNER ? hideBtn(r) + '<button type="button" class="btn-small" data-act="edit" data-id="' + esc(r.id) + '">' + esc(t('edit')) + '</button>' : '');
    root.innerHTML = '<div class="overlay' + (isOpen ? ' held' : '') + '" data-act="close-bg"><div class="sheet cs-' + ((r.n | 0) % 8) + '" role="dialog" aria-modal="true" aria-labelledby="d-title" tabindex="-1">' +
      '<div class="kicker"><span class="folno">' + (detailPick ? esc(r.by ? t('pick_by', { u: r.by }) : t('pick_lilith')) + ' · ' : '') + esc(t('fol')) + ' ' + roman(r.n) + '</span><button type="button" class="x-close" data-act="close" id="d-close"><span>' + esc(t('close')) + '</span><i aria-hidden="true"></i></button></div>' +
      '<div class="headline"><span class="initial" aria-hidden="true">' + esc(capOf(r)) + '</span><h2 class="title" id="d-title">' + titleHtml(r) + '</h2>' +
      (r.a ? '<p class="byline">' + esc(t('by')) + ' ' + authorHtml(r) + '</p>' : '') + '<p style="margin:4px 0 0">' + headTag(r) + '</p></div>' +
      metaHtml(r) + chipsHtml(r, true) + textsHtml(r) +
      '<div class="folio-foot"><div class="foot-l">' + stars(r.sc) + (r.d ? '<span class="inscr">' + esc(t('inscribed', { d: dateTxt(r.d) })) + '</span>' : '') + '</div><div class="actions">' + actions + '</div></div>' +
      (rels ? '<div class="rels">' + rels + '</div>' : '') + '</div></div>';
    document.body.style.overflow = 'hidden';
    var sh = root.querySelector('.sheet'); if (sh) { try { sh.focus({ preventScroll: true }); } catch (e) { sh.focus(); } }
  }

  function formFields(prefix, d, owner) {
    var ratingOpts = [['?', t('r_?')], ['G', t('r_G')], ['T', t('f_ta')], ['M', t('r_M')], ['E', t('r_E')]];
    var stOpts = [['', t('f_dk')]].concat(STS.map(function (x) { return [x, stName(x)]; }));
    var lenOpts = [['', t('f_dk')]].concat(LENS.map(function (x) { return [x, lenName(x)]; }));
    function inp(k, label, type, extra, cls) { return '<div class="field' + (cls ? ' ' + cls : '') + '"><label for="' + prefix + k + '">' + label + '</label><input type="' + type + '" id="' + prefix + k + '" value="' + esc(d[k] == null ? '' : d[k]) + '"' + (extra || '') + '></div>'; }
    function sel(k, label, list) { return '<div class="field"><label for="' + prefix + k + '">' + esc(label) + '</label><select id="' + prefix + k + '">' + opts(list, d[k] || (k === 'r' ? '?' : ''), null) + '</select></div>'; }
    function ta(k, label, ph) { return '<div class="field full"><label for="' + prefix + k + '">' + esc(label) + '</label><textarea id="' + prefix + k + '" maxlength="' + LIMITS[k] + '" placeholder="' + esc(ph || '') + '">' + esc(d[k] || '') + '</textarea></div>'; }
    var dl = '<datalist id="' + prefix + 'fandoms">' + uniq('f').map(function (f) { return '<option value="' + esc(f) + '">'; }).join('') + '</datalist><datalist id="' + prefix + 'ships">' + uniq('s').map(function (s) { return '<option value="' + esc(s) + '">'; }).join('') + '</datalist>';
    var req = ' <span class="req">*</span>';
    var h = '<div class="form-grid">' +
      inp('l', esc(t('f_link')) + req, 'url', ' placeholder="https://archiveofourown.org/works/…" inputmode="url"', 'full') +
      inp('t', esc(t('f_title')) + req, 'text', ' maxlength="200"') +
      inp('a', esc(t('f_author')), 'text', ' maxlength="120"') +
      inp('f', esc(t('f_fandom')), 'text', ' list="' + prefix + 'fandoms" maxlength="80" placeholder="Twice (Band)"') +
      inp('s', esc(t('f_ship')), 'text', ' list="' + prefix + 'ships" maxlength="80" placeholder="Michaeng"') +
      sel('r', t('f_rating'), ratingOpts) + sel('st', t('f_status'), stOpts) + sel('len', t('f_len'), lenOpts) +
      (owner ? inp('ch', esc(t('f_chapters')), 'number', ' min="0" max="999"') : inp('by', esc(t('f_by')), 'text', ' maxlength="31" placeholder="@usuario"')) +
      ta('ab', t('f_about'), t('f_about_ph')) + ta('w', owner ? t('f_why_o') : t('f_why'), t('f_why_ph')) +
      tagField(prefix, d.tr) +
      inp('wa', esc(t('f_warn')), 'text', ' maxlength="200" placeholder="' + esc(t('f_warn_ph')) + '"', 'full');
    if (owner) {
      h += sel('m', t('f_mylist'), [['', '—']].concat(MINES.map(function (x) { return [x, mineName(x)]; }))) +
        '<div class="field"><label for="' + prefix + 'sc">' + esc(t('f_myscore')) + '</label><select id="' + prefix + 'sc">' + opts([['0', t('unrated')], ['1', '★'], ['2', '★★'], ['3', '★★★'], ['4', '★★★★'], ['5', '★★★★★']], String(d.sc || 0), null) + '</select></div>' +
        inp('by', esc(t('f_recby')), 'text', ' maxlength="31" placeholder="' + esc(t('f_recby_ph')) + '"') +
        '<div class="field full"><label for="' + prefix + 'no">' + esc(t('f_notes')) + '</label><textarea id="' + prefix + 'no" maxlength="400">' + esc(d.no || '') + '</textarea></div>';
    }
    return h + '</div>' + dl;
  }
  function readForm(prefix, owner) {
    var d = {};
    ['l', 't', 'a', 'f', 's', 'r', 'st', 'len', 'ab', 'w', 'tr', 'wa', 'by'].forEach(function (k) { d[k] = val(prefix + k); });
    if (owner) { d.m = val(prefix + 'm'); d.sc = parseInt(val(prefix + 'sc'), 10) || 0; d.no = val(prefix + 'no'); d.ch = parseInt(val(prefix + 'ch'), 10) || null; }
    return d;
  }

  function renderRecomendar() {
    var p = document.getElementById('panel');
    var contacto = (DATA.meta.contacto || '').replace(/^@+/, '');
    p.innerHTML = '<div class="two-col">' +
      '<section aria-labelledby="rec-h"><h2 id="rec-h">' + esc(t('rec_h')) + '</h2><p class="sub">' + esc(t('rec_sub')) + '</p>' +
      '<form id="rec-form" novalidate>' + formFields('rf-', draft, false) + '</form></section>' +
      '<aside class="side" aria-labelledby="prev-h"><h2 id="prev-h">' + esc(t('prev_h')) + '</h2><div id="rf-preview"></div>' +
      '<ol class="steps"><li>' + esc(t('step1')) + '</li><li>' + esc(t('step2')) + '</li><li>' + esc(t('step3', { u: contacto || '…', tag: t('hashtag') })) + '</li></ol>' +
      '<div class="row"><button type="button" class="btn" data-act="copyscroll">' + esc(t('copy_scroll')) + '</button><button type="button" class="btn-ghost" data-act="newscroll">' + esc(t('new_scroll')) + '</button></div>' +
      '<div class="row">' + (contacto ? '<a class="btn-ghost" href="https://x.com/' + esc(contacto) + '" target="_blank" rel="noopener noreferrer">' + esc(t('open_dm', { u: contacto })) + ' \u2197</a>' : '') +
      '<a class="btn-ghost" id="rf-tweet" href="https://twitter.com/intent/tweet" target="_blank" rel="noopener noreferrer">' + esc(t('post_x')) + ' \u2197</a></div>' +
      '<p id="rf-msg" class="err" hidden></p>' +
      '<details><summary>' + esc(t('see_text')) + '</summary><pre class="scroll" id="rf-text"></pre></details></aside></div>';
    updateScroll();
  }
  function tweetUrl(d) {
    var h = xHandle(), title = d.t || '';
    function build(tt) {
      var lines = ['\ud83d\udcdc ' + t('tw_head', { tag: t('hashtag') }) + ' \u201c' + tt + '\u201d' + (d.a ? t('x_by', { a: d.a }) : '')];
      var meta = [d.s, RK[d.r] && d.r !== '?' ? t('r_' + d.r) : ''].filter(Boolean).join(' \u00b7 '); if (meta) lines.push(meta);
      if (d.l) lines.push(d.l);
      if (h) lines.push('@' + h);
      return lines.join('\n');
    }
    var txt = build(title);
    if (txt.length > 270 && title.length > 20) { title = title.slice(0, Math.max(20, title.length - (txt.length - 270) - 1)) + '\u2026'; txt = build(title); }
    return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(txt);
  }
  function updateScroll() {
    draft = readForm('rf-', false);
    store('archivo-fanfics-borrador', JSON.stringify(draft));
    var d = clean(draft);
    var prev = document.getElementById('rf-preview');
    if (prev) prev.innerHTML = card(Object.assign({}, d, { n: 0, d: '' }), { preview: true });
    var x = document.getElementById('rf-text');
    if (x) x.textContent = scrollText(d);
    var tw = document.getElementById('rf-tweet');
    if (tw) tw.href = tweetUrl(d);
  }

  function auBoxHtml() {
    var A = DATA.autoras, ed = auEdit !== null && A[auEdit] ? A[auEdit] : null, d = ed || {};
    var list = A.length ? '<ul class="pend">' + A.map(function (a, i) {
      return '<li><span>' + esc(a.a) + (a.f || a.works ? ' <span class="hint">· ' + esc([fshort(a.f), a.works ? t('fics_n', { n: a.works }) : ''].filter(Boolean).join(' · ')) + '</span>' : '') + '</span>' +
        '<span class="actions"><button type="button" class="btn-small" data-act="au-edit" data-i="' + i + '">' + esc(t('au_edit')) + '</button>' +
        '<button type="button" class="btn-small danger" data-act="au-del" data-i="' + i + '">' + esc(t('au_del')) + '</button></span></li>';
    }).join('') + '</ul>' : '';
    return '<section class="box" id="au-box" aria-labelledby="au-h"><h2 id="au-h">' + esc(t('au_h')) + '</h2><p class="sub">' + esc(t('au_sub')) + '</p>' + list +
      (ed ? '<p class="sub" style="margin:0">' + esc(t('au_editing', { a: ed.a })) + '</p>' : '') +
      '<div class="form-grid"><div class="field full"><label for="au-l">' + esc(t('au_link')) + '</label><input type="url" id="au-l" placeholder="https://archiveofourown.org/users/…" value="' + esc(d.l || '') + '"></div>' +
      '<div class="field"><label for="au-a">' + esc(t('au_name')) + '</label><input type="text" id="au-a" value="' + esc(d.a || '') + '"></div>' +
      '<div class="field"><label for="au-f">' + esc(t('au_fandom')) + '</label><input type="text" id="au-f" value="' + esc(d.f || '') + '"></div>' +
      '<div class="field"><label for="au-w">' + esc(t('au_works')) + '</label><input type="number" id="au-w" min="0" step="1" value="' + esc(d.works || '') + '"></div></div>' +
      '<div class="row"><button type="button" class="btn" data-act="au-add">' + esc(t(ed ? 'au_save' : 'au_add')) + '</button>' +
      (ed ? '<button type="button" class="btn-ghost" data-act="au-cancel">' + esc(t('cancel')) + '</button>' : '') + '</div><p id="au-msg" class="err" hidden></p></section>';
  }
  // Escriba: the list of letters, and an editor that shows only the fields of the letter being edited
  var cEdit = null, cDel = null, fEdit = null;
  function cartasBoxHtml() {
    var L = cartas(), ed = cEdit ? cartaById(cEdit) : null;
    function row(c) {
      var vf = (c.frags || []).filter(function (f) { return String(f.texto || '').trim(); }).length;
      var info = [t('pk_t_' + c.tipo), c.tipo === 'capitulo' ? (vf === 1 ? t('pk_frags_1') : t('pk_frags_n', { n: vf })) : (c.cap ? t('pk_f_cap', { n: roman(+c.cap) }) : ''), t(cartaVisible(c) ? 'ca_vis' : 'ca_hid')].filter(Boolean).join(' · ');
      return '<li' + (ed && ed.id === c.id ? ' class="editing"' : '') + '><span><b>' + esc(cartaTitle(c)) + '</b> <span class="hint">· ' + esc(info) + '</span></span><span class="actions">' +
        '<button type="button" class="btn-small" data-act="ca-edit" data-id="' + esc(c.id) + '">' + esc(t('ca_edit')) + '</button>' +
        '<button type="button" class="btn-small" data-act="ca-toggle" data-id="' + esc(c.id) + '">' + esc(t(c.on ? 'ca_hide' : 'ca_show')) + '</button>' +
        (cDel === c.id ? '<button type="button" class="btn-small danger" data-act="ca-del" data-id="' + esc(c.id) + '">' + esc(t('ca_del_q')) + '</button>'
          : '<button type="button" class="btn-small danger" data-act="ca-del" data-id="' + esc(c.id) + '">' + esc(t('ca_del')) + '</button>') + '</span></li>';
    }
    var list = L.length ? '<ul class="pend cartas-list">' + L.map(row).join('') + '</ul>' : '<p class="sub">' + esc(t('ca_none')) + '</p>';
    var add = '<div class="row"><div class="field"><label for="nc-tipo">' + esc(t('ca_type')) + '</label><select id="nc-tipo">' + CTYPES.map(function (x) { return '<option value="' + x + '">' + esc(t('pk_t_' + x)) + '</option>'; }).join('') + '</select></div>' +
      '<button type="button" class="btn-ghost" data-act="ca-new" style="align-self:flex-end">' + esc(t('ca_new')) + '</button></div>';
    return '<section class="box" id="cartas-box" aria-labelledby="ca-h"><h2 id="ca-h">' + esc(t('ca_h')) + '</h2><p class="sub">' + esc(t('ca_sub')) + '</p>' + list + add + (ed ? cartaEditorHtml(ed) : '') + '</section>';
  }
  function cartaEditorHtml(c) {
    function inp(k, label, v, type, full) { return '<div class="field' + (full ? ' full' : '') + '"><label for="ce-' + k + '">' + esc(label) + '</label><input type="' + (type || 'text') + '" id="ce-' + k + '" value="' + esc(v == null ? '' : v) + '"></div>'; }
    function area(k, label, v, rows, help) { return '<div class="field full"><label for="ce-' + k + '">' + esc(label) + '</label><textarea id="ce-' + k + '" rows="' + rows + '">' + esc(v || '') + '</textarea>' + (help ? '<p class="sub" style="margin:4px 0 0">' + esc(help) + '</p>' : '') + '</div>'; }
    var lang = '<div class="field"><label for="ce-lang">' + esc(t('ad_lang')) + '</label><select id="ce-lang"><option value="en"' + (c.lang !== 'es' ? ' selected' : '') + '>English</option><option value="es"' + (c.lang === 'es' ? ' selected' : '') + '>Español</option></select></div>';
    var f = '';
    if (c.tipo === 'capitulo') {
      f = inp('fic', t('ad_fic'), c.fic) + inp('cap', t('ca_capn'), c.cap, 'number') + inp('titulo', t('ca_title_cap'), c.titulo) + lang + inp('link', t('ad_link'), c.link, 'url') +
        '<label class="check" style="align-self:end"><input type="checkbox" id="ce-borrador"' + (c.borrador ? ' checked' : '') + '> ' + esc(t('ad_draft')) + '</label>' +
        '<label class="check" style="align-self:end"><input type="checkbox" id="ce-fin"' + (c.fin ? ' checked' : '') + '> ' + esc(t('ca_fin')) + '</label>' +
        area('nota', t('ad_note'), c.nota, 2);
    } else {
      f = inp('titulo', t(c.tipo === 'perfil' ? 'ca_name' : 'ca_title'), c.titulo) + inp('sub', t(c.tipo === 'perfil' ? 'ca_role' : 'ca_sub2'), c.sub) +
        inp('fic', t('ad_fic'), c.fic) + inp('cap', t('ca_capopt'), c.cap, 'number') + lang +
        area('datos', t('ad_pdat'), c.datos, 4) + area('texto', t('ca_text'), c.texto, 12, t('ad_help'));
    }
    var frags = '';
    if (c.tipo === 'capitulo') {
      var fr = c.frags || [], fe = fEdit ? fr.filter(function (x) { return x.id === fEdit; })[0] : null;
      frags = '<h3 class="ad-sub">' + esc(t('fr_h')) + '</h3>' + (fr.length ? '<ul class="pend">' + fr.map(function (x, i) {
        var words = String(x.texto || '').split(/\s+/).filter(Boolean).length, d = fragDate(x.fecha);
        return '<li' + (fe && fe.id === x.id ? ' class="editing"' : '') + '><span><b>' + esc(t('pk_frag', { n: roman(i + 1) })) + '</b> <span class="hint">· ' + esc([d, t('fr_words', { n: words }), t(x.on === false ? 'ca_hid' : 'ca_vis')].filter(Boolean).join(' · ')) + '</span></span><span class="actions">' +
          '<button type="button" class="btn-small" data-act="fr-edit" data-id="' + esc(x.id) + '">' + esc(t('ca_edit')) + '</button>' +
          '<button type="button" class="btn-small" data-act="fr-toggle" data-id="' + esc(x.id) + '">' + esc(t(x.on === false ? 'ca_show' : 'ca_hide')) + '</button>' +
          '<button type="button" class="btn-small danger" data-act="fr-del" data-id="' + esc(x.id) + '">' + esc(t(cDel === 'f:' + x.id ? 'ca_del_q' : 'ca_del')) + '</button></span></li>';
      }).join('') + '</ul>' : '<p class="sub">' + esc(t('fr_none')) + '</p>') +
        '<div class="field full"><label for="fr-texto">' + esc(fe ? t('fr_editing', { n: roman(fr.indexOf(fe) + 1) }) : t('fr_new')) + '</label><textarea id="fr-texto" rows="12">' + esc(fe ? fe.texto : '') + '</textarea>' +
        '<p class="sub" style="margin:4px 0 0">' + esc(t('ad_help')) + '</p></div>' +
        '<div class="row"><button type="button" class="btn" data-act="fr-add">' + esc(t(fe ? 'fr_save' : 'fr_add')) + '</button>' + (fe ? '<button type="button" class="btn-ghost" data-act="fr-cancel">' + esc(t('cancel')) + '</button>' : '') + '</div>';
    }
    return '<div class="carta-editor"><h3 class="ad-sub">' + esc(t('ca_editing', { t: cartaTitle(c) })) + '</h3><div class="form-grid">' + f + '</div>' +
      '<div class="row"><button type="button" class="btn" data-act="ca-save">' + esc(t('ca_save')) + '</button><button type="button" class="btn-ghost" data-act="ca-view">' + esc(t('ad_view')) + '</button>' +
      '<button type="button" class="btn-ghost" data-act="ca-close">' + esc(t('ca_close')) + '</button></div><p id="ca-msg" class="err" hidden></p>' + frags + '</div>';
  }
  function applyCarta() {
    // copies whatever is in the editor's fields into the letter; true if something changed
    var c = cEdit ? cartaById(cEdit) : null;
    if (!c || !document.getElementById('ce-titulo')) return false;
    var before = JSON.stringify(c);
    function v(k) { var el = document.getElementById('ce-' + k); return el ? String(el.value || '') : null; }
    function ck(k) { var el = document.getElementById('ce-' + k); return el ? !!el.checked : false; }
    var capv = parseInt(v('cap'), 10);
    c.titulo = v('titulo').trim(); c.fic = v('fic').trim(); c.cap = capv > 0 ? capv : ''; c.lang = v('lang') === 'es' ? 'es' : 'en';
    if (c.tipo === 'capitulo') { c.link = v('link').trim(); c.borrador = ck('borrador'); c.fin = ck('fin'); c.nota = v('nota').trim(); }
    else { c.sub = v('sub').trim(); c.datos = v('datos').trim(); c.texto = v('texto').replace(/\s+$/, ''); }
    return JSON.stringify(c) !== before;
  }
  function renderArchivista() {
    var p = document.getElementById('panel');
    var ed = editingId ? byId(editingId) : null;
    var d = ed ? ed : (catalogLink ? { l: catalogLink } : {});
    var impHtml = importList.map(function (it, i) {
      return '<div>' + card(Object.assign({}, it.rec, { n: 0, d: today() }), { preview: true }) +
        '<div class="row" style="margin-top:8px">' + (it.added ? '<p class="okmsg">' + esc(t('added')) + '</p>' : it.dup ? '<p class="err">' + esc(t('dup')) + '</p>' :
          '<button type="button" class="btn-small" data-act="imp-add" data-i="' + i + '">' + esc(t('add_to')) + '</button>') + '</div></div>';
    }).join('');
    var peekBox = cartasBoxHtml();
    p.innerHTML = peekBox +
      '<section class="box" aria-labelledby="imp-h"><h2 id="imp-h">' + esc(t('imp_h')) + '</h2><p class="sub">' + esc(t('imp_sub')) + '</p>' +
        '<textarea id="imp" rows="5" placeholder="' + esc(t('imp_ph')) + '"></textarea>' +
        '<div class="row"><button type="button" class="btn" data-act="parse">' + esc(t('read_scrolls')) + '</button>' + (importList.some(function (x) { return !x.added && !x.dup; }) ? '<button type="button" class="btn-ghost" data-act="imp-all">' + esc(t('add_all')) + '</button>' : '') + '</div>' +
        '<p id="imp-msg" class="err" hidden></p>' + (impHtml ? '<div class="grid">' + impHtml + '</div>' : '') + '</section>' +
      '<section class="box" id="of-box" aria-labelledby="of-h"><h2 id="of-h">' + esc(ed ? t('of_edit', { t: ed.t }) : t('of_add')) + '</h2>' +
        (catalogLink && !ed ? '<p class="sub">' + esc(t('cataloging')) + '</p>' : '') +
        '<form id="of-form" novalidate>' + formFields('of-', d, true) + '</form>' +
        '<div class="row"><button type="button" class="btn" data-act="of-save">' + esc(ed ? t('save_folio') : t('add_to')) + '</button>' +
        ((ed || catalogLink) ? '<button type="button" class="btn-ghost" data-act="of-cancel">' + esc(t('cancel')) + '</button>' : '') + '</div><p id="of-msg" class="err" hidden></p></section>' +
      '<section class="box" aria-labelledby="pend-h"><h2 id="pend-h">' + esc(t('pend_h', { n: DATA.pendientes.length })) + '</h2>' +
        (DATA.pendientes.length ? '<p class="sub">' + esc(t('pend_sub')) + '</p><ul class="pend">' + DATA.pendientes.map(function (u, i) {
          var l = safeUrl(u);
          return '<li>' + (l ? '<a href="' + esc(l) + '" target="_blank" rel="noopener noreferrer">' + esc(l.replace(/^https?:\/\/(www\.)?/, '')) + '</a>' : '<span>' + esc(u) + '</span>') +
            '<span class="actions"><button type="button" class="btn-small" data-act="cat" data-i="' + i + '">' + esc(t('catalog')) + '</button><button type="button" class="btn-small danger" data-act="cat-del" data-i="' + i + '">' + esc(t('remove')) + '</button></span></li>';
        }).join('') + '</ul>' : '<p class="sub">' + esc(t('no_pend')) + '</p>') + '</section>' +
      '<section class="box" aria-labelledby="ao3-h"><h2 id="ao3-h">' + esc(t('ao3_h')) + '</h2><p class="sub">' + esc(t('ao3_sub')) + '</p><div class="row"><button type="button" class="btn-ghost" data-act="ao3-toggle">' + esc(ao3Down() ? t('ao3_off') : t('ao3_on')) + '</button></div>' +
        '<p class="sub" style="margin:6px 0 0">' + esc(t('eta_owner_sub')) + '</p>' +
        '<div class="row"><div class="field"><label for="eta-from">' + esc(t('eta_from')) + '</label><input type="date" id="eta-from" value="' + esc(String(DATA.meta.ao3From || '').slice(0, 10)) + '"></div>' +
        '<div class="field"><label for="eta-to">' + esc(t('eta_to')) + '</label><input type="date" id="eta-to" value="' + esc(String(DATA.meta.ao3To || '').slice(0, 10)) + '"></div>' +
        '<button type="button" class="btn-ghost" data-act="eta-save" style="align-self:flex-end">' + esc(t('eta_use')) + '</button></div></section>' +
      '<section class="box" aria-labelledby="meme-h"><h2 id="meme-h">' + esc(t('meme_h')) + '</h2><p class="sub">' + esc(t('meme_sub')) + '</p>' +
        '<div class="row"><div class="field grow"><label for="meme-url">' + esc(t('meme_lbl')) + '</label><textarea id="meme-url" rows="3" spellcheck="false" placeholder="https://x.com/…/status/…  ·  <blockquote class=&quot;twitter-tweet&quot;>…">' + esc(DATA.meta.meme || '') + '</textarea></div>' +
        '<button type="button" class="btn" data-act="meme-set" style="align-self:flex-end">' + esc(t('meme_set')) + '</button>' +
        (DATA.meta.meme ? '<button type="button" class="btn-ghost" data-act="meme-clear" style="align-self:flex-end">' + esc(t('meme_clear')) + '</button>' : '') + '</div>' +
        '<p id="meme-msg" class="err" hidden></p></section>' +
      auBoxHtml() +
      '<section class="box" aria-labelledby="ct-h"><h2 id="ct-h">' + esc(t('ct_h')) + '</h2><p class="sub">' + esc(t('ct_sub')) + '</p>' +
        '<div class="row"><div class="field grow"><label for="ct">' + esc(t('ct_label')) + '</label><input type="text" id="ct" maxlength="31" placeholder="@" value="' + esc(DATA.meta.contacto || '') + '"></div><button type="button" class="btn-ghost" data-act="ct-save">' + esc(t('ct_use')) + '</button></div></section>';
  }

  function updateSaveBar() {
    var b = document.getElementById('savebar');
    if (!b) return;
    if (!OWNER || (!dirty && !saveErr && !saveOk)) { b.innerHTML = ''; return; }
    var msg = saveErr ? saveErr : (saveOk && !dirty) ? saveOk : saving ? t('saving') : (dirty === 1 ? t('unsaved1') : t('unsavedN', { n: dirty })) + ' ' + t('others_see');
    b.innerHTML = '<div class="savebar" role="status"><p>' + esc(msg) + '</p><div class="row">' +
      (dirty ? '<button type="button" class="btn" data-act="save"' + (saving ? ' disabled' : '') + '>' + esc(t('save')) + '</button><button type="button" class="btn-ghost" data-act="discard"' + (saving ? ' disabled' : '') + '>' + esc(t('discard')) + '</button>' : '<button type="button" class="btn-ghost" data-act="err-ok">' + esc(t('gotit')) + '</button>') + '</div></div>';
  }
  function touch() { dirty++; saveErr = ''; saveOk = ''; updateSaveBar(); }

  function safeJson(o) { return JSON.stringify(o).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029'); }
  function buildDoc() {
    var style = document.getElementById('app-style').textContent;
    var code = document.getElementById('app-code').textContent;
    return SKELETON_OPEN + HEAD_HTML + '<style id="app-style">' + style + '</style>\n<div id="app"></div>\n' +
      '<script id="fic-data" type="application/json">' + safeJson(DATA) + '<\/script>\n' +
      '<script id="app-code">' + code + '<\/script>\n' + SKELETON_CLOSE;
  }
  function save() {
    if (saving) return;
    if (GH && IS_OWNER) return ghSave();
    if (!ART) { saveErr = t('e_ro'); updateSaveBar(); return; }
    saving = true; saveErr = ''; updateSaveBar();
    DATA.meta.updated = today();
    var eb = document.querySelector('.eyebrow'); if (eb) eb.textContent = eyebrowTxt();
    ART.publish(buildDoc()).then(function () { dirty = 0; saving = false; say(t('m_saved')); }, function (e) {
      saving = false;
      var c = e && e.code;
      if (c === 'conflict') saveErr = t('e_conflict');
      else if (c === 'not_writer' || c === 'not_granted' || c === 'capability_disabled' || c === 'consent_required' || c === 'not_declared') saveErr = t('e_ro');
      else if (c === 'rate_limited') saveErr = t('e_rate');
      else if (c === 'too_large') saveErr = t('e_big');
      else saveErr = t('e_gen');
      updateSaveBar();
    });
  }
  function showMsg(id, text, ok) { var el = document.getElementById(id); if (!el) return; el.hidden = !text; el.textContent = text || ''; el.className = ok ? 'okmsg' : 'err'; }
  function addRec(d, extra) {
    var r = clean(d), n = nextN();
    var rec = Object.assign({ id: 'r' + n, n: n, m: '', sc: 0, no: '', ch: null, d: today() }, r, extra || {});
    DATA.recs.push(rec);
    return rec;
  }

  /* ---------- navegacion ---------- */
  var peekItem = '';
  function route() {
    var h = (location.hash || '').replace('#', ''), sub = '';
    if (h.indexOf('adelanto/') === 0) { sub = h.slice(9); h = 'adelanto'; }
    if (h.indexOf('fic-') === 0 && shown(byId(h.slice(4)))) { detailId = h.slice(4); return; }
    detailId = null; detailPick = false;
    view = (VIEWS.indexOf(h) >= 0 && (h !== 'archivista' || OWNER) && (h !== 'recomendar' || OWNER) && (h !== 'adelanto' || OWNER || peekOn())) ? h : (h ? 'archivo' : view);
    try { sub = decodeURIComponent(sub); } catch (e) {}
    peekItem = view === 'adelanto' ? sub : '';
    if (peekItem === 'capitulo' || peekItem === 'perfil') { var lc = cartas().filter(function (c) { return c.tipo === peekItem && (OWNER || cartaVisible(c)); })[0]; peekItem = lc ? lc.id : ''; }
  }
  function openDetail(id, pick) { detailPick = !!pick; if (location.hash === '#fic-' + id) { detailId = id; renderDetail(); } else location.hash = 'fic-' + id; }
  function closeDetail() { location.hash = view; }
  var wantY = window.scrollY || 0, restoring = false;
  window.addEventListener('scroll', function () { if (!restoring && !detailId && view !== 'adelanto') wantY = window.scrollY; }, { passive: true });
  window.addEventListener('hashchange', function () {
    var prevView = view, prevDetail = detailId, prevItem = peekItem;
    route();
    if (view !== prevView) { confirmDel = null; renderShell(); restoring = true; var pn = document.getElementById('panel'); window.scrollTo(0, view === 'adelanto' && pn ? pn.getBoundingClientRect().top + window.scrollY - 24 : wantY); jumpToFrag(); requestAnimationFrame(function () { requestAnimationFrame(function () { restoring = false; }); }); }
    else if (peekItem !== prevItem) {
      renderView();
      var pk = document.getElementById('panel'); if (pk) window.scrollTo(0, pk.getBoundingClientRect().top + window.scrollY - 24);
      jumpToFrag();
    }
    else if (detailId !== prevDetail) renderDetail();
  });

  /* ---------- eventos ---------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.querySelector('.palpick.open')) { setPalMenu(false, true); return; }
    if (e.key === 'Escape' && detailId) { closeDetail(); return; }
    if (e.key === 'Escape' && ghLogin) { ghLogin = false; ghErr = ''; renderShell(); return; }
    if (e.key === 'Enter' && e.target && e.target.id === 'gh-tok') { e.preventDefault(); var ge = document.querySelector('[data-act="gh-enter"]'); if (ge) ge.click(); return; }
    var tg = e.target;
    if (tg && tg.classList && tg.classList.contains('tag-in')) {
      var pf = tg.closest('.tagbox').getAttribute('data-prefix');
      if (e.key === 'Enter' || e.key === ',' || e.key === ';') { e.preventDefault(); commitTag(pf); }
      else if (e.key === 'Backspace' && !tg.value) { var tags = tropesAll(val(pf + 'tr')); if (tags.length) { tags.pop(); setTags(pf, tags); } }
    }
  });
  document.addEventListener('focusout', function (e) { var tg = e.target; if (tg && tg.classList && tg.classList.contains('tag-in')) commitTag(tg.closest('.tagbox').getAttribute('data-prefix')); });
  document.addEventListener('mousedown', function (e) { var tb = e.target.classList && e.target.classList.contains('tagbox') ? e.target : null; if (tb) { e.preventDefault(); var i = tb.querySelector('.tag-in'); if (i) i.focus(); } });
  document.addEventListener('input', function (e) {
    var id = e.target.id || '';
    if (id === 'q') { F.q = e.target.value; renderResults(); }
    else if (e.target.classList && e.target.classList.contains('tag-in')) {
      var tv = e.target.value;
      if (/[,;]/.test(tv)) { var parts = tv.split(/[,;]/), rest = parts.pop(); e.target.value = rest.replace(/^\s+/, ''); addTags(e.target.closest('.tagbox').getAttribute('data-prefix'), parts.join(',')); }
    }
    else if (id.indexOf('rf-') === 0) { updateScroll(); showMsg('rf-msg', ''); }
  });
  document.addEventListener('change', function (e) {
    var id = e.target.id || '';
    var map = { 'f-fandom': 'fandom', 'f-ship': 'ship', 'f-rating': 'rating', 'f-mine': 'mine', 'f-sort': 'sort' };
    if (map[id]) { F[map[id]] = e.target.value; renderResults(); }
    else if (id === 'f-completos' || id === 'f-sin18') { F[id === 'f-completos' ? 'completos' : 'sin18'] = e.target.checked; renderResults(); }
    else if (id === 'g-by') { groupBy = e.target.value; renderIndice(); }
    else if (id.indexOf('rf-') === 0) updateScroll();
  });
  document.addEventListener('submit', function (e) { e.preventDefault(); });
  document.addEventListener('click', function (e) {
    var openPick = document.querySelector('.palpick.open');
    if (openPick && !openPick.contains(e.target)) setPalMenu(false);
    var b = e.target.closest('[data-act]');
    if (!b) {
      // a click anywhere on a card opens it, unless it lands on a link, a button or while selecting text
      var fo = e.target.closest('[data-open]'), sel = '';
      try { sel = String(window.getSelection ? window.getSelection() : ''); } catch (er) {}
      if (fo && !sel && !e.target.closest('a, button, input, select, textarea, label, summary, details')) openDetail(fo.getAttribute('data-open'), false);
      return;
    }
    var act = b.getAttribute('data-act'), id = b.getAttribute('data-id'), i = parseInt(b.getAttribute('data-i'), 10), v = b.getAttribute('data-v');
    if (act === 'close-bg') { if (e.target === b) closeDetail(); return; }
    if (act === 'close') closeDetail();
    else if (act === 'open') openDetail(id, false);
    else if (act === 'lang') { if (v !== LANG) { LANG = v; store('archivo-fanfics-idioma', v); renderShell(); } }
    else if (act === 'pal') {
      PAL = v; store('archivo-fanfics-paleta', v === 'auto' ? null : v); applyPalette();
      Array.prototype.forEach.call(document.querySelectorAll('.pal-opt'), function (s) { s.setAttribute('aria-pressed', String(s.getAttribute('data-v') === v)); });
      var pn = document.getElementById('pal-name'); if (pn) pn.textContent = t('pal_' + v);
      var pc = document.getElementById('pal-cur'); if (pc) pc.style.background = palBg(v);
      setTimeout(renderMeme, 650);
      setPalMenu(false, true);
    }
    else if (act === 'pal-toggle') setPalMenu(!b.closest('.palpick').classList.contains('open'));
    else if (act === 'bm') {
      var k = BM.indexOf(id);
      if (k >= 0) BM.splice(k, 1); else BM.push(id);
      store('archivo-fanfics-marcadores', JSON.stringify(BM));
      Array.prototype.forEach.call(document.querySelectorAll('[data-act="bm"][data-id="' + id + '"]'), function (x) { var on = BM.indexOf(id) >= 0; x.setAttribute('aria-pressed', String(on)); x.textContent = on ? '✓ ' + t('bm_on') : t('bm_add'); });
      var bc = document.getElementById('bm-count'); if (bc) bc.textContent = bmCount() ? roman(bmCount()) : '';
      if (view === 'marcadores' && !detailId) renderMarcadores();
    }
    else if (act === 'copyx') { var r = byId(id); if (r) copy(xText(r), b); }
    else if (act === 'break-seal') {
      e.preventDefault();
      peekJump = b.getAttribute('data-jump') || '';
      var to = (b.getAttribute('href') || '#adelanto').slice(1), go = function () { location.hash = to; };
      var sk = b.getAttribute('data-seal'); if (sk) { OPENED[sk] = 1; store('archivo-fanfics-cartas', JSON.stringify(OPENED)); }
      if (reduced || b.classList.contains('breaking')) { go(); return; }
      b.classList.add('breaking'); setTimeout(go, 1900);
    }
    else if (act === 'pk-type') { peekType = v || ''; renderView(); }
    else if (act === 'pk-cap') { peekCap = v || ''; renderView(); }
    else if (act === 'pk-frag') { peekJump = v || ''; jumpToFrag(); }
    else if (act === 'random') { var list = filtered(); if (list.length) openDetail(list[Math.floor(Math.random() * list.length)].id, true); }
    else if (act === 'clear') { F = { q: '', fandom: '', ship: '', rating: '', mine: '', completos: false, sin18: false, sort: F.sort, tropes: [] }; renderArchivo(); }
    else if (act === 'filters') { filtersOpen = !filtersOpen; var fp = document.getElementById('filters-panel'); if (fp) fp.hidden = !filtersOpen; b.setAttribute('aria-expanded', String(filtersOpen)); var fa = document.getElementById('farrow'); if (fa) fa.textContent = filtersOpen ? '\u25b4' : '\u25be'; }
    else if (act === 'unfilter') { var uk = b.getAttribute('data-k'); if (uk === 'trope') toggleTrope(v); else if (uk === 'completos' || uk === 'sin18') F[uk] = false; else F[uk] = ''; renderArchivo(); }
    else if (act === 'ftrope') { toggleTrope(v); if (view !== 'archivo') { location.hash = 'archivo'; return; } if (detailId) closeDetail(); renderArchivo(); }
    else if (act === 'tag-x') { var tb = b.closest('.tagbox'); if (tb) { var pf = tb.getAttribute('data-prefix'); setTags(pf, tropesAll(val(pf + 'tr')).filter(function (x) { return x !== v; })); var ti2 = document.getElementById(pf + 'tr-in'); if (ti2) ti2.focus(); } }
    else if (act === 'copyscroll') {
      commitTag('rf-');
      var d = clean(readForm('rf-', false));
      if (!d.l || !d.t) { showMsg('rf-msg', !d.l ? t('err_link') : t('err_title')); return; }
      copy(scrollText(d), b);
    }
    else if (act === 'newscroll') { draft = {}; store('archivo-fanfics-borrador', null); renderRecomendar(); var f = document.getElementById('rf-l'); if (f) f.focus(); }
    else if (act === 'as-visitor' && IS_OWNER) setVisitorView(!AS_VISITOR);
    else if (act === 'gh-login' && GH) { ghLogin = true; ghErr = ''; ghBusy = false; renderShell(); var gt = document.getElementById('gh-tok'); if (gt) gt.focus(); }
    else if (act === 'gh-cancel') { ghLogin = false; ghErr = ''; renderShell(); }
    else if (act === 'gh-enter' && GH && !ghBusy) {
      var tv = ((document.getElementById('gh-tok') || {}).value || '').trim();
      if (!tv) return;
      ghBusy = true; ghErr = ''; var gb = document.querySelector('[data-act="gh-enter"]'); if (gb) { gb.disabled = true; gb.textContent = t('gh_checking'); }
      ghEnter(tv, false);
    }
    else if (act === 'gh-out' && GH) {
      if (dirty) { saveErr = t('gh_unsaved'); updateSaveBar(); return; }
      try { localStorage.removeItem(GH_TOKEN_KEY); } catch (er) {}
      location.reload();
    }
    else if (!OWNER) return;
    else if (act === 'del') { confirmDel = id; renderResults(); if (view === 'marcadores') renderMarcadores(); }
    else if (act === 'del-no') { confirmDel = null; renderResults(); if (view === 'marcadores') renderMarcadores(); }
    else if (act === 'del-yes') { DATA.recs = DATA.recs.filter(function (r) { return r.id !== id; }); confirmDel = null; touch(); renderShell(); say(t('m_removed')); }
    else if (act === 'edit') {
      editingId = id; catalogLink = null;
      if (view === 'archivista' && !detailId) renderArchivista(); else location.hash = 'archivista';
      setTimeout(function () { var bx = document.getElementById('of-box'); if (bx) bx.scrollIntoView({ block: 'start' }); }, 40);
    }
    else if (act === 'of-cancel') { editingId = null; catalogLink = null; renderArchivista(); }
    else if (act === 'of-save') {
      commitTag('of-');
      var fd = readForm('of-', true), c = clean(fd);
      if (!c.t) { showMsg('of-msg', t('err_title_o')); return; }
      if (!c.l) { showMsg('of-msg', t('err_link_o')); return; }
      var extra = { m: MINES.indexOf(fd.m) >= 0 ? fd.m : '', sc: Math.max(0, Math.min(5, fd.sc | 0)), no: c.no, ch: fd.ch };
      if (editingId) { var cur = byId(editingId); if (cur) Object.assign(cur, c, extra); say(t('m_updated')); }
      else { addRec(fd, extra); if (catalogLink) DATA.pendientes = DATA.pendientes.filter(function (u) { return u !== catalogLink; }); say(t('m_added')); }
      editingId = null; catalogLink = null; touch(); renderShell();
    }
    else if (act === 'cat') { catalogLink = DATA.pendientes[i]; editingId = null; renderArchivista(); var bx2 = document.getElementById('of-box'); if (bx2) bx2.scrollIntoView({ block: 'start' }); var ti = document.getElementById('of-t'); if (ti) ti.focus(); }
    else if (act === 'cat-del') { DATA.pendientes.splice(i, 1); touch(); renderShell(); }
    else if (act === 'parse') {
      var txt = val('imp'), re = /#ficha:([A-Za-z0-9_-]+)/g, m, found = [];
      while ((m = re.exec(txt))) { try { var rec = clean(JSON.parse(b64d(m[1]))); if (rec.t || rec.l) found.push(rec); } catch (err) {} }
      if (!found.length) { showMsg('imp-msg', t('imp_none')); return; }
      importList = found.map(function (rec) { return { rec: rec, dup: DATA.recs.some(function (x) { return rec.l && cleanAo3(x.l) === rec.l; }), added: false }; });
      renderArchivista();
    }
    else if (act === 'imp-add' || act === 'imp-all') {
      var idxs = act === 'imp-all' ? importList.map(function (_, k2) { return k2; }) : [i], added = 0;
      idxs.forEach(function (k2) { var it = importList[k2]; if (it && !it.added && !it.dup) { addRec(it.rec, {}); it.added = true; added++; } });
      if (added) { dirty += added - 1; touch(); }
      renderShell(); say(t('m_nadded', { n: added }));
    }
    else if (act === 'eta-save') {
      var ef = val('eta-from'), et = val('eta-to');
      if (/^\d{4}-\d{2}-\d{2}$/.test(ef)) DATA.meta.ao3From = ef + 'T12:00:00Z';
      if (/^\d{4}-\d{2}-\d{2}$/.test(et)) DATA.meta.ao3To = et + 'T12:00:00Z';
      touch(); renderShell(); say(t('m_ready'));
    }
    else if (act === 'meme-set') {
      var pm = parseMeme((document.getElementById('meme-url') || {}).value), mmsg = document.getElementById('meme-msg');
      if (!pm) { if (mmsg) { mmsg.textContent = t('meme_bad'); mmsg.hidden = false; } return; }
      var Mm = DATA.meta;
      if (pm.url !== Mm.meme || pm.text !== (Mm.memeText || '') || pm.by !== (Mm.memeBy || '')) {
        Mm.meme = pm.url; Mm.memeText = pm.text; Mm.memeBy = pm.by; Mm.memeDate = pm.date; Mm.memeLang = pm.lang; touch();
      }
      renderShell();
    }
    else if (act === 'au-add') {
      var al = ((document.getElementById('au-l') || {}).value || '').trim(), an = ((document.getElementById('au-a') || {}).value || '').trim();
      var af = ((document.getElementById('au-f') || {}).value || '').trim(), aw = parseInt((document.getElementById('au-w') || {}).value, 10);
      if (!an) { var um = /\/users\/([^\/?#]+)/i.exec(al); if (um) { try { an = decodeURIComponent(um[1]); } catch (er) { an = um[1]; } } }
      if (!an) { var am = document.getElementById('au-msg'); if (am) { am.textContent = t('au_need'); am.hidden = false; } return; }
      var rec = { a: an.slice(0, 80), l: safeUrl(al) || '', f: af.slice(0, 80), works: aw > 0 ? aw : 0 };
      if (auEdit !== null && DATA.autoras[auEdit]) DATA.autoras[auEdit] = rec; else DATA.autoras.push(rec);
      auEdit = null; touch(); renderArchivista();
      var ab = document.getElementById('au-box'); if (ab) ab.scrollIntoView({ block: 'nearest' });
    }
    else if (act === 'au-edit') { auEdit = i; renderArchivista(); var ab2 = document.getElementById('au-box'); if (ab2) ab2.scrollIntoView({ block: 'start' }); var aa = document.getElementById('au-l'); if (aa) aa.focus(); }
    else if (act === 'au-del') { if (DATA.autoras[i]) { DATA.autoras.splice(i, 1); if (auEdit === i) auEdit = null; touch(); renderArchivista(); } }
    else if (act === 'au-cancel') { auEdit = null; renderArchivista(); }
    else if (act === 'meme-clear') { var Mc = DATA.meta; Mc.meme = ''; Mc.memeText = ''; Mc.memeBy = ''; Mc.memeDate = ''; Mc.memeLang = ''; touch(); renderShell(); }
    else if (act === 'ao3-toggle') { DATA.meta.ao3Down = !ao3Down(); touch(); renderShell(); say(t('m_ready')); }
    else if (act === 'ct-save') { DATA.meta.contacto = val('ct').replace(/^@+/, '').replace(/[^A-Za-z0-9_]/g, '').slice(0, 30); touch(); renderShell(); say(t('m_ready')); }
    else if (act === 'save') save();
    else if (act === 'hide' && OWNER) {
      var hr = byId(id);
      if (hr) {
        if (hr.h) delete hr.h; else hr.h = true;
        touch(); say(t(hr.h ? 'm_hidden' : 'm_unhidden'));
        var eb = document.querySelector('.eyebrow'); if (eb) eb.textContent = eyebrowTxt();
        var lc = document.querySelector('a.tab[href="#archivo"] .count'); if (lc) lc.textContent = roman(pubRecs().length);
        if (view === 'archivo') renderResults(); else renderView();
        if (detailId) renderDetail();
      }
    }
    else if (act === 'ca-new') {
      if (applyCarta()) touch();
      var tp = (document.getElementById('nc-tipo') || {}).value || 'capitulo';
      var nc = { id: cuid('c'), tipo: CTYPES.indexOf(tp) >= 0 ? tp : 'capitulo', on: false, fic: peekFic(), cap: '', titulo: '', lang: 'en' };
      if (nc.tipo === 'capitulo') { nc.borrador = true; nc.link = ''; nc.nota = ''; nc.fin = false; nc.frags = []; } else { nc.sub = ''; nc.datos = ''; nc.texto = ''; }
      cartas().push(nc); cEdit = nc.id; fEdit = null; cDel = null; touch(); renderShell();
      var ne = document.querySelector('.carta-editor'); if (ne) ne.scrollIntoView({ block: 'start' });
      var nf = document.getElementById(nc.tipo === 'capitulo' ? 'ce-cap' : 'ce-titulo'); if (nf) nf.focus({ preventScroll: true });
    }
    else if (act === 'ca-edit') {
      if (applyCarta()) touch();
      cEdit = cEdit === id ? null : id; fEdit = null; cDel = null; renderArchivista();
      var ee = document.querySelector('.carta-editor'); if (ee) ee.scrollIntoView({ block: 'start' });
    }
    else if (act === 'ca-toggle') { if (applyCarta()) touch(); var ct = cartaById(id); if (ct) { ct.on = !ct.on; touch(); } cDel = null; renderShell(); }
    else if (act === 'ca-del') {
      if (cDel !== id) { cDel = id; renderArchivista(); return; }
      DATA.cartas = cartas().filter(function (c) { return c.id !== id; });
      if (cEdit === id) { cEdit = null; fEdit = null; }
      cDel = null; touch(); renderShell();
    }
    else if (act === 'ca-save') {
      var chg = applyCarta(), cs = cartaById(cEdit), cm = document.getElementById('ca-msg');
      if (cs && !cs.titulo && !(cs.tipo === 'capitulo' && cs.cap)) { if (cm) { cm.textContent = t('ca_need'); cm.hidden = false; } return; }
      if (chg) touch();
      renderShell(); say(t('m_ad'));
    }
    else if (act === 'ca-view') { if (applyCarta()) touch(); if (cEdit) location.hash = 'adelanto/' + encodeURIComponent(cEdit); }
    else if (act === 'ca-close') { if (applyCarta()) touch(); cEdit = null; fEdit = null; cDel = null; renderShell(); }
    else if (act === 'fr-add') {
      if (applyCarta()) touch();
      var cf = cartaById(cEdit), ftxt = ((document.getElementById('fr-texto') || {}).value || '').replace(/\s+$/, '');
      if (!cf || !ftxt.trim()) return;
      cf.frags = cf.frags || [];
      var fe = fEdit ? cf.frags.filter(function (x) { return x.id === fEdit; })[0] : null;
      if (fe) fe.texto = ftxt; else cf.frags.push({ id: cuid('f'), on: true, fecha: today(), texto: ftxt });
      fEdit = null; cDel = null; touch(); renderArchivista();
      var fl = document.getElementById('fr-texto'); if (fl) fl.scrollIntoView({ block: 'nearest' });
    }
    else if (act === 'fr-edit') {
      if (applyCarta()) touch();
      fEdit = id; cDel = null; renderArchivista();
      var ft = document.getElementById('fr-texto'); if (ft) { ft.scrollIntoView({ block: 'center' }); ft.focus({ preventScroll: true }); }
    }
    else if (act === 'fr-cancel') { fEdit = null; renderArchivista(); }
    else if (act === 'fr-toggle') {
      if (applyCarta()) touch();
      var cf2 = cartaById(cEdit), fx = cf2 ? (cf2.frags || []).filter(function (x) { return x.id === id; })[0] : null;
      if (fx) { fx.on = fx.on === false; touch(); }
      cDel = null; renderArchivista();
    }
    else if (act === 'fr-del') {
      if (cDel !== 'f:' + id) { cDel = 'f:' + id; renderArchivista(); return; }
      var cf3 = cartaById(cEdit); if (cf3) cf3.frags = (cf3.frags || []).filter(function (x) { return x.id !== id; });
      if (fEdit === id) fEdit = null;
      cDel = null; touch(); renderArchivista();
    }
    else if (act === 'discard') { DATA = parseData(ORIGINAL); dirty = 0; saveErr = ''; editingId = null; catalogLink = null; importList = []; cEdit = null; fEdit = null; cDel = null; renderShell(); }
    else if (act === 'err-ok') { saveErr = ''; saveOk = ''; updateSaveBar(); }
  });


  /* ---------- cielo de constelaciones ---------- */
  // Constelaciones reales, del catalogo Hipparcos y sus figuras modernas: cada estrella es [x, y, magnitud],
  // ya proyectada (norte arriba, este a la izquierda, como se ve el cielo) en una caja de lado 1; d es su tamano real en grados,
  // ra y de el punto del cielo donde esta (ascension recta en horas, declinacion en grados).
  var CONSTELLATIONS = [
    { es: 'Orión', en: 'Orion', d: 30.2, ra: 5.43, de: 7, s: [[-.298,-.319,4.4],[-.187,-.5,4.4],[-.262,-.498,4.6],[-.334,-.301,4.5],[-.261,-.147,4.1],[-.203,-.071,.5],[.044,-.034,1.6],[.29,-.162,4.6],[.264,.118,4.5],[.3,.094,3.7],[.324,-.012,3.7],[.334,-.057,3.2],[.326,-.121,4.3],[.276,-.274,4.1],[.209,-.336,4.7],[.167,-.341,4.8],[.132,.45,.2],[.049,.256,3.4],[-.013,.186,2.2],[-.038,-.153,3.4],[-.086,.241,1.7],[-.145,.5,2.1],[-.048,.216,1.7],[-.042,.373,2.8],[.188,.346,2.8],[-.054,-.526,3],[.107,.405,3.6],[-.069,.263,3.8],[-.372,.385,4]], e: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[8,9],[9,10],[10,11],[11,12],[12,7],[7,13],[13,14],[14,15],[16,17],[17,18],[18,6],[6,19],[19,5],[5,20],[20,21],[20,22],[22,18]] },
    { es: 'Osa Mayor', en: 'Ursa Major', d: 46.1, ra: 10.91, de: 52.6, s: [[-.149,-.222,3.3],[.064,-.29,1.8],[.066,-.173,2.3],[-.102,-.134,2.4],[-.267,-.241,1.8],[-.362,-.264,2.2],[-.5,-.201,1.9],[-.1,-.002,3.7],[-.024,.333,3.5],[-.025,.368,3.8],[.029,.084,3],[.22,.144,3.1],[.237,.111,3.5],[.291,-.35,3.6],[.459,-.368,3.4],[.265,-.251,3.8],[.286,-.144,4.5],[.36,-.109,3.2],[.5,-.073,3.1],[.492,-.049,3.6],[-.431,.12,2.9],[.514,.247,3.1],[.093,.312,3.8],[.508,.191,3.8],[.547,.059,4]], e: [[0,1],[1,2],[2,3],[3,0],[0,4],[4,5],[5,6],[3,7],[7,8],[8,9],[7,10],[10,11],[10,12],[1,13],[13,14],[14,15],[15,2],[2,16],[16,17],[17,18],[19,17]] },
    { es: 'Osa Menor', en: 'Ursa Minor', d: 18.8, ra: 15.76, de: 80, s: [[-.04,.188,4.3],[-.148,.289,5],[.06,.5,3],[.154,.358,2.1],[-.154,-.052,4.2],[-.126,-.299,4.3],[-.057,-.5,2]], e: [[0,1],[1,2],[2,3],[3,0],[0,4],[4,5],[5,6]] },
    { es: 'Casiopea', en: 'Cassiopeia', d: 12.5, ra: .99, de: 60.4, s: [[-.5,-.308,3.4],[-.276,.006,2.7],[.013,-.02,2.1],[.195,.308,2.2],[.5,.057,2.3],[.096,.211,3.5]], e: [[0,1],[1,2],[2,3],[3,4]] },
    { es: 'Lira', en: 'Lyra', d: 6.9, ra: 18.81, de: 36.5, s: [[.103,-.209,4.3],[.111,-.5,4.6],[.323,-.384,0],[-.178,-.107,4.2],[-.323,.5,3.2],[-.052,.406,3.5]], e: [[0,1],[1,2],[2,0],[0,3],[3,4],[4,5],[5,0]] },
    { es: 'Cisne', en: 'Cygnus', d: 25.8, ra: 20.16, de: 40.7, s: [[-.436,.383,3.2],[-.196,.266,2.5],[.006,.035,2.2],[.268,-.159,2.9],[.341,-.425,3.8],[.407,-.5,3.8],[-.118,-.169,1.2],[.205,.236,3.9],[.436,.5,3],[-.287,-.138,3.7],[-.398,.077,3.7],[.073,-.215,3.8],[-.248,-.023,3.9],[.061,-.254,4],[-.472,-.244,4]], e: [[0,1],[1,2],[2,3],[3,4],[4,5],[6,2],[2,7],[7,8]] },
    { es: 'Cruz del Sur', en: 'Southern Cross', d: 6, ra: 12.5, de: -59.7, s: [[-.347,-.058,1.2],[.347,-.218,2.8],[.09,.5,.8],[-0,-.5,1.6],[.204,.052,3.6]], e: [[0,1],[2,3]] },
    { es: 'Can Mayor', en: 'Canis Major', d: 18.3, ra: 6.9, de: -22.4, s: [[.384,-.166,2],[.092,-.242,-1.4],[-.137,.147,3],[-.2,.288,1.8],[-.117,.371,3.5],[-.079,.427,1.5],[.376,.5,3],[-.384,.455,2.5],[-.052,-.225,4.4],[-.152,-.302,4.1],[-.026,-.5,4.1],[-.026,.165,3.9],[.2,-.101,4]], e: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[7,3],[1,8],[8,9],[9,10],[10,8]] },
    { es: 'Boyero', en: 'Boötes', d: 38.4, ra: 14.46, de: 32.5, s: [[.258,.392,4.5],[.209,.37,2.7],[.077,.355,-.1],[-.021,.064,3.6],[-.02,-.143,3],[-.168,-.205,3.5],[-.258,-.028,3.5],[-.098,.148,2.4],[-.085,.5,3.8],[.054,-.348,4.2],[.061,-.5,4.5],[.012,-.5,4],[.176,-.442,1.9]], e: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,2],[2,8],[4,9],[9,10],[10,11],[11,9]] },
    { es: 'Corona Boreal', en: 'Corona Borealis', d: 7.3, ra: 15.73, de: 28.1, s: [[.34,-.363,4.1],[.5,-.059,3.7],[.301,.273,2.2],[.056,.333,3.8],[-.155,.363,4.6],[-.397,.248,4.1],[-.5,-.163,5]], e: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6]] },
    { es: 'Hércules', en: 'Hercules', d: 32.6, ra: 17.03, de: 33, s: [[.319,.34,3.7],[.253,.272,2.8],[.159,-.036,2.8],[.138,-.261,3.5],[.183,-.372,4.2],[.251,-.5,3.9],[.316,-.465,4.2],[.419,-.404,4.6],[.035,-.012,3.9],[-.057,-.194,3.2],[-.308,-.229,3.9],[-.109,-.207,4.2],[-.068,.174,3.1],[-.279,.072,3.4],[-.351,.016,3.7],[-.419,.022,3.8],[-.073,.5,2.8],[-.231,.552,2.1],[-.179,-.488,3.8]], e: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[2,8],[3,9],[10,11],[11,9],[9,8],[8,12],[12,13],[13,14],[14,15],[16,1]] },
    { es: 'Águila', en: 'Aquila', d: 18.9, ra: 19.65, de: 4.8, s: [[-.098,-.322,2.7],[-.158,-.23,.8],[-.218,-.1,3.7],[-.433,.283,3.2],[-.182,.187,3.9],[.175,.075,3.4],[.432,-.5,3],[.433,.5,3.4]], e: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,1],[1,5],[5,7]] },
    { es: 'Pegaso', en: 'Pegasus', d: 36.7, ra: 22.73, de: 21, s: [[.29,-.37,4.3],[.099,-.283,2.9],[-.026,-.226,2.4],[-.414,-.292,2.1],[-.5,.091,2.8],[-.044,.125,2.5],[.075,.21,4.2],[.11,.247,3.4],[.326,.37,3.5],[.5,.259,2.4],[.056,-.129,3.5],[.078,-.101,4],[.322,-.156,3.8],[.459,-.176,4.1]], e: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[5,2],[2,10],[10,11],[11,12],[12,13]] },
    { es: 'Andrómeda', en: 'Andromeda', d: 33.5, ra: .56, de: 38.6, s: [[-.5,-.235,2.1],[-.223,.018,2.1],[-.041,.171,3.3],[.162,.219,2.1],[-.168,.391,4.4],[-.099,.368,4.1],[-.036,.217,4.3],[-.024,.085,4.3],[.297,-.223,4.3],[.5,-.237,3.6],[.28,-.253,4.2],[.285,-.319,3.8],[-.139,-.061,3.9],[-.095,-.136,4.5],[-.186,-.328,4.3],[-.322,-.391,3.6],[.241,-.311,5],[-.522,.158,3.4]], e: [[0,1],[1,2],[2,3],[4,5],[5,6],[6,2],[2,7],[7,8],[8,9],[8,10],[10,11],[1,12],[12,13],[13,14],[14,15],[10,16]] },
    { es: 'Perseo', en: 'Perseus', d: 24.2, ra: 3.39, de: 45.2, s: [[-.332,.487,3.8],[-.42,.498,2.8],[-.447,.331,4],[-.42,.157,2.9],[-.313,.059,3.8],[-.283,-.155,3],[-.238,-.169,4.3],[-.154,-.236,1.8],[-.033,-.391,2.9],[.043,-.498,3.8],[.035,-.366,3.9],[-.051,-.229,4],[-.045,-.032,3.8],[-.028,.129,2.1],[-.05,.186,4.6],[0,.215,3.3],[.049,.178,4.7],[.038,.122,5.9],[-.432,-.276,4.2],[-.5,-.205,4.1],[-.462,-.17,4],[.117,-.227,4.1],[.5,-.378,4],[.458,.001,2.1],[.482,.313,3]], e: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[12,13],[13,14],[14,15],[15,16],[16,17],[17,13],[18,19],[19,20],[20,5],[11,21],[21,22]] },
    { es: 'Auriga', en: 'Auriga', d: 26.1, ra: 5.41, de: 41.3, s: [[-.214,-.141,1.9],[.076,-.17,.1],[.153,.011,3.2],[.245,.316,2.7],[.008,.5,1.6],[-.245,.155,2.6],[-.175,-.5,3.7],[.18,-.091,3],[.183,.015,3.7],[-.177,.086,4]], e: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,6],[6,1],[1,7],[7,8]] },
    { es: 'Cefeo', en: 'Cepheus', d: 21.8, ra: 21.84, de: 63.9, s: [[.343,.169,4.2],[.277,.243,3.4],[.096,.243,2.5],[-.031,.427,4.2],[-.225,.5,4.2],[-.195,.449,3.4],[-.304,.427,4.1],[-.343,.055,3.5],[-.333,-.5,3.2],[.012,-.116,3.2],[.386,-.214,3.8]], e: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,2],[9,7]] },
    { es: 'Cuervo', en: 'Corvus', d: 8.2, ra: 12.33, de: -21, s: [[.361,.5,4],[.318,.243,3],[.162,-.377,2.6],[-.248,-.5,2.9],[-.361,.34,2.6]], e: [[0,1],[1,2],[2,3],[3,4],[4,1]] },
    { es: 'Delfín', en: 'Delphinus', d: 4.8, ra: 20.67, de: 14.6, s: [[.338,.5,4],[.116,-.182,3.6],[.011,-.455,3.8],[-.338,-.5,5.2],[-.18,-.281,4.4]], e: [[0,1],[1,2],[2,3],[3,4],[4,1]] },
    { es: 'Dragón', en: 'Draco', d: 35, ra: 16.82, de: 66.3, s: [[-.354,.32,3.7],[-.405,.468,2.2],[-.285,.469,2.8],[-.28,.385,4.9],[-.472,-.068,3.1],[-.308,-.101,4.2],[-.161,.096,3.2],[-.017,.214,2.7],[.073,.287,4],[.203,.241,3.3],[.373,-.026,3.7],[.426,-.324,3.9],[.5,-.469,3.8],[-.294,-.139,3.5],[-.5,-.184,3.8],[.12,-.199,2.1],[.09,-.112,3]], e: [[0,1],[1,2],[2,3],[3,0],[0,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[5,13],[4,14]] },
    { es: 'Aries', en: 'Aries', d: 12.8, ra: 2.18, de: 22.8, s: [[-.5,-.321,3.6],[.246,-0,2],[.476,.203,2.6],[.5,.321,3.9]], e: [[0,1],[1,2],[2,3]] },
    { es: 'Tauro', en: 'Taurus', d: 32, ra: 4.3, de: 14.6, s: [[-.5,-.224,3],[-.048,-.049,.9],[.007,-.028,3.4],[.073,-.02,3.6],[.05,-.08,3.8],[.008,-.132,3.5],[-.391,-.454,1.6],[.219,.077,3.4],[.481,.155,3.7],[.203,.281,3.9],[.5,.177,3.6],[.414,.454,4.3],[-.441,.256,1.6],[-.542,.497,1.7],[-.506,.469,2.2],[.306,-.291,2.9],[-.162,.248,3.2],[-.513,.137,3.4],[.294,-.288,3.6],[-.173,.291,3.7],[-.2,.39,3.7],[.325,-.292,3.7]], e: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[3,7],[7,8],[8,9],[8,10],[10,11]] },
    { es: 'Géminis', en: 'Gemini', d: 20.5, ra: 7.04, de: 23.1, s: [[.5,-.021,3.3],[.408,-.014,2.9],[.168,-.131,3.1],[-.129,-.378,4.4],[-.372,-.469,1.6],[-.5,-.288,1.2],[-.402,-.225,4.1],[-.237,.023,3.5],[-.056,.095,4],[.253,.294,1.9],[.168,.469,3.4],[-.221,.29,3.6],[-.504,-.109,3.6],[-.289,-.263,3.8]], e: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[7,11]] },
    { es: 'Cáncer', en: 'Cancer', d: 19.5, ra: 8.7, de: 17.9, s: [[-.265,.365,4.3],[-.091,.044,3.9],[-.074,-.125,4.7],[-.111,-.5,4],[.265,.5,3.5]], e: [[0,1],[1,2],[2,3],[1,4]] },
    { es: 'Leo', en: 'Leo', d: 29.4, ra: 10.54, de: 19.4, s: [[.337,.243,1.4],[.341,.079,3.5],[.236,-.023,2],[-.196,-.056,2.6],[-.5,.125,2.1],[-.208,.118,3.3],[.259,-.146,3.4],[.441,-.243,3.9],[.5,-.17,3],[-.298,.282,4]], e: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[2,6],[6,7],[7,8]] },
    { es: 'Virgo', en: 'Virgo', d: 45.6, ra: 13.27, de: -.4, s: [[.5,-.151,4],[.474,-.042,3.6],[.31,.013,3.9],[.189,.03,2.7],[.034,.119,4.4],[-.049,.243,1],[-.329,.132,4.1],[-.481,.127,3.9],[.076,-.243,2.9],[.113,-.077,3.4],[-.102,.011,3.4],[-.25,-.036,4.2],[-.5,-.045,3.7]], e: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[8,9],[9,3],[4,10],[10,11],[11,12]] },
    { es: 'Libra', en: 'Libra', d: 20.5, ra: 15.34, de: -20.6, s: [[.104,.279,3.2],[.27,-.167,2.8],[-.035,-.5,2.6],[-.255,-.233,3.9],[-.255,.419,3.6],[-.27,.5,3.7]], e: [[0,1],[1,2],[2,3],[3,4],[4,5],[1,3]] },
    { es: 'Escorpio', en: 'Scorpius', d: 23.4, ra: 16.81, de: -33.6, s: [[.48,-.221,2.9],[.481,-.373,2.3],[.441,-.5,2.6],[.266,-.262,2.9],[.185,-.23,1.1],[.121,-.156,2.8],[-.013,.102,2.3],[-.026,.263,3],[-.046,.448,3.6],[-.183,.491,3.3],[-.381,.5,1.9],[-.481,.389,3],[-.446,.336,2.4],[-.382,.244,1.6],[-.357,.25,2.7],[-.521,.26,3.2],[-.324,-.283,3.3],[.407,.303,3.4],[.484,-.086,3.9],[.424,-.464,3.9],[.513,.11,4],[.375,-.52,4]], e: [[0,1],[1,2],[1,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[12,13]] },
    { es: 'Sagitario', en: 'Sagittarius', d: 28.7, ra: 19.06, de: -27.9, s: [[.31,.243,3.1],[.271,.155,1.8],[.309,-.002,2.7],[.268,-.161,2.8],[.395,-.304,3.8],[-.134,.5,4],[-.149,.364,4],[-.006,-.015,2.6],[.126,-.113,3.2],[-.354,.427,4.1],[-.415,.199,4.4],[-.422,-.119,4.7],[-.275,-.181,4.6],[-.185,-.199,5],[-.107,-.175,4.9],[.052,-.14,2],[.422,.031,3],[-.039,-.092,3.3],[-.022,-.299,3.8],[-.063,-.324,2.9],[-.129,-.395,4.9],[-.164,-.433,3.9],[-.167,-.5,4.5],[.035,-.321,3.5],[.063,-.263,4.9]], e: [[0,1],[1,2],[2,3],[3,4],[5,6],[6,7],[7,8],[8,3],[9,10],[10,11],[11,12],[12,13],[13,14],[14,15],[15,8],[8,2],[2,16],[16,1],[1,7],[7,17],[17,15],[15,18],[18,19],[19,20],[20,21],[21,22],[18,23],[23,24],[24,15]] },
    { es: 'Capricornio', en: 'Capricornus', d: 21.7, ra: 21.01, de: -18.8, s: [[.5,-.326,4.3],[.457,-.223,3],[.363,-.087,4.8],[.166,.251,4.1],[.105,.326,4.1],[-.263,.123,3.8],[-.5,-.156,2.9],[-.421,-.136,3.7],[-.224,-.136,4.3],[-.044,-.121,4.1],[.495,-.325,3.6]], e: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,0]] },
    { es: 'Acuario', en: 'Aquarius', d: 42.9, ra: 22.39, de: -8.3, s: [[.5,.005,3.8],[.471,-.009,4.7],[.244,-.1,2.9],[.045,-.227,3],[-.048,-.202,3.9],[-.09,-.234,3.6],[-.128,-.232,4],[-.227,-.056,3.7],[-.373,-.015,4.4],[-.313,.267,3.7],[.038,.09,4.3],[-.02,-.053,4.2],[-.069,-.267,4.8],[-.39,.246,4],[-.5,.199,4.8],[.147,.145,2.9],[-.235,.137,3.3],[.186,.16,3.7],[-.376,-.31,3.7],[.254,.3,3.8]], e: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[2,10],[3,11],[5,12],[13,8],[8,14]] },
    { es: 'Piscis', en: 'Pisces', d: 45.2, ra: .63, de: 9.6, s: [[-.212,-.196,4.7],[-.195,-.321,4.5],[-.238,-.259,4.7],[-.203,-.116,4.7],[-.316,.007,3.6],[-.399,.143,4.3],[-.5,.284,3.8],[-.451,.276,4.6],[-.381,.226,4.5],[-.317,.214,4.8],[-.225,.184,5.2],[-.165,.179,4.3],[-.087,.186,4.4],[.185,.2,4],[.293,.224,4.1],[.36,.205,4.3],[.404,.226,5],[.424,.273,3.7],[.37,.321,5],[.284,.311,4.5],[.259,.274,5],[.5,.257,4.5],[-.492,-.193,2],[.119,-.297,2.1],[.449,-.304,2.4],[.477,-.005,2.5],[-.432,-.125,2.6],[.104,.017,2.8],[.548,-.371,2.9],[-.035,-.334,3.3],[-.403,-.326,3.4],[.532,-.232,3.5]], e: [[0,1],[1,2],[2,0],[0,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[12,13],[13,14],[14,15],[15,16],[16,17],[17,18],[18,19],[19,20],[20,14],[17,21]] },
    { es: 'Pléyades', en: 'Pleiades', d: 1, ra: 3.78, de: 24.2, s: [[-.112,.146,2.9],[-.495,.197,3.6],[-.5,.113,5],[.484,.138,3.7],[.267,-.116,3.9],[.153,.303,4.1],[.407,-.216,4.3],[.5,-.039,5.5],[.248,-.303,5.8]], e: [[2,1],[1,0],[0,5],[5,3],[3,7],[7,6],[6,4],[4,0],[6,8]] }
  ];
  function initSky() {
    var fine = false;
    try { fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches; } catch (e) {}
    if (!fine || !window.requestAnimationFrame || !document.createElement('canvas').getContext) return;
    var cv = document.createElement('canvas');
    cv.id = 'sky'; cv.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(cv, document.body.firstChild);
    var ctx = cv.getContext('2d');
    if (!ctx) { cv.remove(); return; }
    document.documentElement.classList.add('has-sky');
    var W = 0, H = 0, dust = [], figs = [], mx = -9999, my = -9999, lastMove = -1e9, prev = 0, color = '#c9a24a', frame = 0, running = false;
    var GLOW = 170;       // dust stars brighten around the cursor
    var NEAR = 80;        // how close the cursor must pass to a line to wake a constellation
    var HOLD = 2600;      // a constellation the mouse has left stays lit this long while the mouse keeps moving
    var FADE = 5200;      // ms for the lines to fade out once the mouse rests
    var STILL = 300;      // no movement for this long = the mouse is resting
    // parallax: when the page scrolls the sky drifts up more slowly, the dust slower still, so the sky feels deep;
    // the constellations live on a band two screens tall that wraps around, so new ones keep rising into view
    var SKY_DEPTH = .24, DUST_DEPTH = .1, M = 230, P = 0, scrollS = 0, scrollV = 0, OMEGA = 4.6;
    function scrollTop() { return reduced ? 0 : (window.scrollY || window.pageYOffset || 0); }
    function readColor() { try { var c = getComputedStyle(document.documentElement).getPropertyValue('--gold').trim(); if (c) color = c; } catch (e) {} }
    function clamp(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
    function layout() {
      // a map of the real sky: right ascension runs across (east on the left, as when looking up, cut where the sky is
      // emptiest, between Cancer and Leo) and declination runs down the band, from the pole star at the top to the Southern Cross.
      // Each constellation starts at its true place, then neighbours nudge each other apart just enough not to overlap.
      P = Math.max(2 * H, H + 2 * M + 40);
      var n = CONSTELLATIONS.length, base = clamp(Math.sqrt(W * P / n) * .7, 150, 270), RA0 = 9.62, TOP = 84, BOT = -64;
      var byDec = CONSTELLATIONS.slice().sort(function (p, q) { return q.de - p.de; });
      var items = CONSTELLATIONS.map(function (C) {
        var size = base * clamp(Math.sqrt(C.d / 26), .4, 1), rad = size * .5;
        var fx = (((RA0 - C.ra) / 24) % 1 + 1) % 1;
        // the north holds more of these figures, so the declination scale is eased by rank to give them room
        var fy = .45 * (TOP - C.de) / (TOP - BOT) + .55 * byDec.indexOf(C) / (n - 1);
        var ax = rad * .7 + fx * (W - rad * 1.4), ay = P * (.06 + .88 * fy);
        return { C: C, size: size, rad: rad, ax: ax, ay: ay, x: ax, y: ay };
      });
      for (var it = 0; it < 220; it++) {
        for (var i = 0; i < n; i++) for (var j = i + 1; j < n; j++) {
          var o1 = items[i], o2 = items[j], dx = o2.x - o1.x, dy = o2.y - o1.y;
          dy -= Math.round(dy / P) * P;   // the band wraps from bottom to top
          var d = Math.sqrt(dx * dx + dy * dy) || .01, need = o1.rad + o2.rad + 12;
          if (d < need) { var push = (need - d) / 2 / d; dx *= push; dy *= push; o1.x -= dx; o1.y -= dy; o2.x += dx; o2.y += dy; }
        }
        items.forEach(function (o) { o.x += (o.ax - o.x) * .025; o.y += (o.ay - o.y) * .025; o.x = clamp(o.x, o.rad * .7, W - o.rad * .7); });
      }
      figs = items.map(function (o) {
        var C = o.C, size = o.size, cx = o.x, cy = ((o.y % P) + P) % P;
        var pts = C.s.map(function (p) {
          return { x: cx + p[0] * size, y: cy + p[1] * size, m: p[2], r: Math.max(.7, 2.45 - p[2] * .42), a: Math.max(.26, .64 - p[2] * .07), ph: Math.random() * 6.283, sp: Math.random() * .22 + .08 };
        });
        var adj = pts.map(function () { return []; });
        var E = C.e.map(function (e) {
          var A = pts[e[0]], B = pts[e[1]], dx = B.x - A.x, dy = B.y - A.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
          adj[e[0]].push([e[1], len]); adj[e[1]].push([e[0], len]);
          return { a: e[0], b: e[1], len: len, ux: dx / len, uy: dy / len, sa: len };
        });
        var top = 1e9, bot = -1e9;
        pts.forEach(function (p) { top = Math.min(top, p.y); bot = Math.max(bot, p.y); });
        // the name goes just under the figure
        return { C: C, s: pts, E: E, adj: adj, depth: pts.map(function () { return -1; }), arr: [], dur: 1, total: 1, T: 0, v: 0, t: -1e9, lx: cx, ly: bot + 12, cy: cy, top: top, bot: bot + 24, oy: 0 };
      });
    }
    function plan(f, x, y) {
      // connect-the-dots from the star nearest the cursor: at each step, every line leaving an already lit star
      // runs all the way to the next star
      var S = f.s, n = S.length, depth = [], queue = [], i, root = -1, best = Infinity;
      for (i = 0; i < n; i++) {
        depth.push(-1);
        var dx = S[i].x - x, dy = S[i].y - y, dd = dx * dx + dy * dy;
        if (f.adj[i].length && dd < best) { best = dd; root = i; }
      }
      if (root < 0) return;
      depth[root] = 0; queue.push(root);
      for (;;) {
        while (queue.length) {
          var u = queue.shift(), nb = f.adj[u];
          for (var k = 0; k < nb.length; k++) if (depth[nb[k][0]] < 0) { depth[nb[k][0]] = depth[u] + 1; queue.push(nb[k][0]); }
        }
        // a piece of the figure not joined to the rest starts one step in, from its star nearest the first one
        var w = -1, dw = Infinity;
        for (i = 0; i < n; i++) if (depth[i] < 0 && f.adj[i].length) { var g = Math.hypot(S[i].x - S[root].x, S[i].y - S[root].y); if (g < dw) { dw = g; w = i; } }
        if (w < 0) break;
        depth[w] = 1; queue.push(w);
      }
      var levels = 1;
      f.E.forEach(function (e) {
        // each line runs from the star lit first to the other one
        if (depth[e.b] < depth[e.a]) { e.from = e.b; e.to = e.a; } else { e.from = e.a; e.to = e.b; }
        e.lv = depth[e.from]; levels = Math.max(levels, e.lv + 1);
      });
      // each line takes its time, and the next step starts while the last one is still easing in, so the figure grows without jolts
      var dur = clamp(4800 / levels, 1000, 1800), gap = dur * .4, arr = [];
      for (i = 0; i < n; i++) arr.push(Infinity);
      // a star is reached when the first line coming into it lands; the starting stars are lit from the outset of their step
      f.E.forEach(function (e) { e.t0 = e.lv * gap; arr[e.to] = Math.min(arr[e.to], e.t0 + dur); });
      for (i = 0; i < n; i++) if (depth[i] >= 0 && arr[i] === Infinity) arr[i] = depth[i] * gap;
      f.depth = depth; f.arr = arr; f.dur = dur; f.total = (levels - 1) * gap + dur;
    }
    function resize() {
      var dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.min(360, Math.round(W * H / 4200));
      dust = [];
      for (var i = 0; i < n; i++) {
        var big = Math.random() < .05;
        dust.push({ b: big, x: Math.random() * W, y: Math.random() * H, r: big ? Math.random() * .9 + 1 : Math.random() * .9 + .3, a: big ? Math.random() * .3 + .4 : Math.random() * .38 + .12,
          p: Math.random() * 6.283, s: Math.random() * .25 + .1, vx: (Math.random() - .5) * .025, vy: (Math.random() - .5) * .03, g: 0 });
      }
      layout();
    }
    function segDist(px, py, ax, ay, bx, by) {
      var dx = bx - ax, dy = by - ay, l = dx * dx + dy * dy, u = l ? clamp(((px - ax) * dx + (py - ay) * dy) / l, 0, 1) : 0;
      var ex = ax + u * dx - px, ey = ay + u * dy - py;
      return Math.sqrt(ex * ex + ey * ey);
    }
    function touch(now) {
      // the moving cursor wakes every constellation whose lines it passes near
      figs.forEach(function (f) {
        for (var i = 0; i < f.E.length; i++) {
          var A = f.s[f.E[i].a], B = f.s[f.E[i].b];
          if (segDist(mx, my - f.oy, A.x, A.y, B.x, B.y) < NEAR) {
            if (f.v <= 0 && f.T <= 0) plan(f, mx, my - f.oy);
            f.t = now; return;
          }
        }
      });
    }
    function sparkle(x, y, k) {
      var w = k * .26;
      ctx.beginPath();
      ctx.moveTo(x, y - k); ctx.lineTo(x + w, y - w); ctx.lineTo(x + k, y); ctx.lineTo(x + w, y + w);
      ctx.lineTo(x, y + k); ctx.lineTo(x - w, y + w); ctx.lineTo(x - k, y); ctx.lineTo(x - w, y - w); ctx.closePath(); ctx.fill();
    }
    function ease(v) { return v * v * (3 - 2 * v); }
    function inOut(u) { return (1 - Math.cos(Math.PI * u)) / 2; }
    var GLOW_TAIL = 2800;  // ms a star keeps glowing after its line arrives
    var GLOW_RISE = 520;   // ms the glow takes to bloom
    var glowCv = document.createElement('canvas'), glowFor = '';
    glowCv.width = glowCv.height = 64;
    function glowSprite() {
      // a soft round halo in the palette's gold, redrawn only when the colour changes
      if (glowFor === color) return glowCv;
      glowFor = color;
      var g = glowCv.getContext('2d'), r = 201, gg = 162, bb = 74, m;
      g.clearRect(0, 0, 64, 64); g.fillStyle = color;
      var c = String(g.fillStyle);
      if ((m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})/i.exec(c))) { r = parseInt(m[1], 16); gg = parseInt(m[2], 16); bb = parseInt(m[3], 16); }
      else if ((m = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/.exec(c))) { r = +m[1]; gg = +m[2]; bb = +m[3]; }
      var rgb = r + ',' + gg + ',' + bb, gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(' + rgb + ',1)'); gr.addColorStop(.28, 'rgba(' + rgb + ',.42)'); gr.addColorStop(.6, 'rgba(' + rgb + ',.1)'); gr.addColorStop(1, 'rgba(' + rgb + ',0)');
      g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
      return glowCv;
    }
    function draw(time) {
      var dt = prev ? Math.min(50, time - prev) : 16, f60 = dt / 16.7, moving = time - lastMove < STILL;
      prev = time;
      if (!(frame++ % 20)) readColor();
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = color; ctx.strokeStyle = color;
      var i, st, decay = Math.pow(.99, f60), rise = 1 - Math.pow(.93, f60);
      // the sky follows the scroll with a gentle lag instead of jumping with each wheel notch
      var target = scrollTop();
      for (var rem = dt / 1000; rem > 0; rem -= .016) {
        var h = Math.min(rem, .016);
        scrollV += (OMEGA * OMEGA * (target - scrollS) - 2 * OMEGA * scrollV) * h;
        scrollS += scrollV * h;
      }
      if (Math.abs(target - scrollS) < .05 && Math.abs(scrollV) < .5) { scrollS = target; scrollV = 0; }
      var offD = scrollS * DUST_DEPTH, offC = scrollS * SKY_DEPTH;
      // loose dust: drifts, twinkles and brightens near the moving cursor, never joined by lines
      for (i = 0; i < dust.length; i++) {
        st = dust[i];
        if (!reduced) {
          st.x += st.vx * f60; st.y += st.vy * f60;
          if (st.x < 0) st.x += W; else if (st.x > W) st.x -= W;
          if (st.y < 0) st.y += H; else if (st.y > H) st.y -= H;
        }
        var yy = st.y - offD; yy -= Math.floor(yy / H) * H;
        var dx = st.x - mx, dy = yy - my, d = Math.sqrt(dx * dx + dy * dy);
        var want = moving && d < GLOW ? ease(1 - d / GLOW) * .8 : 0;
        st.g = want > st.g ? st.g + (want - st.g) * rise : st.g * decay;
        var wave = Math.sin(time / 1000 * st.s + st.p), tw = reduced ? 1 : (st.b ? .62 + .38 * wave : .72 + .28 * wave);
        ctx.globalAlpha = clamp(st.a * tw + st.g * .6, 0, 1);
        if (st.b) sparkle(st.x, yy, (st.r + st.g) * (reduced ? 2.6 : 2.45 + .25 * wave));
        else { ctx.beginPath(); ctx.arc(st.x, yy, st.r + st.g, 0, 6.2832); ctx.fill(); }
      }
      // the constellations: lines first, then the stars over them, so every joint sits under its star
      ctx.lineWidth = 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (var n = 0; n < figs.length; n++) {
        var fg = figs[n], E = fg.E, S = fg.s;
        if (moving && time - fg.t < HOLD) fg.v = Math.min(1, fg.v + dt / 1300);
        else if (fg.v > 0) { fg.v = Math.max(0, fg.v - dt / FADE); if (!fg.v) fg.T = 0; }
        if (fg.v > 0 && fg.T < fg.total + GLOW_TAIL) fg.T = reduced ? fg.total + GLOW_TAIL : fg.T + dt;
        var vis = ease(fg.v), T = fg.T, full = T >= fg.total;
        // where this figure sits on the wrapping band right now; skip drawing it while it is off screen
        var yc = fg.cy - offC; yc = ((yc + M) % P + P) % P - M; fg.oy = yc - fg.cy;
        if (fg.top + fg.oy > H + 30 || fg.bot + fg.oy < -30) continue;
        ctx.save(); ctx.translate(0, fg.oy);
        if (vis > 0) {
          ctx.globalAlpha = vis * .66;
          ctx.beginPath();
          for (i = 0; i < E.length; i++) {
            var e = E[i];
            if (full) { ctx.moveTo(S[e.a].x, S[e.a].y); ctx.lineTo(S[e.b].x, S[e.b].y); continue; }
            // each line eases out of its star and eases into the next one, touching both
            var u = clamp((T - e.t0) / fg.dur, 0, 1);
            if (u <= 0) continue;
            var k = inOut(u), A = S[e.from], B = S[e.to];
            ctx.moveTo(A.x, A.y); ctx.lineTo(A.x + (B.x - A.x) * k, A.y + (B.y - A.y) * k);
          }
          ctx.stroke();
          // a soft glow blooms on each star as its line arrives, then fades away
          var spr = glowSprite();
          for (i = 0; i < S.length; i++) {
            if (fg.depth[i] < 0) continue;
            var since = T - fg.arr[i];
            if (since < -GLOW_RISE || since > GLOW_TAIL) continue;
            var gl = since < 0 ? ease((since + GLOW_RISE) / GLOW_RISE) : 1 - ease(since / GLOW_TAIL);
            if (gl <= .01) continue;
            var R = 11 + S[i].r * 5;
            ctx.globalAlpha = vis * gl * .5;
            ctx.drawImage(spr, S[i].x - R, S[i].y - R, R * 2, R * 2);
          }
        }
        for (i = 0; i < S.length; i++) {
          st = S[i];
          // each star of the figure brightens as its line arrives; the other stars of that patch of sky only a little
          var lit = 0, dp = fg.depth[i];
          if (vis > 0) lit = dp < 0 ? vis * .5 * ease(clamp(T / fg.total, 0, 1)) : vis * ease(clamp((T - fg.arr[i] + 420) / 900, 0, 1));
          var tw2 = reduced ? 1 : .82 + .18 * Math.sin(time / 1000 * st.sp + st.ph);
          ctx.globalAlpha = Math.min(1, st.a * tw2 + lit * .4);
          if (st.m < 1.1) sparkle(st.x, st.y, (st.r + lit * .6) * 2.4);
          else { ctx.beginPath(); ctx.arc(st.x, st.y, st.r + lit * .55, 0, 6.2832); ctx.fill(); }
        }
        // its name, once most of it is drawn
        var la = vis * ease(clamp((fg.T / fg.total - .5) * 1.6, 0, 1)) * .5;
        if (la > .01) {
          ctx.globalAlpha = la;
          ctx.font = '600 7.5px Cinzel, "Cormorant Garamond", Georgia, serif';
          try { ctx.letterSpacing = '1.6px'; } catch (e) {}
          ctx.textAlign = 'center'; ctx.textBaseline = 'top';
          var name = LANG === 'en' ? fg.C.en : fg.C.es, half = ctx.measureText(name).width / 2 + 10;
          ctx.fillText(name, clamp(fg.lx, half, W - half), fg.ly);
          try { ctx.letterSpacing = '0px'; } catch (e) {}
        }
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }
    function loop(time) { if (!running) return; draw(time); requestAnimationFrame(loop); }
    function start() { if (running || document.hidden) return; running = true; prev = 0; requestAnimationFrame(loop); }
    scrollS = scrollTop();
    resize(); readColor();
    var rt;
    // scrolling slides the sky under a resting cursor: what passes beneath it lights up too
    window.addEventListener('scroll', function () { if (mx > -9000) { lastMove = performance.now(); touch(lastMove); } }, { passive: true });
    window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(resize, 150); });
    window.addEventListener('mousemove', function (e) {
      if (e.clientX === mx && e.clientY === my) return;
      mx = e.clientX; my = e.clientY; lastMove = performance.now(); touch(lastMove);
    }, { passive: true });
    window.addEventListener('mouseout', function (e) { if (!e.relatedTarget) { mx = -9999; my = -9999; } });
    document.addEventListener('visibilitychange', function () { if (document.hidden) running = false; else start(); });
    start();
  }

  /* ---------- GitHub Pages: la archivista entra con su token y guarda en sus dos repos ----------
     El repo público guarda la página (index.html) solo con lo visible; el privado guarda data.json con todo,
     lo oculto incluido. Lo que se ve sin token es exactamente lo que ve la comunidad. */
  var GH_CFG = { owner: '', repo: '', priv: 'ImBabyLilith-PrivateArchive', branch: 'main' };
  var GH = null, GH_TOKEN_KEY = 'archivo-gh-token', ghPrivSha = null, ghPrivOk = false, ghLogin = false, ghBusy = false, ghErr = '';
  (function () {
    if (window.claude && typeof window.claude.use === 'function') return;
    var owner = GH_CFG.owner, repo = GH_CFG.repo, m = /^([a-z0-9-]+)\.github\.io$/i.exec(location.hostname);
    if (!owner && m) {
      owner = m[1].toLowerCase();
      var seg = location.pathname.split('/').filter(Boolean)[0];
      repo = seg && !/\.html?$/i.test(seg) ? seg : owner + '.github.io';
    }
    if (owner && repo) GH = { owner: owner, repo: repo, priv: GH_CFG.priv, branch: GH_CFG.branch };
  })();
  function ghToken() { try { return localStorage.getItem(GH_TOKEN_KEY) || ''; } catch (e) { return ''; } }
  function ghApi(path, opts, tok) {
    opts = opts || {};
    var h = { Accept: 'application/vnd.github+json', Authorization: 'Bearer ' + (tok || ghToken()), 'X-GitHub-Api-Version': '2022-11-28' };
    if (opts.body) h['Content-Type'] = 'application/json';
    return fetch('https://api.github.com' + path, { method: opts.method || 'GET', cache: 'no-store', headers: h, body: opts.body ? JSON.stringify(opts.body) : undefined })
      .then(function (r) {
        return r.text().then(function (txt) {
          var j = null; try { j = txt ? JSON.parse(txt) : null; } catch (e) {}
          if (!r.ok) { var err = new Error((j && j.message) || ('HTTP ' + r.status)); err.status = r.status; throw err; }
          return j;
        });
      });
  }
  function ghRepoPath(repo) { return '/repos/' + encodeURIComponent(GH.owner) + '/' + encodeURIComponent(repo); }
  function ghFile(repo, file) { return ghRepoPath(repo) + '/contents/' + file; }
  function b64enc(str) {
    var bytes = new TextEncoder().encode(str), bin = '';
    for (var i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  }
  function b64dec(b64) {
    var bin = atob(String(b64 || '').replace(/\s/g, '')), bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }
  function ghFootHtml() {
    if (!GH) return '';
    return IS_OWNER ? '<button type="button" class="link-btn" data-act="gh-out">' + esc(t('gh_out')) + '</button>'
      : '<button type="button" class="link-btn" data-act="gh-login">✦ ' + esc(t('gh_login')) + '</button>';
  }
  function ghDialogHtml() {
    if (!GH || !ghLogin || IS_OWNER) return '';
    return '<div class="overlay" role="dialog" aria-modal="true" aria-labelledby="gh-h"><div class="sheet gh-sheet">' +
      '<h2 id="gh-h">' + esc(t('gh_login')) + '</h2><p class="sub" style="margin:0">' + esc(t('gh_sub')) + '</p>' +
      '<div class="field"><label for="gh-tok">' + esc(t('gh_tok')) + '</label><input type="password" id="gh-tok" autocomplete="off" spellcheck="false"></div>' +
      (ghErr ? '<p class="err">' + esc(ghErr) + '</p>' : '') +
      '<p class="hint" style="margin:0"><a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noopener noreferrer">' + esc(t('gh_how')) + ' ↗</a></p>' +
      '<div class="row"><button type="button" class="btn-ghost" data-act="gh-cancel">' + esc(t('gh_cancel')) + '</button><button type="button" class="btn" data-act="gh-enter">' + esc(t('gh_enter')) + '</button></div>' +
      '</div></div>';
  }
  function ghEnter(tok, quiet) {
    if (!GH || !tok) return Promise.resolve(false);
    return ghApi(ghRepoPath(GH.repo), null, tok).then(function (r) {
      if (!r || !r.permissions || !r.permissions.push) { var e = new Error('no push'); e.status = 403; throw e; }
      try { localStorage.setItem(GH_TOKEN_KEY, tok); } catch (e2) {}
      return ghApi(ghFile(GH.priv, 'data.json?ref=' + encodeURIComponent(GH.branch)), null, tok).then(function (f) {
        ghPrivOk = true; ghPrivSha = f.sha;
        var txt = b64dec(f.content); ORIGINAL = txt; DATA = parseData(txt);
      }, function (e3) {
        if (e3.status !== 404) throw e3;
        // no data.json yet: fine if the private repo exists (the first save creates it)
        return ghApi(ghRepoPath(GH.priv), null, tok).then(function () { ghPrivOk = true; ghPrivSha = null; }, function () { ghPrivOk = false; });
      });
    }).then(function () {
      IS_OWNER = true; OWNER = !AS_VISITOR; ghLogin = false; ghBusy = false; ghErr = '';
      route(); renderShell();
      if (!ghPrivOk) { saveErr = t('gh_nopriv', { r: GH.priv }); updateSaveBar(); }
      return true;
    }, function (e) {
      ghBusy = false;
      var st = e && e.status;
      if (quiet) { if (st === 401) { try { localStorage.removeItem(GH_TOKEN_KEY); } catch (er) {} } return false; }
      ghErr = st === 401 || st === 403 || st === 404 ? t('gh_bad') : t('gh_net');
      renderShell();
      var gt = document.getElementById('gh-tok'); if (gt) gt.focus();
      return false;
    });
  }
  function publicData(D) {
    // what the public page carries: no hidden folios, no catalog queue, and no sneak peek that isn't shown
    var P = JSON.parse(JSON.stringify(D));
    P.recs = (P.recs || []).filter(function (r) { return !r.h; });
    P.pendientes = [];
    delete P.adelanto;
    P.cartas = (P.cartas || []).filter(cartaVisible).map(function (c) {
      if (c.tipo === 'capitulo') c.frags = (c.frags || []).filter(function (f) { return f.on !== false && String(f.texto || '').trim(); });
      return c;
    });
    return P;
  }
  function ghSiteUrl() {
    var root = GH.repo.toLowerCase() === (GH.owner + '.github.io').toLowerCase();
    return 'https://' + GH.owner + '.github.io/' + (root ? '' : GH.repo + '/');
  }
  function buildGhDoc(data) {
    var reset = (SKELETON_OPEN.match(/<style>[\s\S]*?<\/style>/) || [''])[0], site = ghSiteUrl();
    var desc = 'Lilith’s library of fanfic recs and reading list, with sneak peeks of Medieval MiChaeng.';
    var icon = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Ccircle cx='32' cy='32' r='29' fill='%23b8341f'/%3E%3Ccircle cx='32' cy='32' r='21' fill='none' stroke='%23e0704d' stroke-width='2'/%3E%3Ctext x='32' y='43' font-family='Georgia,serif' font-size='30' font-weight='700' text-anchor='middle' fill='%23f6d9b8'%3EL%3C/text%3E%3C/svg%3E";
    var metas = '<meta name="description" content="' + desc + '">\n<meta name="theme-color" content="#121419">\n<link rel="icon" href="' + icon + '">\n' +
      '<meta property="og:type" content="website">\n<meta property="og:site_name" content="Lilith’s Archive">\n<meta property="og:title" content="Lilith’s Archive">\n' +
      '<meta property="og:description" content="' + desc + '">\n<meta property="og:url" content="' + site + '">\n<meta property="og:image" content="' + site + 'og.png">\n' +
      '<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">\n<meta name="twitter:card" content="summary_large_image">\n' +
      '<meta name="twitter:title" content="Lilith’s Archive">\n<meta name="twitter:description" content="' + desc + '">\n<meta name="twitter:image" content="' + site + 'og.png">\n';
    return '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' + reset + '\n' + metas + HEAD_HTML +
      '\n<link rel="stylesheet" href="app.css">\n</head>\n<body>\n<div id="app"></div>\n' +
      '<script id="fic-data" type="application/json">' + safeJson(data) + '<\/script>\n<script src="app.js"><\/script>\n</body>\n</html>\n';
  }
  function ghSave() {
    if (!ghPrivOk) { saveErr = t('e_gh_nopriv', { r: GH.priv }); updateSaveBar(); return; }
    saving = true; saveErr = ''; updateSaveBar();
    DATA.meta.updated = today();
    var eb = document.querySelector('.eyebrow'); if (eb) eb.textContent = eyebrowTxt();
    var full = JSON.stringify(DATA, null, 1), pubData = publicData(DATA);
    var msg = 'Actualiza el archivo · ' + new Date().toISOString().slice(0, 16).replace('T', ' ');
    ghApi(ghFile(GH.priv, 'data.json'), { method: 'PUT', body: { message: msg, content: b64enc(full), sha: ghPrivSha || undefined, branch: GH.branch } })
      .then(function (r) {
        ghPrivSha = r && r.content && r.content.sha;
        // only the data changes: the published page keeps its own code, so a browser holding an older copy of the page can't roll the design back
        return ghApi(ghFile(GH.repo, 'index.html?ref=' + encodeURIComponent(GH.branch))).then(function (f) {
          var cur = f && f.content ? b64dec(f.content) : '', open = '<script id="fic-data" type="application/json">', i = cur.indexOf(open), j = i < 0 ? -1 : cur.indexOf('<\/script>', i);
          var doc = j < 0 ? buildGhDoc(pubData) : cur.slice(0, i + open.length) + safeJson(pubData) + cur.slice(j);
          return { sha: f.sha, doc: doc };
        }, function (e) { if (e.status === 404) return { sha: undefined, doc: buildGhDoc(pubData) }; throw e; });
      })
      .then(function (o) { return ghApi(ghFile(GH.repo, 'index.html'), { method: 'PUT', body: { message: msg, content: b64enc(o.doc), sha: o.sha, branch: GH.branch } }); })
      .then(function () { ORIGINAL = full; dirty = 0; saving = false; saveErr = ''; saveOk = t('m_saved_gh'); updateSaveBar(); clearTimeout(saveOkTimer); saveOkTimer = setTimeout(function () { saveOk = ''; updateSaveBar(); }, 6000); }, function (e) {
        saving = false;
        var st = e && e.status;
        saveErr = st === 409 ? t('e_gh_conflict') : (st === 401 || st === 403 || st === 404) ? t('e_gh_auth') : t('e_gen');
        updateSaveBar();
      });
  }

  route();
  renderShell();
  initSky();
  if (GH && ghToken()) ghEnter(ghToken(), true);

  if (window.claude && typeof window.claude.use === 'function') {
    window.claude.use('artifact').then(function (a) { ART = a; }, function () {});
    window.claude.use('user').then(function (u) { return u ? u.isOwner() : false; }).then(function (isO) {
      if (isO) { IS_OWNER = true; OWNER = !AS_VISITOR; route(); renderShell(); }
    }, function () {});
  }
})();
