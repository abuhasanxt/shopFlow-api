import { Role } from "../../generated/prisma/enums";
import { envVars } from "../config/env";
import { auth } from "../lib/auth";
import { prisma } from "../lib/prisma";

export const seedAdmin = async () => {
  try {
    const isAdminExist = await prisma.user.findFirst({
      where: {
        role: Role.ADMIN,
      },
    });
    if (isAdminExist) {
      console.log("Admin already exists. Skipping seeding admin");
      return;
    }

    const adminUser = await auth.api.signUpEmail({
      body: {
        email: envVars.ADMIN_EMAIL,
        password: envVars.ADMIN_PASSWORD,
        name: "Admin Saheb",
        role: Role.ADMIN,
      },
    });
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: {
          id: adminUser.user.id,
        },
        data: {
          emailVerified: true,
        },
      });
    });
    const admin = await prisma.user.findUnique({
      where: {
        email: envVars.ADMIN_EMAIL,
      },
    });
    console.log("Admin Created ", admin);
  } catch (error) {
    console.error("Error seeding Admin: ", error);
    await prisma.user.delete({
      where: {
        email: envVars.ADMIN_EMAIL,
      },
    });
  }
};
