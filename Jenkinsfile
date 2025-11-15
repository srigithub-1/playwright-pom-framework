pipeline {
    agent any

    stages {

        stage('Install Dependencies') {
            steps {
                echo "📦 Installing NPM packages..."
                bat 'npm ci'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                echo "🚀 Running tests..."
                bat 'npx playwright test'
            }
        }

        stage('Archive Reports') {
            steps {
                echo "📁 Archiving Reports..."

                // Archive all reports (if folder exists)
                script {
                    def reportFolders = [
                        'reports/html-report',
                        'reports/monocart-report',
                        'reports/playwright',
                        'reports/allure',
                        'reports/raw'
                    ]

                    reportFolders.each { folder ->
                        if (fileExists(folder)) {
                            archiveArtifacts artifacts: "${folder}/**", fingerprint: true
                        } else {
                            echo "⚠️ Folder not found: ${folder} (skipped)"
                        }
                    }
                }
            }
        }

        stage('Publish HTML Report') {
            when {
                expression { fileExists('reports/html-report/index.html') }
            }
            steps {
                echo "📄 Publishing Playwright HTML report..."
                publishHTML(target: [
                    reportDir: 'reports/html-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright HTML Report',
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: false
                ])
            }
        }

        stage('Publish Monocart Report') {
            when {
                expression { fileExists('reports/monocart-report/index.html') }
            }
            steps {
                echo "📊 Publishing Monocart Dashboard..."
                publishHTML(target: [
                    reportDir: 'reports/monocart-report',
                    reportFiles: 'index.html',
                    reportName: 'Monocart Dashboard',
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: false
                ])
            }
        }
    }
}
