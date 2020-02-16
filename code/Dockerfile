FROM python:3.7

WORKDIR /checkmate

EXPOSE 80
EXPOSE 443

# Nginx
RUN apt-get update && \
    # apt-get install software-properties-common && \
    # apt-get update && \
    # add-apt-repository -y ppa:certbot/certbot && \
    # apt install python-certbot-nginx && \
    apt-get install -y nginx

COPY ./certs/letsencrypt/live/api.checkma.it/cert.pem /etc/ssl/certs/cert.pem
COPY ./certs/letsencrypt/live/api.checkma.it/privkey.pem /etc/ssl/certs/privkey.pem
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/sites.conf /etc/nginx/sites.conf


# Backend
COPY ./backend .
RUN pip3 install -r requirements.txt

CMD nginx && \
    python3 manage.py migrate && \
    uwsgi --ini uwsgi.ini
