from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.validators import URLValidator


class Category(models.Model):
    """Catégorie littéraire (Roman, Science-Fiction, Biographie, etc.)."""
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="Nom"
    )
    description = models.TextField(
        blank=True,
        verbose_name="Description"
    )

    class Meta:
        verbose_name = "Catégorie"
        verbose_name_plural = "Catégories"
        ordering = ['name']

    def __str__(self):
        return self.name


class Book(models.Model):
    """Livre du catalogue commun. Un livre n'existe qu'une seule fois."""
    title = models.CharField(
        max_length=250,
        verbose_name="Titre"
    )
    author = models.CharField(
        max_length=250,
        verbose_name="Auteur"
    )
    isbn = models.CharField(
        max_length=13,
        blank=True,
        null=True,
        unique=True,
        verbose_name="ISBN"
    )
    summary = models.TextField(
        blank=True,
        verbose_name="Résumé"
    )
    publication_year = models.IntegerField(
        null=True,
        blank=True,
        verbose_name="Année de publication"
    )
    cover_image = models.ImageField(
        upload_to='book_covers/',
        blank=True,
        null=True,
        verbose_name="Image de couverture (fichier)"
    )
    cover_url = models.URLField(
        blank=True,
        null=True,
        verbose_name="URL de couverture (lien externe)"
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='books',
        verbose_name="Catégorie"
    )
    added_to_catalog = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date d'ajout au catalogue"
    )

    class Meta:
        verbose_name = "Livre"
        verbose_name_plural = "Livres"
        ordering = ['-added_to_catalog']
        unique_together = ('title', 'author')

    def __str__(self):
        return f"{self.title} — {self.author}"


class UserBook(models.Model):
    """Livre dans la bibliothèque personnelle d'un utilisateur.
    Table de liaison entre User et Book avec attributs personnels.
    """
    class ReadingStatus(models.TextChoices):
        TO_READ = 'to_read', 'À lire'
        READING = 'reading', 'En cours'
        FINISHED = 'finished', 'Terminé'

    class Rating(models.IntegerChoices):
        ONE = 1, '★☆☆☆☆'
        TWO = 2, '★★☆☆☆'
        THREE = 3, '★★★☆☆'
        FOUR = 4, '★★★★☆'
        FIVE = 5, '★★★★★'

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='user_books',
        verbose_name="Utilisateur"
    )
    book = models.ForeignKey(
        Book,
        on_delete=models.CASCADE,
        related_name='user_books',
        verbose_name="Livre"
    )
    reading_status = models.CharField(
        max_length=20,
        choices=ReadingStatus.choices,
        default=ReadingStatus.TO_READ,
        verbose_name="Statut de lecture"
    )
    added_date = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Date d'ajout"
    )
    is_favorite = models.BooleanField(
        default=False,
        verbose_name="Favori"
    )
    is_read_later = models.BooleanField(
        default=False,
        verbose_name="À lire plus tard"
    )
    personal_note = models.TextField(
        blank=True,
        verbose_name="Note personnelle"
    )
    comment = models.TextField(
        blank=True,
        verbose_name="Commentaire"
    )
    rating = models.IntegerField(
        null=True,
        blank=True,
        choices=Rating.choices,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Évaluation"
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Dernière modification"
    )

    class Meta:
        verbose_name = "Livre utilisateur"
        verbose_name_plural = "Livres utilisateurs"
        ordering = ['-added_date']
        unique_together = ('user', 'book')

    def __str__(self):
        return f"{self.user.username} — {self.book.title}"
