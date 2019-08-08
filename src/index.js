fetch("http://localhost:9001/getData")
  .then(response => response.json())
  .then(res => {
    console.info('res',res)
  })
  .catch(error => {
    console.log("Request Error", error);
  });