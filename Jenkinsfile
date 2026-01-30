pipeline {
    agent any
     options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
    }

    tools {
        nodejs "Node18"
    }

    triggers {
        cron('30 10 * * *')   // Daily 10:30 AM
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/avelmuruganofficials-sudo/RESTD-All-Sate.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                bat 'npx playwright test --headed --reporter=html'
            }
        }
    }

    post {

        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
        }

        success {
            emailext(
                subject: "✅ Playwright SUCCESS - Build #${BUILD_NUMBER}",
                body: """
Hello Velmurugan,

Your Playwright Test Run was SUCCESSFUL ✅

Report Link:
${BUILD_URL}artifact/playwright-report/index.html

Regards,
Jenkins
""",
                to: "a.velmuruganofficials@gmail.com"
            )
        }

        failure {
            emailext(
                subject: "❌ Playwright FAILED - Build #${BUILD_NUMBER}",
                body: """
Hello Velmurugan,

Your Playwright Test Run FAILED ❌

Console Output:
${BUILD_URL}console

HTML Report:
${BUILD_URL}artifact/playwright-report/index.html

Screenshots/Videos:
${BUILD_URL}artifact/test-results/

Regards,
Jenkins
""",
                to: "a.velmuruganofficials@gmail.com",
                attachmentsPattern: "test-results/**"
            )
        }
    }
}
