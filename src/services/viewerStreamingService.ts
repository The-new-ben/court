const SIGNALING_URL = 'http://localhost:5001/api/stream';

export class ViewerStreamingService {
  private peer: RTCPeerConnection | null = null;

  async join(roomId: string): Promise<MediaStream> {
    this.peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    const remoteStream = new Promise<MediaStream>((resolve) => {
      if (!this.peer) return;
      this.peer.ontrack = (event) => resolve(event.streams[0]);
    });

    const offer = await this.peer.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
    await this.peer.setLocalDescription(offer);

    const response = await fetch(`${SIGNALING_URL}/viewer/${roomId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sdp: offer.sdp })
    });
    const data = await response.json();
    await this.peer.setRemoteDescription({ type: 'answer', sdp: data.sdp });

    return remoteStream;
  }

  leave() {
    this.peer?.close();
    this.peer = null;
  }
}

export const viewerStreamingService = new ViewerStreamingService();
