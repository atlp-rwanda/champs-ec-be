import { v4 as uuidv4 } from "uuid";

export async function up(queryInterface) {
  await queryInterface.bulkInsert(
    "users",
    [
      {
        id: uuidv4(),
        firstName: "Emmanuel",
        lastName: "munezero",
        email: "test1@gmail.com",
        password: uuidv4(),
        phone: "+250786534332",
        birthDate: new Date(),
        preferredLanguage: "kinyarwanda",
        preferredcurrency: "$",
        whereYouLive: "kigali street KN 250 st",
        billingAddress: "kigali street KN 250 st",
        profileImage: "test.png",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        firstName: "Emmanuel",
        lastName: "munezero",
        email: "tes2t3@gmail.com",
        password: uuidv4(),
        phone: "+250786534332",
        birthDate: new Date(),
        preferredLanguage: "kinyarwanda",
        preferredcurrency: "$",
        whereYouLive: "kigali street KN 250 st",
        billingAddress: "kigali street KN 250 st",
        profileImage: "test.png",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        firstName: "Emmanuel",
        lastName: "munezero",
        email: "test5@gmail.com",
        password: uuidv4(),
        phone: "+250786534332",
        birthDate: new Date(),
        preferredLanguage: "kinyarwanda",
        preferredcurrency: "$",
        whereYouLive: "kigali street KN 250 st",
        billingAddress: "kigali street KN 250 st",
        profileImage: "test.png",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: uuidv4(),
        firstName: "Emmanuel",
        lastName: "munezero",
        email: "testwde2@gmail.com",
        password: uuidv4(),
        phone: "+250786534332",
        birthDate: new Date(),
        preferredLanguage: "kinyarwanda",
        preferredcurrency: "$",
        whereYouLive: "kigali street KN 250 st",
        billingAddress: "kigali street KN 250 st",
        profileImage: "test.png",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    {}
  );
}
export async function down(queryInterface) {
  await queryInterface.bulkDelete("users", null, {});
}
