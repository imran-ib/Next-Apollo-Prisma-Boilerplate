async function IsAdmin(ctx) {
  const user = await ctx.prisma.query.user(
    {
      where: {
        id: ctx.request.userId
      }
    },
    `{
              id
              name
              email
              permissions
            }`
  );
  if (!user) throw new Error("You Must Login ");

  return user.permissions.includes("ADMIN");
}

module.exports = IsAdmin;
