pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = "ocaltubitak"
    }

    stages {

        stage('Kodu Hazırla') {
            steps {
                script {
                    // Jenkins zaten Git repository'yi checkout etmiş oluyor.
                    // Burada mevcut commit'in kısa SHA değerini alıyoruz.
                    env.IMAGE_TAG = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()

                    echo "Bu build için image tag: ${env.IMAGE_TAG}"
                }
            }
        }

        stage('Docker İmajlarını Derle') {
            steps {

                echo "Backend imajı derleniyor: ${IMAGE_TAG}"

                dir('backend') {
                    sh """
                        docker build \
                        -t ${DOCKERHUB_USERNAME}/todo-kube-backend:${IMAGE_TAG} \
                        -t ${DOCKERHUB_USERNAME}/todo-kube-backend:latest \
                        .
                    """
                }

                echo "Frontend imajı derleniyor: ${IMAGE_TAG}"

                dir('frontend') {
                    sh """
                        docker build \
                        -t ${DOCKERHUB_USERNAME}/todo-kube-frontend:${IMAGE_TAG} \
                        -t ${DOCKERHUB_USERNAME}/todo-kube-frontend:latest \
                        .
                    """
                }
            }
        }

        stage('Docker Hub\'a Gönder') {
            steps {

                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        passwordVariable: 'DOCKER_PASSWORD',
                        usernameVariable: 'DOCKER_USERNAME'
                    )
                ]) {

                    sh '''
                        echo "$DOCKER_PASSWORD" | \
                        docker login -u "$DOCKER_USERNAME" --password-stdin
                    '''

                    // SHA tag
                    sh "docker push ${DOCKERHUB_USERNAME}/todo-kube-backend:${IMAGE_TAG}"
                    sh "docker push ${DOCKERHUB_USERNAME}/todo-kube-frontend:${IMAGE_TAG}"

                    // latest tag
                    sh "docker push ${DOCKERHUB_USERNAME}/todo-kube-backend:latest"
                    sh "docker push ${DOCKERHUB_USERNAME}/todo-kube-frontend:latest"
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
    }
}