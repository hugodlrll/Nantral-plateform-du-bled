# Create a new react project #

1. create a folder event-backend and cd in this folder
2. type the following commands : 
3. npm init -y
4. npm install express core bcryptjs jsonwebtoken pg
5. cd ..
6. npm create vite@latest event-frontend -- --template react-ts
7. (npm run dev to launch the website)
8. cd event-frontend
9. npm install sass
10. npm install

# Postgres #

1. add the path of the postgres app (C:\Program Files\PostgreSQL\18\bin) in your windows PATH
2. type de following commands :
3. psql -U postgres
4. type your postgres password
5. CREATE DATABASE DBname ;
6. \c DBname ;
7. (use vs extension postgres sql (the second one) to visualize the database)
8. Launch all the sql script files located in the /event-backend/migrations folder

# Launch the project #

1. Navigate to the event-backend folder
2. Type : npm run dev
3. Then navigate to the event-frontend folder
4. Type : npm run dev
5. You can now launch the website at the following url : http://localhost:5173/