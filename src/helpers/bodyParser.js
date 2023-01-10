import code from '@/shared/code';

export default function (req, res, next) {
  try {
    JSON.parse(req.body);
    return next();
  } catch (err) {
    res.json({ error: code.ERROR, message: 'Body is not a JSON object' })
  }
}