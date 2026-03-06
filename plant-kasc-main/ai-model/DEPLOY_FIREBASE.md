# Deploy AI API to Firebase / Cloud Run

This guide shows how to deploy the `ai-model/api` to Google Cloud Run and optionally integrate with Firebase Hosting. It also covers Firebase Storage setup for serving uploaded images over HTTPS.

Prerequisites
- Google Cloud SDK (`gcloud`) installed and authenticated
- Firebase CLI (`firebase`) installed and authenticated
- A Google Cloud project with billing enabled

1) Create a Firebase service account for Cloud Run

- In GCP Console, go to IAM & Admin → Service Accounts
- Create a new service account (e.g. `plant-ai-sa`)
- Grant it the `Storage Admin` role (or narrow to required permissions)
- Create and download a JSON key and save it as `serviceAccountKey.json` (keep safe)

2) Set environment variables locally (or in Cloud Run)

- `GOOGLE_APPLICATION_CREDENTIALS` should be set to the path of the downloaded service account JSON
- `FIREBASE_STORAGE_BUCKET` should be set to your Firebase storage bucket name, e.g. `your-project-id.appspot.com`

Example (locally)

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\serviceAccountKey.json"
$env:FIREBASE_STORAGE_BUCKET = "your-project-id.appspot.com"
```

3) Ensure `ai-model/api` is Docker-ready

- A `Dockerfile` is included. It runs the app via Gunicorn on port 5001.
- Confirm `requirements.txt` includes `firebase-admin` (already added)

4) Deploy to Cloud Run (recommended)

Option A: Deploy from source (Cloud Build will build image)

```bash
cd ai-model/api
gcloud config set project PROJECT_ID
gcloud run deploy plant-ai-api \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com"
```

Option B: Build image and deploy

```bash
cd ai-model/api
gcloud builds submit --tag gcr.io/PROJECT_ID/ai-api
gcloud run deploy plant-ai-api \
  --image gcr.io/PROJECT_ID/ai-api \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com"
```

- In Cloud Run service settings, set `GOOGLE_APPLICATION_CREDENTIALS` by creating a secret with your service account JSON and mounting it, or use Workload Identity.

5) (Optional) Use Firebase Hosting rewrites so your frontend can call the API on the same HTTPS origin

Add to `firebase.json` in your project root:

```json
{
  "hosting": {
    "rewrites": [
      {
        "source": "/api/**",
        "run": {
          "serviceId": "plant-ai-api",
          "region": "us-central1"
        }
      },
      {
        "source": "/uploads/**",
        "run": {
          "serviceId": "plant-ai-api",
          "region": "us-central1"
        }
      }
    ]
  }
}
```

6) Update frontend env and redeploy

- Set `VITE_AI_API_URL` to your Firebase Hosting domain or Cloud Run URL
- Rebuild frontend and `firebase deploy --only hosting` (if using hosting)

7) Notes on storage & public access

- This code attempts to call `blob.make_public()` after upload so the image can be displayed directly.
- For production, configure security rules appropriately or use signed URLs for private content.

8) Troubleshooting

- If Firebase init fails on Cloud Run, check that credentials are available to the runtime via secret or Workload Identity.
- Inspect Cloud Run logs via `gcloud logs read --project=PROJECT_ID --limit=50`.


That's it — once deployed, your AI API will be reachable over HTTPS and can serve uploaded images via Firebase Storage (HTTPS), avoiding mixed-content issues in your hosted frontend.