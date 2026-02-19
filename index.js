const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();

app.use(express.urlencoded({ extended: true }));
//доступ к файлам
app.use(express.static(__dirname));

//подключение к базе данных
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '0906', 
    database: 'restaurant_db'
});

// проверка подключения к базе данных
connection.connect(err => {
    if (err) {
        console.error('Ошибка подключения к базе: ' + err.message);
    } else {
        console.log('Успешно подключено к MySQL');
    }
});


app.post('/save', (req, res) => {
    const { fio, phone, email, guests, booking_date, comments } = req.body;
    
    const sql = `INSERT INTO bookings (name, phone, email, guests, booking_date, comments) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    
    connection.query(sql, [fio, phone, email, guests, booking_date, comments], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('<h1>Ошибка БД!</h1>');
        }
        // Страница после успешной записи
        res.send(`
            <div style="text-align: center; margin-top: 50px; font-family: Arial;">
                <h1>Заявка успешно принята!</h1>
                <p>Данные занесены в базу данных</p>
                <a href="/">Вернуться на главную</a>
            </div>
        `);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
});