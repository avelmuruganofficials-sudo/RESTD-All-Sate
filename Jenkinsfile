pipeline {
    agent any

    triggers {
        cron('0 10 * * *')   // Daily at 10 AM
    }

    options {
        timestamps()
        timeout(time: 3, unit: 'HOURS')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat '''
                    echo Installing Node packages...
                    npm ci

                    echo Installing Playwright browsers...
                    npx playwright install
                '''
            }
        }

        stage('Run Playwright Tests (CI Headless)') {
            steps {
                bat '''
                    echo Running Playwright Tests...
                    npx playwright test --workers=2 --reporter=html
                '''
            }
        }

        stage('Archive Playwright Reports & Evidence') {
            steps {

                echo "Archiving Playwright HTML Report..."
                archiveArtifacts artifacts: '''
                    playwright-report/**
                    test-results/**
                ''', allowEmptyArchive: true

                echo "Publishing HTML Report..."
                publishHTML(target: [
                    reportDir: 'playwright-report',
                    reportFiles: 'index.html',
                    reportName: 'Playwright Automation Report'
                ])
            }
        }
    }

    post {
        always {
            echo "Pipeline Finished. Reports and Evidence Saved."
        }

        failure {
            echo "Tests Failed. Please check screenshots, videos, and trace in Jenkins artifacts."
        }
    }
}
