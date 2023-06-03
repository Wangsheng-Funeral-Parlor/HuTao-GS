export function toCamelCase(str: string): string {
  return (str.slice(0, 1).toUpperCase() + str.slice(1).toLowerCase()).replace(/_([a-z])/g, (_, letter) =>
    letter.toUpperCase()
  )
}
export function getFunctionName(name: string) {
  return name.charAt(0).toLowerCase() + name.slice(1)
}
