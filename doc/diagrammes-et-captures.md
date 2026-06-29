# Diagrammes Mermaid et captures d'écran — BookNest

---

## 1. Diagrammes Mermaid à insérer dans le rapport

> Copier chaque bloc Mermaid dans le rapport Markdown entre ` ```mermaid ` et ` ``` `.

---

### Diagramme 1 — Schéma relationnel (Analyse et conception, §2.4)

```mermaid
erDiagram
    User ||--o{ UserBook : possede
    Book ||--o{ UserBook : reference
    Category ||--o{ Book : categorise

    User {
        int id PK
        string username
        string email
        string password
    }

    Category {
        int id PK
        string name UK
        string description
    }

    Book {
        int id PK
        string title
        string author
        string isbn UK
        string summary
        int publication_year
        string cover_image
        string cover_url
        int category_id FK
        datetime added_to_catalog
    }

    UserBook {
        int id PK
        int user_id FK
        int book_id FK
        string reading_status
        datetime added_date
        bool is_favorite
        bool is_read_later
        string personal_note
        string comment
        int rating
        datetime updated_at
    }
```

**Emplacement :** §2.4 Schéma relationnel

---

### Diagramme 2 — Logique anti-doublon (Analyse et conception, §2.5)

```mermaid
flowchart TD
    A[Utilisateur soumet un livre] --> B{ISBN fourni ?}
    B -->|Oui| C{Book avec cet ISBN existe ?}
    C -->|Oui| D[Book trouve dans le catalogue]
    C -->|Non| E{Book avec meme titre + auteur ?}
    B -->|Non| E
    E -->|Oui| D
    E -->|Non| F[Creer le Book dans le catalogue]
    D --> G{UserBook existe deja ?}
    G -->|Oui| H[Erreur : deja dans la bibliotheque]
    G -->|Non| I[Creer le UserBook]
    F --> I
    I --> J[Redirection vers Ma Bibliotheque]
```

**Emplacement :** §2.5 Logique anti-doublon

---

### Diagramme 3 — Flux utilisateur principal (Analyse et conception, §2.2)

```mermaid
flowchart TD
    subgraph Visiteur
        A[Accueil] --> B[Catalogue public]
        B --> C[Fiche detaillee d un livre]
        A --> D[A propos]
        A --> E[Categories]
        A --> F[Connexion]
        A --> G[Inscription]
        F --> H{Authentifie ?}
        G --> H
        H -->|Oui| I[Ma Bibliotheque]
        H -->|Non| A
    end

    subgraph Utilisateur connecte
        I --> J[Ajouter un livre]
        I --> K[Modifier statut / notes]
        I --> L[Retirer un livre]
        I --> M[Mes Favoris]
        I --> N[A lire plus tard]
        I --> O[Statistiques de lecture]
        J --> P{Anti-doublon}
        P --> I
    end

    C -->|Connecte ?| H2{Deja dans la biblio ?}
    H2 -->|Oui| K
    H2 -->|Non| J
```

**Emplacement :** §2.2 Cas d'utilisation

---

### Diagramme 4 — Architecture MVT Django (Réalisation technique, §3.1)

```mermaid
graph TD
    A[Navigateur] --> B[URL Dispatcher]
    B --> C[Vues - views.py]
    C --> D[Modeles - models.py]
    C --> E[Templates - .html]
    D --> F[(SQLite)]
    E --> A
    G[Django Admin] --> D
    H[Commandes management] --> D

    subgraph Application books
        C
        D
        E
    end

    subgraph Application accounts
        I[Vues auth]
        J[Templates auth]
    end
```

**Emplacement :** §3.1 Architecture générale

---

### Diagramme 5 — Déploiement simplifié (Conclusion ou Annexes)

```mermaid
flowchart LR
    A[Developpeur] -->|git push| B[GitHub]
    C[Enseignant] -->|git clone| B
    C -->|pip install -r requirements.txt| D[.venv]
    D -->|python manage.py migrate| E[(SQLite)]
    D -->|python manage.py runserver| F[Serveur Django :8000]
    D -->|python manage.py import_books| E
    D -->|python manage.py test| G[48 tests OK]
```

**Emplacement :** Annexes — Instructions d'installation

---

### Diagramme 6 — Parcours CRUD complet (Réalisation technique, §3.6)

```mermaid
sequenceDiagram
    actor U as Utilisateur
    participant V as Vue Django
    participant M as Modele Book
    participant B as Modele UserBook
    participant T as Template

    U->>V: POST /my-books/add/
    V->>M: Recherche par ISBN
    alt ISBN trouve
        M-->>V: Book existant
    else ISBN absent ou non trouve
        V->>M: Recherche par titre+auteur
        alt trouve
            M-->>V: Book existant
        else non trouve
            V->>M: Creer le Book
            M-->>V: Nouveau Book
        end
    end
    V->>B: Verifier doublon UserBook
    alt UserBook existe deja
        B-->>V: Erreur
        V->>T: Message d'erreur
    else UserBook absent
        V->>B: Creer UserBook
        B-->>V: OK
        V->>T: Redirection Ma Bibliotheque
    end
```

**Emplacement :** §3.6 Formulaires, CRUD et anti-doublon

---

### Diagramme 7 — Gestion des mots de passe (Réalisation technique, §3.8)

```mermaid
flowchart LR
    A[Page de connexion] -->|Mot de passe oublie ?| B[PasswordResetView]
    B -->|Email saisi| C[Envoi email console]
    C --> D[Lien dans le terminal]
    D --> E[PasswordResetConfirmView]
    E -->|Nouveau mot de passe| F[PasswordResetCompleteView]
    F --> A

    G[Navbar - utilisateur connecte] -->|Changer mot de passe| H[PasswordChangeView]
    H -->|Ancien + nouveau| I[PasswordChangeDoneView]
```

**Emplacement :** §3.8 Gestion des mots de passe

---

### Diagramme 8 — Import du catalogue (Réalisation technique, §3.9)

```mermaid
flowchart TD
    A[books.csv - 271K lignes] --> B[csv.DictReader]
    B --> C{Lecture ligne par ligne}
    C --> D[Extraction ISBN, titre, auteur, annee, URL couv]
    D --> E[Accumulation dans un batch de 500]
    E --> F{Batch plein ?}
    F -->|Oui| G[bulk_create avec ignore_conflicts=True]
    G --> H[Commit en base]
    H --> I{Batch suivant}
    I --> C
    F -->|Non| C
    C -->|Fin du fichier| J[Dernier batch]
    J --> K[Import termine]
```

**Emplacement :** §3.9 Import du catalogue

---

## 2. Captures d'écran à prendre

> Prendre chaque capture en mode plein écran (`Alt+Impr.Écran`), recadrer proprement, sauvegarder dans `doc/screenshots/`.

| # | Fichier | Page à capturer | URL | Ce qui doit être visible |
|---|---------|-----------------|-----|--------------------------|
| 1 | `01-accueil.png` | **Accueil** | `http://127.0.0.1:8000/` | Les 3 stats (livres, catégories, lecteurs) + « Derniers livres ajoutés » + boutons « Voir tout le catalogue » et « Créer un compte » |
| 2 | `02-catalogue.png` | **Catalogue** | `http://127.0.0.1:8000/catalogue/` | Grille de livres avec couvertures, barre de recherche, filtre catégorie, pagination |
| 3 | `03-livre-detail.png` | **Fiche détaillée** | `http://127.0.0.1:8000/book/1/` | Couverture, titre, auteur, année, ISBN, résumé, note moyenne, catégorie, bouton « Ajouter à ma bibliothèque » |
| 4 | `04-ajout-livre.png` | **Formulaire d'ajout** | `http://127.0.0.1:8000/my-books/add/` | Formulaire rempli avec titre, auteur, catégorie sélectionnée, statut choisi |
| 5 | `05-ma-bibliotheque.png` | **Ma Bibliothèque** | `http://127.0.0.1:8000/my-books/` | Liste des livres personnels avec badges de statut, mini-stats, boutons Modifier/Retirer |
| 6 | `06-favoris.png` | **Favoris** | `http://127.0.0.1:8000/my-books/favorites/` | Page des favoris avec au moins 1 livre marqué favori (cœur) |
| 7 | `07-statistiques.png` | **Statistiques** | `http://127.0.0.1:8000/my-books/stats/` | Barres de progression, répartition par statut et catégorie, taux de complétion |
| 8 | `08-connexion.png` | **Connexion** | `http://127.0.0.1:8000/accounts/login/` | Formulaire de connexion avec lien « Mot de passe oublié ? » visible |
| 9 | `09-reset-password.png` | **Réinitialisation mdp** | `http://127.0.0.1:8000/accounts/password-reset/` | Formulaire de saisie d'email |
| 10 | `10-dropdown-navbar.png` | **Navbar dropdown** | `http://127.0.0.1:8000/` (connecté) | Le menu « Mon Espace » **déplié** montrant toutes les options |
| 11 | `11-admin.png` | **Django Admin** | `http://127.0.0.1:8000/admin/` | Liste des Books avec filtres, ou formulaire d'édition d'un livre |
| 12 | `12-tests.png` | **Tests automatisés** | Terminal | Résultat de `python manage.py test` montrant « Ran 48 tests in ... OK » |

---

## 3. Emplacement des captures dans le rapport Markdown

Dans [`doc/rapport-booknest.md`](doc/rapport-booknest.md), repérer les commentaires `<!-- Insérer capture: ... -->` et les remplacer par :

```markdown
![Légende](screenshots/XX-nom.png)
```

Ou pour le DOCX : ouvrir [`rapport-booknest.docx`](rapport-booknest.docx:1) dans Word, et à chaque section indiquée, faire **Insertion > Image**.
