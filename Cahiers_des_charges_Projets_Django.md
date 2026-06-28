CAHIERS DES CHARGES
10 projets Django

Document de référence pour les étudiants
Année universitaire 2025-2026

Livrables obligatoires : dépôt GitHub + rapport imprimé + rapport PDF

Page | 1

Sommaire
01   1. Cadre pédagogique et périmètre

02   2. Livrables et modalités de remise

03   3. Critères de validation communs

04   Projet 1 - TaskFlow : Gestionnaire de tâches personnelles

05   Projet 2 - BookNest : Bibliothèque personnelle en ligne

06   Projet 3 - EventHub : Gestion d’événements universitaires

07   Projet 4 - RecipeShare : Plateforme de partage de recettes

08   Projet 5 - JobBoard Étudiant : Offres de stages, PFE et emplois

09   Projet 6 - MiniBlog : Blog collaboratif thématique

10   Projet 7 - Lost&Found : Objets perdus et trouvés

11   Projet 8 - MovieShelf : Catalogue de films et séries

12   Projet 9 - StudyResources : Partage de ressources pédagogiques

13   Projet 10 - ClubManager : Gestion simplifiée d’un club étudiant

Utilisation du document
L’étudiant choisit un seul sujet parmi les dix propositions. Toute variante doit conserver le socle technique obligatoire, les
livrables imposés et les fonctionnalités CRUD, modèles, formulaires, comptes utilisateurs, tests, GitHub et documentation.

Page | 2

1. Cadre pédagogique et périmètre
Les projets proposés couvrent les notions vues en classe : configuration de l’environnement, création de projet,
architecture Django, templates, modèles, administration, opérations CRUD, formulaires et authentification
utilisateur.

Principe général
Chaque projet doit être réalisé de manière structurée. Les fonctionnalités obligatoires constituent le socle commun de
validation. Le volet « Pour aller plus loin » permet aux étudiants de proposer des améliorations à valeur ajoutée, sans
compromettre la stabilité du périmètre principal.

Compétences attendues
• Créer et activer un environnement virtuel Python, installer les dépendances et exécuter les commandes Django.
• Structurer un projet selon l’architecture Django : URL dispatcher, vues, templates, modèles et base de données.
• Créer des modèles, migrations, requêtes ORM et gérer les données avec Django Admin.
• Développer des parcours CRUD en utilisant les vues génériques et les formulaires Django.
• Mettre en place l’inscription, la connexion et la déconnexion des utilisateurs.
• Utiliser un template de base, l’héritage de templates, les fichiers statiques CSS et les URLs nommées.
• Écrire des tests automatisés essentiels avec le framework de tests Django.
• Appliquer une démarche de versionnement avec Git et GitHub.

Socle technique commun obligatoire

Rubrique

Exigence

Langages et outils

Python 3, Django, HTML, CSS, SQLite, Git et GitHub.

Environnement

Architecture

Un environnement virtuel .venv dédié au projet. Les dépendances doivent être installables depuis
requirements.txt.

Organisation MVT : URLs, vues, modèles, templates, fichiers statiques, application(s) Django et
configuration de projet.

Base de données

SQLite au minimum, migrations exécutées et données administrables depuis Django Admin.

Interface

Un template base.html, héritage de templates, navigation cohérente, CSS propre et pages de
messages utilisateur.

Sécurité des formulaires

Formulaires soumis en POST avec intégration systématique de {% csrf_token %}.

Comptes utilisateurs

Inscription, connexion, déconnexion et affichage conditionnel selon l’état de connexion.

Tests

Tests de pages principales, de modèles et d’au moins un parcours fonctionnel CRUD.

Versionnement

Dépôt GitHub actif avec commits réguliers, lisibles et représentatifs de l’avancement réel.

Page | 3

2. Livrables et modalités de remise
La remise est considérée comme complète uniquement lorsque les trois éléments ci-dessous sont fournis. Le lien
GitHub doit également être indiqué dans le rapport imprimé et dans le rapport PDF.

2.1 Dépôt GitHub obligatoire
• Créer un dépôt GitHub portant un nom explicite, par exemple : django-taskflow-groupe-01.
• Déposer l’intégralité du code source, à l’exclusion de .venv, des fichiers temporaires et des clés secrètes.
• Inclure obligatoirement : README.md, requirements.txt, .gitignore et les fichiers de configuration nécessaires.
• Le README doit expliquer le projet, la procédure d’installation, l’activation de l’environnement, les migrations, la création du

superutilisateur et le lancement du serveur.

• Effectuer des commits réguliers et significatifs. Un unique commit final n’est pas acceptable.
• Ajouter le lien exact du dépôt GitHub sur la page de garde ou dans la première page du rapport.

2.2 Rapport imprimé obligatoire
• Remettre un exemplaire papier du rapport, imprimé en format A4 et relié ou agrafé selon les consignes de l’enseignant.
• Le rapport imprimé doit présenter la même version que le rapport PDF remis en ligne.
• Il doit être lisible, paginé, structuré et illustré par des captures d’écran représentatives de l’application.

2.3 Rapport PDF obligatoire
• Remettre le rapport au format PDF, avec une nomenclature explicite : NomProjet_NomGroupe_Rapport.pdf.
• Le PDF doit être identique au rapport imprimé et inclure le lien GitHub, les captures, les schémas utiles et les résultats de

tests.

• Le PDF doit être déposé selon le canal communiqué par l’enseignant : plateforme pédagogique, espace partagé ou e-mail

institutionnel.

Condition de validation
Un projet sans dépôt GitHub accessible, sans rapport imprimé ou sans rapport PDF est considéré comme incomplet, même
si l’application fonctionne.

Structure minimale recommandée du rapport

Partie

Page de garde

Introduction

Analyse et conception

Titre du projet, noms des étudiants, filière, année, encadrant, lien GitHub.

Contexte, problème traité, objectifs et périmètre fonctionnel.

Contenu attendu

Acteurs, cas d’utilisation simplifiés, modèles de données, schéma relationnel ou diagramme de classes
simple.

Réalisation technique

Architecture Django, applications créées, URLs, vues, templates, modèles, formulaires et authentification.

Tests et validation

Tests exécutés, captures, résultats, erreurs rencontrées et corrections apportées.

Conclusion

Annexes

Bilan, limites, compétences acquises et pistes d’évolution.

Instructions d’installation, extraits de code utiles et lien du dépôt GitHub.

Page | 4

3. Critères de validation communs
Les critères ci-dessous constituent une grille indicative de vérification.

Critère

Éléments observés

Fonctionnalités et parcours
utilisateur

Architecture et qualité du code

Les fonctions annoncées sont accessibles, cohérentes et testables.

Organisation Django, lisibilité, réutilisation des templates et cohérence des
URLs/vues.

Modèles, ORM et administration

Migrations, données, relations éventuelles et exploitation de Django Admin.

Formulaires et authentification

Création de compte, connexion, déconnexion, formulaires POST/CSRF.

Tests automatisés

Tests Django exécutables et cohérents avec les fonctionnalités.

GitHub et documentation
technique

Rapport imprimé et PDF

Dépôt complet, commits réguliers, README et requirements.txt.

Qualité de rédaction, structuration, captures, lien GitHub et conformité de
remise.

Poids

25 %

20 %

15 %

10 %

10 %

10 %

10 %

Points de contrôle technique avant remise
• La commande python manage.py runserver démarre sans erreur.
• Les migrations sont appliquées et un superutilisateur peut accéder à /admin/.
• Les opérations de création, consultation, modification et suppression fonctionnent.
• La commande python manage.py test s’exécute avec succès.
• Le dépôt GitHub est accessible et contient le README, requirements.txt et .gitignore.
• Le rapport imprimé et le rapport PDF indiquent le lien exact du dépôt GitHub.

Page | 5

PROJET 2

BookNest
Bibliothèque personnelle en ligne

Objectif. Créer une plateforme de gestion d’une collection de livres, avec organisation par catégories et suivi de
lecture.

Périmètre fonctionnel obligatoire
• Afficher un catalogue de livres et la fiche détaillée de chaque ouvrage.
• Ajouter, modifier et supprimer un livre.
• Associer un livre à une catégorie littéraire.
• Indiquer un statut de lecture : à lire, en cours ou terminé.
• Utiliser Django Admin pour administrer les livres et catégories.
• Mettre à disposition les pages d’inscription, connexion et déconnexion.

Modèle de données minimal

Entité / modèle

Champs minimaux attendus

Category

Book

nom, description.

titre, auteur, résumé, année_publication, statut_lecture, date_ajout, catégorie.

Pages et parcours minimum
Accueil ; À propos ; catalogue ; détail d’un livre ; gestion CRUD ; page des catégories ; authentification ; administration.

Pour aller plus loin

• Ajouter une image de couverture avec gestion des médias.
• Créer une bibliothèque propre à chaque utilisateur.
• Mettre en place les favoris et une liste « à lire plus tard ».
• Ajouter une note personnelle et un commentaire par livre.
• Créer des statistiques de lecture par catégorie et par statut.

