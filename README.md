# GeoAAC Homepage

The official project homepage for **GeoAAC**, published with GitHub Pages.

## Local preview

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Publish

Push to the `main` branch. The workflow in `.github/workflows/pages.yml` deploys the site automatically. In the repository settings, set **Pages → Source** to **GitHub Actions** if it is not selected already.

## Customize

- Update project copy and links in `index.html`.
- Adjust colors and layout in `assets/styles.css`.
- Add lightweight interactions in `assets/main.js`.
- Replace the social preview image referenced by the metadata when a final project figure is available.
