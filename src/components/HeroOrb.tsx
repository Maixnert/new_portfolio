/** Abstraktní „blob“ v korálových tónech — čisté CSS, bez knihoven. */
export function HeroOrb() {
  return (
    <div className="hero-orb" aria-hidden>
      <div className="hero-orb__mesh" />
      <div className="hero-orb__glow" />
    </div>
  )
}
