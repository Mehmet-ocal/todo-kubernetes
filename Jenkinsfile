pipeline {
    agent any

    stages {
        stage('Kodu Çek (Checkout)') {
            steps {
                // SCM ayarımız sayesinde kodlar otomatik çekilecek
                echo 'Adım 1: Yeni kodlar GitHub deposundan başarıyla indirildi!'
            }
        }
        
        stage('Docker İmajını Derle') {
            steps {
                // İleride buraya: sh 'docker build -t todo-app .' yazacağız
                echo 'Adım 2: Docker imajı oluşturuluyor...'
            }
        }
        
        stage('Kubernetes\'e Dağıt') {
            steps {
                // İleride buraya: sh 'kubectl apply -f k8s/' yazacağız
                echo 'Adım 3: Yeni versiyon Kubernetes kümesine gönderildi ve yayına alındı!'
            }
        }
    }
}