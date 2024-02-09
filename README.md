# This api provides access to Users db
## To run the app there are multiple options
- "npm run start:dev" launches the server in dev mode,
- "npm run start:prod" launches the server in production mode on 1 cluster,
- "npm run start:multi" launches the server in production mode on all available clusters,

Default port is 4000 that is specified in .env file

## API methods:
- GET api/users is used to get all persons
- GET api/users/{userId} get user by ID
- POST api/users is used to create record about new user and store it in database
- PUT api/users/{userId} is used to update existing user
- DELETE api/users/{userId} is used to delete existing user from database

In case of error on server occurs - 500 status is returned with description

Handled not found route
