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
                bat 'for /d %%G in (playwright-report*) do rmdir /s /q "%%G"'
                bat 'if exist test-results rmdir /s /q test-results'
                bat 'if exist node_modules rmdir /s /q node_modules'
                bat 'if exist monocart-report rmdir /s /q monocart-report'
            }
        }

        stage('Checkout') {
            steps {
                echo "📦 Checking out code from GitHub..."
                checkout scm
            }
        }

        stage('Install Dependencies') {
            options { timeout(time: 15, unit: 'MINUTES') }
            steps {
                echo "📥 Installing npm packages..."
                bat '"C:\\Program Files\\nodejs\\npm.cmd" ci --prefer-offline --no-audit --no-fund --loglevel=error'
                echo "📦 Ensuring Monocart Reporter is installed..."
                bat '"C:\\Program Files\\nodejs\\npm.cmd" install monocart-reporter --save-dev'
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
                call "C:\\Program Files\\nodejs\\npx.cmd" playwright test
                exit /b 0
                """
                echo "🔎 Checking if Monocart report was generated..."
                bat 'dir monocart-report'
            }
        }

        stage('Archive Monocart Report') {
            steps {
                script {
                    echo "📊 Packaging Monocart HTML report..."
                    if (fileExists('monocart-report')) {
                        bat """
                        powershell -NoLogo -NoProfile -Command ^
                          "Compress-Archive -Path 'monocart-report\\*' -DestinationPath 'monocart-report-${env.REPORT_DATE}.zip' -Force"
                        """
                        archiveArtifacts artifacts: "monocart-report-${env.REPORT_DATE}.zip", allowEmptyArchive: false
                        echo "✅ Download the report zip from Jenkins → Artifacts section"
                    } else {
                        echo "⚠️ No Monocart report found — skipping archive step."
                    }
                }
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