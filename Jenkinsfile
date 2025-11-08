pipeline {
    agent any

    options {
        timeout(time: 20, unit: 'MINUTES') // 🕒 avoid infinite hangs
    }

    environment {
        NODE_HOME = "C:\\Program Files\\nodejs"
        SYS_PATH  = "C:\\Windows\\System32"
        PATH = "${SYS_PATH};${NODE_HOME};${PATH}"
        REPORT_DATE = powershell(script: '(Get-Date).ToString("yyyy-MM-dd_HH-mm-ss")', returnStdout: true).trim()
    }

    stages {

        stage('Clean Workspace') {
            steps {
                echo "🧹 Cleaning old reports and node_modules..."
                bat 'for /d %%G in (playwright-report*) do rmdir /s /q "%%G"'
                bat 'if exist test-results rmdir /s /q test-results'
                bat 'if exist node_modules rmdir /s /q node_modules'
                bat 'if exist allure-results rmdir /s /q allure-results'
            }
        }

        stage('Checkout') {
            steps {
                echo "📦 Checking out code from GitHub..."
                checkout scm
            }
        }

        stage('Install Dependencies') {
            options { timeout(time: 5, unit: 'MINUTES') }
            steps {
                echo "📥 Installing npm packages..."
                bat '"C:\\Program Files\\nodejs\\npm.cmd" install --no-fund --no-audit --loglevel=error'
                // 🧠 ensure allure-playwright exists
                bat '"C:\\Program Files\\nodejs\\npm.cmd" install allure-playwright --save-dev'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                echo "🌐 Installing Playwright browsers..."
                bat '"C:\\Program Files\\nodejs\\npx.cmd" playwright install --with-deps'
            }
        }

        stage('Run Playwright Tests') {
            options { timeout(time: 10, unit: 'MINUTES') }
            steps {
                echo "🚀 Running Playwright tests..."
                bat """
                call "C:\\Program Files\\nodejs\\npx.cmd" playwright test --reporter=list --reporter=html --reporter=allure-playwright --output=playwright-report-%REPORT_DATE%
                exit /b 0
                """
                bat 'dir allure-results'
            }
        }

        stage('Publish HTML Report') {
            steps {
                echo "📊 Publishing Playwright HTML report..."
                publishHTML(target: [
                    reportDir: "playwright-report-${env.REPORT_DATE}",
                    reportFiles: 'index.html',
                    reportName: "Playwright Report - ${env.REPORT_DATE}",
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: false
                ])
            }
        }

        stage('Publish HTML Report') {
    steps {
        echo "📊 Publishing Playwright HTML report..."
        publishHTML(target: [
            reportDir: "playwright-report",
            reportFiles: 'index.html',
            reportName: "Playwright Test Report",
            keepAll: true,
            alwaysLinkToLastBuild: true,
            allowMissing: false
        ])
    }
}

        stage('Archive Artifacts') {
            steps {
                echo "📦 Archiving reports and screenshots..."
                archiveArtifacts artifacts: "playwright-report-${env.REPORT_DATE}/**, test-results/**, screenshots/**", allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo "✅ Pipeline finished (success or failure)."
            // 🧹 Force-kill leftover Node/Playwright processes
            bat 'taskkill /IM node.exe /F || exit 0'
        }
        success {
            echo "🎉 Playwright Tests Passed!"
        }
        failure {
            echo "❌ Playwright Tests Failed!"
        }
    }
}
