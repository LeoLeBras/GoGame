var API = [
  /**************************/
  /*                        */
  /*         GÉNÉRAL        */
  /*                        */
  /**************************/
      {
        title: 'Dan',
        kanji: 'ダン',
        description: 'Ce terme japonnais est utilisé dans les arts martiaux ainsi que d’autres pratiques traditionnelles pour signaler différents niveaux de maîtrise ou d’expérience. Il va du 1er au 9ème dan.',
        categories: ['Général', 'Dan']
      },
      {
        title: 'Insei',
        kanji: '見習い',
        description: 'On parle d\'Insei pour désigner un joueur qui est un apprenti porfessionnel.',
        categories: ['Général', 'Insei']
      },
      {
        title: 'Kifu',
        kanji: '季風',
        description: 'Déisgne l\'enregistrement d\'une partie sur un papier quadrillé représentant un goban, une fois que celle-ci est terminée.',
        categories: ['Général', 'Kifu']
      },
      {
        title: 'Kyū',
        kanji: 'コミ語',
        description: 'Indique le niveau d\'un joueur moyen. Le Kyū va de 30ème Kyū à 1er Kyū',
        categories: ['Général', 'Kyu']
      },
      {
        title: 'Fuseki',
        kanji: '布石',
        description: 'Le fuseki est le mot japonais utilisé et conservé tel quel dans les langues occidentales pour désigner l\'ouverture d\'une partie de go.',
        categories: ['Général', 'Fuseki']
      },
      {
        title: 'Joseki',
        kanji: '定石',
        description: 'Un joseki est une séquence classique (une « forme modèle »). Les plus utilisés sont ceux de coin, principalement en début de partie (fuseki), mais il existe des joseki de bord et ils peuvent être utiles tout au long de la partie.',
        categories: ['Général', 'Joseki']
      },
      {
        title: 'Chuban',
        kanji: '中盤',
        description: 'Chuban désigne le umilieu d\'une partie dans le jeu de go.',
        categories: ['Général', 'Chuban']
      },
      {
        title: 'Yose',
        kanji: 'ヨセ',
        description: 'Ce terme désigne la phase finale d\'une partie de jeu de go, et par extension les séquences et les concepts de jeu normalement spécifiques à la fin de partie.',
        categories: ['Général', 'Yose']
      },

  /**************************/
  /*                        */
  /*         RÈGLES         */
  /*                        */
  /**************************/

      {
        title: 'Byo yomi',
        kanji: '黄泉',
        description: 'Désigne le temps imparti au joueur pour terminer sa partie, et il dépend du niveau des adversaires. Jusqu\'à 8 heures peuvent être attribuées aux matchs réunissant les meilleurs joueurs de go, mais sinon il est beaucoup plus réduit.',
        categories: ['Règles', 'Byo Yomi', 'Byo', 'Yomi']
      },
      {
        title: 'Komi',
        kanji: 'コミ語',
        description: 'Ce termine désigne les points donnés aux Blanc en début de partie pour compenser leur handicap, vu qu\'ils jouent en second',
        categories: ['Règles', 'Komi']
      },
      {
        title: 'Nigiri',
        kanji: 'にぎり',
        description: 'Le nigiri désigne, au jeu de go, le tirage au sort des couleurs jouées par les joueurs avant la partie. On procède ainsi : l\'un des joueurs (Blanc) prend le bol de pierres blanches, l\'autre (Noir) celui de pierres noires.',
        categories: ['Règles', 'Nigiri']
      },
      {
        title: 'Tsumego',
        kanji: '詰碁',
        description: 'Tsumego est un terme japonais du jeu de go et désigne un problème de « vie et mort ». Il est utilisé au go pour désigner des coups bloquant l\'expansion d\'un groupe. On peut le traduire par "go dans des espaces limités".',
        categories: ['Règles', 'Tsumego']
      },

  /**************************/
  /*                        */
  /*         GOBAN          */
  /*                        */
  /**************************/

     {
        title: 'Goban',
        kanji: '碁盤',
        description: 'Il s\'agit du plateau quadrillé qu\'on utilise pour jouer au go. Il peut être de différentes tailles : 9x9, 13x19, ou plus généralement en 19x19.',
        categories: ['Goban', 'Goban']
      },
      {
        title: 'Hoshi',
        kanji: '保志',
        description: 'Les hoshis (étoiles) sont les points noirs épais qui marquent le goban sur lequel se joue le jeu de go. Les pierres de handicap sont traditionnellement placées sur les hoshis.',
        categories: ['Goban', 'Hoshi']
      },
      {
        title: 'Komoku',
        kanji: '小目',
        description: 'Les points 3-4 ou 4-3, situés dans une extrémité du goban.',
        categories: ['Goban', 'Komoku']
      },
      {
        title: 'Mokuhazushi',
        kanji: '目外し',
        description: 'Les points 3-5 ou 5-3, situés dans une extrémité du goban.',
        categories: ['Goban', 'Mokuhazushi']
      },
      {
        title: 'Takamoku',
        kanji: '高杢',
        description: 'Les points 4-5 ou 5-4, situés dans une extrémité du goban.',
        categories: ['Goban', 'San-san', 'San']
      },
      {
        title: 'San-san',
        kanji: 'サンさん',
        description: 'Les points point 3-3 dans un coin, intervenant beaucoup dans les problèmes de vie et de mort des coins.',
        categories: ['Goban', 'San-san', 'San']
      },
      {
        title: 'Tengen',
        kanji: '天元',
        description: 'Le tengen (tianyuan en chinois, littéralement "Centre du ciel") désigne le point central d\'un goban, le plateau de jeu de go.',
        categories: ['Goban', 'Tengen']
      },

  /**************************/
  /*                        */
  /*         COMBAT         */
  /*                        */
  /**************************/

      {
        title: 'Tenuki',
        kanji: '手抜き',
        description: 'Faire tenuki, c\'est suspendre une séquence locale pour aller jouer ailleurs, sans aucune autre marque de respect.',
        categories: ['Combat', 'Tenuki']
      },
      {
        title: 'Damezumari',
        kanji: 'ダメヅマ',
        description: 'Décrit la situation d\'un groupe de pierres en manque de libertés',
        categories: ['Combat', 'Damezumari']
      },
      {
        title: 'Geta',
        kanji: 'ダメヅマ',
        description: 'Au jeu de go, un geta (ou filet), est une technique de capture. Il permet de capturer des pierres ennemies en les enfermant dans une forme qui ressemble à un filet.',
        categories: ['Combat', 'Geta']
      },
      {
        title: 'Prisonnier',
        kanji: '囚人',
        description: 'Pierre capturée par un joueur et mise de côté pour compter les points',
        categories: ['Combat', 'Prisonnier']
      },
      {
        title: 'Hasanami',
        kanji: 'は佐波',
        description: 'Tactique qui consiste à encercler les pions adverses en les prenant en tenaille.',
        categories: ['Combat', 'Hasanami']
      },
      {
        title: 'Honte',
        kanji: '本手',
        description: 'Coup "authentique" car il est sens de simple et efficace.',
        categories: ['Combat', 'Honte']
      },
      {
        title: 'Territoire',
        kanji: '領土',
        description: 'Espace entouré par les pierres d\'un joueur.',
        categories: ['Combat', 'Territoire']
      },
      {
        title: 'Kakari',
        kanji: 'かかり',
        description: 'S\'emploit lorsqu\'on "approche" d\'une pierre du coin',
        categories: ['Combat', 'Kakari']
      },
      {
        title: 'Kakashi',
        kanji: 'カカシ',
        description: 'Technique qui constitue à effectuer un coup entraînant une réponse unique et souvent forcée, de l\'adversaire.',
        categories: ['Combat', 'Kakashi']
      },
      {
        title: 'Ko',
        kanji: '劫',
        description: 'Dans le jeu de go, le terme ko désigne une configuration répétitive particulièrement fréquente, et ayant nécessité la création d\'une règle spéciale.',
        categories: ['Combat', 'Ko']
      },
      {
        title: 'Sagari',
        kanji: '下がり',
        description: '"Descente" : c\'est un coup permettant de gagner des libertés lorsque le besoin se fait sentir.',
        categories: ['Combat', 'Sagari']
      },
      {
        title: 'Shibori',
        kanji: '絞り',
        description: 'Le Shibori ("essorage) est technique de sacrifice permettant de prendre à un groupe de prendre une bonne forme.',
        categories: ['Combat', 'Shibori']
      },
      {
        title: 'Shicho',
        kanji: '師著',
        description: 'Au jeu de go, un shichō est une technique de capture, qui ne laisse à chaque coup qu\'une seule liberté au groupe de l\'adversaire. Si aucune pierre du plateau n\'interfère, la séquence de coups traverse tout le goban, avec une forme d\'escalier.',
        categories: ['Combat', 'Shicho']
      },
      {
        title: 'Briseur de schicho',
        kanji: '地著ブカ',
        description: 'Le Briseur de schicho points est une pierre empêchant l\'adversaire de te capturer en shicho.',
        categories: ['Combat', 'Briseur de schicho', 'Shicho']
      },
      {
        title: 'Techu',
        kanji: 'テチュ',
        description: 'La technique du "béton" permet le renforcement d\'un point sensible du goban.',
        categories: ['Combat', 'Techu']
      },
      {
        title: 'Ikken',
        kanji: '一見',
        description: 'Ikken ou "proche", corresponda à un saut d\'une intersection, sur le goban.',
        categories: ['Combat', 'Ikken']
      },
      {
        title: 'Niken',
        kanji: '二件',
        description: 'Ikken ou "loin", corresponda à un saut de 2 intersections, sur le goban.',
        categories: ['Combat', 'Niken']
      },
      {
        title: 'Seki',
        kanji: '関',
        description: 'Le Seki est une forme de vie particulière où jouer un coup implique de se faire capturer',
        categories: ['Combat', 'Seki']
      },
      {
        title: 'Vivre',
        kanji: 'ライブ',
        description: 'Rendre un groupe de pierres incapturable, en créant deux yeux ou par seki',
        categories: ['Combat', 'Vivre']
      },
      {
        title: 'Taka',
        kanji: 'たか',
        description: 'Ikken ou "haut", correspondant souvent à la 4eme ligne du goban.',
        categories: ['Combat', 'Taka']
      },
      {
        title: 'Aji',
        kanji: '味',
        description: '« Arrière-goût » ou le potentiel de nuisance restant dans une position.',
        categories: ['Combat', 'Aji']
      },
      {
        title: 'Atari',
        kanji: '当たり',
        description: 'Atari (« hurler, dévorer ») est un terme technique du jeu de go. Il décrit une situation de jeu dans laquelle une pierre ou un groupe de pierres n\'a plus qu\'une seule liberté (une seule intersection vide dans le voisinage immédiat).',
        categories: ['Combat', 'Atari']
      },
      {
        title: 'Compter',
        kanji: 'カウント',
        description: 'Calculer le nombre de libertés restantes pour un groupe ; calculer le nombre de points respectif des joueurs',
        categories: ['Combat', 'Compter']
      },
      {
        title: 'Dame',
        kanji: 'ダメ',
        description: 'Terme qui désigne les libertés d\'un groupe de pierres ; intersection ne valant pas de point.',
        categories: ['Combat', 'Dame']
      },
      {
        title: 'Dame',
        kanji: '後手',
        description: 'Terme qui désigne une séquence qui fait perdre la main au joueur qui l\'a commencée.',
        categories: ['Combat', 'Dame']
      },
      {
        title: 'Hamete',
        kanji: 'ハメ手',
        description: 'Un hamete est un terme qui désigne un coup ou une séquence de coups destinés à piéger l\'adversaire. Si celui-ci ne répond pas correctement et tombe dans le piège, le résultat peut être très pénalisant.',
        categories: ['Combat', 'Hamete']
      },
      {
        title: 'Influence',
        kanji: '影響',
        description: 'Désigne les conséquences vers l\'extérieur de la solidité d\'une positions',
        categories: ['Combat', 'Influence']
      },

  /**************************/
  /*                        */
  /*         COMBAT         */
  /*                        */
  /**************************/

      {
        title: 'Angle vide',
        kanji: '空の角度',
        description: '3 pierres collées formant un coude autour d\'une intersection vide, forme réputée mauvaise car inefficace.',
        categories: ['Combat', 'Angle vide', 'Angle', 'Vide']
      },
      {
        title: 'Lourde/légère',
        kanji: '重い/です',
        description: 'Caractéristiques des formes concernant le nombre de libertés et la faciliter à vivre ou fuir.',
        categories: ['Combat', 'Forme', 'lourde', 'légère']
      },
      {
        title: 'Hane',
        kanji: 'ハネ',
        description: 'Le hane désigne un coup spécifique lors d\'une partie de go, qui consiste à contourner une ou plusieurs pierres de l\'adversaire.',
        categories: ['Combat', 'Hane']
      },
      {
        title: 'Keima',
        kanji: '桂馬',
        description: 'Désigne une action au coup par rapport à une pierre amie, avec un déplacement similaire au cavalier d\'échec. Il existe le petit Keima (Kogeima) et le grand Keima (Ogeima)•',
        categories: ['Combat', 'Keima', 'Kogeima', 'Ogeima']
      },
      {
        title: 'Kosumi',
        kanji: '小済',
        description: 'Désigne un coup en diagonale par rapport à une pierre amie•',
        categories: ['Combat', 'Kosumi']
      },
      {
        title: 'Ponnuki ',
        kanji: 'ぽん浮き',
        description: 'forme laissée après la capture d\'une seule pierre ennemie (quatre pierres autour d\'une intersection vide).',
        categories: ['Combat', 'Ponnuki ']
      },
      {
        title: 'Tobi',
        kanji: 'トビ',
        description: 'Le Tobi est un terme technique du jeu de go qui désigne un saut en ligne droite par rapport à une pierre amie. Ainsi, deux pierres de même couleur seront séparées par une seule intersection sur une même ligne.',
        categories: ['Combat', 'Tobi']
      },

  /**************************/
  /*                        */
  /*          PRO           */
  /*                        */
  /**************************/
      
      {
        title: 'Meijin',
        kanji: '名人',
        description: 'Meijin est un titre exceptionnel , aboutissement de toute une existence dédiée à l\'art,  associant parfois la notion d\'être divin , pour mieux faire comprendre la valeur du lauréat. Le terme signifie Grand Maître , Être d\'exception accompli.',
        categories: ['Pro', 'Meijin']
      },
      {
        title: 'Kisei',
        kanji: '棋聖',
        description: 'Le Kisei est un tournoi japonais de jeu de go.',
        categories: ['Pro', 'Kisei']
      },
      {
        title: 'Honinbō',
        kanji: '本因坊',
        description: 'Hon\'inbō était l\'une des quatre grandes écoles de go du Japon, et désigne désormais l\'un des principaux titres japonais de jeu de go, dont le détenteur est décidé par un tournoi.',
        categories: ['Pro', 'Honinbo']
      },
      {
        title: 'Juudan',
        kanji: '十段',
        description: 'Le Juudan, qui se traduit littéralement par "dixième dan", est un tournoi de jeu de go.',
        categories: ['Pro', 'Juudan']
      },
      {
        title: 'Ōza',
        kanji: '王座',
        description: 'Ōza, littéralement « le trône », est un titre et un tournoi japonais de jeu de go. La finale du tournoi consiste en une série de cinq parties entre le détenteur du titre et le vainqueur d\'une ligue de 16 joueurs.',
        categories: ['Pro', 'Oza']
      },

  /**************************/
  /*                        */
  /*        PIERRES         */
  /*                        */
  /**************************/
      
      /* AVAILABLE SOON */

    ];

module.exports = API;