import type { FormEvent } from 'react'
import { Reveal } from '../components/Reveal'
import { assetPaths, contactPage, site } from '../data/maixner'

export function Contact() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
  }

  return (
    <div className="page-hero">
      <div className="page-hero__inner">
        <Reveal>
          <span className="section-kicker">{contactPage.kicker}</span>
          <h1>{contactPage.title}</h1>
        </Reveal>

        <Reveal delayMs={60}>
          <div className="contact-layout">
            <div className="contact-options">
              <article className="contact-card">
                <h3>E-mail</h3>
                <p className="contact-card__value">{site.email}</p>
                <a className="contact-card__link" href={`mailto:${site.email}`}>
                  {contactPage.sendMessage}
                </a>
              </article>
              <article className="contact-card">
                <h3>Messenger</h3>
                <p className="contact-card__value">{site.name}</p>
                <a
                  className="contact-card__link"
                  href={site.messengerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contactPage.sendMessage}
                </a>
              </article>
              <article className="contact-card">
                <h3>WhatsApp</h3>
                <p className="contact-card__value">{site.whatsapp}</p>
                <a
                  className="contact-card__link"
                  href={site.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contactPage.sendMessage}
                </a>
              </article>
            </div>

            <div className="contact-form-wrap">
              <p className="hero-lead contact-form-lead">
                Stejný formulář jako na původním webu můžete napojit na EmailJS — zatím je ukázkový. Stáhnout CV:{' '}
                <a href={assetPaths.cv} className="contact-cv-link">
                  cv.pdf
                </a>{' '}
                (soubor dejte do <code className="contact-code">public/portfolio/cv.pdf</code>).
              </p>
              <form className="form" onSubmit={handleSubmit} noValidate>
                <label>
                  {contactPage.formName}
                  <input type="text" name="name" autoComplete="name" required />
                </label>
                <label>
                  {contactPage.formEmail}
                  <input type="email" name="email" autoComplete="email" required />
                </label>
                <label>
                  {contactPage.formMessage}
                  <textarea name="message" required rows={7} />
                </label>
                <button type="submit" className="btn btn-primary">
                  {contactPage.submit}
                </button>
              </form>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
