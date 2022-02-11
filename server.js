const express = require('express');
const fs = require('fs');
const path = require('path');
const session = require('express-session');
const {
    check,
    oneOf,
    body,
    validationResult
} = require('express-validator');
const methodOverride = require('method-override');

const app = express();
let arr = [];
const showArr = [];
let showObj = {};
let myHTML
const PORT = process.env.PORT || 3000;
// let count;
let errorVal = '';
let title1 = '';
let body1 = '';
//Express middleware
app.use(express.static(__dirname));
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({
    extended: false
}))

// parse application/json
app.use(express.json())

app.use(methodOverride('_method'));
app.use(session({
    secret: 'krunal',
    saveUninitialized: false,
    resave: false
}));
app.get('/home', function (req, res) {
    let dataJson;
    const data = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), {
        encoding: "utf8"
    });
    if(data === '') {
        dataJson = [];
    } else {
        dataJson = JSON.parse(data);
        console.log('home', dataJson);
    }
    
    res.json({
        articles: dataJson
    });
})
app.get('/article', function (req, res) {
   
    res.json({
        'article': showObj
    });
})
app.get('/create/article', function (req, res) {
    res.redirect('/addArticle.html');
});
app.get('/show/article/:id', function (req, res) {
    const id = req.params.id;
    // let showObj;
    // console.log(arr[id - 1]);
    // showArr.push(arr[id - 1]);
    // console.log(showArr);
    const data = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), {
        encoding: "utf8"
    });
    let dataJson = JSON.parse(data);
    dataJson.forEach((value, index)=> {
        if(value.count == Number(id)) {
            showObj = value;
        }
    })
    // showObj = arr[id - 1];
    res.redirect('/showArticle.html');
})
app.get('/edit/article', function (req, res) {
    res.send(myHTML);
})
app.get('/edit/:id', function (req, res) {
    const id = req.params.id;
    let title;
    let body;
    console.log('editroute', id);
    const data = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), {
        encoding: "utf8"
    });
    let dataJson = JSON.parse(data);
    dataJson.forEach((value, index) => {
        if (value.count === Number(id)) {
            title = value.title;
            body = value.body;
        }
    })
    console.log('editbody', body);
    myHTML =
        `<form action="/update/article/${id}?_method=PUT" method="post">
    <input type="hidden" name="_method" value="PUT">
    <section class="form-group">
        <label for="title">title</label>
        <input type="text" class="form-control" id="title" name="title" value="${title}">
    </section>
    <section class="form-group">
        <textarea name="body" id="body" cols="30" rows="10" class="form-control">${body}</textarea>
    </section>
    <button type="submit" class="btn btn-block btn-info">Update</button>

    </form>`

    res.redirect('/editArticle.html');

    // res.send(myHTML);

})

app.get('/errors', function (req, res) {
    // const errorVal = req.session.errors
    const errorValues = errorVal;
    errorVal = '';
    res.json({
        errors: errorValues,
        title: title1,
        body: body1
    });
})
app.post('/post/article', [check('title', 'title must be filled').not().isEmpty(), check('body', 'body must be filled').not().isEmpty(), check('password', 'password must be filled').not().isEmpty(), check('confirm', 'confirm password must be filled').not().isEmpty(), check('confirm', 'passwords do not match').custom((value, {
        req
    }) => (value === req.body.password)

)], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errorVal = errors.array();
        title1 = req.body.title;
        body1 = req.body.body;
        res.redirect('/addArticle.html');

    } else {
        let jsonArr = [];
        // count++;
        let dataObj = {
            title: req.body.title,
            body: req.body.body,
            count: Date.now() * Math.random()
        }
        const data = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), {
            encoding: "utf8"
        });
        // arr.push(data);
        if (data === '') {
            jsonArr.push(dataObj);
            fs.writeFileSync(path.join(__dirname,'db', 'db.json'), JSON.stringify(jsonArr, null, 3, ));
            jsonArr.length = 0;
            jsonArr = [];
        } else {
            const dataJson = JSON.parse(data);
            dataJson.push(dataObj);
            fs.writeFileSync(path.join(__dirname,'db', 'db.json'), JSON.stringify(dataJson, null, 3, ));
        }
        res.redirect('/');
    }

})
app.put('/update/article/:id', function (req, res) {
    const id = req.params.id;
    console.log('reached Put route');
    const obj = {};
    console.log('initial', arr);
    // console.log(req.body);
    const title = req.body.title;
    const body = req.body.body;
    console.log('title', title);
    console.log('body', body);
    obj['count'] = Number(id);
    obj['title'] = title;
    obj['body'] = body;


    const data = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), {
        encoding: "utf8"
    });
    let dataJson = JSON.parse(data);
    dataJson.forEach((value, index) => {

        if (value.count == Number(id)) {
            dataJson.splice(index, 1, obj)
        }
    })
    fs.writeFileSync(path.join(__dirname,'db', 'db.json'), JSON.stringify(dataJson, null, 3, ));
    console.log('after', arr);
    res.redirect('/');
})
app.delete('/delete/:id', function (req, res) {
    // console.log('delete', arr);
    const id = req.params.id;
    console.log(id);

    const data = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), {
        encoding: "utf8"
    });
    let dataJson = JSON.parse(data);
    dataJson.forEach((value, index) => {
        if (value.count === Number(id)) {
            // count = value.count - 1;
            dataJson.splice(index, 1);
        }
    });
    // data = data.map((item, index) => {
    //     let obj = {};
    //     obj['count'] = index + 1;
    //     obj['title'] = item.title;
    //     obj['body'] = item.body;
    //     return obj;
    // })
    fs.writeFileSync(path.join(__dirname,'db', 'db.json'), JSON.stringify(dataJson, null, 3, ));
    // count = data.length;
    res.redirect('/');
    // res.send('<h1>Deleted</h1>')
})
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
})