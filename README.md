# BookNest — Bibliotheque personnelle en ligne

Projet Django n°2 — Annee universitaire 2025-2026

---

## Presentation

BookNest est une plateforme web de gestion de bibliotheque personnelle. Elle permet aux utilisateurs de :

- Consulter un **catalogue commun** de **271 000+ livres** enrichi collaborativement
- Gerer leur **bibliotheque personnelle** (ajout, modification, suppression)
- Eviter les doublons : si un livre existe deja dans le catalogue, il est simplement lie a l'utilisateur sans etre duplique
- Suivre leur lecture (a lire, en cours, termine)
- Marquer des **favoris** et creer une liste « a lire plus tard »
- Rediger des **notes et avis** sur les livres
- Consulter des **statistiques** de lecture personnalisees

## Technologies

- **Python 3.14** — Langage de programmation
- **Django 6.0** — Framework web
- **PostgreSQL** (Railway) ou **SQLite** (local) — Base de donnees
- **HTML5 & CSS3** — Interface utilisateur responsive
- **Pillow** — Gestion des images de couverture
- **Gunicorn + Whitenoise** — Serveur de production

## Installation locale

### Pre-requis

- Python 3.x installe
- Git installe

### Etapes

```bash
# 1. Cloner le depot
git clone https://github.com/Tranck04/django-booknest-tracy-franck-mukendi.git
cd django-booknest-tracy-franck-mukendi

# 2. Creer et activer l'environnement virtuel
python -m venv .venv
.venv\Scripts\activate      # Windows

# 3. Installer les dependances
pip install -r requirements.txt

# 4. Appliquer les migrations
python manage.py migrate

# 5. Creer un superutilisateur
python manage.py createsuperuser

# 6. (Optionnel) Importer les 271 000 livres
python manage.py import_books

# 7. Lancer le serveur de developpement
python manage.py runserver
```

L'application est accessible a l'adresse : **http://127.0.0.1:8000/**

## Deploiement sur Railway

### Pre-requis

- Un compte [Railway](https://railway.app/)
- Le depot GitHub du projet

### Etapes

```bash
# 1. Creer un nouveau projet Railway depuis GitHub
#    Lier le depot : Tranck04/django-booknest-tracy-franck-mukendi

# 2. Ajouter une base PostgreSQL
#    Dashboard Railway > New > Database > PostgreSQL

# 3. Configurer les variables d'environnement
#    SECRET_KEY = <cle secrete aleatoire>
#    DEBUG = False
#    ALLOWED_HOSTS = .railway.app

# 4. Le deploiement est automatique :
#    - Release : migrations + collectstatic
#    - Web     : gunicorn avec port Railway ($PORT)

# 5. Creer le superutilisateur (via Railway CLI)
#    railway run python manage.py createsuperuser
```

Le projet est automatiquement configure pour Railway via :
- [`Procfile`](Procfile:1) : commande de demarrage et release
- [`runtime.txt`](runtime.txt:1) : version Python
- [`booknest/settings.py`](booknest/settings.py:1) : PostgreSQL via `DATABASE_URL`, Whitenoise, securite production

https://web-production-71811.up.railway.app

## Acces administrateur

- **Local** : http://127.0.0.1:8000/admin/
- **Railway** : `https://web-production-71811.up.railway.app/admin`
- Utilisez les identifiants du superutilisateur

## Tests

```bash
python manage.py test
```

48 tests couvrant :
- Les modeles (Category, Book, UserBook)
- Les pages publiques (accueil, catalogue, detail, categories)
- L'authentification (inscription, connexion, deconnexion)
- La bibliotheque personnelle (CRUD UserBook, anti-doublon)
- Les fonctionnalites avancees (favoris, a lire plus tard, statistiques, note moyenne)

## Pages de l'application

| URL | Page | Acces |
|-----|------|-------|
| `/` | Accueil | Public |
| `/about/` | A propos | Public |
| `/catalogue/` | Catalogue commun | Public |
| `/book/<id>/` | Fiche detaillee d'un livre | Public |
| `/categories/` | Liste des categories | Public |
| `/accounts/signup/` | Inscription | Public |
| `/accounts/login/` | Connexion | Public |
| `/accounts/logout/` | Deconnexion | Connecte |
| `/accounts/password-change/` | Changer mot de passe | Connecte |
| `/accounts/password-reset/` | Reinitialiser mot de passe | Public |
| `/my-books/` | Ma Bibliotheque | Connecte |
| `/my-books/add/<pk>/` | Ajout direct depuis le catalogue | Connecte |
| `/my-books/add/` | Ajouter un livre (formulaire) | Connecte |
| `/my-books/<id>/edit/` | Modifier statut/notes | Connecte |
| `/my-books/<id>/delete/` | Retirer de la bibliotheque | Connecte |
| `/my-books/favorites/` | Mes Favoris | Connecte |
| `/my-books/read-later/` | A lire plus tard | Connecte |
| `/my-books/stats/` | Statistiques de lecture | Connecte |

## Structure du projet

```
BookNest/
├── booknest/              # Configuration du projet Django
│   ├── settings.py        # Parametres (FR, MEDIA, STATIC, login, Railway)
│   ├── urls.py            # Routes principales
│   └── wsgi.py            # WSGI pour production
├── books/                 # Application principale
│   ├── models.py          # Modeles : Category, Book, UserBook
│   ├── views.py           # Vues (publiques + bibliotheque + stats)
│   ├── urls.py            # URLs de l'application
│   ├── admin.py           # Configuration Django Admin
│   ├── tests.py           # Tests automatises (48 tests)
│   └── management/
│       └── commands/
│           └── import_books.py  # Import CSV (271K livres)
├── accounts/              # Application d'authentification
│   ├── views.py           # Vue d'inscription
│   └── urls.py            # URLs auth (signup, login, logout, password)
├── templates/             # Templates HTML
│   ├── base.html          # Template de base avec navbar dropdown
│   ├── books/             # 10 templates de l'app books
│   └── accounts/          # 9 templates d'authentification
├── static/                # Fichiers statiques
│   └── css/style.css      # Feuille de style responsive
├── media/                 # Fichiers media (couvertures upload)
├── staticfiles/           # Fichiers statiques collectes (production)
├── manage.py              # Script de gestion Django
├── requirements.txt       # Dependances Python
├── Procfile               # Configuration Railway
├── runtime.txt            # Version Python (Railway)
├── .env.example           # Exemple de configuration locale
└── README.md              # Documentation
```

## Auteurs

Projet realise par **Tracy Franck Mukendi** dans le cadre du cours Django.

## Licence

Projet academique — Annee universitaire 2025-2026.
