from django.shortcuts import get_object_or_404
from django.views.generic import ListView, DetailView, TemplateView
from django.views.generic.edit import CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.db.models import Count, Q
from django.urls import reverse_lazy
from django.http import HttpResponseRedirect
from .models import Category, Book, UserBook


# ============================================================
# Pages publiques
# ============================================================

class HomeView(TemplateView):
    """Page d'accueil avec statistiques globales."""
    template_name = 'books/home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['total_books'] = Book.objects.count()
        context['total_categories'] = Category.objects.count()
        context['total_users'] = UserBook.objects.values('user').distinct().count()
        context['latest_books'] = Book.objects.select_related('category').order_by('-added_to_catalog')[:5]
        return context


class AboutView(TemplateView):
    """Page À propos."""
    template_name = 'books/about.html'


class BookListView(ListView):
    """Catalogue commun de tous les livres."""
    model = Book
    template_name = 'books/book_list.html'
    context_object_name = 'books'
    paginate_by = 12

    def get_queryset(self):
        qs = Book.objects.select_related('category').all()
        category_id = self.request.GET.get('category')
        if category_id:
            qs = qs.filter(category_id=category_id)
        query = self.request.GET.get('q')
        if query:
            qs = qs.filter(
                Q(title__icontains=query) |
                Q(author__icontains=query)
            )
        return qs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.annotate(book_count=Count('books')).all()
        current_category = self.request.GET.get('category', '')
        context['current_category'] = int(current_category) if current_category else None
        context['search_query'] = self.request.GET.get('q', '')
        return context


class BookDetailView(DetailView):
    """Fiche détaillée d'un livre du catalogue."""
    model = Book
    template_name = 'books/book_detail.html'
    context_object_name = 'book'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.request.user.is_authenticated:
            context['user_book'] = UserBook.objects.filter(
                user=self.request.user,
                book=self.object
            ).first()
        context['reviews'] = UserBook.objects.filter(
            book=self.object
        ).exclude(comment='').select_related('user').order_by('-updated_at')[:10]
        return context


class CategoryListView(ListView):
    """Liste des catégories littéraires."""
    model = Category
    template_name = 'books/category_list.html'
    context_object_name = 'categories'

    def get_queryset(self):
        return Category.objects.annotate(book_count=Count('books')).order_by('name')


# ============================================================
# Vues UserBook (bibliothèque personnelle) - Phase 7
# ============================================================

class UserBookListView(LoginRequiredMixin, ListView):
    """Ma Bibliothèque : livres de l'utilisateur connecté."""
    model = UserBook
    template_name = 'books/userbook_list.html'
    context_object_name = 'user_books'
    paginate_by = 12

    def get_queryset(self):
        qs = UserBook.objects.filter(
            user=self.request.user
        ).select_related('book', 'book__category')
        status = self.request.GET.get('status')
        if status:
            qs = qs.filter(reading_status=status)
        if self.request.GET.get('favorite'):
            qs = qs.filter(is_favorite=True)
        if self.request.GET.get('read_later'):
            qs = qs.filter(is_read_later=True)
        ordering = self.request.GET.get('order', '-added_date')
        return qs.order_by(ordering)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user_qs = UserBook.objects.filter(user=self.request.user)
        context['total_books'] = user_qs.count()
        context['books_reading'] = user_qs.filter(reading_status='reading').count()
        context['books_finished'] = user_qs.filter(reading_status='finished').count()
        context['books_favorites'] = user_qs.filter(is_favorite=True).count()
        return context


class UserBookCreateView(LoginRequiredMixin, CreateView):
    """Ajouter un livre à sa bibliothèque (avec anti-doublon)."""
    model = UserBook
    template_name = 'books/userbook_form.html'
    fields = ['reading_status']

    # Champs additionnels pour le Book
    extra_book_fields = ['title', 'author', 'isbn', 'summary', 'publication_year', 'category']

    def form_valid(self, form):
        title = self.request.POST.get('title', '').strip()
        author = self.request.POST.get('author', '').strip()
        isbn = self.request.POST.get('isbn', '').strip() or None

        if not title or not author:
            form.add_error(None, "Le titre et l'auteur sont obligatoires.")
            return self.form_invalid(form)

        # Anti-doublon : chercher le livre dans le catalogue
        book = None
        if isbn:
            book = Book.objects.filter(isbn=isbn).first()
        if not book:
            book = Book.objects.filter(title__iexact=title, author__iexact=author).first()

        if not book:
            # Créer un nouveau livre dans le catalogue
            book = Book.objects.create(
                title=title,
                author=author,
                isbn=isbn,
                summary=self.request.POST.get('summary', ''),
                publication_year=self.request.POST.get('publication_year') or None,
                category_id=self.request.POST.get('category') or None,
            )
            messages.success(self.request, f"📚 '{book.title}' a été ajouté au catalogue !")
        else:
            messages.info(self.request, f"📖 '{book.title}' existe déjà dans le catalogue. Ajouté à votre bibliothèque.")

        # Vérifier que l'utilisateur n'a pas déjà ce livre
        if UserBook.objects.filter(user=self.request.user, book=book).exists():
            messages.error(self.request, "Ce livre est déjà dans votre bibliothèque.")
            return HttpResponseRedirect(reverse_lazy('my-books'))

        # Créer le UserBook
        form.instance.user = self.request.user
        form.instance.book = book
        messages.success(self.request, f"✅ '{book.title}' ajouté à votre bibliothèque !")
        return super().form_valid(form)

    def get_success_url(self):
        return reverse_lazy('my-books')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['categories'] = Category.objects.all()
        return context


class UserBookUpdateView(LoginRequiredMixin, UpdateView):
    """Modifier le statut et les données personnelles d'un livre."""
    model = UserBook
    template_name = 'books/userbook_form.html'
    fields = ['reading_status', 'is_favorite', 'is_read_later', 'personal_note', 'comment', 'rating']

    def get_queryset(self):
        return UserBook.objects.filter(user=self.request.user)

    def get_success_url(self):
        messages.success(self.request, "✅ Vos informations ont été mises à jour.")
        return reverse_lazy('my-books')


class UserBookDeleteView(LoginRequiredMixin, DeleteView):
    """Retirer un livre de sa bibliothèque (ne supprime pas le Book)."""
    model = UserBook
    template_name = 'books/userbook_confirm_delete.html'
    context_object_name = 'user_book'

    def get_queryset(self):
        return UserBook.objects.filter(user=self.request.user)

    def get_success_url(self):
        messages.success(self.request, "🗑️ Livre retiré de votre bibliothèque.")
        return reverse_lazy('my-books')
