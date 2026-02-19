export default function PrivacyPage() {
  return (
    <div className="container">
      <div className="card">
        <h1>Informativa sulla Privacy (Art. 13 GDPR)</h1>
        
        <section>
          <h2>1. Titolare del Trattamento</h2>
          <p>Il titolare del trattamento è [Inserire Nome/Ente]. Questo sondaggio è condotto esclusivamente per finalità statistiche e informative relative al referendum sulla giustizia.</p>
        </section>

        <section>
          <h2>2. Finalità del Trattamento</h2>
          <p>I dati raccolti (sesso, fascia d&apos;età, risposte al questionario) vengono trattati per generare statistiche aggregate sull&apos;orientamento dei cittadini rispetto alla riforma costituzionale proposta.</p>
        </section>

        <section>
          <h2>3. Base Giuridica</h2>
          <p>La base giuridica del trattamento è il <strong>consenso esplicito</strong> dell&apos;interessato, richiesto prima dell&apos;inizio del questionario. Poiché le risposte possono indicare un orientamento politico, esse sono trattate come categorie particolari di dati (Art. 9 GDPR).</p>
        </section>

        <section>
          <h2>4. Minimizzazione e Conservazione</h2>
          <p>Non raccogliamo dati identificativi come nome, email o indirizzo IP. I dati sono conservati in forma anonima e aggregata. Saranno eliminati al termine del periodo referendario.</p>
        </section>

        <section>
          <h2>5. Diritti dell&apos;Interessato</h2>
          <p>L&apos;utente può esercitare i propri diritti in qualsiasi momento (accesso, rettifica, cancellazione) contattando il titolare. Tuttavia, data la natura anonima dei dati salvati, potrebbe non essere possibile identificare una singola risposta nel database una volta inviata.</p>
        </section>

        <a href="/" className="btn btn-secondary">Torna alla Home</a>
      </div>
    </div>
  );
}
