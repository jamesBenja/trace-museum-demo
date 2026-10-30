/* Localized activities, family missions, comparisons, visitor maps and curator controls. */
(function(){
'use strict';
const rows=[];
const a=(en,fr,es)=>rows.push([en,fr,es]);
const ACTIV={
'mmfa-eye':[
['Rendre l’œil monumental','Fais glisser le curseur pour agrandir un œil familier jusqu’à dépasser les bâtiments.','Changer l’échelle d’un objet familier transforme notre perception.'],
['Haz monumental el ojo','Arrastra el control para hacer que un ojo familiar crezca más que los edificios.','Cambiar el tamaño de un objeto familiar transforma cómo lo percibimos.']],
'mmfa-frink':[
['Placer deux gardiens','Place deux sculptures dans la cour, puis tourne-les l’une vers l’autre.','Deux sculptures peuvent dialoguer grâce à l’espace qui les sépare.'],
['Coloca dos guardianes','Coloca dos esculturas en el patio y luego gíralas una hacia la otra.','Dos esculturas pueden conversar a través del espacio que las separa.']],
'mmfa-riopelle':[
['Le laboratoire des objets trouvés','Choisis une base en bois, puis ajoute deux objets différents. Touche un objet pour le retirer.','La sculpture à techniques mixtes crée du sens en réunissant des matériaux variés.'],
['El laboratorio de objetos encontrados','Elige una base de madera y combina dos objetos diferentes. Toca uno para retirarlo.','La escultura de técnica mixta crea nuevos significados al unir materiales distintos.']],
'mmfa-rodin':[
['Le langage d’une pose','Modifie la figure, un geste à la fois. Tu peux imiter sa pose finale.','Une posture assise, un bras plié et une tête baissée peuvent exprimer la réflexion sans paroles.'],
['El lenguaje de la postura','Cambia la figura, gesto por gesto. Puedes imitar la postura final.','Un cuerpo sentado, un brazo doblado y una cabeza inclinada pueden expresar reflexión sin palabras.']],
'mmfa-cragg':[
['Révéler plusieurs visages','Touche les trois cercles pointillés pour découvrir différents profils dans cette forme imaginaire.','Une sculpture peut suggérer plusieurs personnages selon le point de vue.'],
['Descubre muchos rostros','Toca los tres círculos punteados para revelar diferentes perfiles en esta forma imaginaria.','Una escultura puede sugerir varias figuras según el punto de vista.']],
'pamm-chaos':[
['Équilibrer des cubes impossibles','Réorganise cette sculpture à trois cubes. Déplace-en deux, puis fais-en tourner un. Peux-tu créer une tour spectaculaire sans la faire tomber ?','Le déplacement des formes en acier crée un équilibre étonnant entre masse et vide.'],
['Equilibra cubos imposibles','Reorganiza esta escultura de tres cubos. Mueve dos y gira uno. ¿Puedes crear una torre atrevida sin que se caiga?','Mover las formas abiertas de acero crea un equilibrio sorprendente entre peso y espacio vacío.']],
'pamm-fonseca':[
['Créer un monde miniature en marbre','Ouvre une niche dans le bloc de pierre, choisis une forme et place-la dans deux niches.','Les ouvertures sculptées transforment un bloc massif en un petit monde habité.'],
['Crea un mundo de mármol en miniatura','Abre un hueco en el bloque, elige una forma y colócala en dos nichos.','Las aberturas talladas convierten un bloque macizo en un pequeño mundo habitado.']],
'pamm-yanko':[
['Transformer des matériaux industriels','Choisis un matériau et place-le sur la sculpture. Combine métal, tuyau et peau de peinture.','Les matériaux industriels peuvent devenir des formes organiques expressives.'],
['Transforma materiales industriales','Elige un material y colócalo en la escultura. Combina metal, manguera y piel de pintura.','Los materiales industriales pueden transformarse en una escultura orgánica y expresiva.']],
'pamm-christo':[
['Entourer les îles de couleur','Déplace le curseur pour entourer les îles vertes de tissu rose. Compare avant et après.','Une installation éphémère peut transformer notre regard sur un paysage familier.'],
['Envuelve las islas de color','Mueve el control para rodear las islas verdes con tela rosa. Compara el antes y el después.','Una instalación temporal puede cambiar cómo vemos un paisaje familiar.']],
'pamm-chromati':[
['Superposer un monde scintillant','Choisis un matériau artistique, puis touche la toile pour appliquer de l’acrylique, de la gouache et des paillettes.','Couleurs, formes opaques et détails brillants créent différentes couches visuelles.'],
['Crea capas de un mundo brillante','Elige un material y toca el lienzo para aplicar acrílico, gouache y purpurina.','Los colores, las formas opacas y los detalles reflectantes crean diferentes capas visuales.']]
};
try{
 const source=window.TRACE_EXTRA?.steps||{};
 for(const [id,langs] of Object.entries(ACTIV))if(source[id]){
  source[id].forEach((en,i)=>a(en,langs[0][i],langs[1][i]));
 }
}catch(e){}
const FAMILY={
'mmfa-marrel':[
['Révèle la créature cachée','Trouve un petit animal parmi les fleurs et montre-le à ton équipe.','Le petit lézard se cache dans le bouquet !','Si le lézard pouvait parler, que dirait-il ?','Ces fleurs sont ma jungle secrète !','Chut ! Je me cache à la vue de tous.','Jacob Marrel peignait des détails minutieux sur une surface lisse en cuivre.'],
['Revela la criatura escondida','Busca un animalito entre las flores y enséñaselo a tu equipo.','¡El pequeño lagarto se esconde en el ramo!','Si el lagarto pudiera hablar, ¿qué diría?','¡Estas flores son mi selva secreta!','¡Shhh! Me escondo a plena vista.','Jacob Marrel pintaba detalles minuciosos sobre una superficie lisa de cobre.']],
'mmfa-witte':[
['Ouvre la porte secrète','Suis les portes du regard. Où les lignes semblent-elles se rejoindre ?','Les lignes convergent en un point de fuite et donnent de la profondeur à la pièce !','Où emmènerais-tu ton équipe à travers cette porte ?','Dans une pièce calme pleine de musique','Dans une salle cachée au fond du tableau','Emanuel de Witte utilisait la perspective pour donner une illusion de profondeur.'],
['Abre la puerta secreta','Sigue las puertas con la mirada. ¿Dónde parecen encontrarse las líneas?','¡Las líneas convergen en un punto de fuga y hacen que la habitación parezca profunda!','¿Adónde llevarías a tu equipo a través de esta puerta?','A una habitación tranquila llena de música','A una habitación escondida más allá del cuadro','Emanuel de Witte usaba la perspectiva para crear una ilusión de profundidad.']],
'mmfa-fortin':[
['Réveille le ciel lumineux','Montrez-vous les zones les plus sombres et les plus lumineuses du tableau.','Tu as fait briller le ciel au-dessus de la ville sombre !','Que va-t-il se passer ensuite dans ce paysage ?','Un orage va éclater','Le soleil percera les nuages','Marc-Aurèle Fortin dramatisait ses paysages grâce au contraste entre ombre et lumière.'],
['Despierta el cielo luminoso','Enseña a tu equipo las zonas más oscuras y luminosas del cuadro.','¡Hiciste brillar el cielo sobre una ciudad oscura!','¿Qué crees que ocurrirá después en este paisaje?','Empezará una tormenta','El sol atravesará las nubes','Marc-Aurèle Fortin dramatizaba las escenas con contrastes de luz y sombra.']],
'pamm-masks':[
['Déchiffre les trois symboles','Cherche des visages et des signes dans une grille. Montre un détail à ton équipe.','Le masque, le poisson et la grille forment un code visuel !','Si les formes transmettaient un message, que diraient-elles ?','Bienvenue dans un monde de symboles !','Chaque forme a son secret.','Joaquín Torres-García utilisait des signes simples pour créer un langage visuel.'],
['Descifra los tres símbolos','Busca caras y símbolos en una cuadrícula. Enséñale un detalle a tu equipo.','¡La máscara, el pez y la cuadrícula forman un código visual!','Si las formas fueran un mensaje, ¿qué dirían?','¡Bienvenido a un mundo de símbolos!','Cada forma tiene su secreto.','Joaquín Torres-García usaba signos sencillos para formar un lenguaje visual.']],
'pamm-delano':[
['Suis la route sinueuse','Trouve la route sur la photographie. Comment relie-t-elle les maisons ?','Tu as suivi le chemin dans l’image !','Si tu marchais sur cette route, où irais-tu ?','Rendre visite à une de ces maisons','Partir à l’aventure au-delà de la colline','Jack Delano utilisait la composition pour guider notre regard dans sa photographie.'],
['Sigue el camino sinuoso','Encuentra el camino en la fotografía. ¿Cómo conecta las casas?','¡Seguiste el camino de la imagen!','Si caminaras por ese camino, ¿adónde irías?','A visitar una de las casas','A una aventura más allá de la colina','Jack Delano usaba la composición para guiar la mirada por su fotografía.']],
'pamm-grid':[
['Crée un message secret','Trouve trois signes différents dans le dessin et montre-les à ton équipe.','Trois signes sont devenus ton alphabet visuel !','Que signifie ton nouvel alphabet secret ?','Un endroit où se sentir chez soi','Une invitation à explorer','Torres-García créait un langage symbolique avec un crayon et quelques lignes.'],
['Crea un mensaje secreto','Encuentra tres signos distintos en el dibujo y muéstraselos a tu equipo.','¡Tres signos se convirtieron en tu alfabeto visual!','¿Qué significa tu nuevo alfabeto secreto?','Un lugar al que llamar hogar','Una invitación a explorar','Torres-García creaba un lenguaje de símbolos con un lápiz y unas pocas líneas.']]
};
try{
 const tasks=window.TRACE_COOP?.tasks||{};
 for(const [id,langs] of Object.entries(FAMILY)){
  const t=tasks[id];if(!t)continue;
  const original=[t.title,t.look,t.secret,t.question,...t.choices,t.lesson];
  original.forEach((x,i)=>a(x,langs[0][i],langs[1][i]));
 }
}catch(e){}
[
["Look together. Play together.","Regardez ensemble. Jouez ensemble.","Miren juntos. Jueguen juntos."],
["Take turns with the phone. There are no assigned roles or points to count.","Passez le téléphone à tour de rôle. Il n’y a ni rôle imposé ni points à compter.","Compartan el teléfono por turnos. No hay roles asignados ni puntos que contar."],
["Look at the actual artwork first","Observez d’abord l’œuvre réelle","Miren primero la obra real"],
["This optional activity helps families observe art together. Scan whenever you like.","Cette activité facultative aide les familles à observer ensemble. Scannez quand vous voulez.","Esta actividad opcional ayuda a las familias a observar juntas. Escanea cuando quieras."],
["MICA’S FAMILY DISCOVERY","DÉCOUVERTE FAMILIALE AVEC MICA","DESCUBRIMIENTO EN FAMILIA CON MICA"],
["OPTIONAL · ABOUT 1 MIN","FACULTATIF · ENVIRON 1 MIN","OPCIONAL · APROX. 1 MIN"],
["Team seal","Sceau d’équipe","Sello de equipo"],["Look","Observer","Observar"],
["Rub to reveal","Frotter pour révéler","Frota para revelar"],["Move the doorway","Déplacer la porte","Mueve la puerta"],
["Slide the light","Faire glisser la lumière","Desliza la luz"],["Tap a secret code","Composer un code secret","Toca un código secreto"],
["Explore with a spotlight","Explorer avec une lampe","Explora con un foco"],["Stamp three symbols","Tamponner trois signes","Estampa tres símbolos"],
["STEP 1 · YOUR INTERACTIVE DISCOVERY","ÉTAPE 1 · VOTRE DÉCOUVERTE INTERACTIVE","PASO 1 · TU DESCUBRIMIENTO INTERACTIVO"],
["STEP 2 · INVENT A STORY TOGETHER","ÉTAPE 2 · INVENTEZ UNE HISTOIRE ENSEMBLE","PASO 2 · INVENTEN UNA HISTORIA JUNTOS"],
["Take turns polishing the silver mist with your finger. Watch what appears underneath!","Effacez la brume argentée du doigt à tour de rôle. Découvrez ce qui se cache dessous !","Por turnos, froten la niebla plateada con el dedo. ¡Descubran qué aparece debajo!"],
["The copper secret is revealed!","Le secret du cuivre est révélé !","¡Se revela el secreto del cobre!"],
["Drag the gold circle","Fais glisser le cercle doré","Arrastra el círculo dorado"],
["into the dashed target where the room lines meet. Use the arrow buttons if you prefer.","vers la cible en pointillés où convergent les lignes. Tu peux aussi utiliser les flèches.","hasta el objetivo punteado donde se cruzan las líneas. También puedes usar las flechas."],
["Slide the light","Fais glisser la lumière","Desliza la luz"],["until the dark city is contrasted by a glowing sky.","jusqu’à ce que le ciel lumineux contraste avec la ville sombre.","hasta que el cielo brillante contraste con la ciudad oscura."],
["Brightness:","Luminosité :","Brillo:"],["MASK → FISH → GRID","MASQUE → POISSON → GRILLE","MÁSCARA → PEZ → CUADRÍCULA"],
["Move the spotlight across the photograph.","Déplace le faisceau lumineux sur la photo.","Mueve el foco por la fotografía."],
["three stops along the winding road","trois arrêts le long du chemin sinueux","tres paradas por el camino sinuoso"],
["Stamp three different symbols","Tamponne trois signes différents","Estampa tres símbolos distintos"],
["to create a message only your family understands.","pour créer un message secret compris par votre famille.","para crear un mensaje que solo entienda tu familia."],
["Your next move will reveal the secret.","Votre prochain geste révélera le secret.","Tu siguiente movimiento revelará el secreto."],
["Secret revealed! Choose your story","Secret révélé ! Choisis ton histoire","¡Secreto revelado! Elige tu historia"],
["Show the secret instead","Révéler le secret autrement","Mostrar el secreto de otra manera"],
["Team Discovery earned!","Découverte d’équipe gagnée !","¡Descubrimiento de equipo conseguido!"],
["Your family story:","Votre histoire familiale :","La historia de tu familia:"],
["Your Team Discovery seal appears in My Finds. Continue with the artwork scan when you’re ready.","Votre sceau apparaît dans Mes trouvailles. Continuez le scan lorsque vous êtes prêts.","Tu sello aparece en Mis hallazgos. Continúa el escaneo cuando quieras."],
["Tell your teammate what you imagine. Tap either answer.","Raconte ton idée à ton équipe. Choisis l’une des réponses.","Cuéntale a tu equipo lo que imaginas. Elige una respuesta."],
["Both are good stories!","Les deux sont de bonnes histoires !","¡Las dos son buenas historias!"],
["Try mask, fish, grid in that order.","Essaie masque, poisson, grille dans cet ordre.","Prueba máscara, pez, cuadrícula en ese orden."],
["Stop","Arrêt","Parada"],["of 3","sur 3","de 3"],
["Continue with the artwork scan","Continuer avec le scan de l’œuvre","Continuar con el escaneo de la obra"],
["Your discovered connections","Vos liens découverts","Tus conexiones descubiertas"],
["YOUR DISCOVERED CONNECTIONS","VOS LIENS DÉCOUVERTS","TUS CONEXIONES DESCUBIERTAS"],
["BONUS MYSTERY · ARTWORK CONNECTIONS","MYSTÈRE BONUS · LIENS ENTRE LES ŒUVRES","MISTERIO EXTRA · CONEXIONES ENTRE OBRAS"],
["Connect the artworks.","Relie les œuvres.","Conecta las obras."],
["Artworks have secret things in common. Explore two you’ve already found, then build a bridge between them.","Les œuvres partagent des secrets. Choisis deux œuvres découvertes pour créer un lien entre elles.","Las obras tienen secretos en común. Elige dos que hayas encontrado y crea un puente entre ellas."],
["Pick any two discoveries. You can connect a new pair every time you explore.","Choisis deux découvertes. Tu peux créer un nouveau lien à chaque exploration.","Elige dos descubrimientos. Puedes conectar una nueva pareja cada vez que explores."],
["connections collected","liens collectés","conexiones reunidas"],["possible now","possibles maintenant","posibles ahora"],
["Tap to choose","Touchez pour choisir","Toca para elegir"],["SELECTED","SÉLECTIONNÉ","SELECCIONADO"],
["Choose two works. Look for different ways the artists use shape, light and storytelling.","Choisis deux œuvres. Observe leurs formes, leur lumière et leurs histoires.","Elige dos obras. Observa sus formas, luces e historias."],
["Replay","Rejouer","Volver a jugar"],
["Adventure map","Carte de l’aventure","Mapa de aventuras"],
["STEP 1 OF 3","ÉTAPE 1 SUR 3","PASO 1 DE 3"],["STEP 2 OF 3","ÉTAPE 2 SUR 3","PASO 2 DE 3"],["STEP 3 OF 3","ÉTAPE 3 SUR 3","PASO 3 DE 3"],
["Swipe between two worlds","Passe d’un univers à l’autre","Desliza entre dos mundos"],
["Drag the gold divider across the paintings. Look for a similarity or a surprising difference.","Fais glisser la séparation dorée sur les images et cherche une ressemblance ou une différence étonnante.","Arrastra el divisor dorado por las imágenes. Busca una similitud o diferencia sorprendente."],
["Drag to compare artworks","Fais glisser pour comparer les œuvres","Arrastra para comparar obras"],
["Choose your detective lens","Choisis ta loupe de détective","Elige tu lente de detective"],
["What do you want to compare?","Que veux-tu comparer ?","¿Qué quieres comparar?"],
["Shapes & lines","Formes et lignes","Formas y líneas"],["Light & colour","Lumière et couleur","Luz y color"],["Stories & ideas","Histoires et idées","Historias e ideas"],
["Tap one detail in each artwork","Choisis un détail dans chaque œuvre","Elige un detalle en cada obra"],
["Choose what you noticed in artwork A and artwork B. Both options are valid observations.","Choisis ce que tu as remarqué dans les œuvres A et B. Les deux réponses sont valides.","Elige lo que has observado en las obras A y B. Ambas opciones son válidas."],
["Artwork A","Œuvre A","Obra A"],["Artwork B","Œuvre B","Obra B"],
["What catches your eye?","Qu’est-ce qui attire ton regard ?","¿Qué llama tu atención?"],
["A CONNECTION IS FORMING","UN LIEN SE CRÉE","SE ESTÁ FORMANDO UNA CONEXIÓN"],
["You connected","Tu as relié","Conectaste"],
["ART BRIDGE CREATED","PONT ARTISTIQUE CRÉÉ","PUENTE ARTÍSTICO CREADO"],
["You found a connection!","Tu as trouvé un lien !","¡Encontraste una conexión!"],
["Art Connector badge earned","Badge Connecteur d’art obtenu","Insignia Conector de arte conseguida"],
["One more discovery to go","Encore une découverte à faire","Falta un descubrimiento"],
["Solve two artworks to unlock the comparison bonus.","Découvre deux œuvres pour débloquer le bonus de comparaison.","Descubre dos obras para desbloquear el reto de comparación."],
["Back to adventure","Retour à l’aventure","Volver a la aventura"]
].forEach(x=>a(...x));
window.TRACE_I18N?.addMany(rows);
})();
