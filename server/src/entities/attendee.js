export default class Attendee {
  constructor({ id, username, avatar, isSpeaker, roomId, peerId }) {
    this.id = id;
    this.username = username;
    this.avatar = avatar;
    this.isSpeaker = isSpeaker;
    this.roomId = roomId;
    this.peerId = peerId;
  }
}
