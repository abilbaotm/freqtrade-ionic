import {Version, Balances, Count} from "@abilbaotm/freqtrade-client";

export interface Bot {
  id: string;
  basePath: string;
  note?: string;
  auth?: {
    accessToken: string;
    refreshToken: string;
  };
  status?: {
    ping?: boolean;
    balances?: Balances;
    count?: Count;
    version?: Version;
  };
}
