import express from 'express'
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser'
import SettingsBill from './setting.js';
import moment from 'moment';

const app = express()

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
var  settingsBill = SettingsBill()
moment().format();
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
    let actionss = settingsBill.actions()
    
    for (let i = 0; i < actionss.length; i++) {
      
        actionss[i].timestamp = moment(actionss[i].timestamp).fromNow();
    }

    res.render('actions', {actions: actionss})
})
app.get('/actions/:actionType', function(req,res){
const actionsType = req.params.actionType;

let actionss = settingsBill.actionsFor(actionsType);

for (let i = 0; i < actionss.length; i++) {
    
    actionss[i].timestamp = moment(actionss[i].timestamp).fromNow();
}
res.render('actions', {actions: actionss})
})

const PORT = process.env.PORT || 3012
app.listen(PORT, function(){
    console.log("App started at port : " + PORT )
})