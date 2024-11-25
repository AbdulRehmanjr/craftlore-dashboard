import { google } from "googleapis";
import { authClient } from "~/server/config/oAuth";


export const calendar = google.calendar({
  version:'v3',
  auth:authClient
})