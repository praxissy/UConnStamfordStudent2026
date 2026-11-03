import type { ErrorRequestHandler } from 'express'
import { ZodError } from 'zod'
import type { ApiErrorBody } from './contract'

export class HttpError extends Error {
  constructor(readonly status: number, message: string, readonly details?: unknown) {
    super(message)
  }
}

const POSTGRES_ERROR_RESPONSES: Record<string, { status: number; message: string }> = {
  '23503': { status: 400, message: 'That refers to something that does not exist.' },
  '23505': { status: 409, message: 'That would create a duplicate.' },
  '23514': { status: 400, message: 'That value breaks one of the database rules.' },
  '22001': { status: 400, message: 'A value is longer than the database allows.' },
  '22007': { status: 400, message: 'A date is not in a valid format.' },
  '22008': { status: 400, message: 'A date is out of range.' },
  '22P02': { status: 400, message: 'A value is not in a valid format.' },
}

function errorToHttpResponse(error: any): { status: number; body: ApiErrorBody } {
  if (error instanceof HttpError) {
    return { status: error.status, body: { error: error.message, details: error.details } }
  }
  if (error instanceof ZodError) {
    return {
      status: 400,
      body: {
        error: 'The request body is not valid.',
        details: error.issues.map(issue => ({ path: issue.path.join('.'), message: issue.message })),
      },
    }
  }
  if (error?.type === 'entity.parse.failed') {
    return { status: 400, body: { error: 'The request body is not valid JSON.' } }
  }
  const pg = typeof error?.code === 'string' ? POSTGRES_ERROR_RESPONSES[error.code] : undefined
  if (pg) {
    return { status: pg.status, body: { error: pg.message, details: error.detail ?? error.message } }
  }
  return { status: 500, body: { error: 'Something went wrong on the server.' } }
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const { status, body } = errorToHttpResponse(error)
  if (status === 500) console.error(error)
  res.status(status).json(body)
}
