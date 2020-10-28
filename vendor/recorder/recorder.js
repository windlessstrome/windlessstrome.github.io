(function(window){

  var WORKER_PATH = 'recorderWorker.js';

  // Recording via javascript script processor will be blocked
  // anytime the main thread is blocked which includes long garbage 
  // collections or UI reflows or many events queued to run in V8
  // event queue. This will cause garbled/lost/repeated audio in
  // the recording. The web audio working group is working on this
  // problem and should be fixed by using AudioWorkers someday 
  // see the discuession here:
  // https://github.com/WebAudio/web-audio-api/issues/113
  var Recorder = function(source, cfg){
    var config = cfg || {};
    var bufferLen = config.bufferLen || 16384; // 16384 is the max buffer the API will allow. 
    var numChannels = config.numChannels || 2;
    this.context = source.context;
    this.node = (this.context.createScriptProcessor ||
                 this.context.createJavaScriptNode).call(this.context,
                 bufferLen, numChannels, numChannels);
    var worker = new Worker(config.workerPath || WORKER_PATH);
    worker.postMessage({
      command: 'init',
      config: {
        sampleRate: this.context.sampleRate,
        numChannels: numChannels
      }
    });
    var recording = false,
      currCallback;
	var gain = this.context.createGain();

    this.node.onaudioprocess = function(e){
      if (!recording) { return; }
      var buffer = [];
      for (var channel = 0; channel < numChannels; channel++){
          // per WC3 Audio API the reference returned by getChannelData
          // is only valid in this callback so we should clone the data
          // prior to passing to record worker thread.
          buffer.push(new Float32Array(e.inputBuffer.getChannelData(channel)));
      }
      worker.postMessage({
        command: 'record',
        buffer: buffer
      });
    };

    this.configure = function(cfg){
      for (var prop in cfg){
        if (cfg.hasOwnProperty(prop)){
          config[prop] = cfg[prop];
        }
      }
    };

    this.record = function(){
      Endo.delayForcedGC = true;
      recording = true;
    };

    this.stop = function(){
      recording = false;
      this.node.disconnect(this.context.destination); // disconnect needed to stop onaudioprocess callbacks.
      Endo.delayForcedGC = false;
    };

    this.clear = function(){
      worker.postMessage({ command: 'clear' });
    };

    this.getBuffer = function(cb) {
      currCallback = cb || config.callback;
      worker.postMessage({ command: 'getBuffer' });
    };

    this.exportWAV = function(cb, type){
      currCallback = cb || config.callback;
      type = type || config.type || 'audio/wav';
      if (!currCallback) { throw new Error('Callback not set'); }
      worker.postMessage({
        command: 'exportWAV',
        type: type
      });
    };

    worker.onmessage = function(e){
      var blob = e.data;
      currCallback(blob);
    };

	
    source.connect(gain);
    gain.connect(this.node);
    gain.gain.value = 1; // nwjs 0.10.2 set a default of 1 but 0.12.3 does not.
    this.node.connect(this.context.destination);    //this should not be necessary but is to get the onaudioprocess callbacks.
  };

  Recorder.forceDownload = function(blob, filename){
    var url = (window.URL || window.webkitURL).createObjectURL(blob);
    var link = window.document.createElement('a');
    link.href = url;
    link.download = filename || 'output.wav';
    var click = document.createEvent('Event');
    click.initEvent('click', true, true);
    link.dispatchEvent(click);
  };

  window.Recorder = Recorder;

})(window);
