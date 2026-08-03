import { Link } from 'react-router-dom'
import { Reveal } from '../components/Reveal'
import { site } from '../data/maixner'

export function Privacy() {
  return (
    <div className="page-hero">
      <div className="page-hero__inner legal-page">
        <Reveal>
          <span className="section-kicker">Právní informace</span>
          <h1>Zásady ochrany osobních údajů</h1>
          <p className="hero-lead">
            Informace o zpracování osobních údajů podle nařízení GDPR (EU) 2016/679 a souvisejících
            předpisů.
          </p>
        </Reveal>

        <Reveal delayMs={40}>
          <div className="legal-prose">
            <p>
              <strong>Poslední aktualizace:</strong> 3. 8. 2026
            </p>

            <h2>1. Správce osobních údajů</h2>
            <p>
              Správcem osobních údajů je:
              <br />
              <strong>{site.legalName}</strong>
              <br />
              IČO: {site.ico}
              <br />
              Sídlo / adresa: {site.address}
              <br />
              E-mail: <a href={`mailto:${site.email}`}>{site.email}</a>
              <br />
              Web: <a href={`https://${site.domain}`}>{site.domain}</a>
            </p>
            <p>
              Provozujeme webovou stránku Massflow a poskytujeme služby v oblasti webu, designu a
              digitálního marketingu.
            </p>

            <h2>2. Jaké údaje zpracováváme</h2>
            <ul>
              <li>
                <strong>Kontaktní formulář:</strong> jméno, e-mailová adresa, obsah zprávy a technické
                údaje o odeslání.
              </li>
              <li>
                <strong>Komunikace:</strong> údaje, které nám sami poskytnete e-mailem, přes Messenger
                nebo WhatsApp.
              </li>
              <li>
                <strong>Analytika (pouze se souhlasem):</strong> anonymizované / pseudonymizované údaje
                o návštěvě webu (např. typ zařízení, stránky, přibližná lokalita) prostřednictvím
                Google Analytics.
              </li>
            </ul>

            <h2>3. Účely a právní základy</h2>
            <ul>
              <li>
                <strong>Vyřízení poptávky / komunikace</strong> — právní základ: oprávněný zájem
                (čl. 6 odst. 1 písm. f GDPR) a/nebo plnění předsmluvních kroků na vaši žádost (čl. 6
                odst. 1 písm. b GDPR).
              </li>
              <li>
                <strong>Provoz webu a bezpečnost</strong> — oprávněný zájem (technické fungování,
                ochrana před zneužitím).
              </li>
              <li>
                <strong>Měření návštěvnosti (Google Analytics)</strong> — souhlas (čl. 6 odst. 1 písm. a
                GDPR). Souhlas můžete kdykoli odvolat.
              </li>
              <li>
                <strong>Plnění právních povinností</strong> — např. účetní a daňové předpisy, pokud
                vznikne smluvní vztah.
              </li>
            </ul>

            <h2>4. Cookies</h2>
            <p>
              Web používá:
            </p>
            <ul>
              <li>
                <strong>Nezbytné cookies / lokální úložiště</strong> — např. uložení vašeho rozhodnutí
                o souhlasu s cookies. Tyto jsou potřebné pro provoz.
              </li>
              <li>
                <strong>Analytické cookies</strong> — Google Analytics (měření ID {`G-JWG4TWR0T9`}),
                pouze pokud kliknete na „Souhlasím s analytikou“. Bez souhlasu se analytika nenačítá.
              </li>
            </ul>
            <p>
              Preference můžete změnit smazáním uloženého souhlasu (odkaz „Nastavení cookies“ v
              patičce) nebo vymazáním dat webu v prohlížeči.
            </p>

            <h2>5. Příjemci a předávání</h2>
            <p>Údaje mohou být v nezbytném rozsahu zpracovávány těmito zpracovateli / službami:</p>
            <ul>
              <li>poskytovatel hostingu webu,</li>
              <li>FormSubmit / e-mailová infrastruktura pro doručení zpráv z formuláře,</li>
              <li>Google Ireland Ltd. / Google LLC — Google Analytics (jen se souhlasem),</li>
              <li>poskytovatel e-mailu (Forpsi) a případně Gmail při přesměrování schránky.</li>
            </ul>
            <p>
              Při využití služeb Google může docházet k předání údajů do třetích zemí (včetně USA) za
              podmínek odpovídajících mechanismům EU (např. standardní smluvní doložky / rozhodnutí o
              odpovídající ochraně). Podrobnosti stanoví zásady společnosti Google.
            </p>

            <h2>6. Doba uchování</h2>
            <ul>
              <li>Komunikace z formuláře a e-mailu: po dobu vyřízení poptávky a dále max. 3 roky,
                pokud není delší doba vyžadována právem nebo oprávněným zájmem (např. obhajoba
                nároků).</li>
              <li>Souhlas s cookies: do odvolání / smazání v prohlížeči.</li>
              <li>Analytická data: dle nastavení Google Analytics (typicky 14 měsíců).</li>
            </ul>

            <h2>7. Vaše práva</h2>
            <p>Máte právo:</p>
            <ul>
              <li>na přístup k údajům,</li>
              <li>na opravu,</li>
              <li>na výmaz („právo být zapomenut“),</li>
              <li>na omezení zpracování,</li>
              <li>na přenositelnost (kde je to relevantní),</li>
              <li>vznést námitku proti zpracování založenému na oprávněném zájmu,</li>
              <li>odvolat souhlas (u analytiky) bez vlivu na zákonnost zpracování před odvoláním,</li>
              <li>
                podat stížnost u Úřadu pro ochranu osobních údajů (
                <a href="https://www.uoou.cz" target="_blank" rel="noopener noreferrer">
                  www.uoou.cz
                </a>
                ).
              </li>
            </ul>
            <p>
              Pro uplatnění práv nás kontaktujte na{' '}
              <a href={`mailto:${site.email}`}>{site.email}</a>.
            </p>

            <h2>8. Identifikační a kontaktní údaje provozovatele</h2>
            <p>
              {site.legalName}, IČO {site.ico}, {site.address}. Elektronický kontakt:{' '}
              <a href={`mailto:${site.email}`}>{site.email}</a>, telefon / WhatsApp:{' '}
              <a href={site.whatsappUrl}>{site.whatsapp}</a>.
            </p>

            <h2>9. Změny zásad</h2>
            <p>
              Tyto zásady můžeme aktualizovat. Aktuální znění je vždy uveřejněno na této stránce s
              datem poslední aktualizace.
            </p>

            <p>
              <Link to="/kontakt" className="btn btn-ghost">
                Kontaktovat nás
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  )
}
