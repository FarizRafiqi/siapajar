interface SequenceOption {
  id: number
  title: string
  context: string
}

interface CurriculumSequenceSelectProps {
  readonly sequences: SequenceOption[]
  readonly value: number | undefined
  readonly onChange: (value: number | undefined) => void
}

export default function CurriculumSequenceSelect({
  sequences,
  value,
  onChange,
}: CurriculumSequenceSelectProps) {
  if (sequences.length === 0) return null

  return (
    <div>
      <label
        htmlFor="learningSequenceId"
        className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
      >
        ATP / alur tujuan (opsional)
      </label>
      <select
        id="learningSequenceId"
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value ? Number(event.target.value) : undefined)}
        className="w-full rounded-lg border border-neutral-300 px-3 py-2 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
      >
        <option value="">Tanpa ATP spesifik</option>
        {sequences.map((sequence) => (
          <option key={sequence.id} value={sequence.id}>
            {sequence.title} ({sequence.context})
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        Tujuan dan indikator dari ATP terpilih akan ikut masuk ke draft.
      </p>
    </div>
  )
}
