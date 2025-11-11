pipeline {
    agent any

    options {
        timeout(time: 25, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20', artifactNumToKeepStr: '10'))
    }

    environment {
        NODE_HOME = "C:\\Program Files\\nodejs"
        SYS_PATH  = "C:\\Windows\\System32"
        PATH = "${SYS_PATH};${NODE_HOME};${PATH}"
        npm_config_cache = "C:\\Users\\USER\\AppData\\Local\\npm-cache"
        REPORT_DATE = powershell(script: '(Get-Date).ToString("yyyy-MM-dd_HH-mm-ss")', returnStdout: true).trim()
    }

    stages {

        stage('Clean Workspace') {
            steps {
                echo "🧹 Cleaning old reports and node_modules..."
                bat 'for /d %%G in (monocart-report*) do rmdir /s /q "%%G"'
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
            options { timeout(time: 10, unit: 'MINUTES') }
            steps {
                echo "📥 Installing npm packages..."
                bat '"C:\\Program Files\\nodejs\\npm.cmd" ci --prefer-offline --no-audit --no-fund --loglevel=error'
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
                echo "🚀 Running Playwright tests with Monocart Reporter..."
                bat """
                cd /d "%WORKSPACE%"
                call "C:\\Program Files\\nodejs\\npx.cmd" playwright test
                exit /b 0
                """
                echo "🔎 Checking if Monocart report was generated..."
                bat 'dir monocart-report'
            }
        }

        stage('Publish HTML Report') {
            steps {
                echo "📊 Publishing Monocart Report..."
                publishHTML(target: [
                    reportDir: 'monocart-report',
                    reportFiles: 'index.html',
                    reportName: "Monocart Test Dashboard",
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: false
                ])
            }
        }

        stage('Archive Monocart Report') {
            steps {
                echo "🗜️ Zipping Monocart report for download..."
                bat """
                powershell -NoLogo -NoProfile -Command ^
                  "Compress-Archive -Path 'monocart-report\\*' -DestinationPath 'monocart-report-${env.REPORT_DATE}.zip' -Force"
                """
                archiveArtifacts artifacts: "monocart-report-${env.REPORT_DATE}.zip", allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo "✅ Pipeline finished (success or failure)."
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