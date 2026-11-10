# all-aboard-starting-template

Go to [mwlaunchpad.com](https://mwlaunchpad.com) for information about Launchpad.

## Fork this repo

Work from your own fork of this repo, not from this repo directly.

1. Click **Fork** at the top of this repo's GitHub page.
2. Choose your GitHub account as the owner, then click **Create fork**.
3. Clone your fork, replacing `<your-github-username>` with your username:

   ```bash
   git clone https://github.com/<your-github-username>/all-aboard-starting-template.git
   ```

## Home screen office map

The onboarding home screen can embed an office map using the Google Maps Embed
API. Copy `.env.example` to `.env`, then set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
and `NEXT_PUBLIC_OFFICE_ADDRESS`. Restrict the browser key to your app's HTTP
referrers and the Maps Embed API in Google Cloud. The key is included in
client-side map requests, so do not commit a real key. The mock data only
contains the colleague's city, not a full street address; without configured
values the home screen shows that city and a link to search for it in Google
Maps.
