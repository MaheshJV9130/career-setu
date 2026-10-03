export function ok<T extends Record<string, any> = Record<string, any>>(
  data?: T,
  message = 'Success',
  status = 200
) {
  const dataObj = data ?? ({} as T)
  const isPlainObj = dataObj && typeof dataObj === 'object' && !Array.isArray(dataObj)

  return Response.json(
    {
      success: true,
      message,
      data: dataObj,
      ...(isPlainObj ? dataObj : {}),
    },
    { status }
  )
}

export function fail(message: string, status = 400, errors: unknown[] = []) {
  return Response.json(
    {
      success: false,
      message,
      errors,
    },
    { status }
  )
}
