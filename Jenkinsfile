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

        stage('Archive Reports') {
            steps {
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
                            echo "📌 Archiving: ${folder}"
                            archiveArtifacts artifacts: "${folder}/**", fingerprint: true
                        } else {
                            echo "⚠️ Missing: ${folder}"
                        }
                    }
                }
            }
        }

        stage('Publish Playwright HTML Report') {
            when { expression { fileExists('reports/html-report/index.html') } }
            steps {
                publishHTML(target: [
                    reportName: 'Playwright HTML Report',
                    reportDir: 'reports/html-report',
                    reportFiles: 'index.html',
                    keepAll: true,
                    alwaysLinkToLastBuild: true
                ])
            }
        }

        stage('Publish Monocart Dashboard') {
            when { expression { fileExists('reports/monocart-report/index.html') } }
            steps {
                publishHTML(target: [
                    reportName: 'Monocart Dashboard',
                    reportDir: 'reports/monocart-report',
                    reportFiles: 'index.html',
                    keepAll: true,
                    alwaysLinkToLastBuild: true
                ])
            }
        }
    }
}
