/* TRACE v2.1: offline EN/FR/ES localization for all visitor and curator surfaces.
 * No translation API, network requests, visitor data collection, or translated source identifiers.
 * English is the canonical source. Live DOM updates are re-localized without mutating models.
 */
(function(){
'use strict';
const phrases=[];
function add(en,fr,es){if(en&&fr&&es)phrases.push([en,fr,es])}
[
["QUEST","QUÊTE","MISIÓN"],["MAP","CARTE","MAPA"],["MY FINDS","MES TROUVAILLES","MIS HALLAZGOS"],["GUIDE","GUIDE","GUÍA"],["MUSEUM","MUSÉE","MUSEO"],
["Switch museum","Changer de musée","Cambiar de museo"],["Choose a museum","Choisir un musée","Elige un museo"],["Close museum selector","Fermer le sélecteur de musée","Cerrar selector de museo"],
["TRACE · EXPLORE THE COLLECTIONS","TRACE · EXPLORER LES COLLECTIONS","TRACE · EXPLORAR LAS COLECCIONES"],
["Switch adventures at any time. Your completed artworks and saved discoveries stay with each museum.","Changez d’aventure à tout moment. Vos œuvres découvertes et vos progrès restent associés à chaque musée.","Cambia de aventura cuando quieras. Tus obras descubiertas y tus avances se conservan en cada museo."],
["Artwork locations and display status are not yet confirmed with either museum.","Les emplacements et les œuvres exposées ne sont pas encore confirmés par les musées.","Las ubicaciones y las obras expuestas aún no están confirmadas por los museos."],
["The Lost Colours","Les couleurs perdues","Los colores perdidos"],["The Hidden Signals","Les signes cachés","Las señales ocultas"],
["discoveries","découvertes","descubrimientos"],["discovery","découverte","descubrimiento"],["of 8 discoveries","sur 8 découvertes","de 8 descubrimientos"],["CURRENT","ACTUEL","ACTUAL"],
["LOADING SCANNER","CHARGEMENT DU SCANNEUR","CARGANDO ESCÁNER"],["SCAN READY","SCANNEUR PRÊT","ESCÁNER LISTO"],["IMAGE REFERENCES","IMAGES DE RÉFÉRENCE","IMÁGENES DE REFERENCIA"],
["Preparing the collection...","Préparation de la collection…","Preparando la colección…"],["All artwork matching happens privately on your device.","La reconnaissance des œuvres se fait uniquement sur votre appareil.","El reconocimiento de obras se realiza de forma privada en tu dispositivo."],
["ART BECOMES AN ADVENTURE","L’ART DEVIENT UNE AVENTURE","EL ARTE SE CONVIERTE EN AVENTURA"],
["There’s more","Il y a tant","Hay mucho más"],["to see.","à voir.","por ver."],
["Two institution-specific adventures using real collection artworks. Find a clue, scan the work, and unlock its story.","Deux aventures basées sur de véritables œuvres de musée. Trouvez un indice, photographiez l’œuvre et découvrez son histoire.","Dos aventuras con obras reales de museo. Encuentra una pista, escanea la obra y descubre su historia."],
["Spot a detail in an artwork","Repérer un détail dans une œuvre","Descubre un detalle de una obra"],
["Scan with a camera or upload a photo","Scanner avec l’appareil photo ou importer une image","Escanea con la cámara o sube una foto"],
["Discover, learn, and collect","Découvrir, apprendre et collectionner","Descubre, aprende y colecciona"],
["A live camera needs HTTPS and browser permission.","La caméra nécessite HTTPS et une autorisation du navigateur.","La cámara necesita HTTPS y permiso del navegador."],
["Scan this artwork","Scanner cette œuvre","Escanea esta obra"],["Take / Upload Photo","Prendre / importer une photo","Tomar / subir foto"],["ARTWORK VERIFIED","ŒUVRE RECONNUE","OBRA RECONOCIDA"],["NO CONFIDENT MATCH","AUCUNE CORRESPONDANCE FIABLE","SIN COINCIDENCIA FIABLE"],
["NOT AUTOMATICALLY VERIFIED","NON VÉRIFIÉ AUTOMATIQUEMENT","SIN VERIFICACIÓN AUTOMÁTICA"],["VISITOR CONFIRMATION","CONFIRMATION DU VISITEUR","CONFIRMACIÓN DEL VISITANTE"],
["Is this the same artwork?","Est-ce la même œuvre ?","¿Es la misma obra?"],["YOUR PHOTO · OPTIONAL","VOTRE PHOTO · FACULTATIVE","TU FOTO · OPCIONAL"],["MUSEUM REFERENCE","IMAGE DU MUSÉE","REFERENCIA DEL MUSEO"],
["No photo required.","Aucune photo nécessaire.","No hace falta foto."],
["You can compare by looking directly at the artwork. No photo required.","Vous pouvez comparer en regardant directement l’œuvre. Aucune photo nécessaire.","Puedes comparar mirando directamente la obra. No hace falta foto."],
["Take or choose one photo (optional)","Prendre ou choisir une photo (facultatif)","Tomar o elegir una foto (opcional)"],
["Retake or replace your photo","Reprendre ou remplacer votre photo","Repetir o cambiar tu foto"],
["Only photograph artworks where museum rules permit it. Photos stay on your device, and can be stored in your private discovery album after confirmation.","Photographiez seulement si le musée l’autorise. Vos photos restent sur votre appareil et peuvent être conservées dans votre carnet privé.","Fotografía solo donde el museo lo permita. Las fotos permanecen en tu dispositivo y pueden guardarse en tu álbum privado."],
["Look at the artwork in front of you and compare its visible shapes, colours, materials and details with the collection image. A single photo is optional.","Observez l’œuvre devant vous et comparez ses formes, couleurs, matériaux et détails à l’image de la collection. La photo est facultative.","Mira la obra y compara sus formas, colores, materiales y detalles con la imagen de la colección. La foto es opcional."],
["Check before confirming","À vérifier avant de confirmer","Comprueba antes de confirmar"],["Does the artwork really match? A sculpture may look different from this angle. If you are unsure, return to the clue or look again.","Est-ce vraiment la même œuvre ? Une sculpture peut paraître différente selon l’angle. En cas de doute, revenez à l’indice.","¿Es realmente la misma obra? Una escultura puede verse distinta desde otro ángulo. Si dudas, vuelve a la pista."],
["Confirm only if you can see the same artwork.","Confirmez uniquement si vous voyez la même œuvre.","Confirma solo si ves la misma obra."],
["This records your own observation, not an automatic image match.","Ceci enregistre votre observation et non une reconnaissance automatique.","Esto registra tu observación, no un reconocimiento automático."],
["Yes, I found this artwork","Oui, j’ai trouvé cette œuvre","Sí, encontré esta obra"],
["Try automatic camera scan","Essayer le scan automatique","Intentar escaneo automático"],
["Back to clue","Retour à l’indice","Volver a la pista"],["Try scanning again","Réessayer le scan","Volver a escanear"],["Try another scan","Réessayer le scan","Intentar otro escaneo"],["Compare with museum reference","Comparer avec l’image du musée","Comparar con la imagen del museo"],
["Camera unavailable? Compare with museum image","Caméra indisponible ? Comparer avec l’image du musée","¿No funciona la cámara? Compara con la imagen del museo"],
["Camera not working? Compare visually","Caméra en panne ? Comparer visuellement","¿No funciona la cámara? Compara visualmente"],
["Compare visually with museum reference","Comparer visuellement à l’image du musée","Comparar visualmente con la referencia del museo"],
["You found it!","Vous l’avez trouvée !","¡La encontraste!"],["Keep looking. You may have found the right work.","Continuez à chercher. C’est peut-être la bonne œuvre.","Sigue buscando. Puede que sea la obra correcta."],
["Discover its story","Découvrir son histoire","Descubrir su historia"],["Discover its story →","Découvrir son histoire →","Descubre su historia →"],
["Back to the clue","Retour à l’indice","Volver a la pista"],["Find artwork on map","Voir l’œuvre sur la carte","Buscar obra en el mapa"],
["Scan the artwork","Scanner l’œuvre","Escanear la obra"],["Checking camera permissions…","Vérification de l’accès caméra…","Comprobando permiso de cámara…"],
["Looking at the details…","Analyse des détails…","Analizando los detalles…"],["Matching your photo against published artworks from both collections, on this device.","Comparaison locale de votre photo avec les œuvres des deux collections.","Comparando tu foto con las obras de ambas colecciones en este dispositivo."],
["Frame the artwork and tap the white button.","Cadrez l’œuvre et touchez le bouton blanc.","Encuadra la obra y toca el botón blanco."],
["VISITOR COMPARISON","COMPARAISON VISITEUR","COMPARACIÓN DEL VISITANTE"],
["Look at the real artwork, then compare its subject, materials, colours and overall form with the museum reference.","Regardez l’œuvre réelle, puis comparez ses sujets, matériaux, couleurs et formes à l’image du musée.","Mira la obra real y compara su tema, materiales, colores y formas con la imagen del museo."],
["View official museum collection record","Voir la fiche officielle de l’œuvre","Ver ficha oficial de la obra"],
["Open official collection record","Ouvrir la fiche officielle","Abrir ficha oficial"],["Official museum artwork record","Fiche officielle de l’œuvre","Ficha oficial de la obra"],
["The scanner could not verify this exact artwork confidently.","Le scanner n’a pas pu identifier cette œuvre avec certitude.","El escáner no pudo identificar esta obra con certeza."],
["Your answer is a personal confirmation, not an automatic image match.","Votre réponse est une confirmation personnelle, pas une identification automatique.","Tu respuesta es una confirmación personal, no una coincidencia automática."],
["Your photo","Votre photo","Tu foto"],["Museum reference:","Image du musée :","Referencia del museo:"],
["THE STORY YOU UNLOCKED","L’HISTOIRE DÉCOUVERTE","LA HISTORIA REVELADA"],["THE STORY","L’HISTOIRE","LA HISTORIA"],
["THE MYSTERY","LE MYSTÈRE","EL MISTERIO"],["FIND THIS DETAIL","TROUVEZ CE DÉTAIL","ENCUENTRA ESTE DETALLE"],
["YOUR CLUE","VOTRE INDICE","TU PISTA"],["YOUR MISSION","VOTRE MISSION","TU MISIÓN"],
["MYSTERY","MYSTÈRE","MISTERIO"],["Power of","Pouvoir de","Poder de"],
["Ask Mica for a hint","Demander un indice à Mica","Pedir una pista a Mica"],["Need a clue?","Besoin d’un indice ?","¿Necesitas una pista?"],
["Help me find the gallery","M’aider à trouver la salle","Ayúdame a encontrar la sala"],
["Back to adventure map","Retour à la carte de l’aventure","Volver al mapa de aventuras"],
["Take one photo or compare visually","Prendre une photo ou comparer visuellement","Tomar una foto o comparar visualmente"],
["Scan artwork with camera","Scanner l’œuvre avec la caméra","Escanear obra con la cámara"],
["Visual identification preview","Aperçu d’identification visuelle","Vista previa de identificación visual"],
["Automatic recognition is not yet validated for this work.","La reconnaissance automatique n’est pas encore validée pour cette œuvre.","El reconocimiento automático aún no está validado para esta obra."],
["Observe it in person and compare with the official collection record.","Observez-la sur place et comparez-la à la fiche officielle.","Obsérvala en persona y compárala con la ficha oficial."],
["The work may not be on display.","L’œuvre n’est peut-être pas exposée.","Puede que la obra no esté expuesta."],
["Demo testing tools","Outils de test","Herramientas de prueba"],["Test matching with a reference","Tester la reconnaissance avec une référence","Probar reconocimiento con una referencia"],
["Not currently in the visitor adventure.","Non disponible dans l’aventure actuelle.","No disponible en la aventura actual."],
["MICA · YOUR ART GUIDE","MICA · VOTRE GUIDE D’ART","MICA · TU GUÍA DE ARTE"],
["A MAGICAL QUEST MAP","CARTE MAGIQUE DE L’AVENTURE","MAPA MÁGICO DE LA AVENTURA"],["ADVENTURE MAP","CARTE DE L’AVENTURE","MAPA DE AVENTURAS"],
["Where shall we explore?","Où explorerons-nous ?","¿Por dónde exploramos?"],
["works currently playable","œuvres accessibles dans le jeu","obras disponibles en el juego"],
["You found every currently available artwork in this museum!","Vous avez trouvé toutes les œuvres disponibles dans ce musée !","¡Encontraste todas las obras disponibles en este museo!"],
["Two mysteries are open. Find either to unlock the next.","Deux mystères sont ouverts. Résolvez-en un pour débloquer le suivant.","Hay dos misterios abiertos. Resuelve uno para desbloquear el siguiente."],
["Your first discovery opened another path!","Votre première découverte a ouvert un nouveau chemin !","¡Tu primer descubrimiento abrió otro camino!"],
["Only","Plus que","Solo quedan"],["currently available mysteries left!","mystères disponibles !","misterios disponibles."],
["DISCOVERED","DÉCOUVERTE","DESCUBIERTA"],["To discover","À découvrir","Por descubrir"],["Solved","Résolue","Resuelta"],
["New works are activated by museum administrators. The map shows adventures, not the real floor plan.","Les œuvres sont activées par le musée. Cette carte présente le jeu, pas le plan réel.","El museo activa las obras. Este mapa muestra la aventura, no el plano real."],
["Plan a 3-stop visit or choose your own available artworks in the MAP tab. Room locations require staff confirmation.","Planifiez trois arrêts ou choisissez vos œuvres avec l’onglet CARTE. Les salles doivent être confirmées par le personnel.","Planifica tres paradas o elige tus obras en MAPA. Las salas deben ser confirmadas por el personal."],
["A SECRET CHALLENGE HAS OPENED","UN DÉFI SECRET EST DÉBLOQUÉ","SE HA DESBLOQUEADO UN RETO SECRETO"],
["Connect the Artworks","Relier les œuvres","Conectar las obras"],
["Explore two completed works together, compare them through a sliding lens and collect an Art Connector badge.","Comparez deux œuvres découvertes à l’aide d’un curseur et gagnez un badge Connecteur d’art.","Compara dos obras descubiertas con un deslizador y consigue una insignia de Conector de arte."],
["Art Connector","Connecteur d’art","Conector de arte"],["saved connections","liens enregistrés","conexiones guardadas"],
["curated pairs per museum","paires par musée","parejas por museo"],
["Play the comparison bonus","Jouer au bonus de comparaison","Jugar el reto de comparación"],
["All available artworks discovered!","Toutes les œuvres disponibles ont été découvertes !","¡Descubiertas todas las obras disponibles!"],
["Come back when the museum activates more artworks. Your discoveries stay saved.","Revenez lorsque de nouvelles œuvres seront activées. Vos découvertes restent enregistrées.","Vuelve cuando se activen más obras. Tus descubrimientos quedan guardados."],
["Open my discovery passport","Ouvrir mon passeport de découvertes","Abrir mi pasaporte de descubrimientos"],
["How will you play?","Comment jouerez-vous ?","¿Cómo jugarás?"],["Switch modes without losing progress.","Changez de mode sans perdre vos progrès.","Cambia de modo sin perder tu progreso."],
["Family team","Équipe familiale","Equipo familiar"],["Solo explorer","Exploration solo","Exploración individual"],
["Share discoveries together","Partager les découvertes","Compartir descubrimientos"],["Play at your own pace","Avancer à votre rythme","Jugar a tu ritmo"],
["Little eyes","Petits yeux","Ojos curiosos"],["Detective","Détective","Detective"],["Explorer+","Explorateur+","Explorador+"],
["CHOOSE YOUR ADVENTURE STYLE","CHOISIS TON STYLE D’AVENTURE","ELIGE TU ESTILO DE AVENTURA"],
["Choose my next mystery","Choisir mon prochain mystère","Elegir mi próximo misterio"],["Plan my museum route","Planifier mon parcours","Planificar mi recorrido"],
["View my passport","Voir mon passeport","Ver mi pasaporte"],["See my discoveries","Voir mes découvertes","Ver mis descubrimientos"],
["Look carefully at the little picture. Can you find its matching artwork?","Regarde bien la petite image. Peux-tu retrouver l’œuvre ?","Mira bien la pequeña imagen. ¿Puedes encontrar la obra?"],
["Investigate the subject, composition and detail, then locate the matching work.","Examine le sujet, la composition et les détails, puis trouve l’œuvre.","Investiga el tema, la composición y los detalles y encuentra la obra."],
["Search for the artwork containing this unusual detail. Look at the real artwork before the phone.","Cherche l’œuvre qui contient ce détail étonnant. Regarde d’abord l’œuvre réelle.","Busca la obra con este detalle inusual. Mira primero la obra real."],
["Solo explorer: notice one tiny detail in the artwork before scanning. You can play at your own pace.","Exploration solo : remarquez un petit détail avant de scanner. Avancez à votre rythme.","Exploración individual: observa un pequeño detalle antes de escanear. Ve a tu ritmo."],
["Look together, then scan the artwork.","Observez ensemble, puis scannez l’œuvre.","Miren juntos y luego escaneen la obra."],
["Find your next discovery.","Trouvez votre prochaine découverte.","Encuentra tu próximo descubrimiento."],
["Take a break if you need one.","Faites une pause si nécessaire.","Descansa si lo necesitas."],
["POWER UNLOCKED","POUVOIR DÉBLOQUÉ","PODER DESBLOQUEADO"],["POWER RECOVERED","POUVOIR RETROUVÉ","PODER RECUPERADO"],
["Choose my next mystery","Choisir mon prochain mystère","Elegir mi próximo misterio"],
["You did it! Your eyes and imagination helped restore another piece of the lens.","Bravo ! Vos yeux et votre imagination ont restauré une partie de la lentille.","¡Lo lograste! Tus ojos y tu imaginación restauraron otra parte de la lente."],
["We recovered every power! Now the museum is full of possibilities.","Tous les pouvoirs sont retrouvés ! Le musée regorge de possibilités.","¡Recuperamos todos los poderes! El museo está lleno de posibilidades."],
["Collect your discovery","Enregistrer votre découverte","Guardar tu descubrimiento"],
["Complete the experiment first","Terminez d’abord l’expérience","Completa primero el experimento"],
["Use a guided alternative","Utiliser une autre méthode guidée","Usar una alternativa guiada"],
["Read the artwork story","Lire l’histoire de l’œuvre","Leer la historia de la obra"],
["CREATIVE CHALLENGE","DÉFI CRÉATIF","RETO CREATIVO"],
["TRACE ART-MAKING LAB","ATELIER CRÉATIF TRACE","TALLER CREATIVO TRACE"],
["Experiment with the illustration above to unlock this discovery.","Expérimentez avec l’illustration pour débloquer la découverte.","Experimenta con la ilustración para desbloquear el descubrimiento."],
["These illustrated experiments are creative interpretations, not exact models of the real objects.","Ces expériences illustrées sont des interprétations créatives, pas des modèles exacts.","Estos experimentos ilustrados son interpretaciones creativas, no modelos exactos."],
["Compare your result with the artwork in the gallery or collection record.","Comparez votre résultat à l’œuvre ou à sa fiche de collection.","Compara tu resultado con la obra o su ficha."],
["Look at the physical artwork first. Discuss one artistic choice with someone nearby, or think about it quietly.","Regardez d’abord l’œuvre réelle. Discutez d’un choix artistique ou réfléchissez en silence.","Mira primero la obra real. Habla de una decisión artística o piénsala en silencio."],
["Your creativity and discoveries stay on this device.","Votre créativité et vos découvertes restent sur cet appareil.","Tu creatividad y tus descubrimientos quedan en este dispositivo."],
["Save keepsake image","Enregistrer le souvenir","Guardar imagen de recuerdo"],
["ART EXPLORER PASSPORT","PASSEPORT D’EXPLORATION","PASAPORTE DE EXPLORACIÓN"],
["A discovery worth revisiting","Une découverte à revisiter","Un descubrimiento para revisitar"],
["Revisit this artwork","Revoir cette œuvre","Volver a ver esta obra"],
["MY DISCOVERIES","MES DÉCOUVERTES","MIS DESCUBRIMIENTOS"],
["STILL TO FIND","À DÉCOUVRIR","POR ENCONTRAR"],["A CONNECTION IS FORMING","UN LIEN SE CRÉE","SE ESTÁ FORMANDO UNA CONEXIÓN"],
["MICA SAYS","MICA DIT","MICA DICE"],
["View full artwork test sheet","Voir les images de test des œuvres","Ver las imágenes de prueba"],
["Artwork source and collection credit","Source de l’œuvre et crédit","Fuente y crédito de la obra"],
["not automatically verified","non vérifié automatiquement","no verificado automáticamente"],
["photo","photo","foto"],["view","voir","ver"]
].forEach(row=>add(...row));
const map=new Map();
const entries=[];
function rebuild(){
 map.clear();for(const [en,fr,es] of phrases)map.set(en,[fr,es]);
 entries.splice(0,entries.length,...[...map].sort((a,b)=>b[0].length-a[0].length));
}
function translate(raw,lang){
 if(!raw||lang==='en')return raw;
 const n=lang==='fr'?0:1,trim=raw.trim();
 if(!trim)return raw;
 const direct=map.get(trim);
 if(direct){const ix=raw.indexOf(trim);return raw.slice(0,ix)+direct[n]+raw.slice(ix+trim.length)}
 let result=raw;
 for(const [key,pair] of entries){
  if(key.length<7||!result.includes(key))continue;
  result=result.split(key).join(pair[n]);
 }
 return result;
}
let currentLang='en',updating=false;
const sources=new WeakMap(),attributes=new WeakMap();
function current(){try{return ['en','fr','es'].includes(state.lang)?state.lang:'en'}catch(e){return currentLang}}
function localizeText(node,lang){
 let rec=sources.get(node);
 if(!rec||node.nodeValue!==rec.last){rec={source:node.nodeValue,last:node.nodeValue};sources.set(node,rec)}
 const value=translate(rec.source,lang);
 if(value!==node.nodeValue){node.nodeValue=value}
 rec.last=value;
}
function localizeAttributes(el,lang){
 for(const name of ['aria-label','title','placeholder','alt']){
  const value=el.getAttribute(name);if(!value)continue;
  let record=attributes.get(el);if(!record){record={};attributes.set(el,record)}
  let rec=record[name];
  if(!rec||value!==rec.last){rec={source:value,last:value};record[name]=rec}
  const result=translate(rec.source,lang);
  if(result!==value)el.setAttribute(name,result);
  rec.last=result;
 }
}
function apply(root=document){
 const lang=current();currentLang=lang;
 document.documentElement.lang=lang;
 const title={en:'TRACE • Art Adventures',fr:'TRACE • Aventures artistiques',es:'TRACE • Aventuras de arte'}[lang];
 document.title=title+' (v2.5)';
 if(updating)return;
 updating=true;
 try{
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT);
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes){
   if(node.nodeType===3){
    const p=node.parentElement;
    if(!p||['SCRIPT','STYLE','NOSCRIPT','CODE','PRE','TEXTAREA','OPTION'].includes(p.tagName)&&p.tagName!=='OPTION')continue;
    localizeText(node,lang)
   }else if(node.nodeType===1) {
    if(node.tagName==='SCRIPT'||node.tagName==='STYLE')continue;
    localizeAttributes(node,lang);
   }
  }
  document.querySelectorAll('[data-trace-lang]').forEach(b=>{b.classList.toggle('active',b.dataset.traceLang===lang);b.setAttribute('aria-pressed',String(b.dataset.traceLang===lang))});
 }finally{updating=false}
}
function setLanguage(lang){
 if(!['en','fr','es'].includes(lang))return;
 try{
  if(typeof state!=='undefined'){state.lang=lang;if(typeof save==='function')save()}
  localStorage.setItem('trace-language-v2',lang);
 }catch(e){}
 if('speechSynthesis' in window)window.speechSynthesis.cancel();
 if(typeof render==='function')render();
 apply();
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-trace-lang]');if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();setLanguage(b.dataset.traceLang)
},true);
document.addEventListener('DOMContentLoaded',()=>{
 try{const stored=localStorage.getItem('trace-language-v2');if(stored&&['en','fr','es'].includes(stored)&&typeof state!=='undefined')state.lang=stored}catch(e){}
 apply();
 const obs=new MutationObserver(()=>{if(!updating)apply()});
 obs.observe(document.body,{childList:true,characterData:true,attributes:false,subtree:true});
});
window.TRACE_I18N={add:(...x)=>{add(...x);rebuild()},addMany:rows=>{rows.forEach(x=>add(...x));rebuild()},apply,setLanguage,translate,get language(){return current()},get size(){return map.size}};
rebuild();
})();
