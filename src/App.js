import React, { Component } from "react";
import Upload from "rc-upload";

// var Upload = require('rc-upload');

class App extends Component {
  constructor(props) {
    super(props)
    this.uploaderProps = {
      action: 'http://localhost:9001/upload',
      // data: { a: 1, b: 2 },
      headers: {
        Authorization: 'xxxxxxx',
      },
      multiple: true,
      beforeUpload(file) {
        console.log('beforeUpload', file.name);
      },
      onStart: (file) => {
        console.log('onStart', file.name);
        // this.refs.inner.abort(file);
      },
      onSuccess(file) {
        console.log('onSuccess', file);
      },
      onProgress(step, file) {
        console.log('onProgress', Math.round(step.percent), file.name);
      },
      onError(err) {
        console.log('onError', err);
      },
    };
    this.state = {
      destroyed: false,
    };
  }

  render() {
    return (
      <div>
        <p>上传示例</p>
        <Upload {...this.uploaderProps} ref="inner"><a>开始上传</a></Upload>
      </div>
    )
  }
}

export default App;