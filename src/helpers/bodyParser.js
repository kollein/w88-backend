import code from '@/shared/code';

export default function (err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.json({ status: code.ERROR, message: err.message })
  }

  next()
}