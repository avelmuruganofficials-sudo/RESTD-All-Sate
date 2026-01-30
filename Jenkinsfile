pipeline {
    agent any

    tools {
        nodejs "NodeJS"
    }

    triggers {
        cron('30 10 * * *')   // Daily Morning 10:30 AM
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/yourusername/yourrepo.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '''
                    npm install
                '''
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat '''
                    npx playwright install
                '''
            }
        }

        stage('Run Playwright Tests (Headed Mode)') {
            steps {
                bat '''
                    npx playwright test --headed
                '''
            }
        }
    }

    post {

        success {
            emailext (
                subject: "✅ Playwright Test SUCCESS - Jenkins Build #${BUILD_NUMBER}",
                body: """
                    Hello Velmurugan,

                    Your Playwright Automation Test Run was SUCCESSFUL ✅

                    Job Name: ${JOB_NAME}
                    Build Number: ${BUILD_NUMBER}

                    Check Report in Jenkins Artifacts.

                    Thanks,
                    Jenkins
                """,
                to: "yourmail@gmail.com"
            )
        }

        failure {
            emailext (
                subject: "❌ Playwright Test FAILED - Jenkins Build #${BUILD_NUMBER}",
                body: """
                    Hello Velmurugan,

                    Your Playwright Automation Test Run FAILED ❌

                    Job Name: ${JOB_NAME}
                    Build Number: ${BUILD_NUMBER}

                    Please check Console Output for error.

                    Thanks,
                    Jenkins
                """,
                to: "yourmail@gmail.com"
            )
        }

        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }
    }
}
