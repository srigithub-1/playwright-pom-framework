pipeline {
    agent any

    stages {

        /* -----------------------------------------
         * 0. CLEAN WORKSPACE
         * -----------------------------------------*/
        stage('Clean Workspace') {
            steps {
                echo "🧹 Cleaning workspace..."
                deleteDir()
            }
        }

        /* -----------------------------------------
         * 1. CHECKOUT THE LATEST CODE
         * -----------------------------------------*/
        stage('Checkout Code') {
            steps {
                echo "📥 Checking out fresh repo..."
                checkout scm
            }
        }

        /* -----------------------------------------
         * 2. DEBUG WORKSPACE CONTENTS
         * -----------------------------------------*/
        stage('Debug Workspace') {
            steps {
                echo "📁 Current workspace:"
                bat "dir"

                echo "📄 Checking playwright.config.ts file:"
                bat "type playwright.config.ts"
            }
        }

        /* -----------------------------------------
         * 3. INSTALL DEPENDENCIES
         * -----------------------------------------*/
        stage('Install Dependencies') {
            steps {
                echo "📦 Installing dependencies via npm ci..."
                bat "npm ci"
            }
        }

        /* -----------------------------------------
         * 4. RUN PLAYWRIGHT TESTS
         * -----------------------------------------*/
        stage('Run Playwright Tests') {
            steps {
                echo "🚀 Running Playwright tests..."
                bat "npx playwright test"
            }
        }

        /* -----------------------------------------
         * 5. ARCHIVE ALL REPORT FOLDERS
         * -----------------------------------------*/
        stage('Archive Reports') {
            steps {
                echo "📁 Archiving reports..."

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
                            echo "⚠ Missing: ${folder}"
                        }
                    }
                }
            }
        }

        /* -----------------------------------------
         * 6. PUBLISH HTML REPORT
         * -----------------------------------------*/
        stage('Publish Playwright HTML Report') {
            when { expression { fileExists('reports/html-report/index.html') } }
            steps {
                echo "📄 Publishing Playwright HTML report..."
                publishHTML(target: [
                    reportName: 'Playwright HTML Report',
                    reportDir: 'reports/html-report',
                    reportFiles: 'index.html',
                    keepAll: true,
                    alwaysLinkToLastBuild: true
                ])
            }
        }

        /* -----------------------------------------
         * 7. PUBLISH MONOCART DASHBOARD
         * -----------------------------------------*/
        stage('Publish Monocart Dashboard') {
            when { expression { fileExists('reports/monocart-report/index.html') } }
            steps {
                echo "📊 Publishing Monocart Dashboard..."
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
