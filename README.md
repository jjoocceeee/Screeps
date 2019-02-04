# Screeps Boilerplate
Code used to implement and play https://screeps.com/
### About
Uses Grunt and hot reload. On file saves, it will auto update on Screeps.

### Config
A config.json is required in the root of the project:
```json
{
  "branch": "dev",
  "email": "blah@gmail.com",
  "password": "screeps_password",
  "ptr": false,
  "private_directory": true,
  "host": "localhost",
  "port": 21025,
  "http": true
}
```

### SRC
The Source File contains basic movement and functionality for Screeps Components.
