pipeline {
    agent any

    stages {
        stage('Kodu Çek (Checkout)') {
            steps {
                echo 'Adım 1: Yeni kodlar GitHub deposundan başarıyla indirildi!'
            }
        }
        
        // YENİ EKLENEN ADIM: Gerçek Linux komutları çalıştırıyoruz!
        stage('Sistem Kontrolü') {
            steps {
                echo 'Proje dosyaları listeleniyor:'
                sh 'ls -la'
                
                echo 'Docker kurulu mu diye bakıyoruz:'
                sh 'docker --version || echo "Docker komutu henüz yetkilendirilmedi!"'
            }
        }
        
        stage('Docker İmajını Derle') {
            steps {
                echo 'Adım 3: İleride burada Docker imajı oluşturulacak...'
            }
        }
        
        stage('Kubernetes\'e Dağıt') {
            steps {
                echo 'Adım 4: İleride yeni versiyon Kubernetes kümesine gönderilecek!'
            }
        }
    }
}