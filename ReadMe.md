#First run following commands on heroku to install postgresql on the dyno of your app
# and replace "your-app" by the name of actual app
heroku addons:add heroku-postgresql:dev --app your-app
heroku pg:promote --app your-app `heroku config --app your-app | grep HEROKU_POSTGRESQL | cut -f1 -d':'`
heroku plugins:install git://github.com/ddollar/heroku-config.git --app your-app

# next push to heroku as required
git push staging-heroku staging:master

git push production-heroku master:master


# To install postgre locally run
./pgsetup.sh

# change the username to ubuntu in .pgpass file becuase anyother name won't work on heroku
#, whereas you can put you system username in it for local debugging

# 1) Create a file .env
# 2) Put EMAIL, EMAILPASSWORD and SMTP variables there with values
# 3) Now you can do 
#     $ foreman start
#   to run the server locally (and read from these env variables), or 
     $ git push staging-heroku staging:master;
      git push production-heroku master:master	
       $heroku  config:push --app sshahriyar-bitstarter-s-mooc

#   to push the .env file remotely.
