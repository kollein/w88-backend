// change this value to require all the users to login again for Authorization
const SECRET_KEY = '2f574c750c775aab1e600e0168aaab122e25827f0dc045b40f574a14a5f6f6512efb7e66b2a3de0560849cc0a9718855'

// number of seconds to stop before a new round
const STOP_BET_BEFORE_SECONDS = 5
const ROUND_STATUS = { running: 'running', stopped: 'stopped', ended: 'ended' };

const GAME_NAMES = {
  keno: 'keno',
  bigsmall: 'bigsmall'
}

export {
  SECRET_KEY,
  STOP_BET_BEFORE_SECONDS,
  ROUND_STATUS,
  GAME_NAMES
}
