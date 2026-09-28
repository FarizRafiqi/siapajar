export class AiServiceError extends Error {}

export class AiJobStillProcessingError extends AiServiceError {
  readonly code = 'AI_JOB_STILL_PROCESSING'

  constructor(
    message: string,
    readonly jobKey: string,
    readonly status: 'pending' | 'processing'
  ) {
    super(message)
    this.name = 'AiJobStillProcessingError'
  }
}
