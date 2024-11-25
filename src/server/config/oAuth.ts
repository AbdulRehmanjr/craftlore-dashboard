import { google } from "googleapis"
import { env } from "~/env"

export const authClient = new google.auth.OAuth2({
    clientId: env.GOOGLE_CLIENT,
    clientSecret: env.GOOGLE_SECRET,
    redirectUri: env.REDIRECT_URI
})
