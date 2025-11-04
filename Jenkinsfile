pipeline {
    agent any

    environment {
        NODE_HOME = "C:\\Program Files\\nodejs"
        SYS_PATH  = "C:\\Windows\\System32"
        PATH = "${SYS_PATH};${NODE_HOME};${PATH}"
    }

    stages {

        // 🧹 Clean before every build
        stage('Clean Workspace') {
            steps {
                echo "🧹 Cleaning old reports and node_modules..."
                bat 'if exist playwright-report rmdir /s /q playwright-report'
                bat 'if exist test-results rmdir /s /q test-results'
                bat 'if exist node_modules rmdir /s /q node_modules'
            }
        }

        stage('Checkout') {
            steps {
                echo "📦 Checking out code from GitHub..."
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "📥 Installing npm packages..."
                bat '"C:\\Program Files\\nodejs\\npm.cmd" install --no-fund --no-audit --loglevel=error'
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

        // 🗂️ Archive logs, screenshots, traces
        stage('Archive Artifacts') {
            steps {
                echo "📦 Archiving test results and screenshots..."
                archiveArtifacts artifacts: 'test-results/**, screenshots/**, playwright-report/**', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo "✅ Pipeline finished (success or failure)."
        }
        success {
            echo "🎉 Playwright Tests Passed!"
        }
        failure {
            echo "❌ Playwright Tests Failed!"
        }
    }
}