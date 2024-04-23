// // tests/chatsController.test.js
// import { expect } from "chai";
// import sinon from "sinon";
// import { Namespace, Server, Socket } from "socket.io";
// import { v4 as uuidv4 } from "uuid";
// import { DefaultEventsMap } from "socket.io/dist/typed-events";
// import ChatsController from "../controllers/chats.controller";
// import Message from "../models/messages";
// import User from "../models/user";
// import { tokenDecode } from "../utils/token.generator";

// describe("ChatsController", () => {
//   let mockIO:
//     | Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
//     | Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>;
//   let mockSocket: Socket<
//     DefaultEventsMap,
//     DefaultEventsMap,
//     DefaultEventsMap,
//     any
//   >;
//   let sandbox: sinon.SinonSandbox;

//   beforeEach(() => {
//     sandbox = sinon.createSandbox();
//     mockIO = new Server();
//     mockSocket = new Socket(mockIO);
//     mockSocket.handshake = {
//       auth: {
//         token: "mockToken"
//       }
//     };
//     sandbox
//       .stub(tokenDecode, "tokenDecode")
//       .returns({ id: uuidv4(), email: "test@example.com" });
//   });

//   afterEach(() => {
//     sandbox.restore();
//   });

//   describe("initIO", () => {
//     it("should initialize the socket.io instance and set up event listeners", () => {
//       const onConnectionStub = sandbox.stub(mockIO, "on");
//       ChatsController.initIO(mockIO);

//       expect(onConnectionStub.calledOnce).to.be.true;
//       expect(onConnectionStub.calledWith("connection")).to.be.true;
//     });

//     it('should handle "connection" event and call appropriate methods', () => {
//       const emitStub = sandbox.stub(mockSocket, "emit");
//       const onStub = sandbox.stub(mockSocket, "on");
//       const getAllMessagesStub = sandbox
//         .stub(ChatsController, "getAllMessages")
//         .resolves([]);

//       ChatsController.initIO(mockIO);
//       const connectionCallback = onConnectionStub.getCall(0).args[1];
//       connectionCallback(mockSocket);

//       expect(emitStub.calledOnceWith("all messages", [])).to.be.true;
//       expect(onStub.calledWith("chat message")).to.be.true;
//       expect(onStub.calledWith("typing")).to.be.true;
//       expect(onStub.calledWith("stop typing")).to.be.true;
//       expect(onStub.calledWith("disconnect")).to.be.true;

//       getAllMessagesStub.restore();
//     });
//   });

//   describe("getAllMessages", () => {
//     it("should retrieve all messages from the database", async () => {
//       const userId = uuidv4();
//       const mockMessages = [
//         {
//           id: uuidv4(),
//           senderId: userId,
//           message: "Hello",
//           sender: {
//             id: userId,
//             firstName: "John",
//             email: "john@example.com"
//           }
//         }
//       ];
//       sandbox.stub(Message, "findAll").resolves(mockMessages);

//       const messages = await ChatsController.getAllMessages();

//       expect(
//         Message.findAll.calledOnceWith({
//           include: [
//             {
//               model: User,
//               as: "sender",
//               attributes: ["id", "firstName", "email"]
//             }
//           ]
//         })
//       ).to.be.true;
//       expect(messages).to.deep.equal(mockMessages);
//     });
//   });
// });
