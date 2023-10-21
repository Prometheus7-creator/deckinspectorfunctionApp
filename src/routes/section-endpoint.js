"use strict";
var express = require('express');
var router = express.Router();
const ErrorResponse = require('../model/error');
var ObjectId = require('mongodb').ObjectId;
const newErrorResponse = require('../model/newError');
const SectionService = require("../service/sectionService");

require("dotenv").config();

router.route('/add')
.post(async function (req,res){
try{
var errResponse; 
// Get user input

const { name, exteriorelements, waterproofingelements,additionalconsiderations,
  additionalconsiderationshtml,visualreview,visualsignsofleak,furtherinvasivereviewrequired,conditionalassessment,
awe,eee,lbc,images,createdby,parentid,parenttype,unitUnavailable } = req.body;

// Validate user input
if (!(name&&parentid)) {
  errResponse = new ErrorResponse(400,"Name and parentid is required","");
  res.status(400).json(errResponse);
  return;
}
var creationtime= (new Date(Date.now())).toISOString();
var newSection = {
    "additionalconsiderations":additionalconsiderations,
    "additionalconsiderationshtml":additionalconsiderationshtml? additionalconsiderationshtml: "",
    "awe":awe, 
    "conditionalassessment":conditionalassessment,
    "createdat":creationtime,
    "createdby":createdby,
    "editedat":creationtime,
    "lasteditedby":createdby,
    "eee":eee,
    "exteriorelements":exteriorelements,
    "furtherinvasivereviewrequired":furtherinvasivereviewrequired.toLowerCase()==='true',
    "lbc": lbc,
    "name":name,
    "parentid": new ObjectId(parentid),
    "parenttype":parenttype,
    "visualreview":visualreview,
    "visualsignsofleak": visualsignsofleak.toLowerCase()==='true',
    "waterproofingelements":waterproofingelements,
    "images":images,
    "unitUnavailable": unitUnavailable,
    "isuploading":false,
} 
var result = await SectionService.addSection(newSection);    
if (result.reason) {
  return res.status(result.code).json(result);
}
if (result) {
  //console.debug(result);
  return res.status(201).json(result);
}
}
catch (exception) {
errResponse = new newErrorResponse(500, false, exception);
return res.status(500).json(errResponse);
}
});


router.route('/:id')
.get(async function(req,res){
  try{
    var errResponse;
    const sectionId = req.params.id;
    var result = await SectionService.getSectionById( sectionId);
    if (result.reason) {
      return res.status(result.code).json(result);
    }
    if (result) {
      //console.debug(result);
      return res.status(201).json(result);
    }
  }
  catch (exception) {
    errResponse = new newErrorResponse(500, false, exception);
    return res.status(500).json(errResponse);
  }
})

router.route('/:id')
.put(async function(req,res){
  try{
    var errResponse;
    const sectionId = req.params.id;
    const newData = req.body;
    if(newData.parentid){
      newData.parentid = new ObjectId(newData.parentid);
    }

    if(newData.furtherinvasivereviewrequired){
      newData.furtherinvasivereviewrequired = newData.furtherinvasivereviewrequired.toLowerCase()==='true'
    }
    if(newData.visualsignsofleak)
    {
      newData.visualsignsofleak = newData.visualsignsofleak.toLowerCase()==='true'
    }

    var result = await SectionService.editSetion(sectionId,newData);

    if (result.reason) {
      return res.status(result.code).json(result);
    }
    if (result) {
      //console.debug(result);
      return res.status(201).json(result);
    }
  }
  catch (exception) {
    errResponse = new newErrorResponse(500, false, exception);
    return res.status(500).json(errResponse);
  }
})
.delete(async function(req,res){
  try{
    var errResponse;
    const sectionId = req.params.id;
    var result = await SectionService.deleteSectionPermanently(sectionId);
    if (result.reason) {
      return res.status(result.code).json(result);
    }
    if (result) {
      //console.debug(result);
      return res.status(201).json(result);
    }
  }
  catch (exception) {
    errResponse = new newErrorResponse(500, false, exception);
    return res.status(500).json(errResponse);
  }
});

router.route('/:id/addimage')
.post(async function(req,res){
  try {
    var errResponse;
    const sectionId = req.params.id;
    const {url} = req.body;
    var result = await SectionService.addImageInSection(sectionId,url);
    if (result.reason) {
      return res.status(result.code).json(result);
    }
    if (result) {
      //console.debug(result);
      return res.status(201).json(result);
    }
  }
  catch (exception) {
    errResponse = new newErrorResponse(500, false, exception);
    return res.status(500).json(errResponse);
  }
});

router.route('/:id/removeimage')
.post(async function(req,res){
  try {
    var errResponse;
    const sectionId = req.params.id;
    const {url} = req.body
    var result = await SectionService.removeImageFromSection(sectionId,url);
    if (result.reason) {
      return res.status(result.code).json(result);
    }
    if (result) {
      //console.debug(result);
      return res.status(201).json(result);
    }
  }
  catch (exception) {
    errResponse = new newErrorResponse(500, false, exception);
    return res.status(500).json(errResponse);
  }
});

//TODO Umesh to delete 
// router.route('/:id/toggleVisibility/')
// .post(async function(req,res){
//   try {
//     var errResponse;
//     const locationId = req.params.id;
//     const {parentId,isVisible,name} = req.body;
    
//     var result = await sections.updateSectionVisibilityStatus(locationId,name,parentId,isVisible);
//     if(result.error){
//         res.status(result.error.code).json(result.error);
//     }
//     if(result.data){
//       //console.debug(result);                                          
//       res.status(result.data.code).json(result.data);
//     }
//   } catch (error) {
//     errResponse = new ErrorResponse(500, "Internal server error", error);
//       res.status(500).json(errResponse);
//   }
// });

router.route('/getSectionById')
  .post(async function(req, res) {
    try {
      const sectionId = req.body.sectionid; // Use req.body instead of req.params
      const userName = req.body.username; // Use req.body instead of req.params

      const result = await SectionService.getSectionById(sectionId);

      if (result.reason) {
        return res.status(result.code).json(result);
      }
      if (result) {
        //console.debug(result);
        return res.status(201).json(result);
      }
    }
    catch (exception) {
      const errResponse = new newErrorResponse(500, false, exception);
      return res.status(500).json(errResponse);
    }
  });

router.route('/getSectionsByParentId')
.post(async function(req,res){
try{
  var errResponse;
  const parentId = req.body.parentid;
  const username = req.body.username;
  var result = await SectionService.getSectionsByParentId(parentId);
  if (result.reason) {
    return res.status(result.code).json(result);
  }
  if (result) {
    //console.debug(result);
    return res.status(201).json(result);
  }
}
catch (exception) {
  errResponse = new newErrorResponse(500, false, exception);
  return res.status(500).json(errResponse);
}
})



module.exports = router ;
