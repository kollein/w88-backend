import { Router } from 'express';
import game from '@/router/game';
import user from '@/router/user';
import bet from '@/router/bet';

export default function (router: Router) {
    game(router);
    user(router);
    bet(router);
}