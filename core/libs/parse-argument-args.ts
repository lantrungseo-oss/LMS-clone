import minimist from 'minimist'

export const parseArgmumentArgs = <T>(opts?: minimist.Opts) => {
  return minimist<T>(process.argv.slice(2), opts)
}