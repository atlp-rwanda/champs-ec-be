import sequelize, { Op } from "sequelize";
import Message from "../models/message";
import Chatroom from "../models/Chatroom";
import { findAllUsers } from "../utils/finders";
import User from "../models/user";
import UserChatroom from "../models/userChatroom";

interface createNewMessageOptions {
  senderId: string;
  message: string;
  receiver: string;
  chatroomId?: string;
}

export const fetchAllUserChatrooms = async (
  userId: string
): Promise<Chatroom[] | null> => {
  try {
    const chatrooms = await Chatroom.findAll({
      where: sequelize.where(
        sequelize.fn("jsonb_build_array", sequelize.col("participants")),
        "@>",
        sequelize.fn("jsonb_build_array", [userId])
      ),
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "firstName", "lastName", "profileImage"],
          through: {
            as: "user_chatroom"
          }
        },
        {
          model: Message,
          as: "messages",
          attributes: ["id", "senderId", "message", "createdAt"]
        }
      ]
    });
    return chatrooms;
  } catch (error) {
    console.error("Sorry, There was an errror fetching user chatrooms:", error);
    throw new Error(
      `Sorry, There was an errror fetching user chatrooms: ${error}`
    );
  }
};

export const fetchChatroomByParticipants = async (
  userId: string,
  receiverId: string
): Promise<object | null> => {
  return await Chatroom.findAll({
    where: sequelize.where(
      sequelize.fn("jsonb_build_array", sequelize.col("participants")),
      "@>",
      sequelize.fn("jsonb_build_array", [userId, receiverId])
    )
  });
};

const createMessageAndStoreInChatroom = async (
  options: createNewMessageOptions,
  chatroom: Chatroom
) => {
  const newMessage = await Message.create({
    ...options,
    chatroomId: chatroom?.dataValues.id as string
  });
  await (chatroom as any).addMessage(newMessage);
  return newMessage;
};
export const createNewMessage = async (
  options: createNewMessageOptions
): Promise<Message | Error> => {
  try {
    const { senderId, message, receiver, chatroomId } = options;

    const chatrooms = (await fetchChatroomByParticipants(
      senderId,
      receiver
    )) as Chatroom[];

    let chatroom = chatrooms.filter(
      (item) =>
        item.dataValues.participants?.includes(senderId) &&
        item.dataValues.participants?.includes(receiver)
    )[0];
    if (chatrooms.length == 2) {
      chatroom = chatrooms.filter(
        (item) =>
          item.dataValues.initiator == senderId ||
          item.dataValues.initiator == receiver
      )[0];
      // create private message / public message
      return await createMessageAndStoreInChatroom(options, chatroom);
    }
    if (
      chatrooms.length == 1 &&
      chatroom.dataValues.initiator != senderId &&
      chatroom.dataValues.initiator != receiver
    ) {
      // allow user to user handshake
      // create new chatroom and  new message
      chatroom = (await Chatroom.create({
        participants: [senderId, receiver],
        initiator: senderId
      })) as Chatroom;
      await Promise.all([
        UserChatroom.create({
          userId: senderId,
          chatroomId: chatroom.dataValues.id as string
        }),
        UserChatroom.create({
          userId: receiver,
          chatroomId: chatroom.dataValues.id as string
        })
      ]);
      return await createMessageAndStoreInChatroom(options, chatroom);
    }
    if (
      chatrooms.length == 1 &&
      chatroom.dataValues.initiator == senderId &&
      chatroom.dataValues.initiator == receiver
    ) {
      // allow admin to send private message
      chatroom = chatrooms.filter(
        (item) =>
          item.dataValues.participants?.includes(senderId) &&
          item.dataValues.participants?.includes(receiver)
      )[0];
      // create private message
      return await createMessageAndStoreInChatroom(options, chatroom);
    }
    console.log("going on here 4 chatroom here", chatroom);
    chatroom = chatrooms.filter(
      (item) =>
        item.dataValues.participants?.includes(senderId) &&
        item.dataValues.participants?.includes(receiver)
    )[0];
    return await createMessageAndStoreInChatroom(options, chatroom);
  } catch (error) {
    console.error("Error creating new message:", error);
    return new Error(`Error creating new message: ${error}`);
  }
};

export const fetchChatroomById = async (chatroomId: string) => {
  try {
    const chatroom = await Chatroom.findByPk(chatroomId, {
      include: [
        {
          model: User,
          as: "users",
          attributes: ["id", "firstName", "lastName", "profileImage"]
        },
        {
          model: Message,
          as: "messages",
          attributes: ["id", "senderId", "message", "createdAt"],
          include: [
            {
              model: User,
              as: "sender",
              attributes: ["id", "firstName", "lastName", "profileImage"]
            }
          ]
        }
      ]
    });
    if (!chatroom) {
      return;
    }

    return chatroom;
  } catch (error) {
    console.error("error fetching chatroom by id:", error);
    return new Error(`Error fetching chatroom: ${error}`);
  }
};

export const createPublicChatroom = async (): Promise<Chatroom> => {
  try {
    // check if chatroom already exists
    const admin = (await User.findOne({
      where: {
        firstName: process.env.PUBLIC_CHATROOM_FIRSTNAME,
        lastName: process.env.PUBLIC_CHATROOM_LASTNAME
      }
    })) as User;
    const publicChatroom = (await Chatroom.findByPk(
      process.env.PUBLIC_CHATROOM_ID as string
    )) as Chatroom;
    // create new public chatroom
    if (!publicChatroom) {
      const newPublicChatroom = (await Chatroom.create({
        id: process.env.PUBLIC_CHATROOM_ID as string,
        initiator: admin.dataValues.id as string,
        participants: [admin.dataValues.id as string],
        isPrivate: false
      })) as Chatroom;
      const users = await findAllUsers();
      // loop through all users and insert them into public chatroom participants
      const newParticipants = [];
      for (let i = 0; i < users.length; i++) {
        const currentUser = users[i].id;
        newParticipants.push(currentUser);
        await Promise.all([
          UserChatroom.create({
            userId: currentUser,
            chatroomId: newPublicChatroom.dataValues.id as string
          })
        ]);
      }
      newPublicChatroom.update({
        participants: newParticipants
      });
    }
    console.log("SUCCESS: Public chatroom created successfully");
    return publicChatroom as Chatroom;
  } catch (err) {
    console.error("FAILED: Error creating public chatroom", err);
    throw new Error(`Error creating Public chatroom: ${err}`);
  }
};

export const insertNewUserIntoPublicChatroom = async (user: User) => {
  const currentUser = user.dataValues.id as string;
  // check if userId exists in public chatroom
  const publicChatroom = (await Chatroom.findByPk(
    process.env.PUBLIC_CHATROOM_ID as string
  )) as Chatroom;
  if (publicChatroom instanceof Chatroom) {
    const check =
      publicChatroom?.dataValues?.participants?.includes(currentUser);
    if (!check) {
      // insert new user id into public chatroom participants
      const newParticipants = publicChatroom.dataValues
        .participants as string[];
      newParticipants.push(currentUser);
      await Promise.all([
        UserChatroom.create({
          userId: currentUser,
          chatroomId: publicChatroom.dataValues.id as string
        })
      ]);
      publicChatroom.update({
        participants: newParticipants
      });
    }
    return;
  }
  return await createPublicChatroom();
};

export const fetchAllUsers = async (userId: string) => {
  try {
    const users = await User.findAll({
      where: {
        id: {
          [Op.ne]: userId
        }
      },
      attributes: ["id", "firstName", "lastName", "profileImage"]
    });
    return users;
  } catch (err) {
    console.error("Error fetching Users", err);
    return err;
  }
};
