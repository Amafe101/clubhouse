export default class Attendee {
  constructor({ id, username, avatar, isSpeaker, roomId, peerId }) {
    this.id = id;
    this.avatar = avatar || "";
    this.isSpeaker = isSpeaker;
    this.roomId = roomId;
    this.peerId = peerId;

    const name = username || "Usuário Anônimo";
    this.username = name;

    const [firstName, lastName] = name.split(/\s/);
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
