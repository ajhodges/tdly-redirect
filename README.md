# tdly-redirect

A lightweight web app that stores your [Tenderly](https://tenderly.co) credentials in the browser and automatically redirects simulation links to your personal dashboard.

## How it works

Tenderly simulation URLs contain your username and project slug, which changes per user. `tdly-redirect` acts as a personal redirect layer: you enter your credentials once, and any simulation link shared through this app will automatically open in your own Tenderly project.

Simulation parameters are passed via URL query string. Compressed payloads (gzip + base64url encoded via the `q` parameter) are decompressed client-side before the redirect is built.

## Usage

1. Open the app and enter your Tenderly **username** and **project slug**
2. Click **Save Details** — credentials are stored in `localStorage`
3. Any link of the form `https://<your-deployment>/tdly-redirect?<params>` will now redirect automatically

### Resetting credentials

Navigate to `?path=/reset` to clear stored credentials.

### Finding your credentials

| Value | Where to find it |
|---|---|
| Username | [Account Settings](https://dashboard.tenderly.co/account/settings) |
| Project slug | [Projects](https://dashboard.tenderly.co/account/projects) |

## Development

```bash
npm install
npm start       # http://localhost:3000
npm test
npm run build
```

## Deployment

The app is configured for GitHub Pages:

```bash
npm run deploy
```

This runs a production build and publishes to the `gh-pages` branch.

## License

MIT
