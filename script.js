var socket = io();

var playing = 0;
var canScan = true;

socket.on('serverStart', (callback) => {
    if (playing = 1) {
        callback(1)
        window.alert('Server restarted!')
        window.location.reload()
    }    
});

document.getElementById('teama').addEventListener('click', function() {
    socket.emit('teama', (response) => {
        console.log(response)
        if (response == 0) {
            window.alert('User already in team a!')
        } else {
            document.getElementById('join').style.display = 'none';
            document.getElementById('scanner').style.display = 'block';
            document.getElementById('clue').innerHTML = response;
            playing = 1;
        }
    })
})

document.getElementById('teamb').addEventListener('click', function() {
    socket.emit('teamb', (response) => {
        if (response == 0) {
            window.alert('User already in team b!')
        } else {
            document.getElementById('join').style.display = 'none';
            document.getElementById('scanner').style.display = 'block';
            document.getElementById('clue').innerHTML = response;
            playing = 1;
        }
    })
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function onScanSuccess(decodedText, decodedResult) {
    console.log(`Scan result: ${decodedText}`, decodedResult);
    if (canScan) {
        socket.emit('codescan', decodedText, async (response) => {
            if (response == 2) {
                window.alert('This is the last clue!')
            } else if (response == 1) {
                window.alert('Invalid code. This may be a scan error. Please try multiple times. This also may be the wrong product.')
            } else if (response == 0) {
                window.alert('You are not supposed to be here!')
                window.close()
            } else if (response.lastClue) {
                document.getElementById('scanner').style.display = 'none';
                document.getElementById('clue').innerHTML = response.clue;
            } else {
                document.getElementById('clue').innerHTML = response;
                canScan = false;
                await sleep(5000)
                canScan = true;
            }
        })
    }
}

var html5QrcodeScanner = new Html5QrcodeScanner(
	"scanner", {
        fps: 10,
        qrbox: 250,
        experimentalFeatures: {
            useBarCodeDetectorIfSupported: true
        }
    });
html5QrcodeScanner.render(onScanSuccess);