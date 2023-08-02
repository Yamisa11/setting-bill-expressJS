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
    const newObject = settingsBill.actions().map(item => {
        return {
          type: item.type,
          cost: item.cost,
          timestamp: moment(item.timestamp).fromNow()
        }
    })
    
    res.render('actions', {actions: newObject})
})
app.get('/actions/:actionType', function(req,res){
const actionsType = req.params.actionType;

let actionss = settingsBill.actionsFor(actionsType);

const newObj = actionss.map(item => {
    return{
        type: item.type,
        cost: item.cost,
        timestamp: moment(item.timestamp).fromNow()  
    }
})

res.render('actions', {actions: newObj})
})

const PORT = process.env.PORT || 3012
app.listen(PORT, function(){
    console.log("App started at port : " + PORT )
})