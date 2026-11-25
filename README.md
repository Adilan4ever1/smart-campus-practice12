# Smart Campus Room Availability Checker

Practice #12 (AI-Driven Software Engineering): the same small feature built two ways and compared.

- **Code-based:** plain HTML/CSS/JavaScript, no dependencies. Live demo: https://adilan4ever1.github.io/smart-campus-practice12/
- **Low-code:** Microsoft Power Apps canvas app. [Open the published app](https://apps.powerapps.com/play/e/default-57081b5e-e66a-4993-8eaf-15b0b309293f/a/b99d312e-0402-4e18-97f3-4d812cc79ac1?tenantId=57081b5e-e66a-4993-8eaf-15b0b309293f) (KBTU tenant sign-in, access must be shared by the owner)

Full write-up, test table, comparison matrix and security checklist: **[REPORT.md](REPORT.md)**
Shared requirements and acceptance criteria: **[docs/CONTRACT.md](docs/CONTRACT.md)**

## Run the code-based version

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

Run the acceptance tests (Node 18+):

```
node tests/run-tests.js
```

Expected output ends with `Acceptance tests: 8/8 passed` and `Extra checks: 6/6 passed`.

## Low-code source

`lowcode/App.Formulas.fx` holds the Power Fx named formulas and user-defined functions (invariant syntax). `lowcode/App.Formulas.ru-locale.fx` is the same text with `;` separators, as pasted into a Russian-locale studio. `lowcode/screen-controls.pa.yaml` is the screen definition pasted into Power Apps Studio.

All data is fictional.
