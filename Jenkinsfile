pipeline {
    agent any

    environment {
        NODE_HOME = "C:\\Program Files\\nodejs"
        SYS_PATH  = "C:\\Windows\\System32"
        PATH = "${SYS_PATH};${NODE_HOME};${PATH}"
        REPORT_DATE = powershell(script: '(Get-Date).ToString("yyyy-MM-dd_HH-mm-ss")', returnStdout: true).trim()
    }

    stages {

        stage('Clean Workspace') {
            steps {
                echo "🧹 Cleaning old results..."
                bat 'if exist allure-results rmdir /s /q allure-results'
                bat 'if exist allure-report rmdir /s /q allure-report'
                bat 'for /d %%G in (playwright-report*) do rmdir /s /q "%%G"'
            }
        }

        stage('Checkout') {
            steps {
                echo "📦 Checking out project..."
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "📥 Installing dependencies..."
                bat '"C:\\Program Files\\nodejs\\npm.cmd" ci --no-fund --no-audit --loglevel=error'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                echo "🚀 Running Playwright tests (with Allure)..."
                bat '"C:\\Program Files\\nodejs\\npx.cmd" playwright test --reporter=list --reporter=html --reporter=allure-playwright'
            }
        }

        stage('Generate Allure Report') {
            steps {
                echo "📊 Generating Allure report..."
                bat '"C:\\Users\\USER\\AppData\\Roaming\\npm\\allure.cmd" generate allure-results --clean -o allure-report'
            }
        }

        stage('Archive Allure Report') {
            steps {
                echo "📦 Archiving Allure report..."
                archiveArtifacts artifacts: 'allure-report/**', allowEmptyArchive: true
            }
        }
    }

    post {
        always {
            echo "✅ Pipeline finished."
            bat 'taskkill /IM node.exe /F || exit 0'
        }
        success {
            echo "🎉 Tests Passed!"
        }
        failure {
            echo "❌ Tests Failed!"
        }
    }
}
