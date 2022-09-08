import { baseUrl } from "../utils/baseUrl";
import app from "firebase/compat/app";

export async function get(address: string) {
  const response = await fetch(`${baseUrl}/${address}.json`);
  const resData = await response.json();
  return resData;
}

export async function post(address: string, body: object) {
  const response = await fetch(`${baseUrl}/${address}.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return await response.json();
}

export async function patch(address: string, body: object, id: string) {
  const response = await fetch(`${baseUrl}/${address}/${id}.json`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Something went wrong!");
  }
}

// export const productImagesDocsRef = (uid: string, timestamp: string) =>
// app.storage().ref(`users/${uid}/productImages/${timestamp}/`);
