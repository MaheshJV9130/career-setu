export function ok(data: Record<string, unknown>, init?: ResponseInit) { return Response.json({ success: true, ...data }, init) }
export function fail(message: string, status = 400) { return Response.json({ success: false, message }, { status }) }
