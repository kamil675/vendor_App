FROM php:8.2-apache

# ======================
# SYSTEM PACKAGES
# ======================
RUN apt-get update && apt-get install -y \
    unzip \
    zip \
    libzip-dev \
    curl \
    git

# ======================
# PHP EXTENSIONS (IMPORTANT ORDER FIX)
# ======================
RUN docker-php-ext-configure zip \
    && docker-php-ext-install pdo pdo_mysql zip

# ======================
# APACHE MODULE
# ======================
RUN a2enmod rewrite

# ======================
# COMPOSER INSTALL
# ======================
RUN curl -sS https://getcomposer.org/installer | php -- \
    --install-dir=/usr/local/bin --filename=composer

# ======================
# WORKDIR
# ======================
WORKDIR /var/www/html

# ======================
# COPY PROJECT
# ======================
COPY . .

# ======================
# INSTALL DEPENDENCIES (FIXED)
# ======================
RUN composer install \
    --no-dev \
    --prefer-dist \
    --no-interaction \
    --optimize-autoloader

# ======================
# LARAVEL PUBLIC FOLDER FIX
# ======================
RUN sed -i 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/000-default.conf

# ======================
# PERMISSIONS FIX
# ======================
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 775 /var/www/html/storage \
    /var/www/html/bootstrap/cache

# ======================
# PORT
# ======================
EXPOSE 80

# ======================
# START APACHE
# ======================
CMD ["apache2-foreground"]