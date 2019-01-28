export default function (increment = null) {
  return increment ? 1000 * increment + new Date().getTime() : new Date().getTime();
}
