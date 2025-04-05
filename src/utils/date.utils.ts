export function convertTimestampToDate(timestamp: number) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date(timestamp * 1000);
  const month = months[date.getMonth()];
  const day = date.getDate();

  return `${month} ${day}`;
}

export function convertTimestampToFullFormat(timestamp: number) {
  const days = Math.floor(timestamp / (24 * 60 * 60));
  const hours = Math.floor((timestamp % (24 * 60 * 60)) / 3600);
  const minutes = Math.floor((timestamp % 3600) / 60);

  return `${days}D ${hours}H ${minutes}M`;
}

export function formatDate(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");
  const milliseconds = String(date.getUTCMilliseconds()).padStart(3, "0");

  const microseconds = "000";

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}${microseconds}`;
}
