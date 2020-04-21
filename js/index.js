const url =
  "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBh7Et-4oeMg32_qhiGaaPO8iTL49y1cUY";
const IBMurl =
  "http://max-image-caption-generator.max.us-south.containers.appdomain.cloud/model/predict";
const data = {
  requests: [
    {
      image: {
        // This is to work with URLs
        // "source":{
        //   "imageUri":
        //     "https://images.pexels.com/photos/45201/kitty-cat-kitten-pet-45201.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
        // }
        content: "",
      },
      features: [
        {
          type: "LABEL_DETECTION",
          maxResults: 3,
        },
      ],
    },
  ],
};
let imagepath = "";

//Microsoft API Stuff
var COMPUTER_VISION_SUB_KEY = "f966a154aad14306bec3830e4e7ef4af";
var COMPUTER_VISION_ENDPOINT = "https://accessibilityvisionapi.cognitiveservices.azure.com/";
var COMPUTER_VISION_URL = COMPUTER_VISION_ENDPOINT + "vision/v2.1/analyze";
var imageBinFile8Array;

// ########## Listeners
//Display Image preview
$("#inputImage").on("change", function () {
  if (typeof FileReader != "undefined") {
    var image_holder = $("#preview");
    image_holder.empty();

    var reader = new FileReader();
    reader.onload = function (e) {
      $("<img />", {
        src: e.target.result,
        class: "thumb-image",
      }).appendTo(image_holder);
    };
    image_holder.show();
    reader.readAsDataURL($(this)[0].files[0]);
  } else {
    alert("This browser does not support FileReader.");
  }
});

$("#inputImage").on("change", function () {
  encodeBase64(this);
  getFileBinary(this);
});

function getFileBinary(elm) {
  const file = elm.files[0],
    imgReader = new FileReader();

  imgReader.onloadend = function () {
    var imageBinFileBuffer = imgReader.result;
    imageBinFile8Array = new Uint8Array(imageBinFileBuffer);
  }

  imgReader.readAsArrayBuffer(file);
}

function fileImage(elm) {
  const file = elm.files[0],
    imgReader = new FileReader();

  imgReader.onloadend = function () {
    // console.log('Base64 Format', imgReader.result);
    imagepath = imgReader.result.split(",")[1];
  };
  imgReader.readAsDataURL(file);
}

$("#uploadButton").on("click", function () {
  getImageTags();
  getImageDescription();
});

// $("#copy").on("click", function () {
//   copyText();
// });

// ######### Functions
function getImageTags() {
  data.requests[0].image.content = imagepath;
  axios({
    method: "POST",
    url: url,
    data: data,
  })
    .then((data) => {
      const rawData = data.data.responses[0].labelAnnotations,
        tags = rawData.map((annotation) => annotation.description);

      $("#generatedNouns").val(tags.join());
    })
    .catch((err) => console.log(err));
}

function getImageDescription() {
  var params = {
    "visualFeatures": "Categories,Description,Color",
    "details": "",
    "language": "en",
  };

  var visionUrl = COMPUTER_VISION_URL + "?" + $.param(params);

  const options = {
    headers: {
    'Content-Type': "application/octet-stream",
    'Ocp-Apim-Subscription-Key': COMPUTER_VISION_SUB_KEY
    }
  };

  axios
  .post(
    visionUrl, imageBinFile8Array, options
  )
  .then(function(data) {
    var textOfPicture = data.data["description"]["captions"][0].text;
    document.getElementById("Microalt").value = textOfPicture;
  })
  .catch((err) => console.log(err));
}

function encodeBase64(elm) {
  const file = elm.files[0],
    imgReader = new FileReader();

  imgReader.onloadend = function () {
    // console.log('Base64 Format', imgReader.result);
    imagepath = imgReader.result.split(",")[1];
  };
  imgReader.readAsDataURL(file);
}

// #### Tooltips
function copyText() {
  /* Get the text field */
  var copyText = $("#altBuilding");

  /* Focus on text */
  copyText.select();

  /* Copy the text inside the text field */
  document.execCommand("copy");

  var tooltip = $("#myTooltip");
  tooltip.html("Copied: " + copyText.val());
}

function outFunc() {
  var tooltip = $("#myTooltip");
  tooltip.html("Copy to clipboard");
}
