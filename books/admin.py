from django.contrib import admin
from .models import Category, Book, UserBook


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')
    search_fields = ('name',)
    ordering = ('name',)


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'isbn', 'category', 'added_to_catalog')
    list_filter = ('category',)
    search_fields = ('title', 'author', 'isbn')
    ordering = ('-added_to_catalog',)
    date_hierarchy = 'added_to_catalog'


@admin.register(UserBook)
class UserBookAdmin(admin.ModelAdmin):
    list_display = ('user', 'book', 'reading_status', 'is_favorite', 'added_date')
    list_filter = ('reading_status', 'is_favorite', 'is_read_later')
    search_fields = ('user__username', 'book__title')
    ordering = ('-added_date',)
