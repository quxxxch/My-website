pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                // Checkout code from the repository
                git credentialsId: 'quxxxch', url: 'https://github.com/quxxxch/My-website.git', branch: 'main'
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
                sh 'npm run build' // Ensure you have a build script in your package.json
            }
        }
        stage('Test') {
            steps {
                // Run your tests
                sh 'npm test' // Ensure you have test scripts in your package.json
            }
        }
        stage('Deploy') {
            steps {
                // Example deployment steps to Heroku
                withCredentials([string(credentialsId: 'HEROKU_API_KEY', variable: 'HEROKU_API_KEY')]) {
                    sh '''
                    echo $HEROKU_API_KEY | docker login --username=_ --password-stdin registry.heroku.com
                    git remote add heroku https://git.heroku.com/your-heroku-app.git
                    git push heroku master
                    '''
                }
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
