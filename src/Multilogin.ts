import { chromium } from "playwright";
import * as crypto from "crypto";
import {
  type MultiloginOptions,
  type SignInArgs,
  type SignInResponse,
  type StartProfileResponse,
} from "./types";

export class Multilogin {
  static MLX_BASE = "https://api.multilogin.com";
  static MLX_LAUNCHER = "https://launcher.mlx.yt:45001/api/v1";

  static REQUEST_HEADERS = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Accept-Language": "en",
  };

  private folderId: string;
  private profileId: string;
  private token: string | null = null;

  constructor({ folderId, profileId }: MultiloginOptions) {
    this.folderId = folderId;
    this.profileId = profileId;
  }

  public async signIn({ email, password }: SignInArgs) {
    const payload = {
      email,
      password: crypto.createHash("md5").update(password).digest("hex"),
    };
    try {
      const response = await fetch(`${Multilogin.MLX_BASE}/user/signin`, {
        method: "POST",
        headers: Multilogin.REQUEST_HEADERS,
        body: JSON.stringify(payload),
      });
      const data: SignInResponse = await response.json();
      this.token = data.data.token;
      return {
        token: this.token,
      };
    } catch (error: any) {
      throw new Error("SignIn failed");
    }
  }

  public async startProfile() {
    if (!this.token) {
      throw new Error("Please use signIn() before startProfile()");
    }
    try {
      const response = await fetch(
        `${Multilogin.MLX_LAUNCHER}/profile/f/${this.folderId}/p/${this.profileId}/start?automation_type=playwright`,
        {
          headers: {
            ...Multilogin.REQUEST_HEADERS,
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
      const data: StartProfileResponse = await response.json();
      const browserURL = `http://127.0.0.1:${data.status.message}`;
      if (data.status.message === "browser process is running") {
        throw new Error("Browser already running");
      }
      const browser = await chromium.connectOverCDP(browserURL); // Using connectOverCDP for Chromium
      const context = browser.contexts()[0];
      const page = context.pages()[0] || (await context.newPage());
      return {
        browser,
        page,
        context,
      };
    } catch (error) {
      console.log(error);
      throw new Error("StartProfile failed");
    }
  }

  public async stopProfile() {
    try {
      await fetch(
        `${Multilogin.MLX_LAUNCHER}/profile/stop/p/${this.profileId}`,
        {
          headers: {
            ...Multilogin.REQUEST_HEADERS,
            Authorization: `Bearer ${this.token}`,
          },
        }
      );
    } catch (error) {
      throw new Error("StopProfile failed");
    }
  }
}
