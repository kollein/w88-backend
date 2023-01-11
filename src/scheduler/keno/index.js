import gameModel from '@/models/game';
import kenoModel from '@/models/keno';
import code from '@/shared/code';
import {
  GAME_NAMES,
  STOP_BET_BEFORE_SECONDS,
  ROUND_STATUS,
} from '@/shared/index';
import { currentTime } from '@/helpers/utils';
import moment from 'moment';

const createNewRound = async () => {
  const gameName = GAME_NAMES.keno;
  const game = await gameModel.findOne({ name: gameName })
  if (!game) {
    console.log('not found game', gameName);
    return;
  }
  console.log('found game', game);

  const { id, name, duration } = game;
  const startAt = currentTime();
  const endAt = moment(startAt).add(duration, 'seconds').toDate().getTime();
  const result = await generateResult(ROUND_STATUS.running)
  const lastRound = await kenoModel.findOne().sort({ _id: -1 })
  console.log('lastRound', lastRound);
  const roundId = lastRound ? lastRound.roundId + 1 : 1;
  console.log('new roundId', roundId);
  const record = {
    gameId: id,
    name,
    roundId,
    result,
    startAt,
    endAt,
    status: 'running'
  }
  console.log('data for create', record);
  const data = await kenoModel.create(record)

  return data ? code.SUCCESS : code.ERROR;
}

const checkRoundRunning = (round) => {
  const { endAt } = round;
  const now = currentTime();
  const durationBeforeStopBet = endAt - (now + (STOP_BET_BEFORE_SECONDS * 1000));
  const durationBeforeStopBetInSecond = Math.round(durationBeforeStopBet / 1000)
  const isStopBet = durationBeforeStopBetInSecond <= 0;
  console.log('isStopBet', isStopBet, durationBeforeStopBetInSecond);

  return {
    isStopBet,
  }
}

const updateAsStopBet = async (round) => {
  const { roundId } = round;
  console.log('updateAsStopBet roundId', roundId);
  const update = { status: ROUND_STATUS.stopped };
  console.log('data for update', update);
  const data = await kenoModel.findOneAndUpdate({ roundId }, update);

  return data ? code.SUCCESS : code.ERROR;
}

const generateResult = async (type = ROUND_STATUS.running) => {
  let result = {
    nums: [],
    sum: null,
    bigSmall: null,
    oddEven: null,
    refund: false,
    upDownDraw: null,
    oddsEvensDraw: null,
    cross: null
  }

  if (type === ROUND_STATUS.running) {
    return result;
  }

  // for ended round
  result = {
    nums: ['12'],
    sum: null,
    bigSmall: null,
    oddEven: null,
    refund: false,
    upDownDraw: null,
    oddsEvensDraw: null,
    cross: null
  }

  return result;
}

const updateResult = async (round) => {
  const { roundId } = round;
  console.log('updateResult roundId', roundId);
  const result = await generateResult(ROUND_STATUS.ended)
  const update = {
    result,
    status: ROUND_STATUS.ended
  }
  console.log('data for update', update);
  const data = await kenoModel.findOneAndUpdate({ roundId }, update);

  return data ? code.SUCCESS : code.ERROR;
}

export default async function () {
  try {
    const round = await kenoModel.findOne({ status: ROUND_STATUS.running })
    if (!round) {
      console.log('createNewRound');
      const res = await createNewRound(round);
      console.log('createNewRound', res);
      if (res !== code.SUCCESS) return

      console.log('socket emits to client new round');
      return
    }

    console.log('found round is running, check time to create result for it', round);
    const { isStopBet } = checkRoundRunning(round);
    if (!isStopBet) return

    const res = await updateAsStopBet(round)
    console.log('updateAsStopBet:', res);
    if (res !== code.SUCCESS) return

    const result = await updateResult(round)
    console.log('updateResult:', result);
    if (result !== code.SUCCESS) return

    console.log('socket emits to client new result');

  } catch (err) {
    console.log(err, new Date().getTime())
  }
}