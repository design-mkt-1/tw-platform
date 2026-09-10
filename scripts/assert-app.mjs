/**
 * Confirms the page a capture script just opened really is this app.
 *
 * This exists because of a measured incident on 2026-09-10. A dev server for a different
 * project — D:\jp-platform, running since before the session — already held port 3000, so
 * `npm run dev` here bound 3001 instead and said so in a line nobody read. All three capture
 * scripts default to http://localhost:3000, so the first screenshot of the "Top-Win casino
 * home" was a screenshot of the Jackpot demo: a dark English page with a GBP balance, captured
 * without a single error, saved under a Top-Win filename.
 *
 * Nothing about that failure is visible in a filename, an exit code or an error log. The only
 * thing that distinguishes the two is what the page says it is, so that is what gets checked.
 */
const EXPECTED_TITLE = 'Top-Win'

export async function assertApp(page, url) {
  const title = await page.title()
  if (!title.includes(EXPECTED_TITLE)) {
    throw new Error(
      `${url} is not this app: expected a title containing "${EXPECTED_TITLE}", got "${title}".\n` +
        `Another dev server is probably holding that port. Check which one:\n` +
        `  netstat -ano | grep ":3000 "\n` +
        `then pass the right base URL as an argument.`,
    )
  }
}
