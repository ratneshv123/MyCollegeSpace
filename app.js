require('dotenv').config()
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
// const session = require('express-session');
const home = require('./routes/home');
const register = require('./routes/register');
const fs = require('fs');
const bufferFrom = require('buffer-from');
const multer = require('multer');
const db = require('./db/db');
const test = require('./routes/test');
const userpapers = require('./routes/papers/userpapers');
const findthepaper = require('./routes/papers/findthepaper');  
const usertimetable = require('./routes/timetable/usertimetable');
const userbooks = require('./routes/books/userbooks');
const notesof = require('./routes/notes/notesof');
const userrequests = require('./routes/allrequests/userrequests');
const mcafirst = require('./routes/papers/MCA/MCAFIRST/mcafirst');
const mcasecond = require('./routes/papers/MCA/MCASECOND/mcasecond');
const mcathird = require('./routes/papers/MCA/MCATHIRD/mcathird');
const mcafourth = require('./routes/papers/MCA/MCAFOURTH/mcafourth');
const mcafifth = require('./routes/papers/MCA/MCAFIFTH/mcafifth');
const mcasixth = require('./routes/papers/MCA/MCASIXTH/mcasixth');
const adminlog = require('./routes/admin/adminloginpanel');
//adminpaper
const updownallpapers = require('./routes/admin/welcome/updownpapers/updownallpapers');
const updownalltimetable = require('./routes/admin/welcome/updowntimetable/updownalltimetable');
const updownallbooks = require('./routes/admin/welcome/updownbooks/updownallbooks');
const updownallnotes = require('./routes/admin/welcome/updownnotes/updownallnotes');
const updownalluserrequest = require('./routes/admin/welcome/updownuserrequest/updownalluserrequest');
const yourprofile = require('./routes/yourprofile');
const yourspace = require('./routes/yourspace');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));
//set view engine ejs
app.set('view engine', 'ejs');
app.use('/', home); 
app.use(test);
app.use(userpapers);
app.use(usertimetable);
app.use(userbooks);
app.use(userrequests);
app.use(notesof);
app.use(mcafirst);
app.use(mcasecond);
app.use(mcathird);
app.use(mcafourth);
app.use(mcafifth);
app.use(mcasixth);
app.use(register);
app.use(adminlog);
app.use(updownallpapers);
app.use(updownalltimetable);
app.use(findthepaper);
app.use(updownallbooks);
app.use(updownallnotes);
app.use(updownalluserrequest);
app.use(yourprofile);
app.use(yourspace);


const port = process.env.PORT || 3000;
app.listen(port, ()=> {
    console.log(`listing on port ${port}`);
});