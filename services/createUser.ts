import sequelize from "@/config/sequelize";
import { User, Source, DefaultSource, Trace } from "@/models";

export interface UserData {
  regionId: number;
  email: string;
  startQuietHours: string;
  endQuietHours: string;
}

export async function createUser(userData: UserData): Promise<User> {
  const { regionId, email, startQuietHours, endQuietHours } = userData;
  const defaultSources = await DefaultSource.findAll();

  const transaction = await sequelize.transaction();
  try {
    const user = await User.create(
      { regionId, email, startQuietHours, endQuietHours },
      { transaction },
    );

    await Trace.create(
      {
        action: "createUser",
        input: JSON.stringify(userData),
        output: JSON.stringify({ id: user.id }),
      },
      { transaction },
    );

    const defaultSourcesForUserDataset = defaultSources.map(defaultSource => {
      return {
        userId: user.id,
        channelId: defaultSource.channelId,
        notificationTypeId: defaultSource.notificationTypeId,
      };
    });
    const sources = await Source.bulkCreate(defaultSourcesForUserDataset, {
      transaction,
    });

    await Trace.create(
      {
        action: "createUserDefaults",
        input: JSON.stringify(defaultSourcesForUserDataset),
        output: JSON.stringify({ ids: sources.map(source => source.id) }),
      },
      { transaction },
    );

    await transaction.commit();
    return user;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
