
pipeline {
    agent any
    environment {
        NODE_VERSION = '24.x'
    }
    triggers {
        cron('0 10 * * *')   // Runs daily at 10 AM
    }
    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
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
                    npm ci
                    npx playwright install
                '''
            }
        }
        stage('Run Playwright Tests (Headed)') {
            steps {
                bat '''
                    npx playwright test --workers=4 --reporter=html || exit /b %ERRORLEVEL%
                '''
            }
        }
        stage('Run Tests (Headed)') {
      steps {
         bat 'npm install'
        sh '''
          Xvfb :99 -screen 0 1280x720x24 &
          export DISPLAY=:99
          npx playwright test --workers=1
        '''
      }
    }
        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
                junit 'playwright-report/**/*.xml'
            }
        }
    }
    post {
         always {

            publishHTML(target: [
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright HTML Report'
            ])
        }
    }
}


