from django.urls import path
from . import views

app_name = 'books'

urlpatterns = [
    # Pages publiques
    path('', views.HomeView.as_view(), name='home'),
    path('about/', views.AboutView.as_view(), name='about'),
    path('catalogue/', views.BookListView.as_view(), name='catalogue'),
    path('book/<int:pk>/', views.BookDetailView.as_view(), name='book-detail'),
    path('categories/', views.CategoryListView.as_view(), name='category-list'),

    # Bibliothèque personnelle (Phase 7)
    path('my-books/', views.UserBookListView.as_view(), name='my-books'),
    path('my-books/add/', views.UserBookCreateView.as_view(), name='userbook-create'),
    path('my-books/<int:pk>/edit/', views.UserBookUpdateView.as_view(), name='userbook-update'),
    path('my-books/<int:pk>/delete/', views.UserBookDeleteView.as_view(), name='userbook-delete'),

    # Phase 11 - Pour aller plus loin
    path('my-books/favorites/', views.UserBookFavoriteListView.as_view(), name='my-favorites'),
    path('my-books/read-later/', views.UserBookReadLaterListView.as_view(), name='my-read-later'),
    path('my-books/stats/', views.ReadingStatsView.as_view(), name='reading-stats'),
]
