pipeline {
    agent any

    environment {
        NODE_HOME = "C:\\Program Files\\nodejs"
        SYS_PATH  = "C:\\Windows\\System32"
        PATH = "${SYS_PATH};${NODE_HOME};${PATH}"
        REPORT_DATE = powershell(script: '(Get-Date).ToString("yyyy-MM-dd_HH-mm-ss")', returnStdout: true).trim()
    }

    stages {

        // 🧹 Clean old files before new build
       stage('Clean Workspace') {
    steps {
        echo "🧹 Cleaning old reports and node_modules..."

        // ✅ Corrected loop: use %%G inside Jenkinsfile bat blocks
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
            steps {
                echo "📥 Installing npm packages..."
                bat '"C:\\Program Files\\nodejs\\npm.cmd" install --no-fund --no-audit --loglevel=error'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                echo "🌐 Installing Playwright browsers..."
                bat '"C:\\Program Files\\nodejs\\npx.cmd" playwright install --with-deps'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                echo "🚀 Running Playwright tests..."
                bat "\"C:\\Program Files\\nodejs\\npx.cmd\" playwright test --reporter=html --output=playwright-report-%REPORT_DATE%"
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

        stage('Publish Allure Report') {
    steps {
        echo "📊 Generating and Publishing Allure Report..."
        bat '"C:\\Program Files\\nodejs\\npx.cmd" allure generate allure-results --clean -o allure-report'
        allure([
            includeProperties: false,
            jdk: '',
            results: [[path: 'allure-results']],
            reportBuildPolicy: 'ALWAYS'
        ])
    }
}

        stage('Archive Artifacts') {
            steps {
                echo "📦 Archiving test results and screenshots..."
                archiveArtifacts artifacts: "playwright-report-${env.REPORT_DATE}/**, test-results/**, screenshots/**", allowEmptyArchive: true
            }
        }

        
    }

    post {
        always {
            echo "✅ Pipeline finished (success or failure)."
        }
        success {
            echo "🎉 Playwright Tests Passed!"
        }
        failure {
            echo "❌ Playwright Tests Failed!"
        }
    }
}
