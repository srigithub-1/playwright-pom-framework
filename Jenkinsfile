pipeline {
    agent any

    stages {

        stage('Clean Workspace') {
            steps {
                echo "🧹 Cleaning Jenkins workspace..."
                deleteDir()
            }
        }

        stage('Checkout Full Repo') {
            steps {
                echo "📥 Checking out latest repository code..."
                checkout scm
            }
        }

        stage('Debug Workspace') {
            steps {
                echo "📁 Listing workspace files:"
                bat "dir"

                echo "📄 Printing playwright.config.ts:"
                bat "type playwright.config.ts"
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "📦 Running npm ci..."
                bat "npm ci"
            }
        }

        stage('Run Playwright Tests') {
            steps {
                echo "🚀 Running Playwright tests..."
                bat "npx playwright test"
            }
        }

        stage('Archive Reports') {
            steps {
                echo "📁 Archiving reports if available..."

                script {
                    def folders = [
                        'reports/html-report',
                        'reports/monocart-report',
                        'reports/playwright',
                        'reports/allure',
                        'reports/raw'
                    ]

                    folders.each { folder ->
                        if (fileExists(folder)) {
                            echo "📌 Archiving: ${folder}"
                            archiveArtifacts artifacts: "${folder}/**", fingerprint: true
                        } else {
                            echo "⚠ Missing: ${folder}"
                        }
                    }
                }
            }
        }

        stage('Publish Playwright HTML Report') {
            when { expression { fileExists('reports/html-report/index.html') } }
            steps {
                echo "📄 Publishing Playwright HTML Report..."
                publishHTML([
                    reportName: 'Playwright HTML Report',
                    reportDir: 'reports/html-report',
                    reportFiles: 'index.html',
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: false
                ])
            }
        }

        stage('Publish Monocart Dashboard') {
            when { expression { fileExists('reports/monocart-report/index.html') } }
            steps {
                echo "📊 Publishing Monocart Dashboard..."
                publishHTML([
                    reportName: 'Monocart Dashboard',
                    reportDir: 'reports/monocart-report',
                    reportFiles: 'index.html',
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: false
                ])
            }
        }
    }
}
