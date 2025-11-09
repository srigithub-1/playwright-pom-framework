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
                call "C:\\Program Files\\nodejs\\npx.cmd" playwright test --reporter="list, html"
                call "C:\\Program Files\\nodejs\\npx.cmd" playwright show-report --report-dir=playwright-report-%REPORT_DATE%
                exit /b 0
                """
            }
        }

        stage('Package & Archive Playwright Report') {
            steps {
                script {
                    echo "📊 Locating latest Playwright report and packaging it..."

                    def reportFolder = bat(
                        script: '@for /f "delims=" %%i in (\'dir /b /ad /o-d playwright-report-*\') do @echo %%i & goto :done\n:done',
                        returnStdout: true
                    ).trim()

                    if (!reportFolder) {
                        echo "⚠️ No Playwright report folder found. Skipping archive."
                        return
                    }

                    echo "✅ Latest report folder: ${reportFolder}"

                    bat """
                    powershell -NoLogo -NoProfile -Command ^
                      "Compress-Archive -Path '${reportFolder}\\*' -DestinationPath 'playwright-report-${env.REPORT_DATE}.zip' -Force"
                    """

                    archiveArtifacts artifacts: "playwright-report-${env.REPORT_DATE}.zip, test-results/**, screenshots/**",
                                     allowEmptyArchive: false

                    echo "📥 Download from build artifacts: playwright-report-${env.REPORT_DATE}.zip"
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
