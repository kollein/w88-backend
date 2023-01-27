
import betModel from '@/models/bet';
import kenoModel from '@/models/keno';
import code from '@/shared/code';
import { currentTime } from '@/helpers/utils';
import { ROUND_STATUS, PHRASES } from '@/shared/index';

export default function gameRouter(router) {

  router.post('/bet/new', async (req, res) => {
    try {
      const { gameId, roundId, items } = req.body;
      const round = await kenoModel.findOne({ gameId, roundId })
      if (!round) res.json({ status: code.ERROR, message: PHRASES.ROUND.NOT_FOUND })
      if (round.status === ROUND_STATUS.ended) res.json({ status: code.ERROR, message: PHRASES.ROUND.ENDED })

      const records = items.map((x) => {
        return {
          gameId,
          roundId,
          betType: x,
          createdAt: currentTime(),
        }
      });
      await betModel.insertMany(records)
      res.json({ status: code.SUCCESS })
    } catch (err) {
      // console.log('err', err);
      res.json({ status: code.ERROR, message: err.code })
    }
  })

  router.post('/bet/cancel', async (req, res) => {
    try {
      const games = await betModel.find()
      return res.json({ status: code.SUCCESS, data: games })
    } catch (err) {
      console.log(err)
      res.json({ status: code.ERROR, message: 'Unauthorization' })
    }
  })
}
