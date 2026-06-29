const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageBreak, PageNumber, Header, Footer, TabStopType,
  TabStopPosition, VerticalAlign
} = require('docx');
const fs = require('fs');

const BLUE = "1F4E79";
const LIGHT_BLUE = "D6E4F0";
const HEADER_BG = "2E75B6";
const WHITE = "FFFFFF";
const GRAY = "F2F2F2";
const BORDER = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };
const NO_BORDERS = {
  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
};

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 320, after: 160 },
    children: [new TextRun({ text, bold: true, size: 36, color: BLUE, font: "Arial" })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 240, after: 120 },
    children: [new TextRun({ text, bold: true, size: 28, color: BLUE, font: "Arial" })]
  });
}

function h3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 24, color: "1F497D", font: "Arial" })]
  });
}

function para(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 80, after: 80 },
    children: [new TextRun({ text, size: 22, font: "Arial", ...opts })]
  });
}

function spacer() {
  return new Paragraph({ children: [new TextRun("")], spacing: { before: 60, after: 60 } });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { before: 40, after: 40 },
    children: [new TextRun({ text, size: 22, font: "Arial" })]
  });
}

function codeBlock(text) {
  const lines = text.split('\n');
  return lines.map(line => new Paragraph({
    spacing: { before: 0, after: 0 },
    shading: { fill: "F0F0F0", type: ShadingType.CLEAR },
    border: {
      left: { style: BorderStyle.SINGLE, size: 8, color: "2E75B6", space: 6 }
    },
    indent: { left: 360 },
    children: [new TextRun({ text: line || " ", font: "Courier New", size: 18, color: "1A1A1A" })]
  }));
}

function headerRow(cells, widths) {
  return new TableRow({
    tableHeader: true,
    children: cells.map((text, i) =>
      new TableCell({
        borders: BORDERS,
        width: { size: widths[i], type: WidthType.DXA },
        shading: { fill: HEADER_BG, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 120, right: 120 },
        verticalAlign: VerticalAlign.CENTER,
        children: [new Paragraph({
          children: [new TextRun({ text, bold: true, size: 20, color: WHITE, font: "Arial" })]
        })]
      })
    )
  });
}

function dataRow(cells, widths, shade = false) {
  return new TableRow({
    children: cells.map((text, i) =>
      new TableCell({
        borders: BORDERS,
        width: { size: widths[i], type: WidthType.DXA },
        shading: { fill: shade ? GRAY : WHITE, type: ShadingType.CLEAR },
        margins: { top: 60, bottom: 60, left: 120, right: 120 },
        children: [new Paragraph({
          children: [new TextRun({ text: String(text), size: 20, font: "Arial" })]
        })]
      })
    )
  });
}

function table(headers, rows, widths) {
  const total = widths.reduce((a, b) => a + b, 0);
  return new Table({
    width: { size: total, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      headerRow(headers, widths),
      ...rows.map((r, idx) => dataRow(r, widths, idx % 2 === 1))
    ]
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

// ---- DOCUMENT ----

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "\u2022",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } }
        }]
      }
    ]
  },
  styles: {
    default: {
      document: { run: { font: "Arial", size: 22 } }
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal",
        run: { size: 36, bold: true, font: "Arial", color: BLUE },
        paragraph: { spacing: { before: 320, after: 160 }, outlineLevel: 0 }
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal",
        run: { size: 28, bold: true, font: "Arial", color: BLUE },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 }
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal",
        run: { size: 24, bold: true, font: "Arial", color: "1F497D" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 }
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1260, bottom: 1440, left: 1260 }
      }
    },
    headers: {
      default: new Header({
        children: [
          new Paragraph({
            border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 } },
            spacing: { after: 120 },
            children: [
              new TextRun({ text: "BookNest \u2014 Rapport de Projet Django", bold: true, size: 20, font: "Arial", color: BLUE }),
              new TextRun({ text: "\t2025-2026", size: 18, font: "Arial", color: "888888" })
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }]
          })
        ]
      })
    },
    footers: {
      default: new Footer({
        children: [
          new Paragraph({
            border: { top: { style: BorderStyle.SINGLE, size: 6, color: "2E75B6", space: 1 } },
            spacing: { before: 120 },
            children: [
              new TextRun({ text: "Projet n\u00b02 \u2014 Universit\u00e9", size: 18, font: "Arial", color: "888888" }),
              new TextRun({ text: "\tPage ", size: 18, font: "Arial", color: "888888" }),
              new TextRun({ children: [PageNumber.CURRENT], size: 18, font: "Arial", color: "888888" })
            ],
            tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }]
          })
        ]
      })
    },
    children: [
      // ============ PAGE DE GARDE ============
      spacer(), spacer(), spacer(),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 200 },
        children: [new TextRun({ text: "RAPPORT DE PROJET DJANGO", bold: true, size: 48, font: "Arial", color: BLUE })]
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 120 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: "2E75B6", space: 6 } },
        children: [new TextRun({ text: "BookNest \u2014 Biblioth\u00e8que Personnelle en Ligne", size: 32, font: "Arial", color: "1F497D" })]
      }),
      spacer(), spacer(),
      new Table({
        width: { size: 8000, type: WidthType.DXA },
        columnWidths: [3000, 5000],
        rows: [
          ["Titre du projet", "BookNest - Biblioth\u00e8que personnelle en ligne"],
          ["Projet", "Projet n\u00b02 - Cahier des charges Django 2025-2026"],
          ["Filiere", "[Fili\u00e8re \u00e0 compl\u00e9ter]"],
          ["Ann\u00e9e universitaire", "2025-2026"],
          ["Encadrant", "[Nom de l\u2019encadrant \u00e0 compl\u00e9ter]"],
          ["Lien GitHub", "github.com/Tranck04/django-booknest-tracy-franck-mukendi"],
        ].map(([k, v], idx) => new TableRow({
          children: [
            new TableCell({
              borders: BORDERS, width: { size: 3000, type: WidthType.DXA },
              shading: { fill: LIGHT_BLUE, type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: k, bold: true, size: 20, font: "Arial", color: BLUE })] })]
            }),
            new TableCell({
              borders: BORDERS, width: { size: 5000, type: WidthType.DXA },
              shading: { fill: idx % 2 === 0 ? WHITE : GRAY, type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 120, right: 120 },
              children: [new Paragraph({ children: [new TextRun({ text: v, size: 20, font: "Arial" })] })]
            })
          ]
        }))
      }),
      spacer(), spacer(),
      pageBreak(),

      // ============ TABLE DES MATIERES ============
      h1("Table des mati\u00e8res"),
      ...[
        "1. Introduction",
        "2. Analyse et conception",
        "3. R\u00e9alisation technique (architecture, applications, mod\u00e8les, URLs, templates, formulaires, couvertures, mots de passe, import catalogue, navigation, authentification, suivi et statistiques)",
        "4. Tests et validation",
        "5. Conclusion",
        "6. Annexes"
      ].map(t => new Paragraph({
        spacing: { before: 60, after: 60 },
        children: [new TextRun({ text: t, size: 22, font: "Arial" })]
      })),
      pageBreak(),

      // ============ 1. INTRODUCTION ============
      h1("1. Introduction"),
      h2("1.1 Contexte"),
      para("Dans le cadre du cours Django, il a \u00e9t\u00e9 demand\u00e9 de r\u00e9aliser une application web compl\u00e8te respectant l\u2019architecture MVT de Django. Le projet devait mettre en \u0153uvre les notions essentielles du cours : environnement virtuel, applications Django, mod\u00e8les, migrations, administration, vues, templates, formulaires, authentification, op\u00e9rations CRUD, tests automatis\u00e9s et documentation."),
      para("Le projet choisi est BookNest, une biblioth\u00e8que personnelle en ligne. L\u2019application permet de consulter un catalogue de 271 379 livres issus du fichier books.csv, d\u2019organiser les ouvrages par cat\u00e9gories, de g\u00e9rer une biblioth\u00e8que propre \u00e0 chaque utilisateur et de suivre sa progression de lecture. Une commande d\u2019import d\u00e9di\u00e9e (import_books) avec traitement par lots (bulk_create) et gestion des conflits (ignore_conflicts) a permis d\u2019importer l\u2019int\u00e9gralit\u00e9 du dataset."),
      spacer(),

      h2("1.2 Probl\u00e8me trait\u00e9"),
      para("Un lecteur peut rapidement perdre le suivi de ses livres : ouvrages d\u00e9j\u00e0 lus, livres en cours, livres \u00e0 lire plus tard, notes personnelles ou avis. Une simple liste ne suffit pas lorsque l\u2019on souhaite aussi classer les livres par cat\u00e9gorie, \u00e9viter les doublons et conserver des statistiques de lecture."),
      para("BookNest r\u00e9pond \u00e0 ce besoin avec un catalogue commun et des biblioth\u00e8ques personnelles rattach\u00e9es aux comptes utilisateurs. Un m\u00eame livre n\u2019est stock\u00e9 qu\u2019une seule fois dans le catalogue, puis il est reli\u00e9 aux utilisateurs qui l\u2019ajoutent \u00e0 leur collection."),
      spacer(),

      h2("1.3 Objectifs du projet"),
      para("Les objectifs fonctionnels principaux sont les suivants :"),
      bullet("afficher une page d\u2019accueil, une page \u00e0 propos, un catalogue de livres et une fiche d\u00e9taill\u00e9e par ouvrage ;"),
      bullet("permettre l\u2019inscription, la connexion et la d\u00e9connexion des utilisateurs ;"),
      bullet("permettre \u00e0 chaque utilisateur connect\u00e9 d\u2019ajouter, modifier et retirer des livres de sa biblioth\u00e8que ;"),
      bullet("associer les livres \u00e0 des cat\u00e9gories litt\u00e9raires ;"),
      bullet("indiquer un statut de lecture : \u00e0 lire, en cours ou termin\u00e9 ;"),
      bullet("administrer les livres, cat\u00e9gories et biblioth\u00e8ques depuis Django Admin ;"),
      bullet("prendre en charge les couvertures de livres, les favoris, la liste \u00e0 lire plus tard, les notes, commentaires et statistiques."),
      spacer(),

      h2("1.4 Conformit\u00e9 au cahier des charges"),
      table(
        ["Exigence du cahier des charges", "R\u00e9alisation dans BookNest"],
        [
          ["Catalogue de livres", "Vue BookListView, template book_list.html, recherche et filtre par cat\u00e9gorie"],
          ["Fiche d\u00e9taill\u00e9e d\u2019un ouvrage", "Vue BookDetailView, template book_detail.html, r\u00e9sum\u00e9, cat\u00e9gorie, avis et note moyenne"],
          ["Ajouter, modifier et supprimer un livre", "Parcours CRUD via UserBookCreateView, UserBookUpdateView, UserBookDeleteView"],
          ["Cat\u00e9gorie litt\u00e9raire", "Mod\u00e8le Category, relation Book.category, page des cat\u00e9gories et administration"],
          ["Statut de lecture", "Champ reading_status du mod\u00e8le UserBook : \u00e0 lire, en cours, termin\u00e9"],
          ["Django Admin", "Mod\u00e8les Category, Book et UserBook administrables"],
          ["Inscription, connexion, d\u00e9connexion", "Application accounts, SignUpView, LoginView, LogoutView"],
          ["Image de couverture", "Champ cover_image, configuration MEDIA_URL / MEDIA_ROOT, upload via formulaire"],
          ["Biblioth\u00e8que par utilisateur", "Mod\u00e8le UserBook, relation entre User et Book, pages priv\u00e9es prot\u00e9g\u00e9es"],
          ["Favoris et \u00e0 lire plus tard", "Champs is_favorite, is_read_later, vues et pages d\u00e9di\u00e9es"],
          ["Note personnelle et commentaire", "Champs personal_note, comment, rating, affichage des avis publics"],
          ["Statistiques", "Vue ReadingStatsView, r\u00e9partitions par statut et cat\u00e9gorie, taux de compl\u00e9tion"],
          ["Tests automatis\u00e9s", "48 tests Django ex\u00e9cutables avec python manage.py test"],
          ["Documentation et GitHub", "Rapport, README, requirements.txt, d\u00e9p\u00f4t GitHub indiqu\u00e9 en page de garde"],
        ],
        [4200, 5000]
      ),
      pageBreak(),

      // ============ 2. ANALYSE ET CONCEPTION ============
      h1("2. Analyse et conception"),
      h2("2.1 Acteurs"),
      table(
        ["Acteur", "R\u00f4le"],
        [
          ["Visiteur", "Consulte les pages publiques : accueil, \u00e0 propos, catalogue, cat\u00e9gories et fiches livres. Il peut cr\u00e9er un compte."],
          ["Utilisateur connect\u00e9", "G\u00e8re sa biblioth\u00e8que personnelle, ajoute des livres, modifie son statut de lecture, ajoute des notes, marque des favoris et consulte ses statistiques."],
          ["Administrateur", "G\u00e8re les livres, cat\u00e9gories et relations utilisateur depuis l\u2019interface Django Admin."],
        ],
        [2500, 6700]
      ),
      spacer(),

      h2("2.2 Cas d\u2019utilisation principaux"),
      para("Les cas d\u2019utilisation sont organis\u00e9s autour de trois acteurs : le Visiteur (navigation publique et cr\u00e9ation de compte), l\u2019Utilisateur connect\u00e9 (gestion de sa biblioth\u00e8que, statuts, favoris, notes et statistiques) et l\u2019Administrateur (administration des livres et cat\u00e9gories via Django Admin)."),
      spacer(),

      h2("2.3 Mod\u00e8le de donn\u00e9es"),
      para("Le projet utilise trois entit\u00e9s principales : Category, Book et UserBook."),
      spacer(),
      h3("Category"),
      table(
        ["Champ", "Type", "R\u00f4le"],
        [
          ["name", "CharField(100)", "Nom unique de la cat\u00e9gorie"],
          ["description", "TextField", "Description optionnelle"],
        ],
        [2000, 3200, 4000]
      ),
      spacer(),
      h3("Book"),
      para("Le mod\u00e8le Book repr\u00e9sente le catalogue commun. Un livre n\u2019est pas cr\u00e9\u00e9 plusieurs fois pour chaque utilisateur : il est stock\u00e9 une fois, puis r\u00e9f\u00e9renc\u00e9 par les biblioth\u00e8ques personnelles."),
      spacer(),
      table(
        ["Champ", "Type", "R\u00f4le"],
        [
          ["title", "CharField(250)", "Titre du livre"],
          ["author", "CharField(250)", "Auteur"],
          ["isbn", "CharField(13)", "ISBN unique, optionnel"],
          ["summary", "TextField", "R\u00e9sum\u00e9 du livre"],
          ["publication_year", "IntegerField", "Ann\u00e9e de publication"],
          ["cover_image", "ImageField", "Image de couverture uploadable"],
          ["category", "ForeignKey(Category)", "Cat\u00e9gorie litt\u00e9raire"],
          ["added_to_catalog", "DateTimeField", "Date d\u2019ajout au catalogue"],
        ],
        [2000, 3200, 4000]
      ),
      spacer(),
      para("La contrainte unique_together = (\u2019title\u2019, \u2019author\u2019) limite les doublons lorsque l\u2019ISBN n\u2019est pas renseign\u00e9."),
      spacer(),
      h3("UserBook"),
      para("Le mod\u00e8le UserBook relie un utilisateur \u00e0 un livre du catalogue et stocke toutes les informations personnelles li\u00e9es \u00e0 la lecture."),
      spacer(),
      table(
        ["Champ", "Type", "R\u00f4le"],
        [
          ["user", "ForeignKey(User)", "Propri\u00e9taire de l\u2019entr\u00e9e"],
          ["book", "ForeignKey(Book)", "Livre r\u00e9f\u00e9renc\u00e9 dans le catalogue"],
          ["reading_status", "CharField", "Statut : \u00e0 lire, en cours, termin\u00e9"],
          ["added_date", "DateTimeField", "Date d\u2019ajout dans la biblioth\u00e8que"],
          ["is_favorite", "BooleanField", "Marqueur favori"],
          ["is_read_later", "BooleanField", "Marqueur \u00e0 lire plus tard"],
          ["personal_note", "TextField", "Note priv\u00e9e de l\u2019utilisateur"],
          ["comment", "TextField", "Commentaire public affich\u00e9 sur la fiche livre"],
          ["rating", "IntegerField", "\u00c9valuation de 1 \u00e0 5"],
          ["updated_at", "DateTimeField", "Date de derni\u00e8re modification"],
        ],
        [2000, 3200, 4000]
      ),
      spacer(),
      para("La contrainte unique_together = (\u2019user\u2019, \u2019book\u2019) emp\u00eache un utilisateur d\u2019ajouter deux fois le m\u00eame livre dans sa biblioth\u00e8que."),
      spacer(),

      h2("2.4 Sch\u00e9ma relationnel"),
      para("Le sch\u00e9ma relationnel s\u2019articule autour de trois entit\u00e9s :"),
      bullet("Category \u2192 Book (un \u00e0 plusieurs) : une cat\u00e9gorie class\u00e9 plusieurs livres"),
      bullet("Book \u2192 UserBook (un \u00e0 plusieurs) : un livre peut \u00eatre r\u00e9f\u00e9renc\u00e9 dans plusieurs biblioth\u00e8ques"),
      bullet("User \u2192 UserBook (un \u00e0 plusieurs) : un utilisateur poss\u00e8de plusieurs entr\u00e9es de biblioth\u00e8que"),
      spacer(),

      h2("2.5 Logique anti-doublon"),
      para("Lors de l\u2019ajout d\u2019un livre, la vue applique la logique suivante :"),
      bullet("Si un ISBN est fourni, recherche d\u2019abord par ISBN"),
      bullet("Sinon, ou si non trouv\u00e9, recherche par titre et auteur (insensible \u00e0 la casse)"),
      bullet("Si le livre n\u2019existe pas encore dans le catalogue, il est cr\u00e9\u00e9"),
      bullet("V\u00e9rification que l\u2019utilisateur n\u2019a pas d\u00e9j\u00e0 ce livre dans sa biblioth\u00e8que"),
      bullet("Cr\u00e9ation du UserBook"),
      pageBreak(),

      // ============ 3. REALISATION TECHNIQUE ============
      h1("3. R\u00e9alisation technique"),
      h2("3.1 Architecture g\u00e9n\u00e9rale"),
      para("Le projet suit l\u2019architecture MVT de Django : les mod\u00e8les d\u00e9finissent les donn\u00e9es, les vues traitent les requ\u00eates, les templates affichent les pages HTML, et les URLs relient les routes aux vues. Django Admin permet l\u2019administration des donn\u00e9es."),
      spacer(),
      h3("Arborescence simplifi\u00e9e"),
      ...codeBlock("BookNest/\n|-- booknest/           # Configuration du projet\n|   |-- settings.py    # Apps, base SQLite, static, media, auth\n|   |-- urls.py        # Routes principales\n|-- books/             # Application principale\n|   |-- models.py      # Category, Book, UserBook\n|   |-- views.py       # Pages publiques, CRUD, favoris, stats\n|   |-- urls.py        # Routes de l'application books\n|   |-- admin.py       # Administration des modeles\n|   |-- tests.py       # Tests automatises\n|-- accounts/          # Authentification\n|   |-- views.py       # SignUpView\n|   |-- urls.py        # signup, login, logout\n|-- templates/         # Templates HTML\n|-- static/css/        # Mise en forme\n|-- media/book_covers/ # Couvertures uploadables\n|-- requirements.txt\n|-- manage.py"),
      spacer(),

      h2("3.2 Applications et configuration"),
      table(
        ["Application", "R\u00f4le"],
        [
          ["books", "Catalogue, cat\u00e9gories, biblioth\u00e8que personnelle, CRUD, favoris, commentaires et statistiques"],
          ["accounts", "Inscription et int\u00e9gration des vues Django de connexion/d\u00e9connexion"],
        ],
        [2500, 6700]
      ),
      spacer(),
      h3("Extrait de configuration"),
      ...codeBlock("LANGUAGE_CODE = 'fr'\nTIME_ZONE = 'Africa/Casablanca'\nSTATIC_URL = 'static/'\nMEDIA_URL = 'media/'\nMEDIA_ROOT = BASE_DIR / 'media'\nLOGIN_URL = '/accounts/login/'\nLOGIN_REDIRECT_URL = '/my-books/'\nLOGOUT_REDIRECT_URL = '/'"),
      spacer(),

      h2("3.3 Mod\u00e8les, migrations et administration"),
      para("Les mod\u00e8les Category, Book et UserBook ont \u00e9t\u00e9 cr\u00e9\u00e9s dans l\u2019application books. Ils ont fait l\u2019objet de migrations Django afin de cr\u00e9er la structure de la base SQLite. Le mod\u00e8le Book inclut l\u2019image de couverture via ImageField. Les trois mod\u00e8les sont administrables depuis Django Admin."),
      spacer(),

      h2("3.4 URLs et vues"),
      h3("Routes publiques"),
      table(
        ["Nom", "URL", "Vue", "R\u00f4le"],
        [
          ["home", "/", "HomeView", "Accueil et statistiques globales"],
          ["about", "/about/", "AboutView", "Pr\u00e9sentation de l\u2019application"],
          ["catalogue", "/catalogue/", "BookListView", "Liste des livres, recherche et filtre"],
          ["book-detail", "/book/<pk>/", "BookDetailView", "Fiche d\u00e9taill\u00e9e, avis et note moyenne"],
          ["category-list", "/categories/", "CategoryListView", "Liste des cat\u00e9gories"],
        ],
        [1800, 2000, 2400, 3000]
      ),
      spacer(),
      h3("Routes priv\u00e9es"),
      table(
        ["Nom", "URL", "Vue", "R\u00f4le"],
        [
          ["my-books", "/my-books/", "UserBookListView", "Biblioth\u00e8que personnelle"],
          ["userbook-create", "/my-books/add/", "UserBookCreateView", "Ajout d\u2019un livre"],
          ["userbook-update", "/my-books/<pk>/edit/", "UserBookUpdateView", "Modification"],
          ["userbook-delete", "/my-books/<pk>/delete/", "UserBookDeleteView", "Retrait d\u2019un livre"],
          ["my-favorites", "/my-books/favorites/", "UserBookFavoriteListView", "Livres favoris"],
          ["my-read-later", "/my-books/read-later/", "UserBookReadLaterListView", "Liste \u00e0 lire plus tard"],
          ["reading-stats", "/my-books/stats/", "ReadingStatsView", "Statistiques de lecture"],
        ],
        [2000, 2200, 2400, 2600]
      ),
      spacer(),

      h2("3.5 Templates et interface utilisateur"),
      table(
        ["Template", "R\u00f4le"],
        [
          ["books/home.html", "Page d\u2019accueil"],
          ["books/book_list.html", "Catalogue, filtres et pagination"],
          ["books/book_detail.html", "Fiche d\u00e9taill\u00e9e avec couverture, note moyenne et commentaires"],
          ["books/userbook_list.html", "Biblioth\u00e8que, favoris et \u00e0 lire plus tard"],
          ["books/userbook_form.html", "Ajout et modification d\u2019un livre personnel"],
          ["books/reading_stats.html", "Statistiques de lecture"],
          ["accounts/login.html", "Connexion"],
          ["accounts/signup.html", "Inscription"],
        ],
        [3500, 5700]
      ),
      spacer(),

      h2("3.6 Formulaires, CRUD et anti-doublon"),
      para("Lors de l\u2019ajout, la vue UserBookCreateView applique la logique anti-doublon, cr\u00e9e le livre si n\u00e9cessaire, puis cr\u00e9e la relation UserBook. La modification met \u00e0 jour le statut, le favori, la note et le commentaire. La suppression retire uniquement le livre de la biblioth\u00e8que personnelle sans toucher au catalogue commun."),
      spacer(),

      h2("3.7 Gestion des couvertures de livres"),
      para("Le mod\u00e8le Book prend en charge deux sources de couverture :"),
      bullet("Upload local : champ cover_image (ImageField), stock\u00e9 dans media/book_covers/"),
      bullet("URL externe : champ cover_url (URLField), affich\u00e9 comme image distante"),
      para("Dans les templates, l\u2019upload local est prioritaire sur l\u2019URL. Si aucun des deux n\u2019est fourni, un placeholder \u00ab Sans couverture \u00bb est affich\u00e9."),
      spacer(),

      h2("3.8 Gestion des mots de passe"),
      para("Le projet int\u00e8gre les vues Django de gestion de mot de passe :"),
      bullet("Changement de mot de passe : /accounts/password-change/ (accessible depuis la navbar, utilisateur connect\u00e9)"),
      bullet("R\u00e9initialisation par email : /accounts/password-reset/ (accessible depuis la page de connexion)"),
      para("L\u2019email de r\u00e9initialisation utilise le backend console (django.core.mail.backends.console.EmailBackend) : le lien de r\u00e9initialisation s\u2019affiche dans le terminal de d\u00e9veloppement."),
      spacer(),

      h2("3.9 Import du catalogue (271 379 livres)"),
      para("Une commande Django personnalis\u00e9e (python manage.py import_books) a \u00e9t\u00e9 d\u00e9velopp\u00e9e pour importer le fichier books.csv contenant 271 379 r\u00e9f\u00e9rences :"),
      bullet("Lecture ligne par ligne avec csv.DictReader (s\u00e9parateur point-virgule)"),
      bullet("Gestion d\u2019encodage UTF-8 avec remplacement des caract\u00e8res invalides"),
      bullet("Traitement par lots de 500 livres avec bulk_create(ignore_conflicts=True)"),
      bullet("R\u00e9cup\u00e9ration de l\u2019URL de couverture (Image-URL-L ou Image-URL-M)"),
      para("L\u2019import complet s\u2019ex\u00e9cute en environ 2 minutes. La commande est idempotente : les ex\u00e9cutions multiples n\u2019entra\u00eenent pas de doublons."),
      spacer(),

      h2("3.10 Interface utilisateur et navigation"),
      para("La barre de navigation a \u00e9t\u00e9 r\u00e9organis\u00e9e pour plus de clart\u00e9 :"),
      bullet("Section publique \u00e0 gauche : Accueil, Catalogue, Cat\u00e9gories, \u00c0 propos"),
      bullet("Menu utilisateur regroup\u00e9 dans un dropdown \u00ab Mon Espace \u00bb (CSS uniquement, sans JavaScript)"),
      bullet("Le dropdown contient : Ma Biblioth\u00e8que, Favoris, \u00c0 lire plus tard, Statistiques, un s\u00e9parateur, Changer mot de passe et D\u00e9connexion"),
      bullet("Badge utilisateur affich\u00e9 \u00e0 c\u00f4t\u00e9 du dropdown"),
      spacer(),

      h2("3.11 Authentification et s\u00e9curit\u00e9"),
      bullet("UserCreationForm pour l\u2019inscription"),
      bullet("LoginView et LogoutView Django int\u00e9gr\u00e9s"),
      bullet("LoginRequiredMixin pour prot\u00e9ger les pages priv\u00e9es"),
      bullet("Filtrage du queryset avec user=self.request.user pour isoler les donn\u00e9es"),
      bullet("Protection CSRF sur tous les formulaires"),
      spacer(),

      h2("3.8 Suivi personnel, avis et statistiques"),
      para("La note moyenne est calcul\u00e9e avec l\u2019ORM Django :"),
      ...codeBlock("ratings = UserBook.objects.filter(book=self.object).exclude(rating__isnull=True)\ncontext['avg_rating'] = ratings.aggregate(avg=Avg('rating'))['avg']\ncontext['rating_count'] = ratings.count()"),
      spacer(),
      para("La page de statistiques affiche : le nombre total de livres, la r\u00e9partition par statut, la r\u00e9partition par cat\u00e9gorie, les livres favoris, les livres les mieux not\u00e9s, les derniers ajouts et le taux de compl\u00e9tion."),
      pageBreak(),

      // ============ 4. TESTS ============
      h1("4. Tests et validation"),
      h2("4.1 Strat\u00e9gie de test"),
      para("Les tests automatis\u00e9s sont \u00e9crits avec django.test.TestCase et couvrent les mod\u00e8les, les pages publiques, l\u2019authentification, les op\u00e9rations CRUD, l\u2019isolation des donn\u00e9es entre utilisateurs, les favoris, la liste \u00e0 lire plus tard, les statistiques et les \u00e9valuations."),
      spacer(),
      h3("Commande d\u2019ex\u00e9cution"),
      ...codeBlock("python manage.py test"),
      spacer(),

      h2("4.2 R\u00e9sultat d\u2019ex\u00e9cution"),
      ...codeBlock("Found 48 test(s).\nSystem check identified no issues (0 silenced).\n................................................\n----------------------------------------------------------------------\nRan 48 tests in 58.051s\n\nOK"),
      spacer(),

      h2("4.3 Couverture fonctionnelle"),
      table(
        ["Cat\u00e9gorie", "Nombre", "\u00c9l\u00e9ments v\u00e9rifi\u00e9s"],
        [
          ["Mod\u00e8les Category, Book, UserBook", "15", "Cr\u00e9ation, cha\u00eenes, contraintes d\u2019unicit\u00e9, relations et suppressions"],
          ["Pages publiques", "8", "Accueil, \u00e0 propos, catalogue, filtres, recherche, d\u00e9tail, cat\u00e9gories, 404"],
          ["Authentification", "7", "Inscription, connexion, d\u00e9connexion, erreurs de formulaire"],
          ["CRUD utilisateur", "10", "Acc\u00e8s prot\u00e9g\u00e9, cr\u00e9ation, modification, suppression, doublons, isolation"],
          ["Fonctionnalit\u00e9s de suivi", "8", "Favoris, \u00e0 lire plus tard, statistiques, notes moyennes, couvertures"],
        ],
        [3000, 1000, 5200]
      ),
      spacer(),

      h2("4.4 Erreurs rencontr\u00e9es et corrections"),
      table(
        ["Erreur", "Cause", "Correction"],
        [
          ["ModuleNotFoundError: No module named 'books'", "Application r\u00e9f\u00e9renc\u00e9e avant cr\u00e9ation", "Cr\u00e9ation des apps puis d\u00e9claration dans INSTALLED_APPS"],
          ["Cannot use ImageField (Pillow)", "D\u00e9pendance manquante", "Installation de Pillow et ajout dans requirements.txt"],
          ["NoReverseMatch sur routes", "Incoh\u00e9rence entre noms namespacic\u00e9s", "Harmonisation des noms d\u2019URLs (accounts:login, etc.)"],
          ["TemplateSyntaxError", "Balises Django coup\u00e9es par formatage HTML", "Correction des templates + d\u00e9sactivation du formateur auto"],
        ],
        [2400, 2400, 4400]
      ),
      spacer(),

      h2("4.5 Points de contr\u00f4le avant remise"),
      table(
        ["Point de contr\u00f4le", "Statut"],
        [
          ["python manage.py runserver d\u00e9marre l\u2019application", "\u00c0 v\u00e9rifier avant soutenance"],
          ["Migrations appliqu\u00e9es", "Conforme au projet"],
          ["Superutilisateur et Django Admin disponibles", "Conforme au projet"],
          ["CRUD fonctionnel", "V\u00e9rifi\u00e9 par tests"],
          ["python manage.py test r\u00e9ussit", "48 tests OK"],
          ["D\u00e9p\u00f4t GitHub accessible", "Lien indiqu\u00e9 en page de garde"],
          ["README, requirements.txt et .gitignore pr\u00e9sents", "Pr\u00e9sents dans le d\u00e9p\u00f4t"],
          ["Rapport PDF et imprim\u00e9 avec captures", "\u00c0 finaliser lors de l\u2019export"],
        ],
        [5500, 3700]
      ),
      pageBreak(),

      // ============ 5. CONCLUSION ============
      h1("5. Conclusion"),
      h2("5.1 Bilan"),
      para("BookNest r\u00e9pond au cahier des charges du projet Django. L\u2019application propose les pages publiques attendues, une gestion CRUD, des cat\u00e9gories, une authentification compl\u00e8te, une administration Django et une biblioth\u00e8que personnelle pour chaque utilisateur."),
      para("La r\u00e9alisation va au-del\u00e0 du socle minimal en int\u00e9grant directement dans les parcours principaux les couvertures de livres, les favoris, la liste \u00e0 lire plus tard, les notes, les commentaires, les \u00e9valuations et les statistiques de lecture."),
      spacer(),

      h2("5.2 Comp\u00e9tences mises en pratique"),
      bullet("Cr\u00e9ation et configuration d\u2019un projet Django"),
      bullet("Structuration en applications"),
      bullet("Mod\u00e9lisation des donn\u00e9es et relations avec l\u2019ORM"),
      bullet("Cr\u00e9ation de migrations"),
      bullet("Administration via Django Admin"),
      bullet("Vues g\u00e9n\u00e9riques et URL dispatcher"),
      bullet("Templates avec h\u00e9ritage"),
      bullet("Formulaires POST et protection CSRF"),
      bullet("Authentification et protection des vues priv\u00e9es"),
      bullet("Gestion des fichiers media"),
      bullet("Tests automatis\u00e9s Django"),
      bullet("Utilisation de Git et GitHub"),
      spacer(),

      h2("5.3 Limites"),
      bullet("L\u2019interface reste simple et pourrait \u00eatre enrichie avec un framework CSS"),
      bullet("La recherche pourrait devenir plus avanc\u00e9e avec une recherche plein texte"),
      bullet("Les commentaires ne disposent pas encore d\u2019un syst\u00e8me de mod\u00e9ration"),
      bullet("Il n\u2019existe pas encore d\u2019import/export de biblioth\u00e8que"),
      bullet("L\u2019application n\u2019int\u00e8gre pas encore de recommandations de lecture"),
      spacer(),

      h2("5.4 Pistes d\u2019\u00e9volution"),
      bullet("Ajouter une API REST avec Django REST Framework"),
      bullet("Permettre l\u2019import/export CSV ou JSON"),
      bullet("Mettre en place une recherche plein texte"),
      bullet("Ajouter un syst\u00e8me de mod\u00e9ration des commentaires"),
      bullet("Proposer des recommandations bas\u00e9es sur les cat\u00e9gories ou les notes"),
      bullet("Pr\u00e9parer un d\u00e9ploiement en ligne avec une base PostgreSQL"),
      pageBreak(),

      // ============ 6. ANNEXES ============
      h1("6. Annexes"),
      h2("A. Instructions d\u2019installation"),
      ...codeBlock("# 1. Cloner le depot\ngit clone https://github.com/Tranck04/django-booknest-tracy-franck-mukendi.git\ncd django-booknest-tracy-franck-mukendi\n\n# 2. Creer et activer l'environnement virtuel\npython -m venv .venv\n.venv\\Scripts\\activate\n\n# 3. Installer les dependances\npip install -r requirements.txt\n\n# 4. Appliquer les migrations\npython manage.py migrate\n\n# 5. Creer un superutilisateur\npython manage.py createsuperuser\n\n# 6. Lancer le serveur\npython manage.py runserver\n\n# 7. Executer les tests\npython manage.py test"),
      spacer(),

      h2("B. D\u00e9pendances principales"),
      ...codeBlock("Django==6.0.6\npillow==12.2.0"),
      spacer(),

      h2("C. D\u00e9p\u00f4t GitHub"),
      para("D\u00e9p\u00f4t du projet : https://github.com/Tranck04/django-booknest-tracy-franck-mukendi"),
      spacer(),

      h2("D. Liste indicative des commits"),
      table(
        ["#", "Message de commit"],
        [
          ["1", "Initialisation du projet Django BookNest"],
          ["2", "Cr\u00e9ation et configuration du projet"],
          ["3", "Ajout des mod\u00e8les Category, Book et UserBook"],
          ["4", "Configuration de Django Admin"],
          ["5", "Ajout des templates et du CSS"],
          ["6", "Pages publiques et catalogue"],
          ["7", "Authentification et biblioth\u00e8que personnelle"],
          ["8", "Couvertures, favoris, notes, commentaires et statistiques"],
          ["9", "Tests automatis\u00e9s"],
          ["10", "Documentation et corrections finales"],
        ],
        [800, 8400]
      ),
      spacer(),

      h2("E. Captures \u00e0 ajouter"),
      para("Pour le rapport PDF final, il est recommand\u00e9 d\u2019ajouter les captures des pages suivantes :"),
      bullet("Page d\u2019accueil"),
      bullet("Catalogue avec filtre par cat\u00e9gorie"),
      bullet("Fiche d\u00e9taill\u00e9e d\u2019un livre"),
      bullet("Formulaire d\u2019ajout"),
      bullet("Biblioth\u00e8que personnelle"),
      bullet("Page statistiques"),
      bullet("R\u00e9sultat des tests"),
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('rapport-booknest.docx', buffer);
  console.log('Fichier genere : rapport-booknest.docx');
}).catch(err => { console.error(err); process.exit(1); });
