## Template for using typescript with express

Basic template that only contains the starter file for initializing a basic express server

### Folder Structure

- `/function`
  Should contians all the functions required for the server.
- `/middleware`
  Middleware used in the routes
- `/routes`
  Routes for the server
- `/models`
  Contains the schema of the database

### Scripts

We only have one routes generating scripts at the time of writing this document.

That is of `routes`, the command to generate the routes is:
`npm run routes <routesname>`. It creates routes in the routes folder only if the file does not exixts.

### Misc

You need to generate some certificates to serve on https in development.
[Follow this guide](https://nodejs.org/en/knowledge/HTTP/servers/how-to-create-a-HTTPS-server/#:~:text=To%20start%20your%20https%20server,the%20file%20on%20the%20terminal.&text=or%20in%20your%20browser%2C%20by,to%20https%3A%2F%2Flocalhost%3A8000%20.) in order to generate the certificates.
