import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

const { NEXT_PUBLIC_BASE_URL_LIVE } = process.env;

export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        console.log(credentials);
        const { data } = await axios
          .post(
            "https://xg3n-4mh1-ngd5.n7.xano.io/api:w4ONEGEJ:v2/auth/login",
            {
              email: credentials.email,
              password: credentials.password,
            }
          )
          .catch((e) => {
            console.log(e);
            return e;
          });

        const token = data.authToken;

        if (data.user) {
          return {
            token,
            name: data.user.firstName,
            email: data.user.email,
            details: data.user,
          };
        } else {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      const { data } = await axios
        .get(
          `https://xg3n-4mh1-ngd5.n7.xano.io/api:w4ONEGEJ:v2/user_by_email?email=${token.email}`
        )

        .catch((e) => {
          console.log(e);
          return e;
        });
      token.id = data.user;
      token.token = data.authToken;

      return token;
    },
    session: async ({ session, token }) => {
      // cookie.set("j_ce_u", session.authToken);
      session.user = token.id;
      session.token = token.token;

      return session;
    },
    signIn: async ({ account, profile }) => {
      if (account.provider === "google") {
        const data = await axios
          .get(
            "https://xg3n-4mh1-ngd5.n7.xano.io/api:U0aE1wpF:v2/oauth/google/continue",
            {
              params: { tokenn: account.access_token },
            }
          )
          .catch((e) => {
            console.log(e);
            return e;
          });

        // setCookie("j_ce_u", account.access_token, {

        //   maxAge: 60 * 60 * 24,
        // });

        //cookie.set("j_ce_u", account.access_token);
        return data;
      } else {
        return true;
      }
    },
  },
  secret: process.env.NEXT_PUBLIC_SECRET,
  session: { jwt: true },
  jwt: {
    secret: process.env.NEXT_PUBLIC_SECRET,
  },
  debug: true,
};

export default NextAuth(options);
