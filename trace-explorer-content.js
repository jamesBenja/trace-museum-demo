/* TRACE Explorer content v1 (MMFA first).
 *
 * Three audience tiers share ONE artwork catalogue:
 *   little    = Little Explorers, ages 5–7   (prefs.age '5-7')
 *   detective = Art Detectives, ages 8–12    (prefs.age '8-12', uses the existing chapter copy)
 *   curious   = Curious Minds, 13+ & adults  (prefs.age 'teen')
 *
 * Little Explorer copy rules: sentences of ~10 words or fewer, everyday words,
 * one idea per line, a physical "do" task, and a playful question. Clues point
 * to a distinctive VISIBLE detail without naming the work.
 *
 * Facts are restricted to what the MMFA collection records, the museum's
 * verification notes in display-status.json, or the existing reviewed TRACE
 * interpretation state. Anything uncertain is phrased as a question for the
 * child to check with their own eyes, never as a fact.
 *
 * Every string is EN / FR / ES. Missing languages fall back to English.
 */
(function(){
'use strict';

const TIERS=[
 {id:'little',age:'5-7',icon:'🐣',label:{en:'Little Explorers',fr:'Petits explorateurs',es:'Pequeños exploradores'},range:{en:'Ages 5–7',fr:'5 à 7 ans',es:'5 a 7 años'}},
 {id:'detective',age:'8-12',icon:'🔍',label:{en:'Art Detectives',fr:'Détectives de l’art',es:'Detectives del arte'},range:{en:'Ages 8–12',fr:'8 à 12 ans',es:'8 a 12 años'}},
 {id:'curious',age:'teen',icon:'🧭',label:{en:'Curious Minds',fr:'Esprits curieux',es:'Mentes curiosas'},range:{en:'13+ and grown-ups',fr:'13 ans et adultes',es:'13+ y adultos'}}
];

/* Themes connect artworks across the visit. Mica uses them to refer back to
   earlier discoveries ("This is bronze too, just like the Thinker!"). */
const THEMES={
 animals:{icon:'🦎',en:'animals',fr:'les animaux',es:'los animales'},
 emotions:{icon:'💭',en:'feelings',fr:'les émotions',es:'las emociones'},
 movement:{icon:'🤸',en:'movement',fr:'le mouvement',es:'el movimiento'},
 light:{icon:'🌗',en:'light and dark',fr:'la lumière et l’ombre',es:'la luz y la sombra'},
 colour:{icon:'🎨',en:'colour',fr:'la couleur',es:'el color'},
 hidden:{icon:'🔎',en:'hidden details',fr:'les détails cachés',es:'los detalles escondidos'},
 materials:{icon:'🪨',en:'materials',fr:'les matériaux',es:'los materiales'},
 imaginary:{icon:'✨',en:'imaginary worlds',fr:'les mondes imaginaires',es:'los mundos imaginarios'},
 bronze:{icon:'🔔',en:'bronze',fr:'le bronze',es:'el bronce'},
 outdoors:{icon:'🌳',en:'art outside',fr:'l’art dehors',es:'el arte al aire libre'}
};

/* ---------------------------------------------------------------- MMFA ---- */
const W={};

W['mmfa-rodin']={
 icon:'🤔',short:{en:'The Thinker',fr:'Le Penseur',es:'El Pensador'},
 themes:['emotions','movement','bronze','materials'],
 little:{
  en:{clue:'Someone is sitting very, very still. He is thinking hard! Can you find him?',
   look:[['🪑','He sits on a rock'],['✋','His chin rests on his hand'],['🦶','His toes grip the rock']],
   move:'Sit like him! Elbow on your knee. Chin on your hand. Now think of your favourite animal.',
   wow:'Look closely: his RIGHT elbow sits on his LEFT knee. That is a twisty way to sit! Try it.',
   ask:'What do you think he is thinking about?'},
  fr:{clue:'Quelqu’un est assis, tout immobile. Il réfléchit très fort ! Peux-tu le trouver ?',
   look:[['🪑','Il est assis sur un rocher'],['✋','Son menton repose sur sa main'],['🦶','Ses orteils agrippent le rocher']],
   move:'Assieds-toi comme lui ! Le coude sur le genou. Le menton sur la main. Pense à ton animal préféré.',
   wow:'Regarde bien : son coude DROIT est posé sur son genou GAUCHE. C’est une drôle de position ! Essaie.',
   ask:'À ton avis, à quoi pense-t-il ?'},
  es:{clue:'Alguien está sentado, muy quieto. ¡Está pensando mucho! ¿Puedes encontrarlo?',
   look:[['🪑','Está sentado en una roca'],['✋','Apoya la barbilla en la mano'],['🦶','Sus dedos se agarran a la roca']],
   move:'¡Siéntate como él! El codo en la rodilla. La barbilla en la mano. Piensa en tu animal favorito.',
   wow:'Mira bien: su codo DERECHO está sobre su rodilla IZQUIERDA. ¡Es una forma retorcida de sentarse! Pruébala.',
   ask:'¿En qué crees que está pensando?'}
 },
 curious:{
  en:{clue:'A seated bronze figure, his body compressed into a single act of concentration.',
   deep:'Rodin first conceived this figure around 1880 for The Gates of Hell, where it represented Dante contemplating his poem. Detached from the portal, it became a universal image of creative thought. Rodin insisted he was “not a dreamer, but a creator.” The MMFA bought this cast directly from the artist in 1909. Notice the tension: the right elbow crosses to the left thigh, so the whole body twists inward. Thinking, here, is physical work.',
   look:'Walk around the base. From which side does the figure feel most closed in on itself?'},
  fr:{clue:'Une figure de bronze assise, le corps tout entier ramassé dans un acte de concentration.',
   deep:'Rodin conçoit cette figure vers 1880 pour La Porte de l’Enfer, où elle représente Dante méditant son poème. Détachée du portail, elle devient une image universelle de la pensée créatrice. Rodin affirmait qu’il n’était « pas un rêveur, mais un créateur ». Le MBAM a acheté ce bronze directement à l’artiste en 1909. Observez la tension : le coude droit croise vers la cuisse gauche, et tout le corps se tord vers l’intérieur. Penser, ici, est un effort physique.',
   look:'Faites le tour du socle. De quel côté la figure semble-t-elle la plus repliée sur elle-même ?'},
  es:{clue:'Una figura de bronce sentada, con todo el cuerpo concentrado en un solo pensamiento.',
   deep:'Rodin concibió esta figura hacia 1880 para La Puerta del Infierno, donde representaba a Dante meditando su poema. Separada del portal, se convirtió en una imagen universal del pensamiento creador. Rodin decía que no era «un soñador, sino un creador». El MBAM compró este bronce directamente al artista en 1909. Observa la tensión: el codo derecho cruza hacia el muslo izquierdo y todo el cuerpo gira hacia dentro. Aquí, pensar es un esfuerzo físico.',
   look:'Rodea el pedestal. ¿Desde qué lado parece la figura más cerrada sobre sí misma?'}
 }
};

W['mmfa-marrel']={
 icon:'🦎',short:{en:'The secret garden',fr:'Le jardin secret',es:'El jardín secreto'},
 themes:['animals','hidden','colour','materials'],
 little:{
  en:{clue:'Find a big bunch of flowers in a glass vase. Tiny animals are hiding in it!',
   look:[['🦎','A lizard'],['🐞','A tiny bug'],['🍒','Red cherries']],
   move:'Make yourself tiny like a bug. Now count the creatures with your finger in the air. No touching!',
   wow:'This picture is painted on a sheet of metal called copper, not on cloth!',
   ask:'If you were a tiny bug, which flower would you live in?'},
  fr:{clue:'Trouve un gros bouquet de fleurs dans un vase en verre. De petits animaux s’y cachent !',
   look:[['🦎','Un lézard'],['🐞','Un tout petit insecte'],['🍒','Des cerises rouges']],
   move:'Fais-toi tout petit comme un insecte. Compte les bestioles avec ton doigt dans l’air. Sans toucher !',
   wow:'Ce tableau est peint sur une plaque de métal appelée cuivre, pas sur du tissu !',
   ask:'Si tu étais un petit insecte, dans quelle fleur habiterais-tu ?'},
  es:{clue:'Busca un gran ramo de flores en un jarrón de cristal. ¡Hay animalitos escondidos!',
   look:[['🦎','Una lagartija'],['🐞','Un insecto pequeñito'],['🍒','Cerezas rojas']],
   move:'Hazte pequeñito como un insecto. Cuenta los animalitos con el dedo en el aire. ¡Sin tocar!',
   wow:'¡Este cuadro está pintado sobre una lámina de metal llamada cobre, no sobre tela!',
   ask:'Si fueras un insecto pequeñito, ¿en qué flor vivirías?'}
 },
 curious:{
  en:{clue:'A still life on a polished metal support, populated by creatures that reward slow looking.',
   deep:'Jacob Marrel painted this bouquet in 1650 in oil on copper. The smooth, non-absorbent metal let thin glazes sit on the surface, which is why the colours still glow. Seventeenth-century flower pieces were often assembled from studies rather than one real bouquet, and the insects, cherries and lizards add life, decay and time to the arrangement. The painting asks you to look at it the way a naturalist would.',
   look:'Find the creature that is easiest to miss. What made it hard to see?'},
  fr:{clue:'Une nature morte sur un support de métal poli, peuplée de créatures qui récompensent le regard lent.',
   deep:'Jacob Marrel a peint ce bouquet en 1650, à l’huile sur cuivre. Le métal lisse et non absorbant permet aux glacis fins de rester en surface, ce qui explique l’éclat des couleurs. Les tableaux de fleurs du XVIIe siècle étaient souvent composés à partir d’études plutôt que d’un vrai bouquet, et les insectes, cerises et lézards y ajoutent la vie, le déclin et le temps. Le tableau nous invite à regarder comme un naturaliste.',
   look:'Trouvez la créature la plus facile à manquer. Qu’est-ce qui la rendait difficile à voir ?'},
  es:{clue:'Un bodegón sobre un soporte de metal pulido, poblado de criaturas que premian la mirada lenta.',
   deep:'Jacob Marrel pintó este ramo en 1650, al óleo sobre cobre. El metal liso y no absorbente deja las veladuras finas en la superficie, por eso los colores aún brillan. Las pinturas de flores del siglo XVII solían componerse a partir de estudios, no de un ramo real, y los insectos, cerezas y lagartijas añaden vida, deterioro y tiempo. La obra pide mirar como un naturalista.',
   look:'Busca la criatura más fácil de pasar por alto. ¿Qué la hacía difícil de ver?'}
 }
};

W['mmfa-witte']={
 icon:'🚪',short:{en:'The rooms beyond',fr:'Les pièces au-delà',es:'Las salas del fondo'},
 themes:['light','hidden','imaginary'],
 little:{
  en:{clue:'Find a room with doors behind doors behind doors. Someone is playing music!',
   look:[['🎹','A keyboard instrument'],['🚪','Doors far, far away'],['⬛','A floor of tiles']],
   move:'Make a telescope with your hands. Look through it. How far can your eyes travel?',
   wow:'The canvas is flat, but the painter tricks your eyes. You feel you could walk inside!',
   ask:'What do you think is behind the very last door?'},
  fr:{clue:'Trouve une pièce avec des portes derrière des portes derrière des portes. Quelqu’un joue de la musique !',
   look:[['🎹','Un instrument à clavier'],['🚪','Des portes très, très loin'],['⬛','Un sol en carreaux']],
   move:'Fais une longue-vue avec tes mains. Regarde dedans. Jusqu’où vont tes yeux ?',
   wow:'La toile est plate, mais le peintre trompe tes yeux. On croirait pouvoir entrer dedans !',
   ask:'Qu’y a-t-il derrière la toute dernière porte, à ton avis ?'},
  es:{clue:'Busca una sala con puertas detrás de puertas detrás de puertas. ¡Alguien toca música!',
   look:[['🎹','Un instrumento de teclado'],['🚪','Puertas muy, muy lejos'],['⬛','Un suelo de baldosas']],
   move:'Haz un catalejo con las manos. Mira a través. ¿Hasta dónde llegan tus ojos?',
   wow:'El lienzo es plano, pero el pintor engaña a tus ojos. ¡Parece que puedes entrar!',
   ask:'¿Qué crees que hay detrás de la última puerta?'}
 },
 curious:{
  en:{clue:'An interior that recedes through successive doorways while music fills the nearest room.',
   deep:'Emanuel de Witte specialised in architectural interiors. Here the tiled floor, the aligned door frames and the fall of light construct a convincing depth on a flat canvas: linear perspective doing the work of a stage set. The woman at the virginal (a small keyboard instrument) sets the mood, and a listener is tucked into the left foreground. Quiet domestic scenes like this were prized in the Dutch Republic for their calm and their technical skill.',
   look:'Trace the floor lines with your eyes. Where do they meet?'},
  fr:{clue:'Un intérieur qui s’enfonce de porte en porte, tandis que la musique emplit la pièce la plus proche.',
   deep:'Emanuel de Witte s’est spécialisé dans les intérieurs architecturaux. Ici, le carrelage, l’alignement des cadres de porte et la lumière construisent une profondeur convaincante sur une toile plate : la perspective linéaire agit comme un décor de théâtre. La femme au virginal (un petit instrument à clavier) donne le ton, et un auditeur se tient discrètement au premier plan à gauche. Ces scènes calmes étaient prisées dans les Provinces-Unies pour leur sérénité et leur virtuosité.',
   look:'Suivez des yeux les lignes du sol. Où se rejoignent-elles ?'},
  es:{clue:'Un interior que se aleja puerta tras puerta mientras la música llena la sala más cercana.',
   deep:'Emanuel de Witte se especializó en interiores arquitectónicos. Aquí el suelo de baldosas, los marcos alineados y la luz construyen una profundidad convincente sobre un lienzo plano: la perspectiva lineal actúa como un decorado. La mujer al virginal (un pequeño instrumento de teclado) marca el tono, y un oyente se esconde en el primer plano a la izquierda. Estas escenas tranquilas se apreciaban en la República Neerlandesa por su calma y su virtuosismo.',
   look:'Sigue con la vista las líneas del suelo. ¿Dónde se juntan?'}
 }
};

W['mmfa-fortin']={
 icon:'⛈️',short:{en:'The storm over the city',fr:'L’orage sur la ville',es:'La tormenta sobre la ciudad'},
 themes:['light','colour','imaginary'],
 little:{
  en:{clue:'Find a dark town under a big, glowing sky. A storm is coming!',
   look:[['⛪','A tall pointy church tower'],['🏠','Dark houses'],['☁️','Clouds full of light']],
   move:'Make a quiet storm! Rub your hands softly. Whisper “whoosh”. Shhh, museum voice!',
   wow:'Hochelaga is a real part of Montréal. You could go there on the metro!',
   ask:'Is the storm coming closer, or going away? How can you tell?'},
  fr:{clue:'Trouve une ville sombre sous un grand ciel lumineux. Un orage arrive !',
   look:[['⛪','Un grand clocher pointu'],['🏠','Des maisons sombres'],['☁️','Des nuages pleins de lumière']],
   move:'Fais un orage tout doux ! Frotte tes mains doucement. Chuchote « whoosh ». Chut, voix de musée !',
   wow:'Hochelaga est un vrai quartier de Montréal. Tu peux y aller en métro !',
   ask:'L’orage s’approche-t-il ou s’en va-t-il ? Comment le sais-tu ?'},
  es:{clue:'Busca un pueblo oscuro bajo un gran cielo brillante. ¡Viene una tormenta!',
   look:[['⛪','Una torre de iglesia alta y puntiaguda'],['🏠','Casas oscuras'],['☁️','Nubes llenas de luz']],
   move:'¡Haz una tormenta silenciosa! Frota tus manos despacito. Susurra «fiuuu». ¡Shhh, voz de museo!',
   wow:'Hochelaga es un barrio real de Montreal. ¡Puedes ir en metro!',
   ask:'¿La tormenta se acerca o se aleja? ¿Cómo lo sabes?'}
 },
 curious:{
  en:{clue:'A working-class district of Montréal held in the charged light before a storm.',
   deep:'Marc-Aurèle Fortin described painting on a dark ground and leaving the sky for last, so the brightest passages sit on top of the darkness rather than being lightened from white. Storm Brewing over Hochelaga (c. 1940, oil and enamel on board) uses that contrast to dramatise an ordinary east-end neighbourhood. Fortin wanted a distinctly Québécois landscape painting, rooted in places people actually lived.',
   look:'Find the brightest point in the sky. Then find the darkest point in the town. How close are they?'},
  fr:{clue:'Un quartier ouvrier de Montréal saisi dans la lumière électrique d’avant l’orage.',
   deep:'Marc-Aurèle Fortin a décrit sa méthode : peindre sur un fond sombre et garder le ciel pour la fin, de sorte que les passages les plus clairs se posent sur l’obscurité au lieu d’être éclaircis à partir du blanc. Orage sur Hochelaga (vers 1940, huile et émail sur panneau) utilise ce contraste pour dramatiser un quartier ordinaire de l’est. Fortin voulait un paysage québécois enraciné dans les lieux où les gens vivaient.',
   look:'Trouvez le point le plus clair du ciel, puis le plus sombre de la ville. Sont-ils proches ?'},
  es:{clue:'Un barrio obrero de Montreal atrapado en la luz eléctrica antes de la tormenta.',
   deep:'Marc-Aurèle Fortin describió su método: pintar sobre un fondo oscuro y dejar el cielo para el final, de modo que las zonas más claras se posan sobre la oscuridad en lugar de aclararse desde el blanco. Tormenta sobre Hochelaga (h. 1940, óleo y esmalte sobre tabla) usa ese contraste para dramatizar un barrio corriente del este. Fortin buscaba un paisaje quebequense arraigado en los lugares donde vivía la gente.',
   look:'Busca el punto más claro del cielo y luego el más oscuro del pueblo. ¿Están cerca?'}
 }
};

W['mmfa-eye']={
 icon:'🪽',short:{en:'The winged giant',fr:'Le géant ailé',es:'El gigante alado'},
 themes:['imaginary','hidden','bronze','outdoors','emotions'],
 little:{
  en:{clue:'Go outside! Find a giant with wings. It covers its face with many hands.',
   look:[['🪽','Two big wings'],['🙌','Lots of hands'],['🕳️','A hole right through its body']],
   move:'Walk all the way around it, slowly. Can you see the sky through its tummy?',
   wow:'It is called The Eye, but its face is hidden! Artists love a surprise.',
   ask:'Count the hands you can see. Is it more than your fingers?'},
  fr:{clue:'Va dehors ! Trouve un géant avec des ailes. Il cache son visage avec plein de mains.',
   look:[['🪽','Deux grandes ailes'],['🙌','Beaucoup de mains'],['🕳️','Un trou à travers son corps']],
   move:'Fais le tour complet, tout doucement. Vois-tu le ciel à travers son ventre ?',
   wow:'Elle s’appelle L’Œil, mais son visage est caché ! Les artistes adorent les surprises.',
   ask:'Compte les mains que tu vois. Y en a-t-il plus que tes doigts ?'},
  es:{clue:'¡Sal afuera! Busca un gigante con alas. Se tapa la cara con muchas manos.',
   look:[['🪽','Dos grandes alas'],['🙌','Muchas manos'],['🕳️','Un agujero que atraviesa su cuerpo']],
   move:'Rodéalo entero, despacito. ¿Ves el cielo a través de su barriga?',
   wow:'Se llama El Ojo, ¡pero su cara está escondida! A los artistas les encantan las sorpresas.',
   ask:'Cuenta las manos que ves. ¿Hay más que dedos en tus manos?'}
 },
 curious:{
  en:{clue:'A monumental winged figure in bronze whose face disappears behind its own hands.',
   deep:'David Altmejd’s The Eye (2010–2011) turns a human-like body into an architecture of hands, wings and voids. The opening through the torso lets the street and sky become part of the sculpture, so it changes with the weather and the time of day. The title points to seeing, yet the figure hides its face: the act of looking is handed over to you, walking around it.',
   look:'Find the viewpoint where the void in the torso frames something in the city.'},
  fr:{clue:'Une figure ailée monumentale en bronze dont le visage disparaît derrière ses propres mains.',
   deep:'L’Œil (2010-2011) de David Altmejd transforme un corps presque humain en architecture de mains, d’ailes et de vides. L’ouverture dans le torse fait entrer la rue et le ciel dans la sculpture, qui change avec la météo et l’heure. Le titre parle de voir, mais la figure cache son visage : c’est à vous de regarder, en tournant autour.',
   look:'Trouvez le point de vue où le vide du torse encadre quelque chose de la ville.'},
  es:{clue:'Una figura alada monumental de bronce cuyo rostro desaparece tras sus propias manos.',
   deep:'El Ojo (2010-2011) de David Altmejd convierte un cuerpo casi humano en una arquitectura de manos, alas y vacíos. La abertura del torso deja entrar la calle y el cielo en la escultura, que cambia con el clima y la hora. El título habla de ver, pero la figura oculta su rostro: mirar te toca a ti, rodeándola.',
   look:'Busca el punto de vista donde el hueco del torso enmarca algo de la ciudad.'}
 }
};

W['mmfa-frink']={
 icon:'🗿',short:{en:'The two guardians',fr:'Les deux gardiens',es:'Los dos guardianes'},
 themes:['emotions','bronze','outdoors','materials'],
 little:{
  en:{clue:'Walk along the street by the museum. Two bronze friends stand there together.',
   look:[['👥','Two of them'],['🟤','Dark bronze'],['🙂','Their faces: happy, sad or calm?']],
   move:'Stand still like a statue. Count to five. Can you be as calm as them?',
   wow:'Their name, In memoriam, means “to remember someone”.',
   ask:'Who would YOU make a statue of, to remember them?'},
  fr:{clue:'Marche le long de la rue près du musée. Deux amis de bronze s’y tiennent ensemble.',
   look:[['👥','Ils sont deux'],['🟤','Du bronze foncé'],['🙂','Leurs visages : joyeux, tristes ou calmes ?']],
   move:'Reste immobile comme une statue. Compte jusqu’à cinq. Es-tu aussi calme qu’eux ?',
   wow:'Leur nom, In memoriam, veut dire « en souvenir de quelqu’un ».',
   ask:'De qui ferais-TU une statue, pour t’en souvenir ?'},
  es:{clue:'Camina por la calle junto al museo. Dos amigos de bronce están allí juntos.',
   look:[['👥','Son dos'],['🟤','Bronce oscuro'],['🙂','Sus caras: ¿alegres, tristes o tranquilas?']],
   move:'Quédate quieto como una estatua. Cuenta hasta cinco. ¿Estás tan tranquilo como ellos?',
   wow:'Su nombre, In memoriam, significa «en recuerdo de alguien».',
   ask:'¿De quién harías TÚ una estatua, para recordarle?'}
 },
 curious:{
  en:{clue:'A pair of bronzes whose title asks what sculpture can hold of a memory.',
   deep:'Elisabeth Frink made In memoriam I and In memoriam II in 1981. Shown together outdoors, the two works are read in relation to each other and to the passers-by around them. Frink’s bronzes often carry their making on the surface, and the title turns the pair into a quiet act of commemoration in the middle of a city street.',
   look:'Stand between the two. Do they seem to share a direction, or turn away from each other?'},
  fr:{clue:'Une paire de bronzes dont le titre demande ce que la sculpture peut garder d’un souvenir.',
   deep:'Elisabeth Frink a réalisé In memoriam I et In memoriam II en 1981. Présentées ensemble à l’extérieur, les deux œuvres se lisent l’une par rapport à l’autre et par rapport aux passants. Les bronzes de Frink gardent souvent la trace du modelage en surface, et le titre fait de la paire un geste discret de commémoration au milieu de la rue.',
   look:'Placez-vous entre les deux. Regardent-elles dans la même direction, ou se détournent-elles ?'},
  es:{clue:'Un par de bronces cuyo título pregunta qué puede guardar la escultura de un recuerdo.',
   deep:'Elisabeth Frink realizó In memoriam I e In memoriam II en 1981. Expuestas juntas al aire libre, las dos obras se leen en relación entre sí y con los transeúntes. Los bronces de Frink suelen conservar la huella del modelado, y el título convierte la pareja en un gesto discreto de conmemoración en plena calle.',
   look:'Colócate entre las dos. ¿Miran en la misma dirección o se dan la espalda?'}
 }
};

/* Inactive in the published route (see display-status.json). Content is kept
   ready so that re-activation by museum staff needs no new authoring. */
W['mmfa-riopelle']={
 icon:'🧩',short:{en:'The found-object lab',fr:'Le labo des objets trouvés',es:'El laboratorio de objetos'},
 themes:['materials','colour'],
 little:{
  en:{clue:'Find a long artwork made of many different things stuck on wood.',
   look:[['🪵','Wood'],['🧩','Lots of different bits'],['🎨','Splashes of colour']],
   move:'Point at three different materials. Say what each one feels like… with your eyes only!',
   wow:'Artists can turn everyday things into art.',ask:'What would you add to it?'},
  fr:{clue:'Trouve une longue œuvre faite de plein de choses collées sur du bois.',
   look:[['🪵','Du bois'],['🧩','Plein de morceaux différents'],['🎨','Des taches de couleur']],
   move:'Montre trois matériaux différents. Dis comment ils semblent au toucher… avec tes yeux seulement !',
   wow:'Les artistes peuvent transformer des objets de tous les jours en art.',ask:'Qu’est-ce que tu ajouterais ?'},
  es:{clue:'Busca una obra larga hecha de muchas cosas pegadas sobre madera.',
   look:[['🪵','Madera'],['🧩','Muchos trozos distintos'],['🎨','Manchas de color']],
   move:'Señala tres materiales distintos. Di cómo se sienten… ¡solo con los ojos!',
   wow:'Los artistas pueden convertir cosas cotidianas en arte.',ask:'¿Qué le añadirías?'}
 }
};
W['mmfa-cragg']={
 icon:'🙂',short:{en:'The many faces',fr:'Les nombreux visages',es:'Las muchas caras'},
 themes:['hidden','bronze','materials'],
 little:{
  en:{clue:'Find a bronze shape full of holes. Faces are hiding in its sides!',
   look:[['🕳️','Holes'],['🙂','A face in profile'],['🔄','A shape that changes as you walk']],
   move:'Walk slowly around it. Say “face!” in a whisper each time you spot one.',
   wow:'The faces only appear from certain sides.',ask:'How many faces did you find?'},
  fr:{clue:'Trouve une forme de bronze pleine de trous. Des visages se cachent sur ses côtés !',
   look:[['🕳️','Des trous'],['🙂','Un visage de profil'],['🔄','Une forme qui change quand tu marches']],
   move:'Tourne doucement autour. Chuchote « visage ! » chaque fois que tu en vois un.',
   wow:'Les visages n’apparaissent que de certains côtés.',ask:'Combien de visages as-tu trouvés ?'},
  es:{clue:'Busca una forma de bronce llena de agujeros. ¡Hay caras escondidas en sus lados!',
   look:[['🕳️','Agujeros'],['🙂','Una cara de perfil'],['🔄','Una forma que cambia al caminar']],
   move:'Rodéala despacio. Susurra «¡cara!» cada vez que veas una.',
   wow:'Las caras solo aparecen desde algunos lados.',ask:'¿Cuántas caras encontraste?'}
 }
};

/* Expansion candidate (NOT in the visitor route until staff verification).
   On-site iPhone colour signatures already exist in trace-gallery-signatures.js. */
W['mmfa-hearts']={
 icon:'💞',short:{en:'Two giant hearts',fr:'Deux cœurs géants',es:'Dos corazones gigantes'},
 themes:['emotions','outdoors'],
 little:{
  en:{clue:'Outside, look for two giant hearts standing side by side.',
   look:[['💞','Two hearts'],['📏','Very, very big'],['🌳','Standing outside']],
   move:'Make a heart with your hands. Hold it up next to the big ones!',
   wow:'The title says “6 feet”. That is about as tall as a very tall grown-up!',
   ask:'Who would you give a giant heart to?'},
  fr:{clue:'Dehors, cherche deux cœurs géants côte à côte.',
   look:[['💞','Deux cœurs'],['📏','Très, très grands'],['🌳','Debout dehors']],
   move:'Fais un cœur avec tes mains. Tiens-le à côté des grands cœurs !',
   wow:'Le titre dit « 6 pieds ». C’est à peu près la taille d’un très grand adulte !',
   ask:'À qui donnerais-tu un cœur géant ?'},
  es:{clue:'Afuera, busca dos corazones gigantes, uno al lado del otro.',
   look:[['💞','Dos corazones'],['📏','Muy, muy grandes'],['🌳','De pie, afuera']],
   move:'Haz un corazón con las manos. ¡Ponlo junto a los grandes!',
   wow:'El título dice «6 pies». ¡Es más o menos la altura de un adulto muy alto!',
   ask:'¿A quién le darías un corazón gigante?'}
 }
};

/* Pair-specific connections Mica can make when the second work is found after
   the first. Generic theme sentences cover every other pair. */
const LINKS=[
 {pair:['mmfa-rodin','mmfa-eye'],theme:'bronze',
  en:'Remember the Thinker? He rested his chin on his hand. This giant hides its whole face with hands! Both are bronze.',
  fr:'Tu te souviens du Penseur ? Il posait son menton sur sa main. Ce géant cache tout son visage avec des mains ! Les deux sont en bronze.',
  es:'¿Recuerdas al Pensador? Apoyaba la barbilla en la mano. ¡Este gigante esconde toda la cara con manos! Los dos son de bronce.'},
 {pair:['mmfa-rodin','mmfa-frink'],theme:'emotions',
  en:'The Thinker was thinking. These two are remembering. Statues can show what is going on inside!',
  fr:'Le Penseur réfléchissait. Ces deux-là se souviennent. Les statues peuvent montrer ce qui se passe à l’intérieur !',
  es:'El Pensador pensaba. Estos dos recuerdan. ¡Las estatuas pueden mostrar lo que pasa por dentro!'},
 {pair:['mmfa-marrel','mmfa-witte'],theme:'hidden',
  en:'In the flower painting, you looked up close. Here, you look far, far away. Same room, two ways of looking!',
  fr:'Dans le tableau de fleurs, tu as regardé de tout près. Ici, tu regardes très loin. Même salle, deux façons de regarder !',
  es:'En el cuadro de flores miraste muy de cerca. Aquí miras muy, muy lejos. ¡Misma sala, dos formas de mirar!'},
 {pair:['mmfa-witte','mmfa-fortin'],theme:'light',
  en:'The music room was full of calm light. This town is waiting for a storm. Light changes how a picture feels!',
  fr:'La salle de musique était pleine d’une lumière calme. Cette ville attend l’orage. La lumière change l’humeur d’un tableau !',
  es:'La sala de música tenía una luz tranquila. Este pueblo espera la tormenta. ¡La luz cambia cómo se siente un cuadro!'},
 {pair:['mmfa-marrel','mmfa-fortin'],theme:'materials',
  en:'Marrel painted on shiny copper. Fortin started on a dark background. What is under the paint matters!',
  fr:'Marrel peignait sur du cuivre brillant. Fortin commençait sur un fond sombre. Ce qu’il y a sous la peinture compte !',
  es:'Marrel pintaba sobre cobre brillante. Fortin empezaba sobre un fondo oscuro. ¡Lo que hay debajo de la pintura importa!'},
 {pair:['mmfa-fortin','mmfa-eye'],theme:'light',
  en:'Fortin painted dark houses under a bright sky. Now look: a dark bronze giant under a REAL sky!',
  fr:'Fortin peignait des maisons sombres sous un ciel lumineux. Regarde : un géant de bronze sombre sous un VRAI ciel !',
  es:'Fortin pintó casas oscuras bajo un cielo brillante. Mira: ¡un gigante de bronce oscuro bajo un cielo DE VERDAD!'},
 {pair:['mmfa-eye','mmfa-frink'],theme:'outdoors',
  en:'Another bronze sculpture outside! Rain, snow and sun all touch it. How is that different from a painting inside?',
  fr:'Encore une sculpture de bronze dehors ! La pluie, la neige et le soleil la touchent. Quelle différence avec un tableau à l’intérieur ?',
  es:'¡Otra escultura de bronce afuera! La lluvia, la nieve y el sol la tocan. ¿En qué se diferencia de un cuadro de adentro?'},
 {pair:['mmfa-marrel','mmfa-eye'],theme:'hidden',
  en:'The lizard hid in the flowers. Here a whole face is hiding behind hands. Artists love hiding things!',
  fr:'Le lézard se cachait dans les fleurs. Ici, tout un visage se cache derrière des mains. Les artistes adorent cacher des choses !',
  es:'La lagartija se escondía entre las flores. Aquí una cara entera se esconde tras las manos. ¡A los artistas les encanta esconder cosas!'},
 {pair:['mmfa-frink','mmfa-hearts'],theme:'emotions',
  en:'The two guardians help us remember. These two hearts help us love. Art can hold big feelings!',
  fr:'Les deux gardiens nous aident à nous souvenir. Ces deux cœurs nous aident à aimer. L’art peut contenir de grands sentiments !',
  es:'Los dos guardianes nos ayudan a recordar. Estos dos corazones nos ayudan a querer. ¡El arte guarda grandes sentimientos!'}
];
const THEME_LINE={
 en:'This one is about {theme}, just like {prev}!',
 fr:'Celle-ci parle de {theme}, comme {prev} !',
 es:'¡Esta habla de {theme}, igual que {prev}!'
};

/* Interface words. Short, verb-first, readable aloud. */
const UI={
 en:{hello:'Hi! I’m Mica. Let’s hunt for art treasures together!',who:'Who is exploring today?',go:'Let’s go!',
  listen:'Listen',stop:'Stop',autoRead:'Mica reads aloud',found:'I found it!',where:'Where is it?',help:'Help me',
  peek:'Peek',next:'Next treasure',play:'Play!',trail:'Treasure trail',treasures:'My treasures',mystery:'Mystery',
  treasure:'Treasure',of:'of',spy:'I spy…',spyHelp:'Tap each one when you see it.',doIt:'Try this!',question:'Mica wonders…',
  wow:'Wow!',youFound:'You found it!',sameRoom:'Another treasure is hiding in this same room!',
  nextRoom:'Next treasure is somewhere else. Follow the trail!',roomDone:'Room complete!',allDone:'You found every treasure! You are a real art explorer!',
  floor:'Floor',outside:'Outside',here:'Last treasure found here',grownups:'For grown-ups',start:'Start',
  noLive:'The trail shows the way. It does not know where you are right now.',suggested:'Suggested route from the museum map',
  directions:'How to get there',back:'Back',locked:'Find the treasures before this one first',
  collectionEmpty:'Your treasure shelf is waiting. Find your first artwork!',deeper:'Look deeper',
  lookAgain:'Look again',remember:'Mica remembers',connect:'Connect two treasures',youAreHere:'Start here',
  mapHeading:'Your treasure map',stop:'Stop',stopsLeft:'treasures left',outsideWarn:'Hold a grown-up’s hand outside.'},
 fr:{hello:'Salut ! Je suis Mica. Partons à la chasse aux trésors de l’art !',who:'Qui explore aujourd’hui ?',go:'C’est parti !',
  listen:'Écouter',stop:'Arrêter',autoRead:'Mica lit à voix haute',found:'Je l’ai trouvée !',where:'Où est-elle ?',help:'Aide-moi',
  peek:'Un indice',next:'Trésor suivant',play:'Jouer !',trail:'Le chemin des trésors',treasures:'Mes trésors',mystery:'Mystère',
  treasure:'Trésor',of:'sur',spy:'Je vois, je vois…',spyHelp:'Touche chaque chose quand tu la vois.',doIt:'Essaie ça !',question:'Mica se demande…',
  wow:'Waouh !',youFound:'Tu l’as trouvée !',sameRoom:'Un autre trésor se cache dans cette même salle !',
  nextRoom:'Le prochain trésor est ailleurs. Suis le chemin !',roomDone:'Salle terminée !',allDone:'Tu as trouvé tous les trésors ! Tu es un vrai explorateur de l’art !',
  floor:'Étage',outside:'Dehors',here:'Dernier trésor trouvé ici',grownups:'Pour les adultes',start:'Commencer',
  noLive:'Le chemin montre la route. Il ne sait pas où tu te trouves en ce moment.',suggested:'Trajet suggéré d’après le plan du musée',
  directions:'Comment y aller',back:'Retour',locked:'Trouve d’abord les trésors d’avant',
  collectionEmpty:'Ton étagère à trésors t’attend. Trouve ta première œuvre !',deeper:'Regarder plus loin',
  lookAgain:'Regarde encore',remember:'Mica se souvient',connect:'Relier deux trésors',youAreHere:'Départ ici',
  mapHeading:'Ta carte au trésor',stop:'Étape',stopsLeft:'trésors restants',outsideWarn:'Dehors, tiens la main d’un adulte.'},
 es:{hello:'¡Hola! Soy Mica. ¡Vamos a buscar tesoros de arte juntos!',who:'¿Quién explora hoy?',go:'¡Vamos!',
  listen:'Escuchar',stop:'Parar',autoRead:'Mica lee en voz alta',found:'¡La encontré!',where:'¿Dónde está?',help:'Ayúdame',
  peek:'Una pista',next:'Siguiente tesoro',play:'¡Jugar!',trail:'El camino de los tesoros',treasures:'Mis tesoros',mystery:'Misterio',
  treasure:'Tesoro',of:'de',spy:'Veo, veo…',spyHelp:'Toca cada cosa cuando la veas.',doIt:'¡Prueba esto!',question:'Mica se pregunta…',
  wow:'¡Guau!',youFound:'¡La encontraste!',sameRoom:'¡Otro tesoro se esconde en esta misma sala!',
  nextRoom:'El siguiente tesoro está en otro lugar. ¡Sigue el camino!',roomDone:'¡Sala completa!',allDone:'¡Encontraste todos los tesoros! ¡Eres un verdadero explorador del arte!',
  floor:'Planta',outside:'Afuera',here:'Último tesoro encontrado aquí',grownups:'Para adultos',start:'Empezar',
  noLive:'El camino muestra la ruta. No sabe dónde estás ahora mismo.',suggested:'Ruta sugerida según el plano del museo',
  directions:'Cómo llegar',back:'Volver',locked:'Encuentra primero los tesoros anteriores',
  collectionEmpty:'Tu estante de tesoros te espera. ¡Encuentra tu primera obra!',deeper:'Mirar más a fondo',
  lookAgain:'Mira otra vez',remember:'Mica recuerda',connect:'Unir dos tesoros',youAreHere:'Empieza aquí',
  mapHeading:'Tu mapa del tesoro',stop:'Parada',stopsLeft:'tesoros por encontrar',outsideWarn:'Afuera, dale la mano a un adulto.'}
};

/* Short, kid-readable room names for the trail. Official labels stay in the map. */
const ROOM_KID={
 'mmfa-peace-1':{icon:'🕊️',en:'Pavilion for Peace',fr:'Pavillon pour la Paix',es:'Pabellón por la Paz'},
 'mmfa-peace-3':{icon:'🕊️',en:'Pavilion for Peace',fr:'Pavillon pour la Paix',es:'Pabellón por la Paz'},
 'mmfa-bourgie-1':{icon:'⛪',en:'Bourgie Pavilion',fr:'Pavillon Bourgie',es:'Pabellón Bourgie'},
 'mmfa-bourgie-front':{icon:'🌳',en:'Outside, by the Bourgie Pavilion',fr:'Dehors, devant le pavillon Bourgie',es:'Afuera, junto al pabellón Bourgie'},
 'mmfa-avenue-du-musee':{icon:'🌳',en:'Outside, on Avenue du Musée',fr:'Dehors, avenue du Musée',es:'Afuera, en la avenida du Musée'},
 'mmfa-entrance':{icon:'🚪',en:'Main entrance',fr:'Entrée principale',es:'Entrada principal'}
};

window.TRACE_EXPLORER_CONTENT=Object.freeze({TIERS,THEMES,WORKS:W,LINKS,THEME_LINE,UI,ROOM_KID});
})();
