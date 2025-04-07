"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import db from "@/lib/prisma";
export async function getOrganization(slug) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) {
    throw new Error("User Not Found!!");
  }
  const organization = await clerkClient().organizations.getOrganization({
    slug,
  });

  if (!organization) {
    return null;
  }
  // Checks if User is the member of the Organization
  const { data: membership } =
    await clerkClient().organizations.getOrganizationMembershipList({
      organizationId: organization.id,
    });
  const userMemberShip = membership.find(
    (member) => member.publicUserData.userId === userId
  );
  // if user is not a member of the organization , return null
  if (!userMemberShip) {
    return null;
  }
  return organization;
}
