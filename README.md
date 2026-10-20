# MechCalc AI — Mechanical Engineering Calculators

MechCalc AI is a responsive, browser-based collection of mechanical engineering calculators. It is built with **HTML, CSS, and vanilla JavaScript** and is designed to work on desktop computers, tablets, and mobile phones.

The calculators perform their mathematical calculations locally in the browser. An optional AI explanation feature can explain a calculated result in simple language using Google's Gemma model through the Gemini API.

## Features

- Responsive layout for phones, tablets, and desktop screens
- Mechanical engineering calculators grouped by topic
- Formula shown for each calculator
- Input units and calculated result units
- Input validation and reset button
- Working values displayed with the result
- Optional AI-generated explanation of a calculation
- No framework or build process required for the static website

## Calculators included

### Power and motion
- Torque
- Power from torque and speed
- Torque from power
- Flywheel energy
- Efficiency

### Drives
- Belt drive speed and belt speed
- Open belt length
- Gear pair speed and ratio

### Strength of materials
- Direct stress
- Elongation of a bar
- Factor of safety
- Solid shaft diameter
- Simply supported beam
- Helical spring
- Bolt tightening torque

### Manufacturing
- Turning speed, feed rate, and machining time

### Thermal and fluids
- Thermal expansion
- Heat conduction
- Hydraulic cylinder force

## Project structure

```text
MechCalc-AI/
├── index.html   # Page structure and calculator interface
├── style.css    # Layout, colors, and responsive styling
├── script.js    # Calculator formulas, validation, navigation, and AI request logic
└── README.md    # Project documentation
```

## How it works

1. **Choose a calculator.** Select a category card or choose a calculator from the calculator menu.
2. **Enter input values.** Each input shows the expected unit.
3. **Calculate.** JavaScript validates the inputs and evaluates the calculator's formula.
4. **Read the result.** The page displays the result, units, and entered values.
5. **Explain the result (optional).** After calculating, select **Explain this result** to request a plain-language explanation from the configured AI service.

The numerical result is calculated by the website's JavaScript. The AI feature explains the result; it should not replace the calculator's numerical calculation.

## Run locally

### Option 1: Open the HTML file

1. Download or clone this repository.
2. Keep `index.html`, `style.css`, and `script.js` in the same folder.
3. Open `index.html` in a web browser.

The mechanical calculators work without an API key or server.

### Option 2: Use VS Code and Live Server

1. Open the project folder in Visual Studio Code.
2. Install the **Live Server** extension if you do not already have it.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

## Publish with GitHub Pages

1. Create a repository on GitHub.
2. Upload `index.html`, `style.css`, `script.js`, and `README.md` to the repository's root.
3. Open the repository's **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder, then save.
6. Wait for GitHub Pages to publish the site. The public URL will be shown in the Pages settings and will usually look like:

   `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`

Replace the example with your actual GitHub username and repository name.

## AI explanation setup and API-key security

The current front-end JavaScript contains the AI request logic and a `GEMINI_API_KEY` placeholder. **Do not commit a real API key to a public GitHub repository or put it in browser-side JavaScript.** Any key included in a public website can be inspected and copied by visitors.

For a public deployment, use a server-side backend (for example, a Cloudflare Worker) that stores the Google API key as a secret. The website should send the prompt to that backend, and the backend should call Google's API. Add rate limiting and usage monitoring before sharing the AI feature publicly.

GitHub Pages hosts static files; it does not run server-side code. The mechanical calculators can be published and used without the AI feature while the backend is being configured.

To enable AI explanations, you need:
- A Google AI Studio API key stored securely on the backend
- A model available to your API key and project
- A backend endpoint configured in `script.js`
- Suitable API quota or billing settings for your Google account

Model availability, quotas, and pricing may change. Check Google's official documentation before deployment:
- [Google AI Studio API keys](https://aistudio.google.com/apikey)
- [Gemini API documentation](https://ai.google.dev/gemini-api/docs)
- [GitHub Pages documentation](https://docs.github.com/en/pages)

## Responsive design

The CSS uses flexible layouts, CSS Grid, flexible widths, and media queries to adapt the interface to smaller screens. Test the deployed website on both a desktop browser and a real mobile device. If an older version remains visible after deployment, refresh the page and clear the browser cache if necessary.

## Notes and limitations

- Results are intended for learning and quick engineering estimates.
- Verify important results independently and consult applicable engineering standards or handbooks before using calculations in real-world designs.
- Input ranges and assumptions vary by calculator; check each formula and its units before relying on a result.
- AI explanations can be incorrect. Verify formulas, units, and numerical results independently.
- Free hosting does not mean unlimited AI usage; API quotas and provider limits apply.

## Technologies used

- HTML5
- CSS3
- Vanilla JavaScript
- Google Gemini API / Gemma model (optional AI explanations)

## Contributing

Suggestions and improvements are welcome. For a change, create a branch, make the update, and open a pull request describing what changed and how it was tested.

## License

No license has been specified yet. If you want others to reuse, modify, or distribute this project, choose and add an appropriate open-source license file (for example, an MIT License) before publishing.
