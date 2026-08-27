pipeline {
    agent any
    
    // Çevresel değişkenlerimizi tanımlıyoruz
    environment {
        DOCKERHUB_USERNAME = "ocaltubitak" 
    }

    stages {
        stage('Kodu Çek (Checkout)') {
            steps {
                echo 'Adım 1: Yeni kodlar GitHub deposundan başarıyla indirildi!'
            }
        }
        
        stage('Docker İmajlarını Derle') {
            steps {
                echo 'Backend imajı derleniyor...'
                dir('backend') {
                    // İmaj ismini Docker Hub kullanıcı adınla etiketliyoruz
                    sh "docker build -t ${DOCKERHUB_USERNAME}/todo-kube-backend:latest ."
                }
                
                echo 'Frontend imajı derleniyor...'
                dir('frontend') {
                    sh "docker build -t ${DOCKERHUB_USERNAME}/todo-kube-frontend:latest ."
                }
            }
        }
        
        stage('Docker Hub\'a Gönder (Push)') {
            steps {
                echo 'Docker Hub\'a güvenli giriş yapılıyor ve imajlar gönderiliyor...'
                // Jenkins kasasındaki şifreleri geçici olarak çıkarıp kullanıyoruz
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh 'echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin'
                    
                    sh "docker push ${DOCKERHUB_USERNAME}/todo-kube-backend:latest"
                    sh "docker push ${DOCKERHUB_USERNAME}/todo-kube-frontend:latest"
                }
            }
        }
    }
}