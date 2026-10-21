# dev by Vardah

Personal portfolio of Vardah Ahmad, full stack developer.

It's a plain static site: HTML, CSS and a little vanilla JavaScript. No framework, no build step, no dependencies to install.

## Files

```
dev-by-vardah/
├── index.html    the whole site (styles and script included)
├── 404.html      page shown for broken links
├── favicon.svg   browser tab icon
├── vercel.json   clean URLs and basic security headers
└── README.md
```

## Run it locally

Open `index.html` in a browser. That's it.

## Deploy on Vercel (free)

1. Create a new public repository on GitHub called `dev-by-vardah`.
2. Upload these five files to the root of the repository (drag them onto the GitHub page and commit).
3. Sign in at vercel.com with your GitHub account.
4. Click **Add New → Project** and import `dev-by-vardah`.
5. Use these settings:
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: leave empty
   - Output Directory: leave empty
   - Install Command: leave empty
6. Click **Deploy**. Your site will be at `https://dev-by-vardah.vercel.app` (or a similar free address).

Every time you change a file on GitHub, Vercel redeploys automatically.

## Editing content

Placeholders are marked with the `ph` class (yellow boxes on the page). Search `index.html` for `TODO` to find them.
