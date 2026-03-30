type PageBackdropWordProps = {
  word: string
}

export function PageBackdropWord({ word }: PageBackdropWordProps) {
  return (
    <span className="page-backdrop-word" aria-hidden>
      {word}
    </span>
  )
}
