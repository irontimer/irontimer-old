import {
  HttpClient,
  EndpointData,
  Theme,
  User,
  PersonalBest,
  UserStats
} from "@irontimer/utils";

const BASE_PATH = "/users";

export default class Users {
  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getData(): EndpointData<User> {
    return await this.httpClient.get(BASE_PATH);
  }

  async create(
    uid: string,
    username: string,
    email: string
  ): EndpointData<undefined> {
    const payload = {
      email,
      username,
      uid
    };

    return await this.httpClient.post(`${BASE_PATH}/signup`, { payload });
  }

  async getNameAvailability(name: string): EndpointData<undefined> {
    return await this.httpClient.get(`${BASE_PATH}/checkName/${name}`);
  }

  async updateName(name: string): EndpointData<undefined> {
    return await this.httpClient.patch(`${BASE_PATH}/name`, {
      payload: { name }
    });
  }

  async updateEmail(
    newEmail: string,
    previousEmail: string
  ): EndpointData<undefined> {
    const payload = {
      newEmail,
      previousEmail
    };

    return await this.httpClient.patch(`${BASE_PATH}/email`, { payload });
  }

  async getPersonalBests(): EndpointData<PersonalBest[] | undefined> {
    return await this.httpClient.get(`${BASE_PATH}/personalBests`);
  }

  async deletePersonalBests(): EndpointData<undefined> {
    return await this.httpClient.delete(`${BASE_PATH}/personalBests`);
  }

  async getCustomThemes(): EndpointData<Theme[]> {
    return await this.httpClient.get(`${BASE_PATH}/customThemes`);
  }

  async addCustomTheme(newTheme: Partial<Theme>): EndpointData<string> {
    const payload = { name: newTheme.name, colors: newTheme.colors };
    return await this.httpClient.post(`${BASE_PATH}/customThemes`, { payload });
  }

  async editCustomTheme(
    themeID: string,
    newTheme: Partial<Theme>
  ): EndpointData<undefined> {
    const payload = {
      themeID: themeID,
      theme: {
        name: newTheme.name,
        colors: newTheme.colors
      }
    };

    return await this.httpClient.patch(`${BASE_PATH}/customThemes`, {
      payload
    });
  }

  async deleteCustomTheme(themeID: string): EndpointData<undefined> {
    const payload = {
      themeID: themeID
    };

    return await this.httpClient.delete(`${BASE_PATH}/customThemes`, {
      payload
    });
  }

  async linkDiscord(
    tokenType: string,
    accessToken: string
  ): EndpointData<string> {
    return await this.httpClient.post(`${BASE_PATH}/discord/link`, {
      payload: { tokenType, accessToken }
    });
  }

  async unlinkDiscord(): EndpointData<undefined> {
    return await this.httpClient.post(`${BASE_PATH}/discord/unlink`);
  }

  async getStats(): EndpointData<UserStats> {
    return await this.httpClient.get(`${BASE_PATH}/stats`);
  }

  async delete(): EndpointData<undefined> {
    return await this.httpClient.delete(BASE_PATH);
  }
}
