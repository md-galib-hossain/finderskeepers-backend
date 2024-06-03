import prisma from "../src/app/utils/prisma";
import bcrypt from 'bcrypt'
import { UserRole } from "@prisma/client";

const seedAdmin = async () => {
  try {
    // Check if the admin already exists
    const isExistAdmin = await prisma.user.findFirst({
      where: {
        role: UserRole.ADMIN,
      },
    });

    // If admin already exists, return
    if (isExistAdmin) {
      console.log("Admin Already Exists");
      return;
    }

    // Hash the default password
    const hashedPassword = await bcrypt.hash("123456", 10);

    // Generate a unique userName based on the email
    const email = "admin@gmail.com";
    const userName = email.split("@")[0]; // Extract the username part of the email

    // Create the admin user
    const adminData = await prisma.user.create({
      data: {
        name: "admin",
        email: email,
        userName: userName, // Assign the generated userName
        password: hashedPassword,
        role: UserRole.ADMIN,
      },
    });

    // Create the admin profile
    const adminProfileData = await prisma.userProfile.create({
      data: {
        bio: "Admin Bio",
        age: 30, // Set the admin's age
        userId: adminData.id,
      },
    });

    console.log("Admin seeded successfully:", adminData);
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seedAdmin();
