import type { NextAuthOptions } from "next-auth";
import type { OAuthUserConfig, OAuthConfig } from "next-auth/providers/index";

export interface KakaoOIDCProfile extends Record<string, unknown> {
  sub: string;
  nickname?: string;
  email?: string;
  picture?: string;
}

export function KakaoOIDC<P extends KakaoOIDCProfile>(
  options: OAuthUserConfig<P>,
): OAuthConfig<P> {
  return {
    id: "kakao",
    name: "Kakao",
    type: "oauth",
    wellKnown: "https://kauth.kakao.com/.well-known/openid-configuration",
    client: { token_endpoint_auth_method: "client_secret_post" },
    authorization: { params: { scope: "openid profile" } },
    idToken: true,
    profile(profile: P) {
      return {
        id: profile.sub,
        name: profile.nickname,
        email: profile.email,
        image: profile.picture,
      };
    },
    style: { logo: "/kakao.svg", bg: "#FEE500", text: "#000000" },
    options,
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    KakaoOIDC({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
