interface ModeEnv {
  PORT: number;
  INDEX: string;
}

const defaultModeObj: ModeEnv = {
  PORT: 3000,
  INDEX: 'local.html',
};

interface Modes {
  [key: string]: ModeEnv;
}

const ENV: Modes = {
  development: {
    PORT: 3000, // socket.io only works with ports: 3000 -> 4000
    INDEX: 'local.html',
  },
};

export default function env(): ModeEnv {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const mode = process.env.VITE_MODE;
  return mode ? ENV[mode] : defaultModeObj;
}
