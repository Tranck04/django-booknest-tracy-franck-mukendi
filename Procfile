web: gunicorn booknest.wsgi --bind 0.0.0.0:${PORT:-8080} --log-file -
release: python manage.py migrate --noinput && python manage.py collectstatic --noinput
