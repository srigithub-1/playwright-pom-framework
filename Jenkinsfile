pipeline {
    agent any

    stages {

        stage('Debug Workspace') {
            steps {
                echo "WORKSPACE: ${env.WORKSPACE}"
                bat "dir"
                echo "Checking PlaywrightAutomation folder:"
                dir('PlaywrightAutomation') {
                    bat "dir"
                }
            }
        }

        stage('Debug Files') {
    steps {
        dir('PlaywrightAutomation') {
            echo "🔎 Listing files in PlaywrightAutomation:"
            bat "dir /b"
            echo "🔎 Listing tests folder:"
            bat "dir tests /s /b"
        }
    }
}

        stage('Install Dependencies') {
            steps {
                dir('PlaywrightAutomation') {
                    echo "📦 Installing npm packages..."
                    bat 'npm ci'
                }
            }
        }

        stage('Run Playwright Tests') {
            steps {
                dir('PlaywrightAutomation') {
                    echo "🚀 Running Playwright tests..."
                    bat 'npx playwright test'
                }
            }
        }

        stage('Archive Reports') {
            steps {
                dir('PlaywrightAutomation') {
                    echo "📁 Archiving report folders..."

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
                                echo "⚠️ Folder not found, skipping: ${folder}"
                            }
                        }
                    }
                }
            }
        }

        stage('Publish Playwright HTML Report') {
            steps {
                dir('PlaywrightAutomation') {
                    script {
                        if (fileExists('reports/html-report/index.html')) {
                            publishHTML(target: [
                                reportName:  'Playwright HTML Report',
                                reportDir:   'reports/html-report',
                                reportFiles: 'index.html',
                                keepAll:     true,
                                alwaysLinkToLastBuild: true
                            ])
                        } else {
                            echo "⚠️ Playwright HTML Report missing, skipping publish."
                        }
                    }
                }
            }
        }

        stage('Publish Monocart Dashboard') {
            steps {
                dir('PlaywrightAutomation') {
                    script {
                        if (fileExists('reports/monocart-report/index.html')) {
                            publishHTML(target: [
                                reportName:  'Monocart Dashboard',
                                reportDir:   'reports/monocart-report',
                                reportFiles: 'index.html',
                                keepAll:     true,
                                alwaysLinkToLastBuild: true
                            ])
                        } else {
                            echo "⚠️ Monocart report not found, skipping publish."
                        }
                    }
                }
            }
        }
    }
}
