# Smart Book Library Backend

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ihsanyigitbasi92/test-repo.git
   ```

2. Navigate to the project directory:
   ```bash
   cd test-repo
   ```

3. Build the Docker image:
   ```bash
   docker build -t smart-book-library-backend .
   ```

4. Run the Docker container:
   ```bash
   docker run -p 5000:5000 smart-book-library-backend
   ```

## Environment Variables

- `DATABASE_URL`: URL for the database connection
- `SECRET_KEY`: Secret key for application security

## Running the Application

The application will be accessible at `http://localhost:5000`.

Ensure all environment variables are set before running the application.