## Rules for naming files and folders/Directories

For specific files we will be using dot notation with element.action.ts for example:

- controller: user.controllers.ts
- middleware: user.middleware.ts
- services: user.services.ts
- routes: user.routes.ts
- config: db.config.ts
- test: element.test.ts

MODEL: FOR MODEL NAMING

- User: model should be Entity in singural and start with capital letter,
  Table(entity): for entity or table naming
- users: (table name should be named entity in plural and start with small letter)

Migration: follow sequelizer formatting correctly
Utils:just function in small case letter

In file naming:

- function: camelCase with small start case
- class: Capital Camel case

Validation: use zod
Commits: avoid creating more than one commit at any cost
packages installation:

- avoid installing types packages in dependencies all of them need to be in dev dependencies
- avoid installing packages that have not been maintain for longer more than year
- for new package installation, please make sure there is no other easily feature can be implemented without package
