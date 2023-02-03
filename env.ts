interface envObj {
  [key: string]: { [key: string]: string | number };
}

const ENV: envObj = {
  development: {
    PORT: 3000, // only works with ports: 3000 -> 4000
    AUTH_API_URL: 'https://auth0.com',
  },
};

export default function env() {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const mode = process.env.VITE_MODE!;
  return ENV[mode];
}
