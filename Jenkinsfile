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
                    bat 'npm install'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('client') {
                    bat 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir('client') {
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
