# 📚 BookNest — Bibliothèque personnelle en ligne

Projet Django n°2 — Année universitaire 2025-2026

---

## 📖 Présentation

BookNest est une plateforme web de gestion de bibliothèque personnelle. Elle permet aux utilisateurs de :

- 📖 **Consulter un catalogue commun** de livres enrichi par la communauté
- 📚 **Gérer leur bibliothèque personnelle** (ajout, modification, suppression)
- 🔍 **Éviter les doublons** : si un livre existe déjà dans le catalogue, il est simplement lié à l'utilisateur sans être dupliqué
- 📊 **Suivre leur lecture** (à lire, en cours, terminé)
- ⭐ **Marquer des favoris** et créer une liste « à lire plus tard »
- 📝 **Rédiger des notes et avis** sur les livres
- 📈 **Consulter des statistiques** de lecture personnalisées

## 🛠️ Technologies

- **Python 3.14** — Langage de programmation
- **Django 6.0** — Framework web
- **SQLite** — Base de données
- **HTML5 & CSS3** — Interface utilisateur responsive
- **Pillow** — Gestion des images de couverture

## 📁 Structure du projet

```
BookNest/
├── booknest/               # Configuration du projet Django
│   ├── settings.py         # Paramètres (FR, MEDIA, STATIC, LOGIN)
│   ├── urls.py             # Routes principales
│   └── ...
├── books/                  # Application principale
│   ├── models.py           # Modèles : Category, Book, UserBook
│   ├── views.py            # Vues (publiques + bibliothèque + stats)
│   ├── urls.py             # URLs de l'application
│   ├── admin.py            # Configuration Django Admin
│   └── tests.py            # Tests automatisés
├── accounts/               # Application d'authentification
│   ├── views.py            # Vue d'inscription
│   ├── urls.py             # URLs auth (login, logout, signup)
│   └── ...
├── templates/              # Templates HTML
│   ├── base.html           # Template de base avec navbar
│   ├── books/              # Templates de l'app books
│   └── accounts/           # Templates d'authentification
├── static/                 # Fichiers statiques
│   └── css/style.css       # Feuille de style
├── media/                  # Fichiers média (couvertures de livres)
├── manage.py               # Script de gestion Django
├── requirements.txt        # Dépendances Python
└── README.md               # Documentation
```

## 🚀 Installation

### Prérequis

- Python 3.x installé
- Git installé

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/Tranck04/django-booknest-tracy-franck-mukendi.git
cd django-booknest-tracy-franck-mukendi

# 2. Créer et activer l'environnement virtuel
python -m venv .venv
.venv\Scripts\activate      # Windows

# 3. Installer les dépendances
pip install -r requirements.txt

# 4. Appliquer les migrations
python manage.py migrate

# 5. Créer un superutilisateur
python manage.py createsuperuser

# 6. Lancer le serveur de développement
python manage.py runserver
```

L'application est accessible à l'adresse : **http://127.0.0.1:8000/**

## 🔑 Accès administrateur

- **URL** : http://127.0.0.1:8000/admin/
- Utilisez les identifiants du superutilisateur créé à l'étape 5

## 🧪 Tests

```bash
python manage.py test
```

Les tests couvrent :

- Les modèles (Category, Book, UserBook)
- Les pages publiques (accueil, catalogue, détail, catégories)
- L'authentification (inscription, connexion, déconnexion)
- La bibliothèque personnelle (CRUD UserBook, anti-doublon)
- Les fonctionnalités avancées (favoris, à lire plus tard, statistiques, note moyenne)

## 🌐 Pages de l'application

| URL                      | Page                       | Accès    |
| ------------------------ | -------------------------- | -------- |
| `/`                      | Accueil                    | Public   |
| `/about/`                | À propos                   | Public   |
| `/catalogue/`            | Catalogue commun           | Public   |
| `/book/<id>/`            | Fiche détaillée d'un livre | Public   |
| `/categories/`           | Liste des catégories       | Public   |
| `/accounts/signup/`      | Inscription                | Public   |
| `/accounts/login/`       | Connexion                  | Public   |
| `/accounts/logout/`      | Déconnexion                | Connecté |
| `/my-books/`             | Ma Bibliothèque            | Connecté |
| `/my-books/add/`         | Ajouter un livre           | Connecté |
| `/my-books/<id>/edit/`   | Modifier statut/notes      | Connecté |
| `/my-books/<id>/delete/` | Retirer de la bibliothèque | Connecté |
| `/my-books/favorites/`   | Mes Favoris                | Connecté |
| `/my-books/read-later/`  | À lire plus tard           | Connecté |
| `/my-books/stats/`       | Statistiques de lecture    | Connecté |

## 👥 Auteurs

Projet réalisé par **Tracy Franck Mukendi** dans le cadre du cours Django.

## 📄 Licence

Projet académique — Année universitaire 2025-2026.
