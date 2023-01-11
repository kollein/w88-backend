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
  const start = currentTime();
  const end = moment(start).add(duration, 'seconds').toDate().getTime();
  const result = {
    nums: [],
    sum: null,
    bigSmall: null, // based on sum
    oddEven: null, // based on sum
    refund: false,
    upDownDraw: null,
    oddsEvensDraw: null, // based on 10 nums (odd numbers > 10, even numbers > 10, odd numbers = even numbers)
    cross: null, // xien based on sum (BIG-ODD, BIG-EVEN, SMALL-ODD, SMALL-EVEN)
  }
  const lastRound = await kenoModel.findOne().sort({ _id: -1 })
  const roundId = lastRound ? lastRound.roundId + 1 : 1;
  console.log('roundId', roundId, lastRound);
  const record = {
    gameId: id,
    name,
    roundId,
    result,
    start,
    end,
    status: 'running'
  }
  console.log('record', record);
  const data = await kenoModel.create(record)

  return data ? code.SUCCESS : code.ERROR;
}

const checkRoundRunning = (round) => {
  const { end } = round;
  const now = currentTime();
  const durationStopBet = end - now - STOP_BET_BEFORE_SECONDS;
  const remainderStopBet = Math.round(moment.duration(durationStopBet).asSeconds())
  const isStopBet = remainderStopBet <= 0;
  console.log('isStopBet', isStopBet, remainderStopBet);

  return {
    isStopBet,
  }
}

const updateAsStopBet = async (round) => {
  const { roundId } = round;
  console.log('updateAsStopBet roundId', roundId);
  const data = await kenoModel.findOneAndUpdate({ roundId }, { status: ROUND_STATUS.ended });
  console.log('updateAsStopBet data', data);

  return data ? code.SUCCESS : code.ERROR;
}

const generateResult = async (round) => {
  const result = {
    nums: ['12'],
    sum: null,
    bigSmall: null, // based on sum
    oddEven: null, // based on sum
    refund: false,
    upDownDraw: null,
    oddsEvensDraw: null, // based on 10 nums (odd numbers > 10, even numbers > 10, odd numbers = even numbers)
    cross: null, // xien based on sum (BIG-ODD, BIG-EVEN, SMALL-ODD, SMALL-EVEN)
  }

  return result;
}

const updateResult = async (round) => {
  const { roundId } = round;
  console.log('updateResult roundId', roundId);
  const result = await generateResult(round)
  const update = {
    result,
  }
  console.log('data for update', update);
  const data = await kenoModel.findOneAndUpdate({ roundId }, update);
  console.log('updateResult data', data);

  return data ? code.SUCCESS : code.ERROR;
}

const kenoScheduler = async () => {
  try {
    const round = await kenoModel.findOne({ status: ROUND_STATUS.running })
    if (!round) {
      console.log('createNewRound');
      const res = await createNewRound(round);
      console.log('create res', res);
      if (res !== code.SUCCESS) return

      console.log('socket emits to client new round');
      return
    }

    console.log('found round is running, check time to create result for it', round);
    const { isStopBet } = checkRoundRunning(round);
    if (!isStopBet) return

    const res = await updateAsStopBet(round)
    if (res !== code.SUCCESS) return

    const result = await updateResult(round)
    if (result !== code.SUCCESS) return

    console.log('socket emits to client new result');

  } catch (err) {
    console.log(err, new Date().getTime())
  }
}

export default function () {
  setInterval(() => {
    kenoScheduler()
  }, 1000);
}