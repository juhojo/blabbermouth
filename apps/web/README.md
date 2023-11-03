# Web

Views:

- /auth: insert email form
  - form submission calls POST /auth, and on success navigates user to /auth/login and sets email as a query parameter
- /auth/login?email={email}: insert passcode received as email form

  - form submission calls POST /auth/login, and on success navigates user to /configs

- /configs: a listview of configs, create a config button
  - create a config button click calls POST /configs, and on success navigates user to /configs/{cid}
  - clicking listview items calls GET /configs/{cid}/fields and navigates user to /configs/{cid}
- /configs/{cid}: config key URL, a listview of fields in config, create a field form, edit a field button on each list item, delete a field button on each list item
