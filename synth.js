const notes = {
    "C4": 261.63,
    "Db4": 277.18,
    "D4": 293.66,
    "Eb4": 311.13,
    "E4": 329.63,
    "F4": 349.23,
    "Gb4": 369.99,
    "G4": 392.00,
    "Ab4": 415.30,
    "A4": 440,
    "Bb4": 466.16,
    "B4": 493.88,
    "C5": 523.25
}
  
// NOTE SELECTS
const noteSelectsDiv = document.querySelector('#note-selects-div');
  //noteSelectsDiv.appendChild(lineBreak);
for (let i = 0; i <= 7; i++) {
   // const lineBreak = document.createElement('br');
    const select = document.createElement('select');
    select.id = `note ${i + 1}`;
    for (let j = 0; j < Object.keys(notes).length; j++) {
        const option = document.createElement('option');
        option.value = j;
        option.innerText = `${Object.keys(notes)[j]}`;
        select.appendChild(option);
        select.addEventListener('change', setCurrentNotes)
    }
    noteSelectsDiv.appendChild(select);
}

let currentNotes = [0, 3, 0, 7, 8, 7, 3, 2]
const noteSelects = document.querySelectorAll('select');
function setNoteSelects() {
    for (let i = 0; i < currentNotes.length; i++) {
        noteSelects[i].value = currentNotes[i];
    }
}
  
function setCurrentNotes() {
    for (let i = 0; i < noteSelects.length; i++) {
        currentNotes[i] = noteSelects[i].value; 
    }
}
  
setNoteSelects();
  
  
// INIT CONTEXT AND MASTER VOLUME
var AudioContext = window.AudioContext ||
    window.webkitAudioContext;
  
const context = new AudioContext();
const masterVolume = context.createGain();
masterVolume.connect(context.destination);
masterVolume.gain.value = 0.2

const volumeControl = document.querySelector('#volume-control');

volumeControl.addEventListener('input', function(){
    masterVolume.gain.value = this.value;
});

//WAVEFORMS, initial waveform = sine

let sinGain = 1;
let squareGain = 0;
let triangleGain  = 0;
let sawToothGain = 0;

const sin = document.querySelector('#sin-level');
const square = document.querySelector('#square-level');
const triangle = document.querySelector('#triangle-level');
const sawtooth = document.querySelector('#sawtooth-level');

sin.addEventListener('input', function() {
    sinGain = this.value;
});

square.addEventListener('input', function() {
    squareGain = this.value;
});

triangle.addEventListener('input', function() {
    triangleGain = this.value;
});

sawtooth.addEventListener('input', function() {
    sawToothGain= this.value;
});



// CONTROLS

// Filter
let cutOffFrequency = 16000;

const filterControl = document.querySelector('#filter-control');

filterControl.addEventListener('input', function() {
    cutOffFrequency = Number(logSliderFreq(this.value));
});


// Envelope
let peakLevel = 1.0;
let attackTime = 0.3;
let sustainLevel = 0.8;
let sustainTime = 0.5;
let decayTime = 0.3;
let releaseTime = 0.3;
let noteDuration = attackTime + decayTime + releaseTime + sustainTime;
  
const sustainLevelControl = document.querySelector('#sustain-level');
const attackControl = document.querySelector('#attack-control');
const decayControl = document.querySelector('#decay-control');
const sustainControl = document.querySelector('#sustain-control');
const releaseControl = document.querySelector('#release-control');

sustainLevelControl.addEventListener('input', function() {
    sustainLevel = Number(this.value);
});

attackControl.addEventListener('input', function() {
    attackTime = Number(this.value);
    noteDuration = attackTime + decayTime + releaseTime + sustainTime;
});

decayControl.addEventListener('input', function() {
    decayTime = Number(this.value);
    noteDuration = attackTime + decayTime + releaseTime + sustainTime;
});

sustainControl.addEventListener('input', function() {
    sustainTime = Number(this.value);
    noteDuration = attackTime + decayTime + releaseTime + sustainTime;
});

releaseControl.addEventListener('input', function() {
    releaseTime = Number(this.value);
    noteDuration = attackTime + decayTime + releaseTime + sustainTime;
});



// LFO
let vibratoSpeed = 0;
let vibratoAmount = 0;
let tremoloAmount = 0;
let tremoloSpeed = 0;

const vibratoAmountControl = document.querySelector('#vibrato-amount-control');
const vibratoSpeedControl= document.querySelector('#vibrato-speed-control');
const tremoloAmountControl = document.querySelector('#tremolo-amount-control');
const tremoloSpeedControl= document.querySelector('#tremolo-speed-control');

vibratoAmountControl.addEventListener('input', function() {
    vibratoAmount = this.value;
});

vibratoSpeedControl.addEventListener('input', function() {
    vibratoSpeed = this.value;
});

tremoloAmountControl.addEventListener('input', function() {
    tremoloAmount = this.value;
});

tremoloSpeedControl.addEventListener('input', function() {
    tremoloSpeed = this.value;
});




// Delay
const delayAmountControl = document.querySelector('#delay-amount-control');
const delayTimeControl= document.querySelector('#delay-time-control');
const feedbackControl= document.querySelector('#feedback-control');
const delay = context.createDelay();
const feedback = context.createGain();
const delayAmountGain = context.createGain();

delayAmountGain.connect(delay)
delay.connect(feedback)
feedback.connect(delay)
delay.connect(masterVolume)


delay.delayTime.value = 0;
delayAmountGain.gain.value = 0;
feedback.gain.value = 0;

delayAmountControl.addEventListener('input', function() {
    delayAmountGain.value = this.value;
})

delayTimeControl.addEventListener('input', function() {
    delay.delayTime.value = this.value;
})

feedbackControl.addEventListener('input', function() {
    feedback.gain.value = this.value;
})


// notes

//const note1 = document.querySelector('#effect-button1');
//note1.addEventListener('click', function() {
  //  playCurrentNote(262.63);
//});

// Select all buttons starting with 'effect-button'
const buttons = document.querySelectorAll('.key'); 
buttons.forEach(button => {
    button.addEventListener('click', function() {
        playCurrentNote(this.dataset.frequency);
    });
});


//SYNTHESIZER BUTTONS
const startButton = document.querySelector('#start-button');
const stopButton = document.querySelector('#stop-button');
const toggleButton = document.querySelector('#toggle-button');
const resetButton = document.querySelector('#reset-button');
const tempoControl = document.querySelector('#tempo-control');
let tempo = 60.0;
let currentNoteIndex = 0;
let isPlaying = false;

tempoControl.addEventListener('input', function() {
    tempo = Number(this.value);
}, false);

startButton.addEventListener('click', function() {
    if (!isPlaying){
        isPlaying = true;
        noteLoop();
    }
})

stopButton.addEventListener('click', function() {
    isPlaying = false;
})

toggleButton.addEventListener('click', function() {
    if (!isPlaying){
        isPlaying = true;
        noteLoop();
    } else {
        isPlaying = false;
    }
})

resetButton.addEventListener('click', function() {
    //isPlaying = false;

    masterVolume.gain.value = 0.2
    volumeControl.value = 0.2;

    sinGain= 1;
    squareGain = 0;
    triangleGain = 0;
    sawToothGain = 0;
    sin.value = 1;
    square.value = 0;
    triangle.value = 0;
    sawtooth.value = 0;

    sustainLevel = 0.8;
    sustainLevelControl.value = 0.8;

    tempo = 60.0;
    tempoControl.value = tempo;

    cutOffFrequency = 16000;
    filterControl.value = 48;

    attackTime = 0.3;
    decayTime = 0.3;
    sustainTime = 0.5;
    releaseTime = 0.3;
    noteDuration = attackTime + decayTime + releaseTime + sustainTime;
    //sustainLevel = 0.8;
    
   // noteLength = 1; make note duration
    attackControl.value = attackTime;
    decayControl.value = decayTime;
    sustainControl.value = sustainTime;
    releaseControl.value = releaseTime;
    //noteLengthControl.value = noteLength;

    vibratoSpeed = 0;
    vibratoAmount = 0;
    vibratoSpeedControl.value = vibratoSpeed;
    vibratoAmountControl.value = vibratoAmount;

    tremoloAmount = 0;
    tremoloSpeed = 0;
    tremoloAmountControl.value = 0;
    tremoloSpeedControl.value = 0;

    delay.delayTime.value = 0;
    feedback.gain.value = 0;
    delayAmountGain.gain.value = 0; 
    delayTimeControl.value = 0;
    feedbackControl.value = 0;
    delayAmountControl.value = 0;
})

// set by the tempo control
function noteLoop() {
    const secondsPerBeat = 60.0 / tempo;  // made 60 for bpm
    if (isPlaying) {
        playCurrentNote();
        nextNote();
        window.setTimeout(function() {
            noteLoop();
        }, secondsPerBeat * 1000)
    };
   //console.log("asdfasdf");
}

//active and inactive note color
function nextNote() {
    noteSelects[currentNoteIndex].style.background = "yellow";
    if (noteSelects[currentNoteIndex - 1]) {
        noteSelects[currentNoteIndex - 1].style.background = "white";
    } else {
        noteSelects[7].style.background = "white"
    }
    currentNoteIndex++;
    if (currentNoteIndex === 8) {
        currentNoteIndex = 0;
    }
}
 //  LFO - low frequency oscillator
 // on default use the frequency from the note loop, otherwise from arg
function playCurrentNote(frequency = null) {
    const osc1 = context.createOscillator(); //sin
    const osc2 = context.createOscillator(); //triangle
    const osc3 = context.createOscillator(); //square
    const osc4 = context.createOscillator(); //sawtooth

    const noteGain1 = context.createGain();
    const noteGain2 = context.createGain();
    const noteGain3 = context.createGain();
    const noteGain4 = context.createGain();

    noteGain1.gain.value = sinGain;
    noteGain2.gain.value = squareGain;
    noteGain3.gain.value = triangleGain;
    noteGain4.gain.value = sawToothGain;

    osc1.connect(noteGain1);
    osc2.connect(noteGain2);
    osc3.connect(noteGain3);
    osc4.connect(noteGain4);

    //mixed gain node of combined signal
    const mixerGainNode = context.createGain();

    noteGain1.connect(mixerGainNode);
    noteGain2.connect(mixerGainNode);
    noteGain3.connect(mixerGainNode);
    noteGain4.connect(mixerGainNode);
    

    // 5 second order biquad filters
    const filter1 = context.createBiquadFilter();
    filter1.type = 'lowpass'; //can be lowpass bandpass highpass
    filter1.frequency.setTargetAtTime(cutOffFrequency, context.currentTime, 0);

    const filter2 = context.createBiquadFilter();
    filter2.type = 'lowpass'; //can be lowpass bandpass highpass
    filter2.frequency.setTargetAtTime(cutOffFrequency, context.currentTime, 0);

    const filter3 = context.createBiquadFilter();
    filter3.type = 'lowpass'; //can be lowpass bandpass highpass
    filter3.frequency.setTargetAtTime(cutOffFrequency, context.currentTime, 0);

    const filter4 = context.createBiquadFilter();
    filter4.type = 'lowpass'; //can be lowpass bandpass highpass
    filter4.frequency.setTargetAtTime(cutOffFrequency, context.currentTime, 0);

    const filter5 = context.createBiquadFilter();
    filter5.type = 'lowpass'; //can be lowpass bandpass highpass
    filter5.frequency.setTargetAtTime(cutOffFrequency, context.currentTime, 0);

    mixerGainNode.connect(filter1);
    filter1.connect(masterVolume);
    //mixerGainNode.connect(delay);
    //filter1.connect(mixerGainNode);


   // mixerGainNode.connect(filter1);
    //filter1.connect(filter2);
    //filter2.connect(context.destination);
   // filter5.connect(context.destination);
    //filter5.connect(mixerGainNode);


    //connect filter to mixer gain node
    

    const lfoGain = context.createGain();
    lfoGain.gain.setValueAtTime(vibratoAmount, 0);
    lfoGain.connect(osc1.frequency)
    lfoGain.connect(osc2.frequency)
    lfoGain.connect(osc3.frequency)
    lfoGain.connect(osc4.frequency)


    const lfo = context.createOscillator();
    lfo.frequency.setValueAtTime(vibratoSpeed, 0);
    lfo.start(0);
    lfo.stop(context.currentTime + noteDuration);
    lfo.connect(lfoGain); 

    const tremoloLfo = context.createOscillator();
    const tremoloGain = context.createGain();

    tremoloLfo.frequency.setValueAtTime(tremoloSpeed, 0);
    tremoloGain.gain.setValueAtTime(tremoloAmount, 0);

   //Tremolo LFO modulate tremoloGain gain
    tremoloLfo.connect(tremoloGain.gain);

    //connect gain to mixerGainNode
    mixerGainNode.connect(tremoloGain);

    //pass through the filter
   tremoloGain.connect(filter1);

    tremoloLfo.start(0);
    tremoloLfo.stop(context.currentTime + noteDuration);

    





    osc1.type = 'sine';
    osc2.type = 'square';
    osc3.type = 'triangle';
    osc4.type = 'sawtooth';


    // selection based on whether the frequency was given from button press
    const noteFrequency = frequency || Object.values(notes)[currentNotes[currentNoteIndex]];
    osc1.frequency.setValueAtTime(noteFrequency, 0);
    osc1.start(0);
    osc1.stop(context.currentTime + noteDuration);

    osc2.frequency.setValueAtTime(noteFrequency, 0);
    osc2.start(0);
    osc2.stop(context.currentTime + noteDuration);

    osc3.frequency.setValueAtTime(noteFrequency, 0);
    osc3.start(0);
    osc3.stop(context.currentTime + noteDuration);

    osc4.frequency.setValueAtTime(noteFrequency, 0);
    osc4.start(0);
    osc4.stop(context.currentTime + noteDuration);
    //osc.connect(noteGain);

    //apply envelope to mixer gain node
    mixerGainNode.gain.setValueAtTime(0, 0);
    mixerGainNode.gain.linearRampToValueAtTime(peakLevel, context.currentTime + attackTime);
    mixerGainNode.gain.setValueAtTime(sustainLevel, context.currentTime + attackTime + decayTime);
    mixerGainNode.gain.setValueAtTime(sustainLevel, attackTime + decayTime + sustainTime);
    mixerGainNode.gain.linearRampToValueAtTime(0, context.currentTime + noteDuration);


    //mixerGainNode.connect(masterVolume);
    //mixerGainNode.connect(delay);


    //debug prints to console

    //console.log("noteDuration " + noteDuration);
    //console.log(cutOffFrequency);
    //console.log(logSlider(20000));
    //console.log(logSliderFreq(48.38483));
    console.log(cutOffFrequency);
    //console.log(vibratoAmount);
    //console.log(vibratoSpeed);
    console.log(noteGain1.gain.value);
    console.log(noteGain2.gain.value);
    console.log(noteGain3.gain.value);
    console.log(noteGain4.gain.value);
}


function logSliderVal(frequency) {
    const minp = 0;
    const maxp = 50;

    // The min and max frequency in Hz
    const minv = Math.log(20);
    const maxv = Math.log(20000);

    // Calculate scale
    const scale = (maxp-minp) / (maxv-minv);
    return (Math.log(frequency) - minv) * scale + minp ;
}

 function logSliderFreq(sliderValue) {
        const minp = 0;
        const maxp = 50;

        // The min and max frequency in Hz
        const minv = Math.log(20);
        const maxv = Math.log(20000);

        // Calculate scale
        const scale = (maxv-minv) / (maxp-minp);
        return Math.ceil(Math.exp(minv + scale*(sliderValue-minp)));
    }