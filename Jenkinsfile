pipeline {
    agent any

    stages {

        stage('Clean Workspace') {
            steps {
                deleteDir()
                echo "🧹 Workspace cleaned."
            }
        }

        stage('Checkout Code') {
            steps {
                checkout scm
                echo "📥 Checked out repo"
            }
        }

        stage('Debug Workspace') {
            steps {
                echo "WORKSPACE: ${env.WORKSPACE}"
                bat "dir"
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "📦 Installing npm packages..."
                bat 'npm ci'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                echo "🚀 Running Playwright tests..."
                bat 'npx playwright test'
            }
        }
        ...
    }
}
