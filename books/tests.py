from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from .models import Category, Book, UserBook


# ============================================================
# Tests des modèles
# ============================================================

class CategoryModelTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(
            name='Roman',
            description='Œuvres de fiction'
        )

    def test_category_creation(self):
        self.assertEqual(self.category.name, 'Roman')
        self.assertEqual(self.category.description, 'Œuvres de fiction')

    def test_category_str(self):
        self.assertEqual(str(self.category), 'Roman')

    def test_category_unique_name(self):
        with self.assertRaises(Exception):
            Category.objects.create(name='Roman')


class BookModelTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name='Science-Fiction')
        self.book = Book.objects.create(
            title='Dune',
            author='Frank Herbert',
            isbn='9782221088456',
            publication_year=1965,
            category=self.category,
        )

    def test_book_creation(self):
        self.assertEqual(self.book.title, 'Dune')
        self.assertEqual(self.book.author, 'Frank Herbert')
        self.assertEqual(self.book.category, self.category)

    def test_book_str(self):
        self.assertEqual(str(self.book), 'Dune — Frank Herbert')

    def test_book_unique_title_author(self):
        with self.assertRaises(Exception):
            Book.objects.create(title='Dune', author='Frank Herbert')

    def test_book_isbn_unique(self):
        with self.assertRaises(Exception):
            Book.objects.create(
                title='Dune (édition spéciale)',
                author='Frank Herbert',
                isbn='9782221088456',
            )

    def test_book_category_set_null(self):
        """La suppression d'une catégorie met le FK à null (SET_NULL)."""
        self.category.delete()
        self.book.refresh_from_db()
        self.assertIsNone(self.book.category)


class UserBookModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('testuser', 'test@test.com', 'testpass123')
        self.category = Category.objects.create(name='Roman')
        self.book = Book.objects.create(title='1984', author='George Orwell', category=self.category)
        self.user_book = UserBook.objects.create(
            user=self.user,
            book=self.book,
            reading_status='reading',
            is_favorite=True,
        )

    def test_userbook_creation(self):
        self.assertEqual(self.user_book.user, self.user)
        self.assertEqual(self.user_book.book, self.book)
        self.assertEqual(self.user_book.reading_status, 'reading')
        self.assertTrue(self.user_book.is_favorite)

    def test_userbook_str(self):
        self.assertEqual(str(self.user_book), 'testuser — 1984')

    def test_userbook_defaults(self):
        ub = UserBook.objects.create(user=self.user, book=Book.objects.create(
            title='Test', author='Test', category=self.category
        ))
        self.assertEqual(ub.reading_status, 'to_read')
        self.assertFalse(ub.is_favorite)
        self.assertFalse(ub.is_read_later)

    def test_userbook_unique_user_book(self):
        with self.assertRaises(Exception):
            UserBook.objects.create(user=self.user, book=self.book)

    def test_userbook_cascade_user(self):
        """La suppression d'un User supprime ses UserBook."""
        user2 = User.objects.create_user('user2', 'u2@test.com', 'pass')
        UserBook.objects.create(user=user2, book=self.book)
        count_before = UserBook.objects.count()
        user2.delete()
        self.assertEqual(UserBook.objects.count(), count_before - 1)

    def test_userbook_cascade_book(self):
        """La suppression d'un Book supprime ses UserBook."""
        book2 = Book.objects.create(title='X', author='Y', category=self.category)
        UserBook.objects.create(user=self.user, book=book2)
        count_before = UserBook.objects.count()
        book2.delete()
        self.assertEqual(UserBook.objects.count(), count_before - 1)

    def test_userbook_delete_preserves_book(self):
        """La suppression d'un UserBook ne supprime pas le Book du catalogue."""
        book_id = self.book.id
        self.user_book.delete()
        self.assertTrue(Book.objects.filter(id=book_id).exists())


# ============================================================
# Tests des pages publiques
# ============================================================

class PublicPageTest(TestCase):
    def setUp(self):
        self.category = Category.objects.create(name='Roman')
        self.book = Book.objects.create(
            title='Les Misérables', author='Victor Hugo', category=self.category
        )

    def test_home_page(self):
        response = self.client.get(reverse('home'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'BookNest')

    def test_about_page(self):
        response = self.client.get(reverse('about'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'À propos')

    def test_catalogue_page(self):
        response = self.client.get(reverse('catalogue'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Les Misérables')

    def test_catalogue_filter_by_category(self):
        cat2 = Category.objects.create(name='SF')
        Book.objects.create(title='Dune', author='F. Herbert', category=cat2)
        response = self.client.get(reverse('catalogue') + '?category=' + str(self.category.id))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Les Misérables')
        self.assertNotContains(response, 'Dune')

    def test_catalogue_search(self):
        response = self.client.get(reverse('catalogue') + '?q=Misérables')
        self.assertContains(response, 'Les Misérables')

    def test_book_detail_page(self):
        response = self.client.get(reverse('book-detail', args=[self.book.pk]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Victor Hugo')

    def test_book_detail_404(self):
        response = self.client.get(reverse('book-detail', args=[9999]))
        self.assertEqual(response.status_code, 404)

    def test_category_list_page(self):
        response = self.client.get(reverse('category-list'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Roman')


# ============================================================
# Tests d'authentification
# ============================================================

class AuthenticationTest(TestCase):
    def setUp(self):
        self.signup_url = reverse('accounts:signup')
        self.login_url = reverse('accounts:login')
        self.logout_url = reverse('accounts:logout')

    def test_signup_page(self):
        response = self.client.get(self.signup_url)
        self.assertEqual(response.status_code, 200)

    def test_signup_success(self):
        response = self.client.post(self.signup_url, {
            'username': 'newuser',
            'password1': 'ComplexPass123!',
            'password2': 'ComplexPass123!',
        })
        self.assertRedirects(response, self.login_url)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_signup_password_mismatch(self):
        response = self.client.post(self.signup_url, {
            'username': 'newuser',
            'password1': 'ComplexPass123!',
            'password2': 'WrongPass456!',
        })
        self.assertEqual(response.status_code, 200)
        self.assertFalse(User.objects.filter(username='newuser').exists())

    def test_login_page(self):
        response = self.client.get(self.login_url)
        self.assertEqual(response.status_code, 200)

    def test_login_success(self):
        User.objects.create_user('testuser', 'test@test.com', 'testpass123')
        response = self.client.post(self.login_url, {
            'username': 'testuser',
            'password': 'testpass123',
        })
        self.assertRedirects(response, reverse('my-books'))  # LOGIN_REDIRECT_URL

    def test_login_failure(self):
        response = self.client.post(self.login_url, {
            'username': 'fake',
            'password': 'wrong',
        })
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'error')

    def test_logout(self):
        User.objects.create_user('testuser', 'test@test.com', 'testpass123')
        self.client.login(username='testuser', password='testpass123')
        response = self.client.post(self.logout_url)
        self.assertRedirects(response, reverse('home'))


# ============================================================
# Tests Bibliothèque personnelle (CRUD UserBook)
# ============================================================

class UserBookCRUDTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('reader', 'r@test.com', 'readerpass')
        self.other_user = User.objects.create_user('other', 'o@test.com', 'otherpass')
        self.category = Category.objects.create(name='Roman')
        self.book = Book.objects.create(
            title='1984', author='George Orwell', isbn='9782070368228', category=self.category
        )
        self.client.login(username='reader', password='readerpass')

    # --- Liste ---
    def test_my_books_requires_login(self):
        self.client.logout()
        response = self.client.get(reverse('my-books'))
        self.assertRedirects(response, reverse('accounts:login') + '?next=' + reverse('my-books'))

    def test_my_books_list(self):
        UserBook.objects.create(user=self.user, book=self.book)
        response = self.client.get(reverse('my-books'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, '1984')

    def test_my_books_only_own_books(self):
        UserBook.objects.create(user=self.user, book=self.book)
        other_book = Book.objects.create(title='Other', author='X', category=self.category)
        UserBook.objects.create(user=self.other_user, book=other_book)
        response = self.client.get(reverse('my-books'))
        self.assertContains(response, '1984')
        self.assertNotContains(response, 'Other')

    # --- Création avec anti-doublon ---
    def test_create_userbook_new_book(self):
        """Ajout d'un livre qui n'existe pas encore dans le catalogue."""
        response = self.client.post(reverse('userbook-create'), {
            'title': 'Sapiens',
            'author': 'Yuval Noah Harari',
            'isbn': '9782226257000',
            'reading_status': 'to_read',
            'category': self.category.id,
        })
        self.assertRedirects(response, reverse('my-books'))
        self.assertTrue(Book.objects.filter(title='Sapiens').exists())
        self.assertTrue(UserBook.objects.filter(user=self.user, book__title='Sapiens').exists())

    def test_create_userbook_existing_book(self):
        """Ajout d'un livre qui existe déjà dans le catalogue."""
        response = self.client.post(reverse('userbook-create'), {
            'title': '1984',
            'author': 'George Orwell',
            'reading_status': 'reading',
            'category': self.category.id,
        })
        self.assertRedirects(response, reverse('my-books'))
        # Vérifier qu'aucun doublon Book n'a été créé
        self.assertEqual(Book.objects.filter(title='1984').count(), 1)
        self.assertTrue(UserBook.objects.filter(user=self.user, book=self.book).exists())

    def test_create_userbook_duplicate_in_library(self):
        """Ajout d'un livre déjà dans la bibliothèque de l'utilisateur."""
        UserBook.objects.create(user=self.user, book=self.book)
        response = self.client.post(reverse('userbook-create'), {
            'title': '1984',
            'author': 'George Orwell',
            'reading_status': 'reading',
            'category': self.category.id,
        })
        self.assertRedirects(response, reverse('my-books'))
        self.assertEqual(UserBook.objects.filter(user=self.user, book=self.book).count(), 1)

    def test_create_userbook_missing_fields(self):
        """Soumission sans titre ni auteur."""
        response = self.client.post(reverse('userbook-create'), {
            'title': '',
            'author': '',
        })
        self.assertEqual(response.status_code, 200)

    # --- Modification ---
    def test_update_userbook(self):
        ub = UserBook.objects.create(user=self.user, book=self.book)
        response = self.client.post(reverse('userbook-update', args=[ub.pk]), {
            'reading_status': 'finished',
            'is_favorite': True,
            'is_read_later': False,
            'personal_note': 'Excellent !',
            'comment': 'Un chef-d\'œuvre.',
            'rating': 5,
        })
        self.assertRedirects(response, reverse('my-books'))
        ub.refresh_from_db()
        self.assertEqual(ub.reading_status, 'finished')
        self.assertTrue(ub.is_favorite)
        self.assertEqual(ub.rating, 5)

    def test_update_userbook_other_user(self):
        """Un utilisateur ne peut pas modifier le UserBook d'un autre."""
        ub = UserBook.objects.create(user=self.other_user, book=self.book)
        response = self.client.get(reverse('userbook-update', args=[ub.pk]))
        self.assertEqual(response.status_code, 404)

    # --- Suppression ---
    def test_delete_userbook(self):
        ub = UserBook.objects.create(user=self.user, book=self.book)
        book_id = self.book.id
        response = self.client.post(reverse('userbook-delete', args=[ub.pk]))
        self.assertRedirects(response, reverse('my-books'))
        self.assertFalse(UserBook.objects.filter(pk=ub.pk).exists())
        self.assertTrue(Book.objects.filter(id=book_id).exists())

    def test_delete_userbook_other_user(self):
        ub = UserBook.objects.create(user=self.other_user, book=self.book)
        response = self.client.post(reverse('userbook-delete', args=[ub.pk]))
        self.assertEqual(response.status_code, 404)


# ============================================================
# Tests Phase 11 - Pour aller plus loin
# ============================================================

class Phase11Tests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('reader', 'r@test.com', 'readerpass')
        self.category = Category.objects.create(name='Roman')
        self.book1 = Book.objects.create(title='1984', author='G. Orwell', category=self.category)
        self.book2 = Book.objects.create(title='Dune', author='F. Herbert', category=self.category)
        self.ub1 = UserBook.objects.create(
            user=self.user, book=self.book1, reading_status='finished',
            is_favorite=True, rating=5, comment='Excellent'
        )
        self.ub2 = UserBook.objects.create(
            user=self.user, book=self.book2, reading_status='reading',
            is_read_later=True, rating=4
        )
        self.client.login(username='reader', password='readerpass')

    def test_favorites_page(self):
        response = self.client.get(reverse('my-favorites'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, '1984')
        self.assertNotContains(response, 'Dune')

    def test_favorites_requires_login(self):
        self.client.logout()
        response = self.client.get(reverse('my-favorites'))
        self.assertRedirects(response, reverse('accounts:login') + '?next=' + reverse('my-favorites'))

    def test_read_later_page(self):
        response = self.client.get(reverse('my-read-later'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Dune')
        self.assertNotContains(response, '1984')

    def test_stats_page(self):
        response = self.client.get(reverse('reading-stats'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Statistiques')
        self.assertContains(response, '2')  # Total books

    def test_stats_requires_login(self):
        self.client.logout()
        response = self.client.get(reverse('reading-stats'))
        self.assertRedirects(response, reverse('accounts:login') + '?next=' + reverse('reading-stats'))

    def test_book_detail_avg_rating(self):
        """La page détail affiche la note moyenne."""
        response = self.client.get(reverse('book-detail', args=[self.book1.pk]))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, '5.0')

    def test_book_detail_has_cover_image_field(self):
        """Vérifie que le champ cover_image est présent dans le modèle."""
        self.assertTrue(hasattr(Book, 'cover_image'))
