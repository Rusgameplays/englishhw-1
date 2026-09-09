# TechFest 2027 Registration Form

A polished, responsive registration form that can be hosted free on GitHub Pages and stores registrations in Google Sheets through Google Apps Script.

## Project files

| File | Purpose |
| --- | --- |
| `index.html` | Form structure and fields |
| `style.css` | Responsive visual design |
| `script.js` | Validation, three-interest limit, and JSON submission |
| `Code.gs` | Google Apps Script endpoint that writes to the spreadsheet |

No secret keys are included. The only value you add to the website is your public Apps Script **Web App URL**.

## 1. Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a blank spreadsheet called **TechFest 2027 Registrations**.
2. Rename the first sheet tab to **Registrations**. It must match the `SHEET_NAME` value in `Code.gs`.
3. In row 1, paste these 16 headings, one per column from A through P:

   ```text
   Timestamp | Full Name | Email Address | Phone Number | Country | University / College | Field of Study | Year of Study | Event Type | Areas of Interest | Participation Format | Learning Expectations | Programming Experience | How Did You Hear About Us | Terms Accepted | Registration Date
   ```

4. Optional: freeze row 1 and format the timestamp column as a date and time.

## 2. Connect the Google Apps Script

1. In that spreadsheet, select **Extensions → Apps Script**.
2. Replace the starter code with the complete contents of `Code.gs` from this project.
3. Click **Save** and give the Apps Script project a helpful name, such as `TechFest 2027 Registration Endpoint`.
4. Click **Deploy → New deployment**.
5. Click the gear icon next to “Select type” and choose **Web app**.
6. Set **Execute as** to **Me**.
7. Set **Who has access** to **Anyone**. This lets visitors submit without needing a Google account.
8. Click **Deploy**, complete Google’s authorization prompts, then copy the **Web app URL**. It ends with `/exec`.

Keep the spreadsheet and Apps Script owned by an account you control. Do not delete the deployment after publishing it.

## 3. Add the endpoint URL to the website

1. Open `script.js`.
2. Replace exactly this text:

   ```javascript
   PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE
   ```

   with the Web app URL copied in the previous step. Keep the quotation marks.
3. Save the file.

The browser sends a JSON body to Apps Script using `text/plain` to avoid browser CORS preflight restrictions. `Code.gs` reads it with `JSON.parse`. Since the endpoint is public, it is deliberately designed only to receive registrations; it contains no secret credentials.

## 4. Test the connection

1. Open `index.html` in a browser, or publish the site first as described below.
2. Complete the required fields, accept the terms, and submit.
3. Return to the Google Sheet. A new row should appear with a timestamp and all form values.

If a row does not appear, confirm all of the following:

- The sheet tab is named `Registrations`.
- The URL in `script.js` is the deployed `/exec` URL, not an editor or `/dev` URL.
- The deployment’s access is set to **Anyone**.
- You clicked **Deploy → Manage deployments → Edit → Deploy** after changing `Code.gs`.

## 5. Publish with GitHub Pages

1. Create a new GitHub repository, for example `techfest-2027-registration`.
2. Upload `index.html`, `style.css`, and `script.js` from this folder to the repository root. `README.md` can be uploaded too. `Code.gs` is a reference copy and is not needed by GitHub Pages.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder, then click **Save**.
6. Wait a minute or two. GitHub displays the public URL for your form in the Pages settings.

Every update pushed to the selected branch is republished automatically.

## Updating the Apps Script later

After editing `Code.gs`, go to **Deploy → Manage deployments**, select the Web app deployment, click the edit icon, set a new version if prompted, and click **Deploy**. The `/exec` URL stays the same.

## Field mapping

The form writes values in this order: Timestamp, Full Name, Email Address, Phone Number, Country, University / College, Field of Study, Year of Study, Event Type, Areas of Interest, Participation Format, Learning Expectations, Programming Experience, How Did You Hear About Us, Terms Accepted, and Registration Date.
