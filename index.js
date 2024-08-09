const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const path = require('node:path');
const { mainModule } = require('node:process');
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
// publicディレクトリ以下のファイルを静的ファイルとして配信
app.use('/static', express.static(path.join(__dirname, 'public')));

const logMiddleware = (req, res, next) => {
  console.log(req.method, req.path);
  next();
}

app.get('/index.ejs', (req, res) => {
  res.render(path.resolve(__dirname, 'views/index.ejs'));
});

app.get('/contact.ejs', (req, res) => {
  res.render(path.resolve(__dirname, 'views/contact.ejs'));
});

app.get('/menu.ejs', (req, res) => {
  res.render(path.resolve(__dirname, 'views/menu.ejs'));
});

app.get('/news.ejs', (req, res) => {
  res.render(path.resolve(__dirname, 'views/news.ejs'));
});

app.post('/send-email', (req, res) => {
  const { name, email, password, message } = req.body;

  // nodemailerの設定を、フォームから受け取った情報で設定
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'wbccafe1101@gmail.com', // フォームから受け取った送信元メールアドレス
      pass: 'nnjzzvowqbmiloog' // 生成したアプリパスワードを使用
    }
  });

  const mailOptions = {
    from: `"${name}" <${email}>`, // フォームで入力された送信元メールアドレス
    to: 'wbccafe1101@gmail.com', // 固定された宛先メールアドレス
    subject: name, // フォームで入力された「お名前」を件名として使用
    text: message, // フォームで入力されたメッセージ
    replyTo: email // 返信先としてフォームで入力されたメールアドレスを使用
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Internal Server Error');
    } else {
      console.log('Email sent:', info.response);
      res.redirect('/contact.ejs');
    }
  });
});


app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

// ポート: 3000でサーバーを起動
app.listen(3000, () => {
  // サーバー起動後に呼び出されるCallback
  console.log('start listening');
});