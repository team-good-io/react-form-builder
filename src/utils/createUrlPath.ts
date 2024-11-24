const createUrlPath = (template: string, values: Record<string, string>): string => {
  return template.replace(/{([^}]+)}/g, (_, match) => {
    if (!(match in values)) {
      throw new Error(`Placeholder "${match}" not found in values`)
    }
    return encodeURIComponent(values[match])
  })
}

export default createUrlPath
