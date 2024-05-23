pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout code from the repository
                git 'https://your-repository-url.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                // Install npm dependencies
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                // Build your project if needed
                sh 'npm run build'
            }
        }
        stage('Test') {
            steps {
                // Run your tests
                sh 'npm test'
            }
        }
        stage('Deploy') {
            steps {
                // Deploy to your server or cloud platform
                sh '''
                # Example deployment steps to Heroku
                heroku login -i
                git remote add heroku https://git.heroku.com/your-heroku-app.git
                git push heroku master
                '''
            }
        }
    }
    post {
        always {
            // Clean up workspace after the build
            cleanWs()
        }
        success {
            // Notify success
            echo 'Build and deployment succeeded!'
        }
        failure {
            // Notify failure
            echo 'Build or deployment failed!'
        }
    }
}
