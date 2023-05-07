var express = require('express');
var router = express.Router();

const mongoose = require('mongoose')
const {dbUrl, dbName} = require('../config/dbConfig')
const {UrlModel} = require('../schema/urlSchema')
const {hashPassword,hashCompare,createToken,decodeToken,validate,roleAdmin} = require('../config/auth')
mongoose.connect(dbUrl)

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/home', async (req, res)=>{
  try {
    let allUrl =  await UrlModel.find()
    res.status(200).send({
    allUrl
  })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:"Internal Server Error",
      error
    })
  }
     
  
});


router.post('/create', async(req, res)=>{
  console.log(req.body)
  try {
    let shortUrl = generateUrl()
    let urlShort = new UrlModel({
      longUrl: req.body.longUrl,
      shortUrl: shortUrl
    })
    await urlShort.save()
     res.status(201).send({
    message:"Short URL Created Successfully",
    shortUrl
  })
  } catch (error) {
    console.log(error)
    res.status(500).send({
      message:"Internal Server Error",
      error
    })
  }


});


router.get('/:url',async function(req, res) {
  let shortUrl = req.params.url
  try{
    console.log(shortUrl)
        const data = await UrlModel.findOne({shortUrl:shortUrl})
        console.log(data.clickCount)
        if(data){
            data.clickCount = data.clickCount + 1;
            await data.save();
            res.redirect(data.longUrl)
            
        }else{
            return res.status(404).json({
                message : "URL not found"
            })
        }
    }catch(error){
        console.log(error)
        res.status(500).send({
          message:"Internal Server Error",
          error
    })
    }
  
});

// router.delete('/delete/:id',async(req,res)=>{
//   try {
//     let deleteUrl = UrlModel.findByIdAndDelete({_id:req.params.id})
//     console.log(deleteUrl)
//   } catch (error) {
    
//   }
// })

function generateUrl() {
  var rndResult = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;

  for (var i = 0; i < 5; i++) {
      rndResult += characters.charAt(
          Math.floor(Math.random() * charactersLength)
      );
  }
  console.log(rndResult)
  return rndResult
}

module.exports = router;
