# Running the Application with HTTPS

This project includes several batch files to easily run the Angular application with HTTPS enabled, which is required to communicate with the backend API that uses HTTPS.

## Quick Start

### Option 1: Using the Main Launcher (Recommended)

1. Double-click the `run-sistema-iglesia.bat` file in Windows Explorer
2. Select from the menu:
   - Option 1: Start the application with HTTPS
   - Option 2: Test the API connection
   - Option 3: Exit

### Option 2: Direct Scripts

If you prefer to run the scripts directly:

1. For HTTPS application: Double-click the `start-https.bat` file
2. For API testing: Double-click the `test-api-connection.bat` file
3. Or run from the command line:
   ```
   .\start-https.bat
   ```

## What the Script Does

The `start-https.bat` script:

1. Checks if Node.js is installed
2. Verifies Angular CLI is available (either globally or in the local node_modules)
3. Creates an SSL directory if it doesn't exist
4. Checks for custom SSL certificates
5. Starts the Angular application with HTTPS enabled and proxy configuration for CORS handling

## SSL Certificates

By default, Angular CLI will auto-generate self-signed certificates. When you first access the application, your browser will show a security warning. This is normal for development environments.

### Using Custom Certificates

If you want to use your own SSL certificates:

1. Create an `ssl` folder in the project root (the script will create this for you)
2. Place your certificate files in the folder:
   - `server.crt`: Your SSL certificate
   - `server.key`: Your SSL private key

The script will automatically detect and use these files if they exist.

## CORS and Proxy Configuration

This application uses a proxy configuration to handle Cross-Origin Resource Sharing (CORS) issues that occur when the frontend (running on https://localhost:4200) tries to communicate with the backend API (running on https://localhost:44347).

### What is CORS?

CORS is a security feature implemented by browsers that restricts web pages from making requests to a different domain than the one that served the web page. This is a common issue in development when your frontend and backend are running on different ports or domains.

### How the Proxy Works

The application includes a `proxy.conf.json` file that configures the Angular development server to proxy API requests:

```json
{
  "/api": {
    "target": "https://localhost:44347",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

This configuration:
- Forwards all requests starting with `/api` to the target server
- Handles HTTPS connections even with self-signed certificates (`secure: false`)
- Changes the origin header to match the target server (`changeOrigin: true`)
- Provides detailed logs for debugging (`logLevel: debug`)

### How It's Implemented

1. The `start-https.bat` script automatically uses this proxy configuration
2. The authentication service uses relative URLs (e.g., `/api/Auth/login`) instead of absolute URLs
3. The Angular development server forwards these requests to the actual backend

This approach allows the frontend to communicate with the backend without CORS issues during development.

## Troubleshooting

### Certificate Warnings

When accessing the application, your browser will show a security warning because the certificates are self-signed. You can:

1. Click "Advanced" and then "Proceed to localhost (unsafe)"
2. Or generate trusted development certificates using tools like [mkcert](https://github.com/FiloSottile/mkcert)

### Connection Issues

If you're having trouble connecting to the API:

1. Run the `test-api-connection.bat` script to verify API connectivity
2. Verify the API is running at https://localhost:44347
3. Check browser console for CORS errors
4. Ensure your auth service is using the correct API URL (should be relative: `/api/Auth`)

### CORS Issues

If you're still seeing CORS errors in the browser console:

1. Verify that the application is running with the proxy configuration:
   - Check that you're using `start-https.bat` or `npm run start:proxy:ssl`
   - Look for "Proxying to https://localhost:44347" in the console output
2. Check that the auth service is using relative URLs (e.g., `/api/Auth/login`)
3. Verify that the proxy.conf.json file exists and has the correct configuration
4. Try clearing your browser cache and cookies
5. Use browser developer tools to inspect the network requests and responses

### Testing API Connection

The project includes a `test-api-connection.bat` script that helps you verify if the API is accessible:

1. Double-click the `test-api-connection.bat` file
2. The script will attempt to connect to the API's Swagger documentation
3. If successful, you'll see a status code 200
4. If unsuccessful, you'll see an error message

This is useful for troubleshooting before starting the Angular application.

## API Information

The backend API is available at:
- API Base URL: `https://localhost:44347`
- Swagger Documentation: `https://localhost:44347/swagger/index.html`
