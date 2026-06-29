import csv
from django.core.management.base import BaseCommand
from books.models import Book


class Command(BaseCommand):
    help = "Importe les livres depuis books.csv dans le catalogue commun."

    def add_arguments(self, parser):
        parser.add_argument(
            '--limit', type=int, default=None,
            help='Nombre max de lignes à importer (pour test).'
        )
        parser.add_argument(
            '--batch', type=int, default=500,
            help='Taille du lot bulk_create (défaut: 500).'
        )

    def handle(self, *args, **options):
        filepath = 'books.csv'
        limit = options['limit']
        batch_size = options['batch']

        # Forcer l'encodage UTF-8 avec remplacement des caractères invalides
        f = open(filepath, 'r', encoding='utf-8', errors='replace')
        reader = csv.DictReader(f, delimiter=';')

        batch = []
        total = 0
        created = 0
        skipped = 0

        for row in reader:
            total += 1
            if limit and total > limit:
                break

            isbn = (row.get('ISBN') or '').strip('"') or None
            title = (row.get('Book-Title') or '').strip('"')
            author = (row.get('Book-Author') or '').strip('"')
            year = (row.get('Year-Of-Publication') or '0').strip('"')
            cover_url = (row.get('Image-URL-L') or '').strip('"') or (row.get('Image-URL-M') or '').strip('"') or None

            if not title or not author:
                skipped += 1
                continue

            try:
                year_int = int(year) if year and year.isdigit() else None
            except ValueError:
                year_int = None

            if year_int and (year_int < 0 or year_int > 2030):
                year_int = None

            batch.append(Book(
                isbn=isbn,
                title=title,
                author=author,
                publication_year=year_int,
                cover_url=cover_url,
            ))

            if len(batch) >= batch_size:
                created += self._save_batch(batch)
                batch = []
                self.stdout.write(f"\r\t... {total} lignes lues, {created} livres créés", ending='')

        # Dernier lot
        if batch:
            created += self._save_batch(batch)

        f.close()

        self.stdout.write(self.style.SUCCESS(
            f"\nImport terminé : {total} lignes lues, "
            f"{created} livres créés, {skipped} ignorés."
        ))

    def _save_batch(self, batch):
        # ignore_conflicts évite les erreurs d'unicité (title+author ou ISBN)
        objs = Book.objects.bulk_create(
            batch,
            ignore_conflicts=True,
            batch_size=len(batch),
        )
        return len(objs)
