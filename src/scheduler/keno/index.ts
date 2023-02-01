import moment from 'moment';
import gameModel from '@/models/game';
import kenoModel from '@/models/keno';
import betModel from '@/models/bet';
import code from '@/shared/code';
import {
  GAME_NAMES,
  STOP_BET_BEFORE_SECONDS,
  ROUND_STATUS,
} from '@/shared/index';
import { currentTime } from '@/helpers/utils';
import { makeResult, rate } from '@/scheduler/keno/generator';
import userModel from '@/models/user';

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
    status: ROUND_STATUS.running
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

const generateResult = async (type) => {
  return makeResult(type);
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
  if (!data) return code.ERROR;

  const data2 = await updateBets(round, result)
  console.log('updateBets:', data2);
  return data2 ? code.SUCCESS : code.ERROR;
}

const updateBets = async (round, result) => {
  const { roundId, gameId } = round;
  console.log('updateBets roundId', roundId);
  const bets = await betModel.find({ roundId, gameId })
  console.log('bets', bets);
  const data = [];

  bets.forEach(async (x) => {
    console.log('x', x);
    const { id, userId } = x;
    console.log(id, userId);
    const win = calcWinLose(x, result);
    const update = {
      win,
      status: ROUND_STATUS.ended
    }
    console.log('data for update', update);
    const res = await betModel.findOneAndUpdate({ _id: id }, update);
    const updateBalance = { $inc: { balance: win } }
    const res2 = await userModel.findOneAndUpdate({ _id: userId }, updateBalance);
    if (res2) {
      data.push(res)
    } else {
      data.push(code.ERROR)
    }
  });
  console.log('data', data);
  return data
}

const calcWinLose = (bet, result) => {
  let win = 0;
  try {
    const { betType, amount } = bet;
    const betTypeKey = Object.keys(betType)[0];
    console.log('betTypeKey', betTypeKey);
    if (result[betTypeKey] === betType[betTypeKey]) {
      win = amount * rate[betTypeKey];
    } else {
      win = amount * -1;
    }
    console.log('win', win);
  } catch (err) {
    console.log('err', err);
  }
  return win;
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

    const res2 = await updateResult(round)
    console.log('updateResult:', res2);
    if (res2 !== code.SUCCESS) return

    console.log('socket emits to client new result');

  } catch (err) {
    console.log(err, new Date().getTime())
  }
}