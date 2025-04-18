pipeline {
    agent any

    environment {
        NODE_ENV = 'development'
    }

    stages {
        stage('Clone Repo') {
            steps {
                git url: 'https://github.com/nikitayugeshwar/pathology.git', branch: 'main'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('Server') {
                     bat 'npm install --legacy-peer-deps'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('Patho-Frontend') {
                    bat 'npm install --legacy-peer-deps'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('Patho-Frontend') {
                    bat 'npm run build'
                }
            }
        }

        stage('Run Tests') {
            steps {
                dir('Server') {
                    bat 'npm test'
                }
            }
        }

        stage('Done') {
            steps {
                echo 'Pipeline completed successfully 🎉'
            }
        }
    }
}
