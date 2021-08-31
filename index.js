const express = require('express')
const { Router } = require('express')
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const path = require('path');
const fs = require('fs');

mongoose.connect('mongodb://mongodb:27017/blog-db');
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const testShema = new mongoose.Schema({
    name:{
        type: String
    }
})

const testModel = mongoose.model('test', testShema)

// Create express instance
const app = express()
const router = Router()


app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(fileUpload());
app.use(express.static(path.join(__dirname, 'files')));


router
.get('/hello', async (req, res) => {

    res.send('im workin hard')

})
.get('/', async (req, res) => {

    const posts = await testModel.find()

    res.send(posts)

})
.post('/', async (req, res) => {

    const data = req.body

    let post = new testModel({
    ...data
    })

    await post.save()

    res.send(post)

})
.get('/uploads', async (req, res) => {

    fs.readdir(path.join(__dirname, 'files'), (err, files) => {

        console.log(files)
        res.send(files);

    });

})
.post('/upload', (req, res) => {

    const currentFile = req.files.file

    currentFile.mv(`${path.join(__dirname, 'files')}/${currentFile.name}`, function(err) {
        if (err){
            console.log(err)
            return res.status(500).send(err);
        }

        console.log(currentFile)
        res.send('File uploaded!');
    });

})

app.use(router)
 
const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(`API server listening on port ${port}`)
})