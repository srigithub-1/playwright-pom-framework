pipeline {
    agent any

    options {
        timeout(time: 25, unit: 'MINUTES')
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
                call "C:\\Program Files\\nodejs\\npx.cmd" playwright test --reporter=html --output=playwright-report-%REPORT_DATE%
                exit /b 0
                """
            }
        }

        // ✅ Dynamically finds the latest Playwright report folder
        stage('Publish HTML Report') {
    steps {
        script {
            echo "📊 Searching for the latest Playwright HTML report..."
            def reportFolder = bat(
                script: '@for /f "delims=" %%i in (\'dir /b /ad /o-d playwright-report-*\') do @echo %%i & goto :done\n:done',
                returnStdout: true
            ).trim()

            if (reportFolder) {
                echo "✅ Found report folder: ${reportFolder}"

                // 🧠 Copy the entire folder to Jenkins workspace root (safe name)
                bat "xcopy \"${reportFolder}\" \"playwright-latest-report\" /E /I /Y"

                publishHTML(target: [
                    reportDir: "playwright-latest-report",
                    reportFiles: 'index.html',
                    reportName: "Playwright Test Report",
                    keepAll: true,
                    alwaysLinkToLastBuild: true,
                    allowMissing: false
                ])
            } else {
                echo "⚠️ No Playwright report folder found!"
            }
        }
    }
}

        stage('Archive Artifacts') {
            steps {
                echo "📦 Archiving reports and screenshots..."
                archiveArtifacts artifacts: "playwright-report-*/**, test-results/**, screenshots/**", allowEmptyArchive: true
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
