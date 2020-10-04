// simulating load time
export function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
