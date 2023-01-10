import game from '@/router/game';
import user from '@/router/user';

export default function (router) {
    game(router);
    user(router);
}