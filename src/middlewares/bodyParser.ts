import code from '@/shared/code';
import { NextFunction, Request, Response } from 'express';

type Error = { status: number };

export default function (err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof SyntaxError && err.status === 400 && 'body2' in err) {
    return res.json({ status: code.ERROR, message: err.message });
  }

  next();
}
