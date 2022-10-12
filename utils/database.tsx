import * as SQLite from "expo-sqlite";

import { Place } from "../models/place";
import { Place as TypeI } from "../types";

const database = SQLite.openDatabase("restaurants.db");

export function init() {
  const promise = new Promise<void>((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS restaurants (
                    id INTEGER PRIMARY KEY NOT NULL,
                    title TEXT NOT NULL,
                    imageUrl TEXT NOT NULL,
                    lat REAL NOT NULL,
                    lng REAL NOT NULL,
                    rating INTEGER NOT NULL
                )`,
        [],
        () => {
          resolve();
          console.log("DB created");
        },
        (_, error): boolean | any => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function insertPlace(place: TypeI) {
  const promise = new Promise((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        `INSERT INTO restaurants (title, imageUrl, lat, lng, rating) VALUES (?, ?, ?, ?, ?)`,
        [
          place.title,
          place.imageUrl,
          place.location.lat,
          place.location.lng,
          place.rating,
        ],
        (_, result) => {
          // console.log(result, "inserting");
          resolve(result);
        },
        (_, error): boolean | any => {
          reject(error);
        }
      );
    });
  });

  return promise;
}

export function fetchPlaces() {
  const promise = new Promise<{
    restaurants: TypeI[];
    length: number;
  }>((resolve, reject) => {
    database.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM restaurants",
        [],
        (_, result) => {
          // console.log(result);
          const restaurants = [];

          for (const dp of result.rows._array) {
            restaurants.push(
              new Place(
                dp.title,
                dp.imageUrl,
                {
                  lat: dp.lat,
                  lng: dp.lng,
                },
                dp.rating,
                dp.id
              )
            );
          }

          const data = { restaurants, length: result.rows.length };
          resolve(data);
        },
        (_, error): boolean | any => {
          reject(error);
        }
      );
    });
  });

  return promise;
}
