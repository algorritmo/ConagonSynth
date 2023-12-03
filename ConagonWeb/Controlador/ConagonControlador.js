function sintetizador() {


  const mostrarPopupBtn = document.getElementById("mostrarPopup");
  const popup = document.getElementById("popup");
  const cerrarPopupBtn = document.getElementById("cerrarPopup");


  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const oscillatorMap = new Map();
  const gainNodeMapOsc1 = new Map();
  const gainNodeMapOsc2 = new Map();

  // Conjunto para mantener un registro de las teclas activas
  let activeKeys = new Set();

  let oscillator1;
  let oscillator2;
  //let gainNode;
  let gainNodeOsc1;
  let gainNodeOsc2;
  let gainNodeOscAll;
  //variables para el manejo de imagenes:
  const input1 = document.getElementById('waveform-knob1');
  const imageOverlay1 = document.getElementById('imageOverlay1');
  const imageOverlay2 = document.getElementById('imageOverlay2');
  const imageOverlay3 = document.getElementById('imageOverlay3');
  const imageOverlay4 = document.getElementById('imageOverlay4');
  const imageOverlayDefault = document.getElementById('imageOverlayDefault');
  const imgOsci1 = document.getElementById('image2Overlay1');
  const imgOsci2 = document.getElementById('image2Overlay2');
  const imgOsci3 = document.getElementById('image2Overlay3');
  const imgOsci4 = document.getElementById('image2Overlay4');
  const imgOsci2Default = document.getElementById('image2OverlayDefault');

  // Variable para controlar el estado de la tecla (inicialmente, ninguna tecla está presionada)
  let keyIsPressed = false;
  let keyup = false;

  let noteFreq = null;
  let customWaveform = null;
  let sineTerms = null;
  let cosineTerms = null;

  //variables de volumen
  const keyboard = document.querySelector(".keyboard");
  let wavePicker1 = null // document.querySelector("select[name='waveform']");
  let wavePicker2 = null
  let volumeControl = document.querySelector("input[name='volume']");
  var volumenValue = document.getElementById("volumenValue");
  let volumenBalancer = document.querySelector("input[name='balancer']");
  const attackControl = document.querySelector("input[name='attack']");
  var attackValue = document.getElementById("attackValue");
  const decayControl = document.querySelector("input[name='decay']");
  var decayValue = document.getElementById("decayValue");
  const sustainControl = document.querySelector("input[name='sustain']");
  var sustainValue = document.getElementById("sustainValue");
  const releaseControl = document.querySelector("input[name='release']");
  var releaseValue = document.getElementById("releaseValue");
  const timeScaleControl = document.querySelector("input[name='time-scale']");
  var timeScaleValue = document.getElementById("timeScaleValue");
  const LowPassFilterControl = document.querySelector("input[name='filtroPasoBajo']");
  var LowPassValue = document.getElementById("LowPassValue");
  const HighPassFilterControl = document.querySelector("input[name='filtroPasoAlto']");
  var HighPassValue = document.getElementById("HighPassValue");
  const delayControl = document.querySelector("input[name='delay']");
  var delayValue = document.getElementById("delayValue");
  const feedbackControl = document.querySelector("input[name='feedback']");
  var feedbackValue = document.getElementById("feedbackValue");

  volumeControl.addEventListener("input", function () {
    volumenValue.innerHTML = volumeControl.value + "dB";
  });

  attackControl.addEventListener("input", function () {
    attackValue.innerHTML = attackControl.value + "s";
  });
  decayControl.addEventListener("input", function () {
    decayValue.innerHTML = decayControl.value + "s";
  });
  sustainControl.addEventListener("input", function () {
    sustainValue.innerHTML = sustainControl.value + "db";
  });
  releaseControl.addEventListener("input", function () {
    releaseValue.innerHTML = releaseControl.value + "s";
  });
  timeScaleControl.addEventListener("input", function () {
    timeScaleValue.innerHTML = timeScaleControl.value + "s";
  });

  LowPassFilterControl.addEventListener("input", function () {
    LowPassValue.innerHTML = LowPassFilterControl.value + "Hz";
  });

  HighPassFilterControl.addEventListener("input", function () {
    HighPassValue.innerHTML = HighPassFilterControl.value + "Hz";
  });

  delayControl.addEventListener("input", function () {
    delayValue.innerHTML = delayControl.value + "s";
  });

  feedbackControl.addEventListener("input", function () {
    feedbackValue.innerHTML = feedbackControl.value + "s";
  });



  $('#waveform-knob1').knob({
    'min': 0,
    'max': 4,
    'step': 1,
    'width': 150,
    'fgColor': '#F0A762',
    'skin': "tron",
    'thickness': ".2",
    'change': function (value) {
      if (oscillator1 || audioContext) {
        console.log('valor default ' + parseInt(value));
        switch (parseInt(value)) {
          case 0:
            // Cambio de imagenes según el caso:
            imageOverlay1.style.display = 'block';
            imageOverlay2.style.display = 'none';
            imageOverlay3.style.display = 'none';
            imageOverlay4.style.display = 'none';
            imageOverlayDefault.style.display = 'none';
            wavePicker1 = 'sine'; // Senoidal
            break;
          case 1:
            imageOverlay1.style.display = 'none';
            imageOverlay2.style.display = 'block';
            imageOverlay3.style.display = 'none';
            imageOverlay4.style.display = 'none';
            imageOverlayDefault.style.display = 'none';
            wavePicker1 = 'square'; // Cuadrada
            break;
          case 2:
            imageOverlay1.style.display = 'none';
            imageOverlay2.style.display = 'none';
            imageOverlay3.style.display = 'block';
            imageOverlay4.style.display = 'none';
            imageOverlayDefault.style.display = 'none';
            wavePicker1 = 'sawtooth'; // Triangular
            break;
          case 3:
            imageOverlay1.style.display = 'none';
            imageOverlay2.style.display = 'none';
            imageOverlay3.style.display = 'none';
            imageOverlay4.style.display = 'block';
            imageOverlayDefault.style.display = 'none';
            wavePicker1 = 'triangle'; // Diente de sierra
            break;
          default:
            imageOverlay1.style.display = 'none';
            imageOverlay2.style.display = 'none';
            imageOverlay3.style.display = 'none';
            imageOverlay4.style.display = 'none';
            imageOverlayDefault.style.display = 'block';
            break;
        }
      }
    }
  });

  $('#waveform-knob2').knob({
    'min': 0,
    'max': 4,
    'step': 1,
    'width': 150,
    'fgColor': '#F0A762',
    'skin': "tron",
    'thickness': ".2",
    'change': function (value) {
      if (oscillator2 || audioContext) {
        console.log('valor default' + parseInt(value));
        switch (parseInt(value)) {
          case 0:
            //Cambio de imagenes según el caso
            image2Overlay1.style.display = 'block';
            image2Overlay2.style.display = 'none';
            image2Overlay3.style.display = 'none';
            image2Overlay4.style.display = 'none';
            image2OverlayDefault.style.display = 'none';
            wavePicker2 = 'sine'; // Senoidal
            break;
          case 1:
            image2Overlay1.style.display = 'none';
            image2Overlay2.style.display = 'block';
            image2Overlay3.style.display = 'none';
            image2Overlay4.style.display = 'none';
            image2OverlayDefault.style.display = 'none';
            wavePicker2 = 'square'; // Cuadrada
            break;
          case 2:
            image2Overlay1.style.display = 'none';
            image2Overlay2.style.display = 'none';
            image2Overlay3.style.display = 'block';
            image2Overlay4.style.display = 'none';
            image2OverlayDefault.style.display = 'none';
            wavePicker2 = 'sawtooth'; // Triangular
            break;
          case 3:
            image2Overlay1.style.display = 'none';
            image2Overlay2.style.display = 'none';
            image2Overlay3.style.display = 'none';
            image2Overlay4.style.display = 'block';
            image2OverlayDefault.style.display = 'none';
            wavePicker2 = 'triangle'; // Diente de sierra
            break;
          default:
            image2Overlay1.style.display = 'none';
            image2Overlay2.style.display = 'none';
            image2Overlay3.style.display = 'none';
            image2Overlay4.style.display = 'none';
            image2OverlayDefault.style.display = 'block';
            break;
        }
      }
    }
  });

  //Eventos que ponene por defecto la imgen del pianito
  document.addEventListener('DOMContentLoaded', function () {
    const imageOverlayDefault = document.getElementById('imageOverlayDefault');
    imageOverlayDefault.style.display = 'block';

    const imageOverlays = document.querySelectorAll('.image-overlay');
    imageOverlays.forEach(function (imageOverlay) {
      if (imageOverlay !== imageOverlayDefault) {
        imageOverlay.style.display = 'none';
      }
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    const image2OverlayDefault = document.getElementById('image2OverlayDefault');
    image2OverlayDefault.style.display = 'block';

    const imageOverlays2 = document.querySelectorAll('.image-overlay-2');
    imageOverlays2.forEach(function (imageOverlay2) {
      if (imageOverlay2 !== image2OverlayDefault) {
        imageOverlay2.style.display = 'none';
      }
    });
  });

  // Evento que cambia las imagenes según el input
  // que se ingrese manualmente
  input1.addEventListener('input', function () {
    const inputValue = parseFloat(input1.value);

    if (inputValue === 1) {
      imageOverlay1.style.display = 'block';
      imageOverlay2.style.display = 'none';
      imageOverlay3.style.display = 'none';
      imageOverlay4.style.display = 'none';
      imageOverlayDefault.style.display = 'none';
    } else if (inputValue === 2) {
      imageOverlay1.style.display = 'none';
      imageOverlay2.style.display = 'block';
      imageOverlay3.style.display = 'none';
      imageOverlay4.style.display = 'none';
      imageOverlayDefault.style.display = 'none';
    } else if (inputValue === 3) {
      imageOverlay1.style.display = 'none';
      imageOverlay2.style.display = 'none';
      imageOverlay3.style.display = 'block';
      imageOverlay4.style.display = 'none';
      imageOverlayDefault.style.display = 'none';
    } else if (inputValue === 4) {
      imageOverlay1.style.display = 'none';
      imageOverlay2.style.display = 'none';
      imageOverlay3.style.display = 'none';
      imageOverlay4.style.display = 'block';
      imageOverlayDefault.style.display = 'none';
    } else {
      // Display the default image
      imageOverlay1.style.display = 'none';
      imageOverlay2.style.display = 'none';
      imageOverlay3.style.display = 'none';
      imageOverlay4.style.display = 'none';
      imageOverlayDefault.style.display = 'block';
    }
  });

  var frequencyValueOsc1 = document.getElementById("frequency-value-osc1");
  $('#frequency-slider1').on('input', function () {
    var frequency = $(this).val();
    frequencyValueOsc1.innerHTML = frequency + " Hz";
    console.log(frequency);
    if (audioContext && oscillator1) {
      oscillator1.frequency.value = frequency;

    }
  });

  var frequencyValueOsc2 = document.getElementById("frequency-value-osc2");
  $('#frequency-slider2').on('input', function () {
    var frequency = $(this).val();
    frequencyValueOsc2.innerHTML = frequency + " Hz";
    if (audioContext && oscillator2) {
      oscillator2.frequency.value = frequency;
    }
  });

  //Eventos que ponene por defecto la imgen del pianito
  document.addEventListener('DOMContentLoaded', function () {
    const imageOverlayDefault = document.getElementById('imageOverlayDefault');
    imageOverlayDefault.style.display = 'block';

    const imageOverlays = document.querySelectorAll('.image-overlay');
    imageOverlays.forEach(function (imageOverlay) {
      if (imageOverlay !== imageOverlayDefault) {
        imageOverlay.style.display = 'none';
      }
    });
  });

  document.addEventListener('DOMContentLoaded', function () {
    const image2OverlayDefault = document.getElementById('image2OverlayDefault');
    image2OverlayDefault.style.display = 'block';

    const imageOverlays2 = document.querySelectorAll('.image-overlay-2');
    imageOverlays2.forEach(function (imageOverlay2) {
      if (imageOverlay2 !== image2OverlayDefault) {
        imageOverlay2.style.display = 'none';
      }
    });
  });

  //ESTADO DEL OSC1
  var stateOsc1 = false;
  $("#btnOnOsc1").on('change', function () {
    if ($(this).is(':checked')) {
      stateOsc1 = $(this).is(':checked');
      console.log('oscilador1: ' + stateOsc1)
    }
    else {
      stateOsc1 = $(this).is(':checked');
      console.log('oscilador1: ' + stateOsc1)
    }
  });

  //ESTADO DEL OSC2
  var stateOsc2 = false;
  $("#btnOnOsc2").on('change', function () {
    if ($(this).is(':checked')) {
      stateOsc2 = $(this).is(':checked');
      console.log('oscilador2: ' + stateOsc2)
    }
    else {
      stateOsc2 = $(this).is(':checked');
      console.log('oscilador2: ' + stateOsc2)
    }
  });

  //encendido filtro
  var stateFilters = false;
  $("#btnOnFilters").on('change', function () {
    if ($(this).is(':checked')) {
      stateFilters = $(this).is(':checked');
      console.log('Filters: ' + stateFilters)
    }
    else {
      stateFilters = $(this).is(':checked');
      console.log('Filters: ' + stateFilters)
    }
  });

  var stateLowPassOsc1 = false;
  $("#lowPassOnOsc1").on('change', function () {
    if ($(this).is(':checked')) {
      stateLowPassOsc1 = $(this).is(':checked');
      console.log('Low Pass Filters Osc1: ' + stateLowPassOsc1)
    }
    else {
      stateLowPassOsc1 = $(this).is(':checked');
      console.log('Low Pass Filters Osc1: ' + stateLowPassOsc1)
    }
  });

  var stateHighPassOsc2 = false;
  $("#highPassOnOsc2").on('change', function () {
    if ($(this).is(':checked')) {
      stateHighPassOsc2 = $(this).is(':checked');
      console.log('High Pass Filters Osc2: ' + stateHighPassOsc2)
    }
    else {
      stateHighPassOsc2 = $(this).is(':checked');
      console.log('High Pass Filters Osc1: ' + stateHighPassOsc2)
    }
  });

  //encendido effect delay
  var stateDelay = false;
  $("#btnOnEffectDelay").on('change', function () {
    if ($(this).is(':checked')) {
      stateDelay = $(this).is(':checked');
      console.log('Effect delay: ' + stateDelay)
    }
    else {
      stateDelay = $(this).is(':checked');
      console.log('Effect delay: ' + stateDelay)
    }
  });



  const note_names =
    [
      ["ラ", "", "A", ""],
      ["ラ#", "シ$\\flat$", "A#", "B$\\flat$"],
      ["シ", "", "B", ""],
      ["ド", "", "C", ""],
      ["ド#", "レ$\\flat$", "C#", "D$\\flat$"],
      ["レ", "", "D", ""],
      ["レ#", "ミ$\\flat$", "D#", "E$\\flat$"],
      ["ミ", "", "E", ""],
      ["ファ", "", "F", ""],
      ["ファ#", "ソ$\\flat$", "F#", "G$\\flat$"],
      ["ソ", "", "G", ""],
      ["ソ#", "ラ$\\flat$", "G#", "A$\\flat$"]
    ];

  document.addEventListener("keydown", (event) => {
    if (!keyIsPressed) {
      keyIsPressed = true;
      keyup = true;
      const key = event.key.toLowerCase();

      const keyMap3 = {
        q: 'C',
        2: 'C#',
        w: 'D',
        3: 'D#',
        e: 'E',
        r: 'F',
        5: 'F#',
        t: 'G',
        6: 'G#',
        y: 'A',
        7: 'A#',
        u: 'B'
      };

      const keyMap4 = {
        i: 'C',
        9: 'C#',
        o: 'D',
        0: 'D#',
        p: 'E',
        z: 'F',
        s: 'F#',
        x: 'G',
        d: 'G#',
        c: 'A',
        f: 'A#',
        v: 'B'
      };

      if (keyMap3.hasOwnProperty(key) || keyMap4.hasOwnProperty(key)) {

        var octave = keyMap3.hasOwnProperty(key) ? 3 : 4;
        const note = keyMap3.hasOwnProperty(key) ? keyMap3[key] : keyMap4[key];
        var freq = parseFloat(noteFreq[octave][note]);
        notePressed({ target: { dataset: { octave, note, frequency: freq } } });

        // Cambiar el color de fondo y el color del texto cuando se presiona una tecla
        const keyElement = document.querySelector(`[data-note='${note}'][data-octave='${octave}']`);
        if (keyElement) {
          keyElement.classList.add('active-key');
        }
      } else {
        console.log('No se reconoció la tecla');
      }
    }


  });

  document.addEventListener("keyup", (event) => {
    keyIsPressed = false;
    const key = event.key.toLowerCase();
    const keyMap3 = {
      q: 'C',
      2: 'C#',
      w: 'D',
      3: 'D#',
      e: 'E',
      r: 'F',
      5: 'F#',
      t: 'G',
      6: 'G#',
      y: 'A',
      7: 'A#',
      u: 'B'
    };
    const keyMap4 = {
      i: 'C',
      9: 'C#',
      o: 'D',
      0: 'D#',
      p: 'E',
      z: 'F',
      s: 'F#',
      x: 'G',
      d: 'G#',
      c: 'A',
      f: 'A#',
      v: 'B'
    };

    if (keyMap3.hasOwnProperty(key) || keyMap4.hasOwnProperty(key)) {
      var octave = keyMap3.hasOwnProperty(key) ? 3 : 4;
      const note = keyMap3.hasOwnProperty(key) ? keyMap3[key] : keyMap4[key];
      var freq = parseFloat(noteFreq[octave][note])
      //console.log('tecla presionada: ' + note + ' - frecuencia: ' + freq + ' - octava: ' + octave);
      noteReleased({ target: { dataset: { octave, note, frequency: freq } } });
      // Restaurar el color de fondo y el color del texto cuando se libera una tecla
      const keyElement = document.querySelector(`[data-note='${note}'][data-octave='${octave}']`);
      if (keyElement) {
        keyElement.classList.remove('active-key');
      }
    } else {
      console.log('No se reconoció la tecla');
    }
  });

  setup();

  // -------------------------------------------------------
  // functions
  // -------------------------------------------------------

  function createNoteTable() {

    let noteFreq = [];
    for (let octave = 0; octave < 9; octave++) {
      noteFreq[octave] = [];
    }

    for (let n = 3; n < 69; n++) {

      const frequency = getAudioFrequency(n);

      let octave = parseInt(n / 12);
      if (n % 12 >= 3) {
        octave++;
      }

      const note_name_sharp_english = note_names[n % 12][2];
      noteFreq[octave][note_name_sharp_english] = frequency;
    }

    return noteFreq;
  }

  function getAudioFrequency(n) {
    return 27.5 * (Math.pow(Math.pow(2, 1 / 12), n));
  }

  function setup() {
    noteFreq = createNoteTable();

    noteFreq.forEach(function (keys, idx) {

      const keyList = Object.entries(keys);
      const octaveElem = document.createElement("div");
      octaveElem.className = "octave";

      for (let i = 0; i < keyList.length; i++) {

        const keySetElem = document.createElement("div");
        keySetElem.className = "key-set-parent";

        const whiteKey = keyList[i];
        const whiteKeyName = whiteKey[0];

        const whiteKeyElem = createKey(whiteKeyName, idx, whiteKey[1], 'white-key');
        keySetElem.appendChild(whiteKeyElem);

        if (whiteKeyName === 'A' || whiteKeyName === 'C' || whiteKeyName === 'D' ||
          whiteKeyName === 'F' || whiteKeyName === 'G') {

          const blackKey = keyList[++i];

          if (blackKey != undefined) {
            const blackKeyName = blackKey[0];
            const blackKeyElem = createKey(blackKeyName, idx, blackKey[1], 'black-key');
            keySetElem.appendChild(blackKeyElem);
          }
        }

        octaveElem.appendChild(keySetElem);
      }

      keyboard.appendChild(octaveElem);
    });

    document.querySelector("div[data-note='F'][data-octave='5']").scrollIntoView(false);

    sineTerms = new Float32Array([0, 0, 1, 0, 1]);
    cosineTerms = new Float32Array(sineTerms.length);
    customWaveform = audioContext.createPeriodicWave(cosineTerms, sineTerms);
  }

  function createKey(note, octave, freq, keyColor) {
    const keyElement = document.createElement("div");
    const labelElement = document.createElement("div");

    if (keyColor === 'black-key') {
      keyElement.className = "key black-key";
    } else {
      keyElement.className = "key";
    }

    keyElement.dataset["octave"] = octave;
    keyElement.dataset["note"] = note;
    keyElement.dataset["frequency"] = freq;

    labelElement.innerHTML = note + "<sub>" + octave + "</sub>";
    keyElement.appendChild(labelElement);

    keyElement.addEventListener("mousedown", notePressed, false);
    keyElement.addEventListener("mouseup", noteReleased, false);
    //keyElement.addEventListener("mouseleave", noteReleased, false);

    keyElement.addEventListener("touchstart", notePressed, false);
    keyElement.addEventListener("touchend", noteReleased, false);
    keyElement.addEventListener("touchmove", noteReleased, false);
    keyElement.addEventListener("touchcancel", noteReleased, false);

    return keyElement;
  }

  class Oscillator1 {

    constructor(type, frequency, gainNodeOsc1, delayNode, feedbackGainNode) {

      // Crear nodos de filtro biquad para cada oscilador
      const filterNodeOsc1 = audioContext.createBiquadFilter();
      filterNodeOsc1.type = 'lowpass'; // Puedes ajustar el tipo de filtro aquí
      filterNodeOsc1.frequency.value = parseFloat(LowPassFilterControl.value);
      oscillator1 = audioContext.createOscillator();

      if (stateLowPassOsc1 && stateFilters && stateDelay) {
        oscillator1.connect(filterNodeOsc1);
        filterNodeOsc1.connect(gainNodeOsc1);
        // Connection: GainNode(ADSR) -> FeedbackGainNode -> DelayNode -> Audio Output
        gainNodeOsc1.connect(feedbackGainNode).connect(delayNode).connect(audioContext.destination);
        // Connection: DelayNode -> FeedbackGainNode
        delayNode.connect(feedbackGainNode);

      } else if (stateLowPassOsc1 && stateFilters) {
        oscillator1.connect(filterNodeOsc1);
        filterNodeOsc1.connect(gainNodeOsc1);

      } else if (stateDelay) {
        oscillator1.connect(gainNodeOsc1);

        // Connection: GainNode(ADSR) -> FeedbackGainNode -> DelayNode -> Audio Output
        gainNodeOsc1.connect(feedbackGainNode).connect(delayNode).connect(audioContext.destination);
        // Connection: DelayNode -> FeedbackGainNode
        delayNode.connect(feedbackGainNode);

      } else {
        oscillator1.connect(gainNodeOsc1);
      }


      if (type == null) {
        oscillator1.setPeriodicWave(customWaveform);
      } else {
        oscillator1.type = type;
      }

      oscillator1.frequency.value = frequency;
    }

    start() {
      oscillator1.start();
    }

    stop(t) {
      oscillator1.stop(t);
    }
  }

  class Oscillator2 {

    constructor(type, frequency, gainNodeOsc2, delayNode, feedbackGainNode) {

      // Crear nodos de filtro biquad para cada oscilador
      const filterNodeOsc2 = audioContext.createBiquadFilter();
      filterNodeOsc2.type = 'highpass'; // Puedes ajustar el tipo de filtro aquí
      filterNodeOsc2.frequency.value = parseFloat(HighPassFilterControl.value);

      oscillator2 = audioContext.createOscillator();


      if (stateHighPassOsc2 && stateFilters && stateDelay) {
        oscillator2.connect(filterNodeOsc2);
        filterNodeOsc2.connect(gainNodeOsc2);
        // Connection: GainNode(ADSR) -> FeedbackGainNode -> DelayNode -> Audio Output
        gainNodeOsc2.connect(feedbackGainNode).connect(delayNode).connect(audioContext.destination);
        // Connection: DelayNode -> FeedbackGainNode
        delayNode.connect(feedbackGainNode);
      } else if (stateHighPassOsc2 && stateFilters) {
        oscillator2.connect(filterNodeOsc2);
        filterNodeOsc2.connect(gainNodeOsc2);

      } else if (stateDelay) {
        oscillator2.connect(gainNodeOsc2);

        // Connection: GainNode(ADSR) -> FeedbackGainNode -> DelayNode -> Audio Output
        gainNodeOsc2.connect(feedbackGainNode).connect(delayNode).connect(audioContext.destination);
        // Connection: DelayNode -> FeedbackGainNode
        delayNode.connect(feedbackGainNode);

      } else {
        oscillator2.connect(gainNodeOsc2);
      }

      if (type == null) {
        oscillator2.setPeriodicWave(customWaveform);
      } else {
        oscillator2.type = type;
      }

      oscillator2.frequency.value = frequency;
    }

    start() {
      oscillator2.start();
    }

    stop(t) {
      oscillator2.stop(t);
    }
  }

  function notePressed(event) {

    //event.preventDefault();

    const dataset = event.target.dataset;

    if (dataset["pressed"]) {
      return;
    }

    dataset["pressed"] = "yes";

    const octave = dataset["octave"];
    const note = dataset["note"];
    const frequency = dataset["frequency"];

    const t_pressed = audioContext.currentTime;
    const volume = parseFloat(volumeControl.value);
    const volumeBalancer = parseFloat(volumenBalancer.value);
    const VolumenOsc1 = volume * (1 - volumeBalancer)
    const VolumenOsc2 = volume * volumeBalancer
    const volumenAll = VolumenOsc1 + VolumenOsc2
    const timeScale = parseFloat(timeScaleControl.value);
    const attackDuration = parseFloat(attackControl.value) * timeScale;
    const decayDuration = parseFloat(decayControl.value) * timeScale;
    const sustainLevel = parseFloat(sustainControl.value);
    const delay = parseFloat(delayControl.value);
    const feedback = parseFloat(feedbackControl.value);
    // DelayNode
    const MAX_DELAY_TIME = 1.0;
    const delayNode = audioContext.createDelay(MAX_DELAY_TIME);
    delayNode.delayTime.value = delay;
    // FeedbackGainNode
    const feedbackGainNode = audioContext.createGain();
    feedbackGainNode.gain.value = feedback;

    // Attack -> Decay -> Sustain
    const gainNode = audioContext.createGain();
    gainNodeOsc1 = audioContext.createGain();
    gainNodeOsc1.connect(audioContext.destination);
    gainNodeOsc1.gain.setValueAtTime(0, t_pressed);
    gainNodeOsc1.gain.linearRampToValueAtTime(VolumenOsc1, t_pressed + attackDuration);
    gainNodeOsc1.gain.setTargetAtTime(sustainLevel * VolumenOsc1, t_pressed + attackDuration, decayDuration);

    gainNodeOsc2 = audioContext.createGain();
    gainNodeOsc2.connect(audioContext.destination);
    gainNodeOsc2.gain.setValueAtTime(0, t_pressed);
    gainNodeOsc2.gain.linearRampToValueAtTime(VolumenOsc2, t_pressed + attackDuration);
    gainNodeOsc2.gain.setTargetAtTime(sustainLevel * VolumenOsc2, t_pressed + attackDuration, decayDuration);

    /*gainNodeOscAll = audioContext.createGain();
    gainNodeOscAll.connect(audioContext.destination);
    gainNodeOscAll.gain.setValueAtTime(0, t_pressed);
    gainNodeOscAll.gain.linearRampToValueAtTime(volumenAll, t_pressed + attackDuration);
    gainNodeOscAll.gain.setTargetAtTime(sustainLevel * volumenAll, t_pressed + attackDuration, decayDuration);
*/
    const keyID = note + octave;
    /*OSCILADOR 1*/

    if (!stateOsc1 && !stateOsc2) {
      alert('Encienda alguno de los 2 Osciladores')

    } else {
      /*OSCILADOR 1*/
      if (stateOsc1) {
        const typeOsc1 = wavePicker1
        const oscillator1 = new Oscillator1(typeOsc1, frequency, gainNodeOsc1, delayNode, feedbackGainNode);
        oscillator1.start();
        oscillatorMap.set(keyID, oscillator1);

      }

      // const type = wavePicker1.options[wavePicker1.selectedIndex].value;
      /*OSCILADOR 2*/
      if (stateOsc2) {
        const typeOsc2 = wavePicker2
        const oscillator2 = new Oscillator2(typeOsc2, frequency, gainNodeOsc2, delayNode, feedbackGainNode);
        oscillator2.start();
        oscillatorMap.set(keyID, oscillator2);
      }
    }

    gainNodeMapOsc1.set(keyID, gainNodeOsc1);
    gainNodeMapOsc2.set(keyID, gainNodeOsc2);
  }

  function noteReleased(event) {

    //event.preventDefault();

    const dataset = event.target.dataset;

    if (keyup) {
      keyup = false;
      dataset["pressed"] = "yes";
    }

    if (!dataset["pressed"]) {
      return;
    }

    delete dataset["pressed"];

    const octave = dataset["octave"];
    const note = dataset["note"];
    const frequency = dataset["frequency"];
    const keyID = note + octave;

    const oscillator1 = oscillatorMap.get(keyID);
    const oscillator2 = oscillatorMap.get(keyID);
    const gainNodeOsc1 = gainNodeMapOsc1.get(keyID);
    const gainNodeOsc2 = gainNodeMapOsc2.get(keyID);
    //const gainNodeOscAll = gainNodeOsc1 + gainNodeOsc2;

    const t_released = audioContext.currentTime;
    const timeScale = parseFloat(timeScaleControl.value);
    const releaseDuration = parseFloat(releaseControl.value) * timeScale;

    //gainNodeOscAll.gain.cancelScheduledValues(t_released);
    //gainNodeOscAll.gain.setValueAtTime(gainNodeOscAll.gain.value, t_released);
    //gainNodeOscAll.gain.linearRampToValueAtTime(0, t_released + releaseDuration);

    gainNodeOsc1.gain.cancelScheduledValues(t_released);
    gainNodeOsc1.gain.setValueAtTime(gainNodeOsc1.gain.value, t_released);
    gainNodeOsc1.gain.linearRampToValueAtTime(0, t_released + releaseDuration);


     gainNodeOsc2.gain.cancelScheduledValues(t_released);
     gainNodeOsc2.gain.setValueAtTime(gainNodeOsc2.gain.value, t_released);
     gainNodeOsc2.gain.linearRampToValueAtTime(0, t_released + releaseDuration);

    if (stateOsc1)
      oscillator1.stop(t_released + releaseDuration);

    if (stateOsc2)
      oscillator2.stop(t_released + releaseDuration);
  }
  // Función para mostrar el popup
  function mostrarPopup() {
    popup.style.display = "block";
  }

  // Función para ocultar el popup
  function ocultarPopup() {
    popup.style.display = "none";
  }

  // Agregar eventos click a los botones
  mostrarPopupBtn.addEventListener("click", mostrarPopup);
  cerrarPopupBtn.addEventListener("click", ocultarPopup);
  popup.addEventListener("click", ocultarPopup); // Cierra el popup al hacer clic fuera de él



}



document.addEventListener('DOMContentLoaded', function () {
  sintetizador(); // Llamada a la función algo cuando la página se carga


});

