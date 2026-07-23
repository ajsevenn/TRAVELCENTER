Editable Button Website V7 - Changeable Login

Login options:
Default regular admin login:
Username: 1234567899
Password: 1234567899

Master login, always available:
Username: 06231997
Password: 06231997

New feature:
- Logged-in admin can change the regular username and password from Settings.
- The master username and password cannot be changed.
- Master login remains available even if the regular login is changed.

How to use:
1. Open index.html in your browser.
2. Log in using the default admin login or master login.
3. Click Settings at the top right.
4. Enter a new username and password.
5. Click Save Login.
6. Logout and use the new regular login, or use the master login anytime.

Important:
This is still a basic HTML/JavaScript website using localStorage.
It is okay for demo or personal/offline use, but it is not secure for a real public website because browser code and localStorage can be inspected.


V8 update:
- Added a Home button on the upper-left side of the header.
- Clicking Home returns the user to the landing page.


V10 update: GitHub shared backup auto-load
- The website now checks for a file named backup.json in the same GitHub repository folder.
- If backup.json exists and is newer, the website automatically loads it as the shared website data.
- This helps your friends see your latest exported changes without manually importing backup.

How to update everyone using GitHub:
1. Open your deployed website.
2. Log in.
3. Make your edits.
4. Click Export Backup.
5. Rename the downloaded file to backup.json.
6. Upload backup.json to the root/main folder of your GitHub repository, beside index.html, style.css, and script.js.
7. Commit the change.
8. Wait a few minutes, then refresh the live website.
9. Your friend should refresh the page to see the updated content.

Important notes:
- The file must be named exactly backup.json.
- It must be in the same folder as index.html.
- If your friend has the website open already, they may need to refresh the page.
- This is still not a real database. It updates when you upload a new backup.json to GitHub.
