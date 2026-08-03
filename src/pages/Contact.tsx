import { type FormEvent, useState } from 'react'
import { Reveal } from '../components/Reveal'
import { contactPage, site } from '../data/maixner'

const channels = [
  {
    key: 'email',
    label: 'E-mail',
    value: site.email,
    href: '#contact-form-heading',
    external: false,
    cta: 'Napsat zprávu',
  },
  {
    key: 'messenger',
    label: 'Messenger',
    value: site.legalName,
    href: site.messengerUrl,
    external: true,
    cta: contactPage.sendMessage,
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    value: site.whatsapp,
    href: site.whatsappUrl,
    external: true,
    cta: contactPage.sendMessage,
  },
] as const

const FORM_SUBMIT_AJAX = `https://formsubmit.co/ajax/${encodeURIComponent(site.email)}`

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

export function Contact() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget

    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }

    const fd = new FormData(form)
    const name = String(fd.get('name') ?? '').trim()
    const email = String(fd.get('email') ?? '').trim()
    const message = String(fd.get('message') ?? '').trim()
    const honey = String(fd.get('_honey') ?? '').trim()

    if (honey) {
      setStatus('success')
      return
    }

    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch(FORM_SUBMIT_AJAX, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
          _replyto: email,
          _subject: `Kontakt z webu Massflow — ${name}`,
          _template: 'table',
          _captcha: 'false',
        }),
      })

      const data = (await res.json()) as { success?: string }
      if (res.ok && data.success) {
        form.reset()
        setStatus('success')
        return
      }
    } catch {
      // handled below
    }

    setStatus('error')
    setErrorMessage(contactPage.formError)
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
                          {ch.cta}
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

                    <div className="form-feedback" role="status" aria-live="polite" aria-atomic="true">
                      {status === 'success' ? (
                        <p className="form-feedback__msg form-feedback__msg--success">
                          {contactPage.formSuccess}
                        </p>
                      ) : null}
                      {status === 'error' ? (
                        <p className="form-feedback__msg form-feedback__msg--error">
                          {errorMessage}
                        </p>
                      ) : null}
                    </div>

                    {status !== 'success' ? (
                      <form className="form contact-form" onSubmit={handleSubmit} noValidate={false}>
                        <input
                          type="text"
                          name="_honey"
                          className="form-honeypot"
                          tabIndex={-1}
                          autoComplete="off"
                        />
                        <label>
                          {contactPage.formName}
                          <input
                            type="text"
                            name="name"
                            autoComplete="name"
                            required
                            disabled={status === 'submitting'}
                          />
                        </label>
                        <label>
                          {contactPage.formEmail}
                          <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            required
                            disabled={status === 'submitting'}
                          />
                        </label>
                        <label>
                          {contactPage.formMessage}
                          <textarea
                            name="message"
                            required
                            rows={7}
                            disabled={status === 'submitting'}
                          />
                        </label>
                        <button
                          type="submit"
                          className="btn btn-primary contact-form__submit"
                          disabled={status === 'submitting'}
                        >
                          {status === 'submitting' ? contactPage.formSubmitting : contactPage.submit}{' '}
                          <span className="btn-arrow">→</span>
                        </button>
                      </form>
                    ) : null}
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
