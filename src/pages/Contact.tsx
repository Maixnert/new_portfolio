import type { FormEvent } from 'react'
import { Reveal } from '../components/Reveal'
import { contactPage, site } from '../data/maixner'

const channels = [
  {
    key: 'email',
    label: 'E-mail',
    value: site.email,
    href: `mailto:${site.email}`,
    external: false,
  },
  {
    key: 'messenger',
    label: 'Messenger',
    value: site.legalName,
    href: site.messengerUrl,
    external: true,
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    value: site.whatsapp,
    href: site.whatsappUrl,
    external: true,
  },
] as const

export function Contact() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    const fd = new FormData(form)
    const name = String(fd.get('name') ?? '').trim()
    const replyEmail = String(fd.get('email') ?? '').trim()
    const message = String(fd.get('message') ?? '').trim()
    const subject = `Kontakt z webu — ${name}`
    const body = `Jméno: ${name}\nE-mail: ${replyEmail}\n\n${message}\n`
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="page-hero">
      <div className="page-hero__inner">
        <div className="contact-page">
          <Reveal>
            <header className="contact-hero">
              <span className="section-kicker">{contactPage.kicker}</span>
              <h1>{contactPage.title}</h1>
              <p className="contact-hero__lead">{contactPage.lead}</p>
            </header>
          </Reveal>

          <Reveal delayMs={70}>
            <>
              <h2 id="contact-channels-heading" className="contact-split__heading">
                {contactPage.channelsHeading}
              </h2>
              <div className="contact-split">
                <aside className="contact-split__channels" aria-labelledby="contact-channels-heading">
                <div className="contact-channels__grid">
                  {channels.map((ch) => (
                    <article key={ch.key} className="contact-channel card-glass">
                      <span className="contact-channel__tag">{ch.label}</span>
                      <p className="contact-channel__value">{ch.value}</p>
                      <a
                        className="contact-channel__link"
                        href={ch.href}
                        {...(ch.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      >
                        {contactPage.sendMessage}
                        <span className="contact-channel__arrow" aria-hidden>
                          →
                        </span>
                      </a>
                    </article>
                  ))}
                </div>
                </aside>

                <section className="contact-split__form" aria-labelledby="contact-form-heading">
                  <div className="contact-form-panel card-glass">
                    <h2 id="contact-form-heading" className="contact-form-panel__title">
                      {contactPage.formHeading}
                    </h2>
                    <p className="contact-form-panel__intro">{contactPage.formIntro}</p>
                    <form className="form contact-form" onSubmit={handleSubmit}>
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
                      <button type="submit" className="btn btn-primary contact-form__submit">
                        {contactPage.submit} <span className="btn-arrow">→</span>
                      </button>
                    </form>
                  </div>
                </section>
              </div>
            </>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
