import {
  Client,
  Endpoints,
  EndpointData,
  Saved,
  Session
} from "../../../types";
import { CLIENT_VERSION } from "../../version";

const BASE_PATH = "/sessions";

export default function getSessionsEndpoints(
  apiClient: Client
): Endpoints["sessions"] {
  async function get(): EndpointData {
    return await apiClient.get(BASE_PATH, {
      headers: {
        "Client-Version": CLIENT_VERSION
      }
    });
  }

  async function add(session: Session): EndpointData {
    return await apiClient.post(BASE_PATH, {
      headers: {
        "Client-Version": CLIENT_VERSION
      },
      payload: {
        session
      }
    });
  }

  async function deleteAll(): EndpointData {
    return await apiClient.delete(BASE_PATH, {
      headers: {
        "Client-Version": CLIENT_VERSION
      }
    });
  }

  async function deleteSession(session: Saved<Session>): EndpointData {
    return await apiClient.delete(`${BASE_PATH}/${session._id}`, {
      headers: {
        "Client-Version": CLIENT_VERSION
      }
    });
  }

  return { get, add, deleteAll, delete: deleteSession };
}
