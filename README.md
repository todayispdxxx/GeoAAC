# GeoAAC Homepage

The official project homepage for **GeoAAC**, published with GitHub Pages.

## Local preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Publish

Push to the `main` branch. The workflow in `.github/workflows/pages.yml` deploys the site automatically. In the repository settings, set **Pages → Source** to **GitHub Actions** if it is not selected already.

## Customize before publication

- Replace author and affiliation placeholders in `index.html`.
- Replace the illustrative experiment values with reported results.
- Add the final paper, video, and project asset links.
- Adjust colors and layout in `assets/styles.css`.
- Update interactive demo data in `assets/main.js`.
