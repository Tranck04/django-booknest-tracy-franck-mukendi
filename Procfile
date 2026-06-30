web: python manage.py migrate --noinput && python manage.py collectstatic --noinput && gunicorn booknest.wsgi:application --bind 0.0.0.0:${PORT:-8080} --log-file -
release: python manage.py migrate --noinput
