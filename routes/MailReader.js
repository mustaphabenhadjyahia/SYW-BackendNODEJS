var express = require('express');
var router = express.Router();
var mailReaderController = require('../Controllers/MailReaderController');

/*  G E T   h o m e   p a g e .  */
router.get('/', mailReaderController.getInfosFromEmail);
router.get('/itemInfos',  mailReaderController.getItemInfosFromEmail);
router.get('/nbEmailsConfirmation', mailReaderController.getnbofRetailsEmails);
router.post('/getImgsOfItems',mailReaderController.getImagesResponse );


module.exports = router;
