class Attendee {
  constructor({ id, avatar, username }) {
    this.id = id;
    this.avatar = avatar;
    this.username = username;
  }
}

export default class Room {
  constructor({
    id,
    topic,
    subTopic,
    attendeesCount,
    roomLink,
    speakersCount,
    featuredAttendees,
    owner,
  }) {
    this.id = id;
    this.topic = topic;
    this.subTopic = subTopic || `Sala de ${owner.username}`;
    this.attendeesCount = attendeesCount;
    this.roomLink = roomLink;
    this.speakersCount = speakersCount;
    this.featuredAttendees = featuredAttendees?.map(
      (attendee) => new Attendee(attendee)
    );
    this.owner = new Attendee(owner);
    this.roomLink = roomLink;
  }
}
