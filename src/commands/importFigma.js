const { app } = require("indesign");
//
//
const isImageExist = async (path, name) => {
  try {
     const folder = await fsProvider.getEntryWithUrl(path); // update the path based on your system
     const file = await folder.getEntry(name); // update the path based on your system
     return file.isFile
  }catch(fileError) {
    return false
  }
}

//
const importFigma = async (path, filename) => {
  // Set up
  var myDocument = app.activeDocument;
  var myJSONData = await readFile(path+filename);

  //var myJSON     = await readFileSimple(path+filename);
  //var myJSONData = JSON.parse(myJSON);

  // Loop through JSON data
  for(var i = 0; i < myJSONData.length; i++) {

    // Create layer
    // var newLayer = myDocument.layers.add();
    // newLayer.name = myJSONData[i].name;

    // Check if image or text
    let entry = myJSONData[i];
    entry.filename = name;
    //
    // TBI if image file exists, we place it to InDesign
    //
    // if (isImageExist(path, entry.filename)){
    //
    if (entry.hasOwnProperty('exportSettings') && entry.exportSettings.length > 0 ){

      entry.type = entry.filename.indexOf("_IdT") > 0?"text":"image";
      console.log(entry.filename, entry.type, entry.filename.indexOf("_IdT"));
      if(entry.type == "image") {

      // Place image
      // var imageFile = File(myJSONData[i].file);
      // var imageRect = [myJSONData[i].x, myJSONData[i].y, myJSONData[i].w, myJSONData[i].h];
      // newLayer.place(imageFile, imageRect);

      placeGraphic(path+entry.filename, entry.top, entry.left, entry.width, entry.height);

      } else if(entry.type == "text") {

        // Create text
        // var textRect = [myJSONData[i].x, myJSONData[i].y, myJSONData[i].w, myJSONData[i].h];
        // var textFrame = myDocument.pages[0].textFrames.add(textRect);
        // textFrame.contents = myJSONData[i].content;
        // textFrame.parentStory.move(newLayer);

        addTextFrame(entry.filename, entry.top, entry.left, entry.width, entry.height);

      }
    }
  }
}

const fsProvider = require('uxp').storage.localFileSystem;
const myJson = "/Users/ymmtny/Documents/GitHub/InDesignFigmaSample/InDesign/myScript/react-starter/src/commands/data.json";
//
//
//
const readFileSimple = async (path) =>{
    // {
    //   "filename": "01-2.png",
    //   "width": 356,
    //   "height": 196,
    //   "top": 226,   -- x
    //   "left": 795   -- y
    // },

    // Access other location
    if (fsProvider.isFileSystemProvider) {
      try {
          const file = await fsProvider.getEntryWithUrl("file:"+path); // update the path based on your system
          console.log(`File path: ${file.nativePath}`);
          const text = await file.read();
            console.log(`File content: ${text}`);
          return text;

      } catch (e) {
          console.error(e);
      }
  }
}

const readFile = async (path) =>{
  // need to interate children
  // {
  //   "id": "269:76966",
  //   "name": "01-2",
  //   "type": "GROUP",
  //   "visible": true,
  //   "locked": false,
  //   "style": {
  //     "blendMode": "PASS_THROUGH",
  //     "opacity": 1,
  //     "effects": [],
  //     "x": 795,
  //     "y": 226,
  //     "absoluteBoundingBox": {
  //       "x": -14302,
  //       "y": 1843,
  //       "width": 356,
  //       "height": 196
  //     }
  //   },
  //   "children": [
  //     {}

  let result = [];
  // Access other location
  if (fsProvider.isFileSystemProvider) {
    try {
        const file = await fsProvider.getEntryWithUrl("file:"+path); // update the path based on your system
        console.log(`File path: ${file.nativePath}`);
        const text = await file.read();
        const myJSONData = JSON.parse(text);
        //
        const parser = (node)=>{
          //console.log(node.children); // node.children.length)
          node.children.forEach((entry) =>{
            let data = {};
            if(entry.style.hasOwnProperty('exportSettings') && entry.style.exportSettings.length>0){
              data.name = entry.name
              data.left = entry.style.x
              data.top = entry.style.y
              data.width = entry.style.absoluteBoundingBox.width
              data.height = entry.style.absoluteBoundingBox.height
              result.push(data);
            }
            if (entry.hasOwnProperty('children') && entry.children.length > 0){
              parser(entry)
            }
          })
        }
        //
        parser(myJSONData);
        console.log(JSON.stringify(result));
        return result;

    } catch (e) {
        console.error(e);
    }
}
}

//const path = "/Users/ymmtny/Documents/GitHub/InDesignFigmaSample/InDesign/myScript/react-starter/src/commands/490.png";
//
//
//
const placeGraphic = (path, top, left,width, height ) =>{

  const { FitOptions, TextWrapModes } =  require("indesign");
  var myDocument = app.activeDocument;
  //Display a standard open file dialog box to select a graphic file.
   let myGraphicFile = "file:" + path;
  //Example : let myGraphicFile = "C://IDS/myImage.PNG";
   //If a graphic file was selected, and if you didn't press Cancel,
  //place the graphic file on the page.
  if((myGraphicFile != "")&&(myGraphicFile != null)){
      let myGraphic = myDocument.pages.item(0).place(myGraphicFile);
      //Since you can place multiple graphics at once, the place method
      //returns an array. To get the graphic you placed, get the first
      //item in the array (JavaScript arrays start with item 0).
      myGraphic = myGraphic[0];
      //Create an object style to apply to the graphic frame.
      let myObjectStyle = myDocument.objectStyles.item("GraphicFrame");
      try {
          let myName = myObjectStyle.name;
      }
      catch (myError){
          //The object style did not exist, so create it.
          myObjectStyle = myDocument.objectStyles.add({name:"GraphicFrame"});
      }
      // myObjectStyle.enableStroke = true;
      // myObjectStyle.strokeWeight = 3;
      // myObjectStyle.strokeType = myDocument.strokeStyles.item("Solid");
      // myObjectStyle.strokeColor = myDocument.colors.item("Red");

      //The frame containing the graphic is the parent of the graphic.
      let myFrame = myGraphic.parent;
      myFrame.applyObjectStyle(myObjectStyle, true);
      //Resize the frame to a specific size.
      myFrame.geometricBounds =[top, left, top+height, left+ width]; // [0,0,144,144];
      //Fit the graphic to the frame proportionally.
      myFrame.fit(FitOptions.proportionally);
      //Next, fit frame to the resized graphic.
      myFrame.fit(FitOptions.frameToContent);

      //Move the graphic frame.
      // let myBounds = myFrame.geometricBounds;
      // let myGraphicWidth = myBounds[3]-myBounds[1];
      // let myPageWidth = myDocument.documentPreferences.pageWidth;
      // let myTopMargin = myDocument.pages.item(0).marginPreferences.top;
      // myFrame.move([myPageWidth-myGraphicWidth, myTopMargin]);

      //Apply a text wrap to the graphic frame.
      // myFrame.textWrapPreferences.textWrapMode = TextWrapModes.BOUNDING_BOX_TEXT_WRAP;
      // myFrame.textWrapPreferences.textWrapOffset = [24, 12, 24, 12];
  }
}

const addTextFrameMasterSpread = (filename, top, left, width, height) =>{
  const { FirstBaseline } =  require("indesign");
  var myDocument = app.activeDocument;
  let myMasterSpread = myDocument.masterSpreads.item(0);

  let myLeftPage = myMasterSpread.pages.item(0);
  //let myRightPage = myMasterSpread.pages.item(1);

  let myLeftTextFrame = myLeftPage.textFrames.add();
  myLeftTextFrame.geometricBounds = [top, left, top+height, left+ width];//[3, 3, 25, 43];
   myLeftTextFrame.textFramePreferences.firstBaselineOffset = FirstBaseline.leadingOffset;
  // myLeftTextFrame.textFramePreferences.textColumnCount = 3;
  // myLeftTextFrame.textFramePreferences.textColumnGutter = 14;
  //Add a label to make the frame easier to find later on.
  myLeftTextFrame.label = filename; //"BodyTextFrame";
  myTextFrame.insertionPoints.item(0).contents = filename;


  /*
  let myRightTextFrame = myRightPage.textFrames.add();
  myRightTextFrame.geometricBounds = [top, left, top+height, left+ width]]; //[3, 54, 25, 91];
  myRightTextFrame.textFramePreferences.firstBaselineOffset = FirstBaseline.leadingOffset;
  myRightTextFrame.textFramePreferences.textColumnCount = 3;
  myRightTextFrame.textFramePreferences.textColumnGutter = 14;
  //Add a label to make the frame easier to find later on.
  myRightTextFrame.label = "BodyTextFrame";
  //Link the two frames using the nextTextFrame property.
  myLeftTextFrame.nextTextFrame = myRightTextFrame;
  */
}

//
//
//
const addTextFrame = (filename, top, left, width, height) =>{
  const { FirstBaseline } =  require("indesign");
  var myDocument = app.activeDocument;
  let myPage = myDocument.pages.item(0);
  let myTextFrame = myPage.textFrames.add();
  myTextFrame.geometricBounds = [top, left, top+height, left+ width];//[3, 3, 25, 43];
  //myTextFrame.textFramePreferences.firstBaselineOffset = FirstBaseline.leadingOffset;
  // myTextFrame.textFramePreferences.textColumnCount = 3;
  // myTextFrame.textFramePreferences.textColumnGutter = 14;

  //Add a label to make the frame easier to find later on.
  myTextFrame.label = filename; //"BodyTextFrame";
  myTextFrame.insertionPoints.item(0).contents = filename;

}

//
//
//
const addText = (text) =>{
  var myDocument = app.activeDocument;

  let myTextFrame = myDocument.masterSpreads.item(0).pages.item(1).textFrames.item(0).override(myDocument.pages.item(0));
  //Add text by setting the contents of an insertion point to a string.
  //In JavaScript, "\r" is a return character.
  myTextFrame.insertionPoints.item(0).contents = text;

}

const masterSpreads = () =>{
  var myDocument = app.activeDocument;
  console.log (myDocument)
  //Set the measurement units and ruler origin.
  const { MeasurementUnits, RulerOrigin } =  require("indesign");
  myDocument.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.points;
  myDocument.viewPreferences.verticalMeasurementUnits = MeasurementUnits.points;
  myDocument.viewPreferences.rulerOrigin = RulerOrigin.pageOrigin;

  //Get a reference to the first master spread.
  let myMasterSpread = myDocument.masterSpreads.item(0);

  //Get a reference to the margin preferences of the first page in the master spread.
  let myMarginPreferences = myMasterSpread.pages.item(0).marginPreferences;

  //Now set up the page margins and columns.
  myMarginPreferences.left = 84;
  myMarginPreferences.top = 70;
  myMarginPreferences.right = 70;
  myMarginPreferences.bottom = 78;
  myMarginPreferences.columnCount = 3;
  myMarginPreferences.columnGutter = 14;

  //Page margins and columns for the right-hand page.
  let myMarginPreferences_1 = myMasterSpread.pages.item(1).marginPreferences;
  myMarginPreferences_1.left = 84;
  myMarginPreferences_1.top = 70;
  myMarginPreferences_1.right = 70;
  myMarginPreferences_1.bottom = 78;
  myMarginPreferences_1.columnCount = 3;
  myMarginPreferences_1.columnGutter = 14;

}

module.exports = {masterSpreads, importFigma, addTextFrame, addText, placeGraphic, readFile}
