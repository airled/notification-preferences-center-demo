import sequelize from "@/config/sequelize";
import { Trace, User } from "@/models";

export default async function updateUserQuietHours(
  user: User,
  startQuietHours?: string,
  endQuietHours?: string,
) {
  if (!startQuietHours && !endQuietHours) return;

  const transaction = await sequelize.transaction();

  const changes: Record<string, string> = { userId: user.id.toString() };

  try {
    if (startQuietHours) {
      user.startQuietHours = startQuietHours;
      changes["startQuietHours"] = startQuietHours;
    }

    if (endQuietHours) {
      user.endQuietHours = endQuietHours;
      changes["endQuietHours"] = endQuietHours;
    }

    await user.save({ transaction });

    await Trace.create(
      {
        action: "updateUserQuietHours",
        input: JSON.stringify(changes),
        output: JSON.stringify({}),
      },
      { transaction },
    );

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
