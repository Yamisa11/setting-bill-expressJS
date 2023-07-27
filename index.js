import express from 'express'
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser'
import SettingsBill from './setting.js';
const app = express()
var  settingsBill = SettingsBill()

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

app.get('/', function(req,res){
    res.render("index",{
        updateSettings: settingsBill.getSettings(),
        totals: settingsBill.totals(),
        warningLevel : settingsBill.hasReachedWarningLevel(),
        criticalLevel: settingsBill.hasReachedCriticalLevel()
    })
})

app.post('/settings', function(req,res){
    settingsBill.setSettings({
        callCost: req.body.callCost,
        smsCost : req.body.smsCost,
        warningLevel: req.body.warningLevel,
        criticalLevel : req.body.criticalLevel
    })
    console.log(settingsBill.getSettings())
     res.redirect('/')
    
})
app.post('/action', function(req,res){
    settingsBill.recordAction(req.body.actionType);
    res.redirect('/')
})
app.get('/actions', function(req,res){
    res.render('actions', {actions: settingsBill.actions()})
})
app.get('/actions/:actionType', function(req,res){
const actionType = req.params.actionType
res.render('actions', {actions: settingsBill.actionsFor(actionType)})
})

const PORT = process.env.PORT || 3011
app.listen(PORT, function(){
    console.log("App started at port : " + PORT )
})