#!/bin/sh

mkdir log
touch log/production.log
rake RAILS_ENV=production db:create
rake RAILS_ENV=production db:migrate

