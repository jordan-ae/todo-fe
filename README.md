To set up, run, and deploy this project on Vercel, follow these steps:

### 1. **Set Up the Project Locally**

#### Prerequisites
- **Node.js**: Ensure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **Git**: Ensure you have Git installed. You can download it from [git-scm.com](https://git-scm.com/).

#### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/jordan-ae/todo-fe.git
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure the API URL**:
   - Open the `api.service.ts` file located in the `services` directory.
   - Modify the `API_URL` to point to your local backend API if needed. By default, it should be set to the current API URL.

4. **Run the Project Locally**:
   ```bash
   npm start
   ```
   This will start the development server, and you can view the project at `http://localhost:4200/`.

### 2. **Deploy the Project on Vercel**

#### Prerequisites
- **Vercel Account**: Sign up for a Vercel account at [vercel.com](https://vercel.com/).
- **Vercel CLI**: Install the Vercel CLI globally using npm:
  ```bash
  npm install -g vercel
  ```

#### Steps
1. **Login to Vercel**:
   ```bash
   vercel login
   ```

2. **Deploy the Project**:
   ```bash
   vercel
   ```
   Follow the prompts to deploy your project. Vercel will automatically detect the project type and configure the deployment.

3. **Set Environment Variables**:
   - If your project requires environment variables (e.g., API keys), you can set them in the Vercel dashboard under the "Environment Variables" section of your project settings.

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```
   This will deploy your project to production.

### 3. **Maintaining the API URL**

- **Local Development**: You can maintain the API URL in `api.service.ts` to point to your local backend API.
- **Production**: Ensure the API URL in `api.service.ts` points to the production backend API before deploying to Vercel.

### 4. **Additional Tips**

- **Continuous Deployment**: You can connect your GitHub repository to Vercel for continuous deployment. Every push to the main branch will trigger a new deployment.
- **Custom Domains**: You can configure custom domains in the Vercel dashboard for your project.

### 5. **Troubleshooting**

- **Build Errors**: If you encounter build errors, check the logs in the Vercel dashboard for more details.
- **Environment Variables**: Ensure all required environment variables are set correctly in the Vercel dashboard.

By following these steps, you should be able to set up, run, and deploy your project on Vercel successfully.
