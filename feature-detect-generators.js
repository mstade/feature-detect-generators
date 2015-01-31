try {
  require('./generator')
  process.exit(0)
} catch (e) {
  console.error("Generators are not supported in this environment.")
  process.exit(1)
}