import { initializeApp } from "firebase/app";

export default function useFirebase(config: object) {
  const app = initializeApp(config);
  return app;
}
