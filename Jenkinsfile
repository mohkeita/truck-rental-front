pipeline {
    agent any

    environment {
        IMAGE_NAME     = 'truck-rental-front'
        CONTAINER_NAME = 'truck-rental-front'
        HOST_PORT      = '80'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:latest ."
            }
        }

        stage('Deploy') {
            steps {
                sh """
                    docker stop ${CONTAINER_NAME} 2>/dev/null || true
                    docker rm ${CONTAINER_NAME} 2>/dev/null || true
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        --restart unless-stopped \
                        -p ${HOST_PORT}:80 \
                        ${IMAGE_NAME}:latest
                """
            }
        }
    }

    post {
        success {
            echo 'Frontend deployment successful'
        }
        failure {
            echo 'Frontend build or deployment failed'
        }
    }
}
