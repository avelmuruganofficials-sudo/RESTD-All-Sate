pipeline {
    agent any

    tools {
        nodejs "NodeJS"
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

        stage('Generate HTML Report') {
            steps {
                bat '''
                    npx playwright show-report
                '''
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }
    }
}
