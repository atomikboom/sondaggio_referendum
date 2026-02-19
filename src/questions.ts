export type Axis = "yesNo" | "accountability";

/**
 * yesNo:
 *   +  => propensione verso Sì (approvare la riforma)
 *   -  => propensione verso No (respingere la riforma)
 *
 * accountability:
 *   +  => preferenza per più controlli/garanzie esterne e accountability (organi dedicati, incompatibilità forti, ecc.)
 *   -  => preferenza per più autogoverno/indipendenza interna e minore “filtro” esterno
 */
export type ScoreVector = Record<Axis, number>;

export type Module =
    | "A_Architettura"
    | "B_CSM_Sorteggio"
    | "C_AltaCorte"
    | "D_Coordinamento_Transitorio"
    | "E_Scenari";

export type QuestionKind = "likert5" | "single_choice";

export interface BaseQuestion {
    id: string;
    module: Module;
    text: string;
    help: string;      // contenuto per il popover del "?"
    legalRef?: string; // riferimento sintetico (non obbligatorio)
    required?: boolean;
    kind: QuestionKind;
}

export interface Likert5Question extends BaseQuestion {
    kind: "likert5";
    // contributo per "step" di Likert: step = (valore - 3) => -2..+2
    // punteggio = step * vectorPerStep
    scoring: {
        vectorPerStep: ScoreVector;
        dkVector?: ScoreVector; // se l’utente sceglie "NS", default 0
    };
}

export interface ChoiceOption {
    id: string;
    label: string;
    help?: string;     // opzionale: micro-tooltip sull'opzione
    score: ScoreVector;
}

export interface SingleChoiceQuestion extends BaseQuestion {
    kind: "single_choice";
    options: ChoiceOption[];
    scoring?: {
        dkVector?: ScoreVector;
    };
}

export type Question = Likert5Question | SingleChoiceQuestion;

export const QUESTIONS: Question[] = [
    // =========================
    // A — ARCHITETTURA
    // =========================
    {
        id: "A01",
        module: "A_Architettura",
        kind: "likert5",
        text:
            "Scrivere in Costituzione che esistono distinte carriere per magistrati giudicanti e requirenti è un miglioramento.",
        help:
            "La riforma aggiunge che le norme sull’ordinamento giudiziario disciplinano anche le distinte carriere (giudicante/requirente).",
        legalRef: "Cost. art. 102 (mod.)",
        scoring: { vectorPerStep: { yesNo: +1.0, accountability: +0.1 } },
        required: true,
    },
    {
        id: "A02",
        module: "A_Architettura",
        kind: "likert5",
        text:
            "La magistratura dovrebbe essere descritta come composta da carriera giudicante e carriera requirente.",
        help:
            "Il nuovo impianto esplicita in Costituzione le due carriere all’interno dell’ordine autonomo e indipendente.",
        legalRef: "Cost. art. 104 (mod.)",
        scoring: { vectorPerStep: { yesNo: +0.8, accountability: +0.1 } },
        required: true,
    },
    {
        id: "A03",
        module: "A_Architettura",
        kind: "likert5",
        text:
            "Separare le carriere rischia di aumentare la distanza culturale tra chi accusa e chi giudica, peggiorando l’equilibrio complessivo.",
        help:
            "È una valutazione di sistema: due carriere e due organi di autogoverno possono produrre prassi e culture più divergenti.",
        scoring: { vectorPerStep: { yesNo: -1.0, accountability: -0.2 } },
        required: true,
    },

    // =========================
    // B — DUE CSM / SORTEGGIO
    // =========================
    {
        id: "B01",
        module: "B_CSM_Sorteggio",
        kind: "likert5",
        text:
            "Avere due CSM distinti (giudicante e requirente) rende più chiaro chi decide su carriere e nomine.",
        help:
            "Il testo prevede due Consigli superiori distinti, uno per la magistratura giudicante e uno per la requirente.",
        legalRef: "Cost. art. 104 (mod.)",
        scoring: { vectorPerStep: { yesNo: +1.0, accountability: +0.2 } },
        required: true,
    },
    {
        id: "B02",
        module: "B_CSM_Sorteggio",
        kind: "likert5",
        text:
            "È giusto che i due CSM siano presieduti dal Presidente della Repubblica.",
        help:
            "Entrambi i Consigli superiori sono presieduti dal Presidente della Repubblica.",
        legalRef: "Cost. art. 104 (mod.)",
        scoring: { vectorPerStep: { yesNo: +0.5, accountability: +0.1 } },
        required: true,
    },
    {
        id: "B03",
        module: "B_CSM_Sorteggio",
        kind: "likert5",
        text:
            "Mi convince che una quota dei componenti del CSM sia estratta a sorte da un elenco di professori ordinari e avvocati con almeno 15 anni (elenco compilato dal Parlamento).",
        help:
            "Un terzo dei componenti è estratto a sorte da un elenco (professori/avvocati ≥15 anni) che il Parlamento in seduta comune compila mediante elezione.",
        legalRef: "Cost. art. 104 (mod.)",
        scoring: { vectorPerStep: { yesNo: +1.1, accountability: +0.6 } },
        required: true,
    },
    {
        id: "B04",
        module: "B_CSM_Sorteggio",
        kind: "likert5",
        text:
            "Mi convince che i restanti componenti siano estratti a sorte tra i magistrati giudicanti/requirenti (numero e procedure demandati alla legge).",
        help:
            "Per due terzi i componenti sono sorteggiati tra i magistrati delle rispettive carriere, secondo numero/procedure stabiliti dalla legge.",
        legalRef: "Cost. art. 104 (mod.)",
        scoring: { vectorPerStep: { yesNo: +1.0, accountability: +0.3 } },
        required: true,
    },
    {
        id: "B05",
        module: "B_CSM_Sorteggio",
        kind: "likert5",
        text:
            "Preferisco il sorteggio (anti-correntismo) all’elezione per selezionare i membri del CSM.",
        help:
            "Domanda di governance: sorteggio come riduzione delle correnti vs elezione come rappresentanza/mandato.",
        scoring: { vectorPerStep: { yesNo: +0.7, accountability: +0.5 } },
        required: true,
    },
    {
        id: "B06",
        module: "B_CSM_Sorteggio",
        kind: "likert5",
        text:
            "È corretto che ciascun CSM elegga il vicepresidente tra i componenti sorteggiati dall’elenco compilato dal Parlamento.",
        help:
            "Il vicepresidente è scelto tra i componenti designati mediante sorteggio dall’elenco parlamentare.",
        legalRef: "Cost. art. 104 (mod.)",
        scoring: { vectorPerStep: { yesNo: +0.6, accountability: +0.6 } },
        required: true,
    },
    {
        id: "B07",
        module: "B_CSM_Sorteggio",
        kind: "likert5",
        text:
            "Mandato di 4 anni e impossibilità di partecipare al sorteggio successivo sono regole utili.",
        help:
            "I componenti sorteggiati durano 4 anni e non possono partecipare al sorteggio successivo (anti-cristallizzazione).",
        legalRef: "Cost. art. 104 (mod.)",
        scoring: { vectorPerStep: { yesNo: +0.6, accountability: +0.4 } },
        required: true,
    },
    {
        id: "B08",
        module: "B_CSM_Sorteggio",
        kind: "likert5",
        text:
            "Le incompatibilità (non iscrizione ad albi, non far parte di Parlamento/Consiglio regionale) sono necessarie e positive.",
        help:
            "Il testo vieta, finché in carica, iscrizione agli albi professionali e appartenenza a Parlamento o Consiglio regionale.",
        legalRef: "Cost. art. 104 (mod.)",
        scoring: { vectorPerStep: { yesNo: +0.5, accountability: +0.8 } },
        required: true,
    },

    // =========================
    // C — ALTA CORTE DISCIPLINARE
    // =========================
    {
        id: "C01",
        module: "C_AltaCorte",
        kind: "likert5",
        text:
            "La giurisdizione disciplinare sui magistrati dovrebbe essere attribuita a un’Alta Corte disciplinare dedicata, non ai CSM.",
        help:
            "La riforma attribuisce la disciplina all’Alta Corte; ai CSM restano (secondo ordinamento giudiziario) assunzioni, trasferimenti, valutazioni, funzioni.",
        legalRef: "Cost. art. 105 (mod.)",
        scoring: { vectorPerStep: { yesNo: +1.2, accountability: +1.0 } },
        required: true,
    },
    {
        id: "C02",
        module: "C_AltaCorte",
        kind: "likert5",
        text:
            "Mi convince la composizione dell’Alta Corte (15 giudici con quote miste: Presidente della Repubblica, elenco parlamentare, magistrati sorteggiati).",
        help:
            "15 giudici: 3 nominati dal Presidente della Repubblica; 3 sorteggiati da elenco parlamentare; 6 giudicanti e 3 requirenti sorteggiati tra categorie con requisiti alti.",
        legalRef: "Cost. art. 105 (mod.)",
        scoring: { vectorPerStep: { yesNo: +1.0, accountability: +1.0 } },
        required: true,
    },
    {
        id: "C03",
        module: "C_AltaCorte",
        kind: "likert5",
        text:
            "Requisiti molto selettivi (anzianità elevata e funzioni di legittimità) aumentano qualità e imparzialità dell’organo disciplinare.",
        help:
            "I membri togati sorteggiati richiedono almeno 20 anni di funzioni e svolgimento (o pregresso) di funzioni di legittimità.",
        legalRef: "Cost. art. 105 (mod.)",
        scoring: { vectorPerStep: { yesNo: +0.7, accountability: +0.6 } },
        required: true,
    },
    {
        id: "C04",
        module: "C_AltaCorte",
        kind: "likert5",
        text:
            "È una buona garanzia che il Presidente dell’Alta Corte sia eletto tra i membri ‘esterni’ (nominati dal PdR o sorteggiati dall’elenco parlamentare).",
        help:
            "Il Presidente dell’Alta Corte è eletto tra i giudici nominati dal PdR o sorteggiati dall’elenco parlamentare.",
        legalRef: "Cost. art. 105 (mod.)",
        scoring: { vectorPerStep: { yesNo: +0.6, accountability: +0.9 } },
        required: true,
    },
    {
        id: "C05",
        module: "C_AltaCorte",
        kind: "likert5",
        text:
            "Mandato 4 anni non rinnovabile e incompatibilità (politica/avvocatura/altre) sono un set di garanzie adeguato.",
        help:
            "Durata 4 anni non rinnovabile; incompatibilità con incarichi politici, Governo, professione forense e altre indicate dalla legge.",
        legalRef: "Cost. art. 105 (mod.)",
        scoring: { vectorPerStep: { yesNo: +0.6, accountability: +1.0 } },
        required: true,
    },
    {
        id: "C06",
        module: "C_AltaCorte",
        kind: "likert5",
        text:
            "Mi preoccupa che l’impugnazione delle decisioni disciplinari sia solo davanti alla stessa Alta Corte (anche se senza i giudici del primo grado).",
        help:
            "È ammessa impugnazione anche per merito, ma soltanto dinanzi alla stessa Alta Corte, con collegio diverso.",
        legalRef: "Cost. art. 105 (mod.)",
        scoring: { vectorPerStep: { yesNo: -0.9, accountability: -0.6 } },
        required: true,
    },
    {
        id: "C07",
        module: "C_AltaCorte",
        kind: "likert5",
        text:
            "È importante che la legge disciplini il procedimento e assicuri la rappresentanza di magistrati giudicanti/requirenti nei collegi.",
        help:
            "La norma rimanda alla legge: illeciti, sanzioni, collegi, procedimento, funzionamento; e richiede rappresentanza nei collegi.",
        legalRef: "Cost. art. 105 (mod.)",
        scoring: { vectorPerStep: { yesNo: +0.4, accountability: +0.5 } },
        required: true,
    },

    // =========================
    // D — COORDINAMENTO / TRANSITORIO
    // =========================
    {
        id: "D01",
        module: "D_Coordinamento_Transitorio",
        kind: "likert5",
        text:
            "È coerente che alcune formule diventino ‘del rispettivo Consiglio’/‘di ciascun Consiglio’ per adattare il testo al doppio CSM.",
        help:
            "Modifiche di coordinamento testuale: con due CSM, i riferimenti vengono adeguati.",
        legalRef: "Cost. artt. 107 e 110 (mod.)",
        scoring: { vectorPerStep: { yesNo: +0.4, accountability: +0.2 } },
        required: true,
    },
    {
        id: "D02",
        module: "D_Coordinamento_Transitorio",
        kind: "likert5",
        text:
            "Mi convince includere anche magistrati requirenti con almeno 15 anni tra i possibili chiamati in base all’art. 106 (come modificato).",
        help:
            "Il testo integra l’art. 106 (3° comma) includendo magistrati requirenti con almeno 15 anni (oltre ai professori e avvocati previsti).",
        legalRef: "Cost. art. 106 (mod.)",
        scoring: { vectorPerStep: { yesNo: +0.5, accountability: +0.2 } },
        required: true,
    },
    {
        id: "D03",
        module: "D_Coordinamento_Transitorio",
        kind: "likert5",
        text:
            "Accetto un periodo transitorio: leggi di adeguamento entro 1 anno e, fino ad allora, applicazione delle norme previgenti.",
        help:
            "Disposizioni transitorie: adeguamento entro un anno; nel frattempo continuano a valere le norme vigenti.",
        legalRef: "Disposizioni transitorie",
        scoring: { vectorPerStep: { yesNo: +0.7, accountability: +0.3 } },
        required: true,
    },

    // =========================
    // E — SCENARI FUTURI (single choice)
    // =========================
    {
        id: "E01",
        module: "E_Scenari",
        kind: "single_choice",
        text:
            "Scenario: l’elenco parlamentare (professori/avvocati) è percepito come ‘di parte’. Quale valutazione ti pesa di più?",
        help:
            "Qui misuriamo la tua sensibilità al rischio di ‘filtro politico’ vs l’idea che il sorteggio riduca quel rischio.",
        options: [
            {
                id: "A",
                label: "Rischio gestibile: il sorteggio attenua e bilancia.",
                score: { yesNo: +1.0, accountability: +0.6 },
            },
            {
                id: "B",
                label: "Rischio grave: già la lista parlamentare è politicizzazione.",
                score: { yesNo: -1.0, accountability: -1.0 },
            },
            { id: "DK", label: "Non so / dipende", score: { yesNo: 0, accountability: 0 } },
        ],
        required: true,
    },
    {
        id: "E02",
        module: "E_Scenari",
        kind: "single_choice",
        text:
            "Scenario: calano le correnti, ma aumenta l’imprevedibilità/eterogeneità nelle decisioni del CSM. Cosa preferisci?",
        help:
            "Trade-off: anti-correntismo vs prevedibilità/standardizzazione delle prassi.",
        options: [
            {
                id: "A",
                label: "Meglio meno correnti anche con più variabilità.",
                score: { yesNo: +1.0, accountability: +0.4 },
            },
            {
                id: "B",
                label: "Meglio prevedibilità anche se restano dinamiche correntizie.",
                score: { yesNo: -0.7, accountability: -0.3 },
            },
            { id: "DK", label: "Non so / dipende", score: { yesNo: 0, accountability: 0 } },
        ],
        required: true,
    },
    {
        id: "E03",
        module: "E_Scenari",
        kind: "single_choice",
        text:
            "Scenario: caso disciplinare ad alta esposizione mediatica. Ti fidi di più se decide…",
        help:
            "Misuriamo quale assetto ti dà più fiducia quando la pressione esterna è massima.",
        options: [
            {
                id: "A",
                label: "Alta Corte disciplinare dedicata.",
                score: { yesNo: +1.2, accountability: +1.0 },
            },
            {
                id: "B",
                label: "Organo interno al CSM (autogoverno).",
                score: { yesNo: -1.0, accountability: -1.0 },
            },
            { id: "DK", label: "Non so / dipende", score: { yesNo: 0, accountability: 0 } },
        ],
        required: true,
    },
    {
        id: "E04",
        module: "E_Scenari",
        kind: "single_choice",
        text:
            "Scenario: l’appello disciplinare è interno alla stessa Alta Corte (collegio diverso). Qual è la tua reazione prevalente?",
        help:
            "È un punto molto discriminante: fiducia nella specializzazione vs preferenza per un giudice ‘esterno’.",
        options: [
            {
                id: "A",
                label: "Rassicura: continuità e specializzazione.",
                score: { yesNo: +0.8, accountability: +0.6 },
            },
            {
                id: "B",
                label: "Preoccupa: preferirei un livello esterno distinto.",
                score: { yesNo: -1.0, accountability: -0.8 },
            },
            { id: "DK", label: "Non so / dipende", score: { yesNo: 0, accountability: 0 } },
        ],
        required: true,
    },
    {
        id: "E05",
        module: "E_Scenari",
        kind: "single_choice",
        text:
            "Scenario: due CSM sviluppano prassi divergenti. È più per te…",
        help:
            "Misuriamo la tua tolleranza per differenziazione/specializzazione vs timore di disomogeneità.",
        options: [
            {
                id: "A",
                label: "Normale specializzazione (accettabile).",
                score: { yesNo: +0.7, accountability: +0.2 },
            },
            {
                id: "B",
                label: "Problema serio (rischio di conflitti/disomogeneità).",
                score: { yesNo: -0.8, accountability: -0.2 },
            },
            { id: "DK", label: "Non so / dipende", score: { yesNo: 0, accountability: 0 } },
        ],
        required: true,
    },
    {
        id: "E06",
        module: "E_Scenari",
        kind: "single_choice",
        text:
            "Scenario: incompatibilità rigide rendono difficile trovare candidati. Cosa preferisci?",
        help:
            "È un classico trade-off: integrità/assenza conflitti vs ampiezza del bacino di selezione.",
        options: [
            {
                id: "A",
                label: "Meglio poche candidature ma regole dure.",
                score: { yesNo: +0.5, accountability: +1.0 },
            },
            {
                id: "B",
                label: "Meglio più candidature anche con regole meno rigide.",
                score: { yesNo: -0.5, accountability: -1.0 },
            },
            { id: "DK", label: "Non so / dipende", score: { yesNo: 0, accountability: 0 } },
        ],
        required: true,
    },
    {
        id: "E07",
        module: "E_Scenari",
        kind: "single_choice",
        text:
            "Scenario: l’attuazione legislativa slitta oltre l’anno. Per te è soprattutto…",
        help:
            "Misura quanto ti pesa l’incertezza applicativa in una riforma costituzionale.",
        options: [
            {
                id: "A",
                label: "Un rischio gestibile (transitorio previsto).",
                score: { yesNo: +0.6, accountability: +0.1 },
            },
            {
                id: "B",
                label: "Un rischio inaccettabile (incertezza e frizioni).",
                score: { yesNo: -0.8, accountability: -0.1 },
            },
            { id: "DK", label: "Non so / dipende", score: { yesNo: 0, accountability: 0 } },
        ],
        required: true,
    },
];
