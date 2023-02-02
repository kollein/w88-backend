import gameModel from '@/models/game';
import code from '@/shared/code';
import { Router } from 'express';

export default function gameRouter(router: Router) {
  router.post('/game/create', async (req, res) => {
    try {
      const { name, duration } = req.body;
      await gameModel.create({
        name,
        duration,
      });
      res.json({ status: code.SUCCESS });
    } catch (err: any) {
      // console.log('err', err);
      res.json({ status: code.ERROR, message: err.code });
    }
  });

  router.get('/game/getAll', async (req, res) => {
    try {
      const games = await gameModel.find();
      return res.json({ status: code.SUCCESS, data: games });
    } catch (err) {
      console.log(err);
      res.json({ status: code.ERROR, message: 'Unauthorization' });
    }
  });
}
