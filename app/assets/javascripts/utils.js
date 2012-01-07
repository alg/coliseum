function seconds_to_time(seconds) {
  var hrs = Math.floor(seconds / 3600),
      rem = seconds - hrs * 3600,
      min = Math.floor(rem / 60),
      sec = rem % 60;

  return "" + (hrs > 0 ? hrs + ":" : "") +
              (min < 10 ? "0" : "") + min + ":" +
              (sec < 10 ? "0" : "") + sec;
}
