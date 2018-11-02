const express = require('express')
const bodyParser = require('body-parser');
let path = require('path')
let fs = require('fs')
const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
 }));

// parse application/json
app.use(bodyParser.json());

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
})

app.get('/userList', function (req, res) {
  res.json({
    msg: "获取成功",
    code: 200,
    data: {
      userName: '15254323904',
      nickName: '周迅',
      id: 1,
      sign: "平凡一生",
      sex: 0,
      birth: "1995-03-03",
      portrait: "http://img.jsqq.net/uploads/allimg/150129/1-1501292112240-L.jpg"
    }
  });
})

app.get('/getFriendsList', function (req, res) {
  var file = path.join(__dirname, 'data/friendsList.json')
  //读取json文件
  fs.readFile(file, 'utf-8', function (err, data) {
    if (err) {
      res.send('文件读取失败');
    } else {
      res.json({
        msg: "获取成功",
        code: 200,
        data: JSON.parse(data)
      });
    }
  })
})

app.post('/record', function (req, res) {
  // var file = path.join(__dirname, 'data/record.json')
  // //读取json文件
  // fs.readFile(file, 'utf-8', function (err, data) {
  //   if (err) {
  //     res.send('文件读取失败');
  //   } else {
  //     var item = req.body.data;
  //     data = JSON.parse(data)
  //     data[item.id].push(item)
  //     fs.writeFile(file, JSON.stringify(data) , function () {
  //       res.json({
  //         msg: "添加成功",
  //         code: 200,
  //         data: []
  //       });
  //     })
  //   }
  // })
  res.json({
    msg: "添加成功",
    code: 200,
    data: []
  });
})

var server = app.listen(4321, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Server running at http://%s:%s', host, port);
})
