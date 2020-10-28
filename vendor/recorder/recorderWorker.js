var recLength = 0,
  recBuffers = [],
  transBuffer = [],
  transLength = 0,
  zeroRun = true,
  sampleRate,
  numChannels;

this.onmessage = function(e){
  switch(e.data.command){
    case 'init':
      init(e.data.config);
      break;
    case 'record':
      transcodeCAS(e.data.buffer);
      break;
    case 'exportWAV':
      exportUlawWAV(e.data.type);
      break;
    case 'getBuffer':
      getBuffer();
      break;
    case 'clear':
      clear();
      break;
  }
};

function init(config){
  sampleRate = config.sampleRate;
  numChannels = config.numChannels;
  initBuffers();
}

// transcode to 8k mono mulaw
function transcodeCAS(pcmBuffers) {
  // mix down the right and left channels into a single channel.
   if (numChannels === 2){
      var mixed = mix(pcmBuffers[0], pcmBuffers[1]);
  } else {
      var mixed = pcmBuffers[0];
  }

  // downsample to 8k and encode to mulaw.
  var mulawBuffer = transcodeTo8kMulaw(mixed,sampleRate);
  transBuffer.push(mulawBuffer);
  transLength += mulawBuffer.length;

}

function exportUlawWAV(type){
  var mergedBuffer = mergeBuffers(transBuffer, transLength);
  var dataview = encodeWAV(mergedBuffer,8000,1,1,false,true);
  var audioBlob = new Blob([dataview], { type: type });
  this.postMessage(audioBlob);
}

function record(inputBuffer){
  for (var channel = 0; channel < numChannels; channel++){
    recBuffers[channel].push(inputBuffer[channel]);
  }
  recLength += inputBuffer[0].length;
}

function exportWAV(type){
  var buffers = [];
  for (var channel = 0; channel < numChannels; channel++){
    buffers.push(mergeBuffers(recBuffers[channel], recLength));
  }
  if (numChannels === 2){
      var interleaved = interleave(buffers[0], buffers[1]);
  } else {
      var interleaved = buffers[0];
  }
  var dataview = encodeWAV(interleaved);
  var audioBlob = new Blob([dataview], { type: type });

  this.postMessage(audioBlob);
}

function getBuffer(){
  var buffers = [];
  for (var channel = 0; channel < numChannels; channel++){
    buffers.push(mergeBuffers(recBuffers[channel], recLength));
  }
  this.postMessage(buffers);
}

function clear(){
  recLength = 0;
  recBuffers = [];
  transLength = 0;
  transBuffer = [];
  initBuffers();
}

function initBuffers(){
  for (var channel = 0; channel < numChannels; channel++){
    recBuffers[channel] = [];
  }
}

function mergeBuffers(recBuffers, recLength){
  var result = new Float32Array(recLength);
  var offset = 0;
  for (var i = 0; i < recBuffers.length; i++){
    result.set(recBuffers[i], offset);
    offset += recBuffers[i].length;
  }
  return result;
}

function mix(inputL, inputR){
  var length = inputL.length;
  var result = new Float32Array(length);

  var index = 0,
    inputIndex = 0;

  while (index < length){
    result[index++] = (inputL[inputIndex]+inputR[inputIndex])/2;
    inputIndex++;
  }
  return result;
}

function interleave(inputL, inputR){
  var length = inputL.length + inputR.length;
  var result = new Float32Array(length);

  var index = 0,
    inputIndex = 0;

  while (index < length){
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  return result;
}

function floatTo16BitPCM(output, offset, input){
  for (var i = 0; i < input.length; i++, offset+=2){
    var s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
  }
}

function write8bits(output, offset, input){
  for (var i = 0; i < input.length; i++){
    output.setInt8(offset+i, input[i], true);
  }
}

function writeString(view, offset, string){
  for (var i = 0; i < string.length; i++){
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

function encodeWAV(samples,sampleRate,channels,bytesPerSample,isFloat,isMulaw){
  var buffer = new ArrayBuffer(58 + (samples.length * bytesPerSample));
  var view = new DataView(buffer);
  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, 50 + (samples.length * bytesPerSample), true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 18, true);
  /* sample format (raw) */
  view.setUint16(20, isMulaw?7:1, true);
  /* channel count */
  view.setUint16(22, channels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * channels * bytesPerSample, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, channels * bytesPerSample, true);
  /* bits per sample */
  view.setUint16(34, bytesPerSample*8, true);
  /* cb size */
  view.setUint16(36, 0, true);
  // fact chunk - optional but our voicemail server/CAS seems to need it.
  writeString(view, 38, 'fact');
  // fact chunk length
  view.setUint32(42, 4, true);
  /* data chunk length */
  view.setUint32(46, (samples.length * bytesPerSample), true);
  /* data chunk identifier */
  writeString(view, 50, 'data');
  /* data chunk length */
  view.setUint32(54, (samples.length * bytesPerSample), true);

  if (isFloat) {
  floatTo16BitPCM(view, 58, samples);
  } else if (bytesPerSample === 1) {
    write8bits(view, 58, samples);
  }
  return view;
}

// we get away with just a downsample (no low pass filter)
// because we are recording voice which wont have any
// frequencies greater than 4k.
// see http://dspguru.com/dsp/faqs/multirate/decimation
function transcodeTo8kMulaw(buffer, rate) {
    var windowSum,windowLen,windowEnd;
    var ratio = rate/8000;
    var pcm16 = new Int16Array(2);
    var mulaw = new Int8Array(Math.round(buffer.length/ratio));
    var mulawLen = 0;
    var windowStart = 0;
    while (mulawLen < mulaw.length) {
        windowSum = 0;
        windowLen = 0;
        windowEnd = Math.round((mulawLen+1)*ratio);
        for (var i=windowStart; i<windowEnd && i<buffer.length; i++) {
            windowSum += buffer[i];
            windowLen++;
            if (zeroRun) {
              if (buffer[i] !== 0) {
                zeroRun = false;
                console.info('RECORD STARTING');
              }
            }
        }
        // we take the average rather than just drop samples.
        sample8k = Math.min(1,windowSum/windowLen);
        // convert from float to 16 bit.
        pcm16[0] = sample8k < 0 ? sample8k*0x8000:sample8k*0x7FFF;
        // encode to mulaw.
        mulaw[mulawLen] = pcm16Tomulaw(pcm16);
        mulawLen++;
        windowStart = windowEnd;
    }
    return mulaw;
}

// mulaw encoder. Adapted from Craig Reese/Joe Campbell https://www.dsprelated.com/showthread/comp.dsp/51552-1.php
var exp_lut = [0,0,1,1,2,2,2,2,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,
          6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,
          7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7
        ];
var BIAS = 0x84;
var CLIP = 32635;
function pcm16Tomulaw(sample /* must be Int16Array element */ ) {
    var sign = new Uint8Array(1);
    var exponent = new Uint8Array(1);
    var mantissa = new Uint8Array(1);
    var ulawbyte = new Uint8Array(1);
   // var sample = new Int16Array(1);

    sign[0] = (sample[0] >> 8) & 0x80; /* set aside the sign */
    if (sign[0] != 0) {
      sample[0] = -sample[0];         /* get magnitude */
    }
    /* sample can be zero because we can overflow in the inversion,
     * checking against the unsigned version solves this */
    if (sample[0] > CLIP) {
      sample[0] = CLIP;            /* clip the magnitude */
    }
      /** convert from 16 bit linear to ulaw **/
    sample[0] = sample[0] + BIAS;
    exponent[0] = exp_lut[(sample[0] >> 7) & 0xFF];
    mantissa[0] = (sample[0] >> (exponent[0] + 3)) & 0x0F;
    ulawbyte[0] = ~(sign[0] | (exponent[0] << 4) | mantissa[0]);
    if (ulawbyte[0] == 0) {
      ulawbyte[0] = 0x02;          /* optional CCITT trap */
    }

    return ulawbyte[0];    
}
