import cloudbase from "@cloudbase/js-sdk";

const envId = import.meta.env.VITE_CLOUDBASE_ENV_ID;
const region = import.meta.env.VITE_CLOUDBASE_REGION;
const accessKey = import.meta.env.VITE_CLOUDBASE_ACCESS_KEY;

if (!envId || !region || !accessKey) {
  throw new Error(
    "CloudBase configuration is missing. Check VITE_CLOUDBASE_ENV_ID, VITE_CLOUDBASE_REGION, and VITE_CLOUDBASE_ACCESS_KEY.",
  );
}

export const app = cloudbase.init({
  env: envId,
  region,
  accessKey,
});

export const db = app.rdb();
