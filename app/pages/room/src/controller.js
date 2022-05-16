import { constants } from "../../_shared/constants.js";
import Attendee from "./entities/attendee.js";

export default class RoomController {
  constructor({ roomInfo, socketBuilder, view, peerBuilder, roomService }) {
    this.socketBuilder = socketBuilder;
    this.peerBuilder = peerBuilder;
    this.roomInfo = roomInfo;
    this.view = view;
    this.roomService = roomService;

    this.socket = {};
  }

  static async initialize(deps) {
    return new RoomController(deps)._initialize();
  }

  async _initialize() {
    this._setupViewEvents();
    this.roomService.init();

    this.socket = this._setupSocket();
    this.roomService.setCurrentPeer(await this._setupWebRTC());
  }

  _setupViewEvents() {
    this.view.configureLeaveButton();
    this.view.updateUserImage(this.roomInfo.user);
    this.view.updateRoomTopic(this.roomInfo.room);
    this.view.configureClapButton(this.onClapPressed());
    this.view.configureMicrophoneButton(this.onMicrophonePressed());
  }

  onMicrophonePressed() {
    return async () => {
      await this.roomService.toggleAudioActivation();
    };
  }

  onClapPressed() {
    return () => {
      this.socket.emit(constants.events.SPEAK_REQUEST, this.roomInfo.user);
    };
  }

  _setupSocket() {
    return this.socketBuilder
      .setOnUserConnected(this.onUserConnected())
      .setOnUserDisconnected(this.onDisconnected())
      .setOnRoomUpdated(this.onRoomUpdated())
      .setOnUserProfileUpgrade(this.onUserProfileUpgrade())
      .setOnSpeakRequested(this.onSpeakRequested())
      .build();
  }

  onSpeakRequested() {
    return (data) => {
      const attendee = new Attendee(data);
      const result = prompt(
        `${attendee.username} pediu para falar! Deseja aceitar?`
      );
      this.socket.emit(constants.events.SPEAK_ANSWER, {
        answer: !!Number(result),
        user: attendee,
      });
    };
  }

  async _setupWebRTC() {
    return this.peerBuilder
      .setOnError(this.onPeerError())
      .setOnConnectionOpened(this.onPeerConnectionOpened())
      .setOnCallReceived(this.onCallReceived())
      .setOnCallError(this.onCallError())
      .setOnCallClose(this.onCallClose())
      .setOnStreamReceived(this.onStreamReceived())
      .build();
  }

  onStreamReceived() {
    return (call, stream) => {
      const callerId = call.peer;
      console.log("onStreamReceived", call, stream);
      const { isCurrentId } = this.roomService.addReceivedPeer(call);
      this.view.renderAudioElement({
        callerId,
        stream,
        isCurrentId,
      });
    };
  }

  onCallClose() {
    return (call) => {
      console.log("onCallClose", call);
      const peerId = call.peer;
      this.roomService.disconnectPeer({ peerId });
    };
  }

  onCallError() {
    return (call, error) => {
      console.log("onCallError", call, error);
      const peerId = call.peer;
      this.roomService.disconnectPeer({ peerId });
    };
  }

  onCallReceived() {
    return async (call) => {
      const stream = await this.roomService.getCurrentStream();
      console.log("answering call", call);
      call.answer(stream);
    };
  }

  onPeerError() {
    return (error) => {
      console.error("deu ruim", error);
    };
  }

  onPeerConnectionOpened() {
    return (peer) => {
      console.log("peeeeeeer", peer);
      this.roomInfo.user.peerId = peer.id;
      this.socket.emit(constants.events.JOIN_ROOM, this.roomInfo);
    };
  }

  onUserProfileUpgrade() {
    return (user) => {
      console.log("onUserProfileUpgrade", user);

      if (user.isSpeaker) {
        this.roomService.upgradeUserPermission(user);
        this.view.addAttendeeOnGrid(user, true);
      }

      this.activateUserFeatures();
    };
  }

  onRoomUpdated() {
    return (room) => {
      console.log("room list!", room);
      this.roomService.updateCurrentUserProfile(room);
      this.view.updateAttendeesOnGrid(room);
      this.activateUserFeatures();
    };
  }

  onDisconnected() {
    return (user) => {
      console.log(`${user.username + user.id} disconnected!`);

      this.view.removeAttendeeFromGrid(user.id);

      this.roomService.disconnectPeer(user);
    };
  }

  onUserConnected() {
    return (user) => {
      console.log("user connected!", user);
      this.view.addAttendeeOnGrid(user);

      this.roomService.callNewUser(user);
    };
  }

  activateUserFeatures() {
    const currentUser = this.roomService.getCurrentUser();
    this.view.showUserFeatures(currentUser.isSpeaker);
  }
}
