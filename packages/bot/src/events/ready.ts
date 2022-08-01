import { EventBuilder } from "fero-dc";

export default new EventBuilder<"ready">()
  .event("ready")
  .run(async (client) => {
    console.log(`${client.user.tag} is ready!`);
  });
