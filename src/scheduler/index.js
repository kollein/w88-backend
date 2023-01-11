import kenoScheduler from '@/scheduler/keno/index'

export default function () {
  setInterval(() => {
    kenoScheduler()
  }, 1000);
}