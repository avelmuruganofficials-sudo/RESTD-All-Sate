pipeline {
    agent any

    tools {
        nodejs 'Node18'
    }

    options {
        timestamps()
        timeout(time: 1, unit: 'HOURS')
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

        stage('Run Specs in Parallel') {
            parallel {

                stage('ACSDT Spec') {
                    steps {
                        bat 'npx playwright test "tests/ACSDT_All_state.spec.js"'
                    }
                }

                stage('RESTD Spec') {
                    steps {
                        bat 'npx playwright test "tests/RESTD_All_State.spec.js"'
                    }
                }

            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true
        }
    }
}
