import { getConfig } from '.';

const WTI_API_URL = 'https://webtranslateit.com/api/projects';

export type WtiErrorResponse = {
  error: string;
  request: string;
};

/**
 * Send a GET request to the WTI API
 *
 * @param path path of the API call
 */
export const wtiGet = async (path: string) => {
  const config = await getConfig();

  return await fetch(
    `${WTI_API_URL}/${config.project.apiKey}${path}`
  );
};

/**
 * Send a POST request to the WTI API
 *
 * @param path path of the API call
 * @param data data to be sent in the request body
 */
export const wtiPost = async (path: string, data: BodyInit) => {
  const config = await getConfig();

  return fetch(
    `${WTI_API_URL}/${config.project.apiKey}${path}`,
    {
      method: 'POST',
      body: data,
    }
  );
};

/**
 * Send a PUT request to the WTI API
 *
 * @param path path of the API call
 * @param data data to be sent in the request body
 */
export const wtiPut = async (path: string, data: BodyInit) => {
  const config = await getConfig();

  return fetch(
    `${WTI_API_URL}/${config.project.apiKey}${path}`,
    {
      method: 'PUT',
      body: data,
    }
  );
};

/**
 * Send a DELETE request to the WTI API
 *
 * @param path path of the API call
 */
export const wtiDelete = async (path: string) => {
  const config = await getConfig();

  return fetch(
    `${WTI_API_URL}/${config.project.apiKey}${path}`,
    {
      method: 'DELETE',
    }
  );
};
