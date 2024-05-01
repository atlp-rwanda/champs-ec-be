echo "Server starting !!!"
./node_modules/.bin/sequelize db:migrate:undo:all
./node_modules/.bin/sequelize db:migrate
npm run dev