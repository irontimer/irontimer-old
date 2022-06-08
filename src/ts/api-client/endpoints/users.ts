import { HttpClient, EndpointData, Theme } from "../../../types";

const BASE_PATH = "/users";

export default class Users {
  constructor(private httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  async getData(): EndpointData {
    return await this.httpClient.get(BASE_PATH);
  }

  async create(name: string, email?: string, uid?: string): EndpointData {
    const payload = {
      email,
      name,
      uid
    };

    return await this.httpClient.post(`${BASE_PATH}/signup`, { payload });
  }

  async getNameAvailability(name: string): EndpointData {
    return await this.httpClient.get(`${BASE_PATH}/checkName/${name}`);
  }

  async delete(): EndpointData {
    return await this.httpClient.delete(BASE_PATH);
  }

  async updateName(name: string): EndpointData {
    return await this.httpClient.patch(`${BASE_PATH}/name`, {
      payload: { name }
    });
  }

  async updateEmail(newEmail: string, previousEmail: string): EndpointData {
    const payload = {
      newEmail,
      previousEmail
    };

    return await this.httpClient.patch(`${BASE_PATH}/email`, { payload });
  }

  async deletePersonalBests(): EndpointData {
    return await this.httpClient.delete(`${BASE_PATH}/personalBests`);
  }

  async getCustomThemes(): EndpointData {
    return await this.httpClient.get(`${BASE_PATH}/customThemes`);
  }

  async editCustomTheme(
    themeID: string,
    newTheme: Partial<Theme>
  ): EndpointData {
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

  async deleteCustomTheme(themeID: string): EndpointData {
    const payload = {
      themeID: themeID
    };
    return await this.httpClient.delete(`${BASE_PATH}/customThemes`, {
      payload
    });
  }

  async addCustomTheme(newTheme: Partial<Theme>): EndpointData {
    const payload = { name: newTheme.name, colors: newTheme.colors };
    return await this.httpClient.post(`${BASE_PATH}/customThemes`, { payload });
  }

  async linkDiscord(tokenType: string, accessToken: string): EndpointData {
    return await this.httpClient.post(`${BASE_PATH}/discord/link`, {
      payload: { tokenType, accessToken }
    });
  }

  async unlinkDiscord(): EndpointData {
    return await this.httpClient.post(`${BASE_PATH}/discord/unlink`);
  }
}
