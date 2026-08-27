pipeline {
    agent any

    stages {
        stage('Kodu Çek (Checkout)') {
            steps {
                echo 'Adım 1: Yeni kodlar GitHub deposundan başarıyla indirildi!'
            }
        }
        
        stage('Docker İmajlarını Derle') {
            steps {
                echo 'Docker Daemon yetkisi test ediliyor...'
                // Asıl yetki kontrolü bu komutla yapılır:
                sh 'docker info'
                
                echo 'Backend imajı derleniyor...'
                dir('backend') {
                    // backend klasörüne girip derler
                    sh 'docker build -t todo-backend:latest .'
                }
                
                echo 'Frontend imajı derleniyor...'
                dir('frontend') {
                    // frontend klasörüne girip derler
                    sh 'docker build -t todo-frontend:latest .'
                }
            }
        }
        
        stage('Kubernetes\'e Dağıt') {
            steps {
                echo 'Adım 3: İleride yeni versiyon Kubernetes kümesine gönderilecek!'
            }
        }
    }
}