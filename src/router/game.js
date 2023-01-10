
import gameModel from '@/models/game';
import code from '@/shared/code';

export default function gameRouter(router) {

  router.post('/game/create', async (req, res) => {
    try {
      console.log(req.body)
      const { name } = req.body;
      await gameModel.create({
        name,
      })
      res.json({ status: code.SUCCESS })
    } catch (err) {
      // console.log('err', err);
      res.json({ status: code.ERROR, message: err.code })
    }
  })
}
