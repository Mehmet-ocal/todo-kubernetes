const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Veritabanı bağlantısı
const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'tododb',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Tabloyu otomatik oluştur
db.query(`
    CREATE TABLE IF NOT EXISTS todos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        task VARCHAR(255) NOT NULL,
        completed BOOLEAN DEFAULT false
    )
`, (err) => {
    if (err) {
        console.error('Tablo oluşturma hatası:', err);
    } else {
        console.log('Todos tablosu hazır.');
    }
});


// ----------------------------------------------------
// HEALTH CHECK
// ----------------------------------------------------

app.get('/health', (req, res) => {
    db.query('SELECT 1', (err) => {
        if (err) {
            return res.status(503).json({
                status: 'error',
                database: 'down'
            });
        }

        res.json({
            status: 'ok',
            database: 'up'
        });
    });
});


// ----------------------------------------------------
// TÜM GÖREVLERİ GETİR
// ----------------------------------------------------

app.get('/api/todos', (req, res) => {
    db.query(
        'SELECT * FROM todos ORDER BY id DESC',
        (err, results) => {
            if (err) {
                console.error('Listeleme hatası:', err);
                return res.status(500).json({
                    message: 'Görevler alınamadı.'
                });
            }

            res.json(results);
        }
    );
});


// ----------------------------------------------------
// YENİ GÖREV EKLE
// ----------------------------------------------------

app.post('/api/todos', (req, res) => {

    const task = req.body.task?.trim();

    if (!task) {
        return res.status(400).json({
            message: 'Görev boş olamaz.'
        });
    }

    if (task.length > 255) {
        return res.status(400).json({
            message: 'Görev en fazla 255 karakter olabilir.'
        });
    }

    db.query(
        'INSERT INTO todos (task) VALUES (?)',
        [task],
        (err, result) => {

            if (err) {
                console.error('Ekleme hatası:', err);

                return res.status(500).json({
                    message: 'Görev eklenemedi.'
                });
            }

            res.status(201).json({
                id: result.insertId,
                task,
                completed: false
            });
        }
    );
});


// ----------------------------------------------------
// GÖREV DURUMUNU GÜNCELLE
// ----------------------------------------------------

app.patch('/api/todos/:id', (req, res) => {

    const { id } = req.params;
    const { completed } = req.body;

    if (typeof completed !== 'boolean') {
        return res.status(400).json({
            message: 'completed alanı boolean olmalıdır.'
        });
    }

    db.query(
        'UPDATE todos SET completed = ? WHERE id = ?',
        [completed, id],
        (err, result) => {

            if (err) {
                console.error('Güncelleme hatası:', err);

                return res.status(500).json({
                    message: 'Görev güncellenemedi.'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Görev bulunamadı.'
                });
            }

            res.json({
                id: Number(id),
                completed
            });
        }
    );
});


// ----------------------------------------------------
// TAMAMLANAN GÖREVLERİ TEMİZLE
// Bu route /:id route'undan önce olmalı.
// ----------------------------------------------------

app.delete('/api/todos/completed', (req, res) => {

    db.query(
        'DELETE FROM todos WHERE completed = true',
        (err, result) => {

            if (err) {
                console.error('Toplu silme hatası:', err);

                return res.status(500).json({
                    message: 'Tamamlanan görevler silinemedi.'
                });
            }

            res.json({
                message: 'Tamamlanan görevler temizlendi.',
                deleted: result.affectedRows
            });
        }
    );
});


// ----------------------------------------------------
// TEK GÖREV SİL
// ----------------------------------------------------

app.delete('/api/todos/:id', (req, res) => {

    const { id } = req.params;

    db.query(
        'DELETE FROM todos WHERE id = ?',
        [id],
        (err, result) => {

            if (err) {
                console.error('Silme hatası:', err);

                return res.status(500).json({
                    message: 'Görev silinemedi.'
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: 'Görev bulunamadı.'
                });
            }

            res.json({
                message: 'Görev başarıyla silindi.'
            });
        }
    );
});


// ----------------------------------------------------
// SERVER
// ----------------------------------------------------

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Backend ${PORT} portunda çalışıyor.`);
});