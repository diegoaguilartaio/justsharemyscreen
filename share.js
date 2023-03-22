// Initialize the PeerJS connection
const peer = new Peer();
let peerId;
let link;
let screenStream = null;

peer.on('open', function (id) {
    console.log('My peer ID is: ' + id);
    peerId = id;
});

// Start the screen share
function startScreenShare() {
    if (screenStream != null) {
        var tracks = screenStream.getTracks();
        for( var i = 0 ; i < tracks.length ; i++ ) tracks[i].stop();
        peer.removeAllListeners('call');
    }
    // Get the user's screen
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
        screenStream = stream;
        // Create a new MediaConnection to the peer
        // const conn = peer.connect(peerId);

        link = `${window.location.origin}/receive.html?id=${peerId}`;
        // Show the link to the other page
        // alert(`Share this link: ${link}`);
        let linkText = document.getElementById("linkText");
        linkText.innerHTML = "Link: " + link;

        peer.on('call', (call) => {
            console.log("someone is calling, stream:", stream);
            // Answer the call, providing our mediaStream
            call.answer(stream);
        });
    });
}

function copyLink() {
    navigator.clipboard.writeText(link).then(() => {
        //alert(`Link copied to clipboard: ${link}`);
        createToast(`Link copied to clipboard: ${link}`);
    });
}

function createToast(message = null) {
    const toast = document.getElementById('toasts');
    const notif = document.createElement('div');

    notif.classList.add('toast');
    notif.innerText = message;
    toast.appendChild(notif);

    setTimeout(() => {
        notif.remove();
    }, 3000)
}
