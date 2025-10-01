
# Al-Asani for Digital Services

This is a digital services marketplace application built with React and TypeScript. It allows for listing and managing digital services, with an integrated AI assistant to help users.

## Deployment to GitHub Pages

This repository is configured with a GitHub Action to automatically build and deploy the application to GitHub Pages.

### 1. Repository Setup

1.  Create a new repository on GitHub.
2.  Upload all the project files (`index.html`, `index.tsx`, `App.tsx`, etc., including the new `.github` directory and this `README.md`) to your new repository.

### 2. Configure the Gemini API Key

The AI assistant requires a Google Gemini API key to function. To provide this securely, you must add it as a "secret" in your GitHub repository.

1.  In your GitHub repository, go to **Settings > Secrets and variables > Actions**.
2.  Click the **New repository secret** button.
3.  For the **Name**, enter `API_KEY`.
4.  For the **Secret**, paste your actual Google Gemini API key.
5.  Click **Add secret**.

The deployment workflow will automatically use this secret. **Do not** write your API key directly in the code.

### 3. Enable and Deploy to GitHub Pages

1.  Once you have pushed your code and set up the secret, the GitHub Action will run automatically. You can view its progress in the "Actions" tab of your repository.
2.  In your repository, go to **Settings > Pages**.
3.  Under **Build and deployment**, for the **Source**, select **GitHub Actions**.
4.  Click **Save**.

Your site will be live at `https://<your-username>.github.io/<your-repository-name>/` in a few minutes after the action completes successfully. Every subsequent push to your `main` branch will trigger a new deployment automatically.
