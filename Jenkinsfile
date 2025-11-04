pipeline {
    agent any

    environment {
        NODE_HOME = "C:\\Program Files\\nodejs"
        PATH = "${NODE_HOME};${PATH}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo "📦 Checking out code from GitHub..."
                checkout scm
            }
        }

        stage('Check CMD') {
            steps {
                echo "🔍 Verifying CMD and PATH configuration..."
                bat 'where cmd'
                bat 'echo %PATH%'
            }
    }

        stage('Install Dependencies') {
            steps {
                echo "📥 Installing npm packages..."
                bat '"C:\\Program Files\\nodejs\\npm.cmd" install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                echo "🌐 Installing Playwright browsers..."
                bat '"C:\\Program Files\\nodejs\\npx.cmd" playwright install --with-deps'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                echo "🚀 Running Playwright tests..."
                bat '"C:\\Program Files\\nodejs\\npx.cmd" playwright test --reporter=html'
            }
        }

        stage('Publish HTML Report') {
            steps {
                echo "📊 Publishing Playwright HTML report..."
                publishHTML(target: [
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Report',
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: false
                ])
            }
        }
    }

    post {
        always {
            echo "✅ Pipeline finished (success or failure). Cleaning up..."
        }
        success {
            echo "🎉 Playwright Tests Passed!"
        }
        failure {
            echo "❌ Playwright Tests Failed!"
        }
    }
}
