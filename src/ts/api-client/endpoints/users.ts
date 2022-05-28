import { Client, Endpoints, EndpointData, Theme } from "../../../types";

const BASE_PATH = "/users";

export default function getUsersEndpoints(
  apiClient: Client
): Endpoints["users"] {
  async function getData(): EndpointData {
    return await apiClient.get(BASE_PATH);
  }

  async function create(
    username: string,
    email: string,
    userID: string
  ): EndpointData {
    return await apiClient.post(`${BASE_PATH}/signup`, {
      payload: {
        email,
        username,
        userID
      }
    });
  }

  async function getNameAvailability(name: string): EndpointData {
    return await apiClient.get(`${BASE_PATH}/checkName/${name}`);
  }

  async function _delete(): EndpointData {
    return await apiClient.delete(BASE_PATH);
  }

  async function updateName(name: string): EndpointData {
    return await apiClient.patch(`${BASE_PATH}/name`, { payload: { name } });
  }

  async function updateEmail(
    newEmail: string,
    previousEmail: string
  ): EndpointData {
    const payload = {
      newEmail,
      previousEmail
    };

    return await apiClient.patch(`${BASE_PATH}/email`, { payload });
  }

  async function deletePersonalBests(): EndpointData {
    return await apiClient.delete(`${BASE_PATH}/personalBests`);
  }

  async function getCustomThemes(): EndpointData {
    return await apiClient.get(`${BASE_PATH}/customThemes`);
  }

  async function editCustomTheme(
    themeId: string,
    newTheme: Partial<Theme>
  ): EndpointData {
    const payload = {
      themeId: themeId,
      theme: {
        name: newTheme.name,
        colors: newTheme.colors
      }
    };
    return await apiClient.patch(`${BASE_PATH}/customThemes`, { payload });
  }

  async function deleteCustomTheme(themeId: string): EndpointData {
    const payload = {
      themeId: themeId
    };
    return await apiClient.delete(`${BASE_PATH}/customThemes`, { payload });
  }

  async function addCustomTheme(newTheme: Partial<Theme>): EndpointData {
    const payload = { name: newTheme.name, colors: newTheme.colors };
    return await apiClient.post(`${BASE_PATH}/customThemes`, { payload });
  }

  async function linkDiscord(data: {
    tokenType: string;
    accessToken: string;
    userID?: string;
  }): EndpointData {
    return await apiClient.post(`${BASE_PATH}/discord/link`, {
      payload: { data }
    });
  }

  async function unlinkDiscord(): EndpointData {
    return await apiClient.post(`${BASE_PATH}/discord/unlink`);
  }

  return {
    getData,
    create,
    getNameAvailability,
    delete: _delete,
    updateName,
    updateEmail,
    deletePersonalBests,
    linkDiscord,
    unlinkDiscord,
    getCustomThemes,
    addCustomTheme,
    editCustomTheme,
    deleteCustomTheme
  };
}
