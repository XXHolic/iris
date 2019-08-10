// CORS
fetch("http://localhost:9001/simpleCrossOriginRequest")
  .then(response => response.json())
  .then(res => {
    console.info("res", res);
  })
  .catch(error => {
    console.log("Request Error", error);
  });

// JSONP 方式
window.jsonP = function(data) {
  console.info("JSONP Request:", data);
}

var scriptEle = document.createElement('script');
scriptEle.setAttribute("src", "http://localhost:9001/jsonp?callBack=jsonP");
document.body.append(scriptEle);


// fetch("http://localhost:9001/notSimpleCrossOriginRequest", {
//   method: "PUT",
//   headers: {
//     "content-type": "application/xml"
//   }
// })
//   .then(response => response.json())
//   .then(res => {
//     console.info("res", res);
//   })
//   .catch(error => {
//     console.log("Request Error", error);
//   });

// var xhr = new XMLHttpRequest();
// xhr.open("PUT", "http://localhost:9001/notSimpleCrossOriginRequest");
// xhr.onreadystatechange = function() {
//   if (xhr.readyState===4) {
//     console.info('response:',xhr.responseText);
//   }
// }

// xhr.send();



