// clean integer unix timestamp for timers & save files and stuff

export default function () {
  return Math.round((new Date()).getTime() / 1000);
}
