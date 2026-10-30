/* Comparison observations, bridge explanations and activity microcopy. */
(function(){
'use strict';
const rows=[],add=(en,fr,es)=>rows.push([en,fr,es]);
const OPTIONS={
 'mmfa-marrel':[
  ['Pétales de fleurs courbés','Petites créatures parmi les feuilles','Éclats de lumière sur les pétales','Ombres sombres entre les feuilles','Un bouquet plein de vie','De petites surprises cachées dans la nature'],
  ['Pétalos curvados','Pequeñas criaturas entre las hojas','Brillos en los pétalos','Sombras oscuras entre las hojas','Un ramo lleno de vida','Pequeñas sorpresas ocultas en la naturaleza']],
 'mmfa-witte':[
  ['Cadres de porte répétés','Lignes du sol qui s’éloignent','Lumière pénétrant dans la pièce','Coins et portes dans l’ombre','Une personne qui joue de la musique','Des pièces calmes à explorer'],
  ['Marcos de puertas repetidos','Líneas del suelo hacia el fondo','Luz que entra en la habitación','Rincones y puertas sombríos','Una persona tocando música','Habitaciones tranquilas para explorar']],
 'mmfa-fortin':[
  ['Bâtiments et toits','Clocher et silhouettes de la ville','Un ciel lumineux et dramatique','Formes sombres de la ville','La ville avant l’orage','Un quartier de Montréal en transformation'],
  ['Edificios y tejados','Iglesia alta y siluetas de la ciudad','Un cielo luminoso y dramático','Formas oscuras de la ciudad','Una ciudad antes de la tormenta','Un barrio cambiante de Montreal']],
 'pamm-masks':[
  ['Visages dans une grille','Signes géométriques et blocs','Couleurs à l’intérieur des masques','Sections de couleurs contrastées','Des masques qui évoquent des personnes','Des symboles à interpréter'],
  ['Caras dentro de una cuadrícula','Signos y bloques geométricos','Colores dentro de las máscaras','Secciones de colores contrastantes','Máscaras que evocan personas','Símbolos que invitan a interpretar']],
 'pamm-delano':[
  ['Une route sinueuse dans l’image','Rangées et formes des maisons','Un ciel dramatique au-dessus des maisons','Lumière et ombre du paysage','Des maisons reliées par une route','Un regard documentaire sur la vie quotidienne'],
  ['Un camino sinuoso por la escena','Filas y formas de las casas','Un cielo dramático sobre las casas','Luz y sombra en el paisaje','Hogares conectados por un camino','Una mirada documental a la vida cotidiana']],
 'pamm-grid':[
  ['Sections rectangulaires superposées','Petits symboles dessinés dans une grille','Lignes sombres au graphite','Espace clair autour des marques','Des signes semblables à un alphabet','Un dessin qui ressemble à une carte'],
  ['Secciones rectangulares apiladas','Pequeños símbolos dentro de una cuadrícula','Líneas oscuras de grafito','Espacio claro alrededor de las marcas','Signos que parecen un alfabeto','Un dibujo que parece un mapa']]
};
const BONUS=window.TRACE_BONUS;
if(BONUS){
 for(const [id,lang] of Object.entries(OPTIONS)){
  const d=BONUS.DETAILS[id];if(!d)continue;
  const en=[...d.shapes,...d.light,...d.stories];
  en.forEach((x,i)=>add(x,lang[0][i],lang[1][i]))
 }
}
const STORIES={
 mmfa:{
  '0-1':{
   shapes:['Marrel remplit son vase de formes naturelles courbes. De Witte crée une impression de profondeur avec les portes et les lignes du sol.','Marrel llena su jarrón de formas naturales curvas. De Witte da profundidad a la habitación con puertas y líneas del suelo.'],
   light:['Marrel fait briller les fleurs avec de petits éclats lumineux. De Witte utilise la lumière et l’ombre pour rendre l’intérieur réaliste.','Marrel destaca las flores con pequeñas luces. De Witte usa luces y sombras para hacer real una habitación imaginaria.'],
   stories:['Une nature morte révèle de petites créatures cachées, tandis qu’un intérieur invite à imaginer la vie derrière ses portes.','Un bodegón invita a descubrir criaturas escondidas y una habitación nos hace imaginar la vida tras sus puertas.']},
  '0-2':{
   shapes:['Marrel célèbre de minuscules formes naturelles. Fortin peint les grandes silhouettes d’une ville sous un ciel immense.','Marrel celebra pequeñas formas naturales, mientras Fortin pinta grandes siluetas urbanas bajo un cielo inmenso.'],
   light:['Les deux artistes font ressortir les lumières contre les ombres, mais Fortin représente toute une ville sous l’orage.','Ambos destacan luces frente a sombras, pero Fortin trabaja a escala de toda una ciudad tormentosa.'],
   stories:['L’un imagine un petit monde naturel ; l’autre montre l’atmosphère d’un paysage montréalais en transformation.','Uno captura un mundo natural pequeño; el otro muestra el ambiente de un paisaje cambiante de Montreal.']},
  '1-2':{
   shapes:['De Witte guide notre regard à travers les pièces ; Fortin agence les toits et silhouettes de la ville.','De Witte guía la mirada por habitaciones; Fortin organiza una ciudad mediante tejados y siluetas.'],
   light:['Les deux œuvres jouent sur la lumière et l’ombre. L’une nous invite à entrer ; l’autre annonce un temps dramatique.','Ambas obras usan luz y sombra. Una nos invita al interior; la otra anuncia un tiempo dramático.'],
   stories:['Un intérieur musical calme et une ville sous l’orage suggèrent des histoires qui pourraient continuer.','Una tranquila escena musical y una ciudad bajo la tormenta sugieren historias que podrían continuar.']}
 },
 pamm:{
  '0-1':{
   shapes:['Torres-García organise des signes dans une grille. Delano guide nos yeux grâce à une route sinueuse et des groupes de maisons.','Torres-García organiza símbolos en una cuadrícula. Delano guía la mirada por un paisaje con un camino sinuoso y casas.'],
   light:['Torres-García crée un rythme par les couleurs. Delano utilise des contrastes et un ciel expressif dans sa photographie.','Torres-García crea ritmo mediante colores. Delano usa contrastes y un cielo expresivo para encuadrar su fotografía.'],
   stories:['Une œuvre transforme les signes en langage visuel ; l’autre documente un lieu réel et les maisons le long d’une route.','Una convierte signos en lenguaje visual; la otra documenta un lugar real y las casas a lo largo de un camino.']},
  '0-2':{
   shapes:['Ces deux œuvres de Torres-García montrent comment les grilles organisent des signes en un vocabulaire visuel inventé.','Estas dos obras de Torres-García muestran cómo las cuadrículas organizan signos en un vocabulario visual inventado.'],
   light:['Une construction colorée et un dessin au graphite plus discret utilisent le contraste très différemment.','La construcción colorida y el discreto dibujo de grafito usan el contraste de formas muy diferentes.'],
   stories:['Les deux œuvres proposent des symboles à interpréter, sans une seule réponse correcte.','Las dos obras ofrecen símbolos que podemos interpretar sin una única respuesta correcta.']},
  '1-2':{
   shapes:['Delano mène notre regard le long d’une route et de maisons. Torres-García dessine une structure imaginée avec des lignes et des cases.','Delano guía nuestra mirada por un camino y edificios. Torres-García construye una estructura imaginada con líneas y compartimentos.'],
   light:['Delano utilise les valeurs d’un paysage photographié ; Torres-García oppose le graphite sombre au papier clair.','Delano usa los tonos de un paisaje fotográfico; Torres-García contrasta el grafito oscuro con el papel claro.'],
   stories:['La photographie documente des maisons dans un paysage précis. Le dessin construit un monde avec quelques signes.','La fotografía documenta hogares en un paisaje real. El dibujo crea un mundo a partir de unos pocos símbolos.']}
 }
};
if(BONUS){
 for(const [museum,pairs] of Object.entries(STORIES)){
  for(const [key,lenses] of Object.entries(pairs)){
   for(const [lens,translations] of Object.entries(lenses)){
    const en=BONUS.STORIES[museum]?.[key]?.[lens];
    if(en)add(en,...translations);
   }
  }
 }
}
[
["The three-dimensional outline of the object","Le contour tridimensionnel de l’objet","La silueta tridimensional del objeto"],
["How different materials are arranged","La disposition des différents matériaux","Cómo se organizan los distintos materiales"],
["The shapes and space around this work","Les formes et l’espace autour de l’œuvre","Las formas y el espacio alrededor de esta obra"],
["The material changes how the light looks","L’effet du matériau sur la lumière","Cómo el material transforma la luz"],
["Highlights, shadows, and what they reveal","Lumières, ombres et leurs effets","Reflejos, sombras y lo que revelan"],
["Why the artist chose","Pourquoi l’artiste a choisi","Por qué el artista eligió"],
["These artists worked with different materials and forms.","Ces artistes ont travaillé avec des formes et matériaux différents.","Estos artistas trabajaron con materiales y formas distintos."],
["uses","utilise","usa"],["while","tandis que","mientras"],["What do their choices make you notice?","Que remarquez-vous dans leurs choix ?","¿Qué notas en sus decisiones?"],
["Choose different artworks","Choisir d’autres œuvres","Elegir otras obras"],
["Select a detail from both artworks","Choisir un détail dans chaque œuvre","Elegir un detalle en cada obra"],
["Create our connection","Créer notre lien","Crear nuestra conexión"],
["Return to the adventure map","Retour à la carte de l’aventure","Volver al mapa de aventuras"],
["You looked at two artworks together and found a way to connect them. Try the same pair with another lens, or find a new pair!","Tu as observé deux œuvres et trouvé un lien. Essaie une autre loupe ou une nouvelle paire !","Observaste dos obras y encontraste una conexión. Prueba otro enfoque o una nueva pareja."],
["Connect another pair","Relier une autre paire","Conectar otra pareja"],
["Compare these again","Comparer de nouveau","Comparar otra vez"],
["Open my discovery passport","Ouvrir mon passeport de découvertes","Abrir mi pasaporte de descubrimientos"],
["A familiar eye becomes a monument","Un œil familier devient un monument","Un ojo familiar se convierte en monumento"],
["Scale of the eye","Échelle de l’œil","Escala del ojo"],
["Change eye size","Changer la taille de l’œil","Cambiar tamaño del ojo"],
["Everyday size","Taille habituelle","Tamaño habitual"],["Monumental size","Taille monumentale","Tamaño monumental"],
["SCULPTURE COURTYARD · TAP A POSITION","COUR DES SCULPTURES · TOUCHE UN EMPLACEMENT","PATIO DE ESCULTURAS · TOCA UNA POSICIÓN"],
["1. Tap an empty circle to place Guardian A.","1. Touche un cercle vide pour placer le gardien A.","1. Toca un círculo vacío para colocar al guardián A."],
["2. Tap another circle to place Guardian B.","2. Touche un autre cercle pour placer le gardien B.","2. Toca otro círculo para colocar al guardián B."],
["Both guardians face inward. Notice the space connecting them.","Les gardiens se regardent. Observe l’espace qui les relie.","Los guardianes se miran. Observa el espacio que los une."],
["3. Turn the guardians to change their relationship.","3. Tourne les gardiens pour changer leur relation.","3. Gira a los guardianes para cambiar su relación."],
["Turn away again","Les tourner vers l’extérieur","Volver a girarlos hacia fuera"],
["Turn toward each other","Les tourner l’un vers l’autre","Girarlos uno hacia otro"],
["Guardian","Gardien","Guardián"],["Move guardian","Déplacer le gardien","Mover guardián"],
["Place guardian here","Placer un gardien ici","Colocar un guardián aquí"],
["Start again","Recommencer","Reiniciar"],
["Choose a wooden base","Choisis une base en bois","Elige una base de madera"],
["1. Choose the base. 2. Select and combine different found objects on the board.","1. Choisis une base. 2. Ajoute différents objets trouvés sur la planche.","1. Elige la base. 2. Combina diferentes objetos encontrados sobre ella."],
["Light wood","Bois clair","Madera clara"],["Dark wood","Bois foncé","Madera oscura"],
["different objects combined. Tap a placed object to remove it.","objets différents réunis. Touche un objet pour le retirer.","objetos diferentes combinados. Toca uno para retirarlo."],
["Remove","Retirer","Quitar"],["wire","fil","alambre"],["wheel","roue","rueda"],["scrap","débris","retal"],["fabric","tissu","tela"],
["Start with this neutral figure. Let’s transform the posture.","Commence par cette figure neutre, puis transforme sa posture.","Empieza con esta figura neutra y cambia su postura."],
["The figure sits down. How does that change its mood?","La figure s’assoit. Comment son humeur change-t-elle ?","La figura se sienta. ¿Cómo cambia su estado de ánimo?"],
["Now the arm rests on the knee. What is it about to do?","Le bras repose maintenant sur le genou. Que va-t-il faire ?","Ahora el brazo se apoya sobre la rodilla. ¿Qué hará?"],
["Finally the hand touches the chin. The figure seems deep in thought.","Enfin, la main touche le menton. La figure semble absorbée dans ses pensées.","Finalmente, la mano toca la barbilla. La figura parece sumida en sus pensamientos."],
["Sit down","S’asseoir","Sentarse"],["Bend the arm","Plier le bras","Doblar el brazo"],["Hand to chin","Main au menton","Mano en la barbilla"],
["OPTIONAL BODY CHALLENGE: Try the finished pose yourself and notice how it feels.","DÉFI CORPOREL FACULTATIF : essaie toi-même la pose et remarque les sensations.","RETO CORPORAL OPCIONAL: prueba la postura y observa cómo te sientes."],
["Reset figure","Réinitialiser la figure","Reiniciar figura"],
["Tap the dotted question marks. We highlight one possible face each time. Then look for your own interpretations in the real sculpture.","Touche les points d’interrogation. Un visage possible apparaît à chaque fois. Cherche ensuite tes propres interprétations dans la sculpture.","Toca los signos de interrogación. Aparecerá un rostro posible cada vez. Luego busca tus propias interpretaciones en la escultura."],
["Reveal profile","Révéler le profil","Revelar perfil"],
["Tap an uncarved square to open it. Choose a shape below, then tap a carved opening to place it inside.","Touche un carré intact pour l’ouvrir. Choisis une forme, puis place-la dans une niche.","Toca un cuadrado sin tallar para abrirlo. Elige una forma y colócala en un nicho."],
["Carve opening","Sculpter une ouverture","Tallar abertura"],
["Place shape in opening","Placer une forme dans l’ouverture","Colocar forma en abertura"],
["triangle","triangle","triángulo"],["sphere","sphère","esfera"],["arch","arche","arco"],
["small worlds furnished.","petits mondes aménagés.","pequeños mundos decorados."],
["Pick a material, then tap a glowing position to place or replace it. Combine all three different materials.","Choisis un matériau, puis touche un emplacement lumineux pour le placer. Réunis trois matériaux différents.","Elige un material y toca una posición luminosa para colocarlo. Combina tres materiales diferentes."],
["Metal","Métal","Metal"],["Hose","Tuyau","Manguera"],["Paint skin","Peau de peinture","Piel de pintura"],
["different materials placed.","matériaux différents placés.","materiales distintos colocados."],
["Place","Placer","Colocar"],["in sculptural position","à l’emplacement sculptural","en la posición escultórica"],
["Pink fabric surrounding the islands","Tissu rose autour des îles","Tela rosa alrededor de las islas"],
["Surround islands with pink fabric","Entourer les îles de tissu rose","Rodear las islas de tela rosa"],
["Before","Avant","Antes"],["Surrounded","Entourées","Rodeadas"],
["1. Choose a material. 2. Tap any square on the artwork to apply it. Layer materials in the same square or try a new one.","1. Choisis un matériau. 2. Touche un carré pour l’appliquer. Superpose plusieurs matériaux ou essaie ailleurs.","1. Elige un material. 2. Toca un cuadro para aplicarlo. Superpón materiales o prueba en otro lugar."],
["Acrylic","Acrylique","Acrílico"],["Gouache","Gouache","Gouache"],["Glitter","Paillettes","Purpurina"],
["Materials used:","Matériaux utilisés :","Materiales usados:"],["Clear canvas","Effacer la toile","Borrar lienzo"],
["Paint area","Peindre la zone","Pintar zona"],
["Illustrated pose changing from standing to thinking","Illustration passant d’une posture debout à une posture pensive","Ilustración que cambia de pie a una postura pensativa"],
["Aerial view of green islands gradually surrounded by pink fabric","Vue aérienne d’îles vertes entourées de tissu rose","Vista aérea de islas verdes rodeadas de tela rosa"],
["Three overlapping abstract profiles highlighted as they are found","Trois profils abstraits superposés dévoilés peu à peu","Tres perfiles abstractos superpuestos que se revelan uno a uno"],
["How the artist chose","Comment l’artiste a choisi","Cómo eligió el artista"]
].forEach(x=>add(...x));
window.TRACE_I18N?.addMany(rows);
})();
