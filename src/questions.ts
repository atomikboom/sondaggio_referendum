// src/questions.ts

export type Axis = "yesNo" | "accountability";

/**
 * Axis meanings (keep consistent with scoring.ts):
 * - yesNo:
 *    +  => propensione verso SÌ (approvare la riforma)
 *    -  => propensione verso NO (respingere la riforma)
 * - accountability:
 *    +  => maggiore sensibilità a rischi di influenza politica / bisogno di contrappesi e accountability
 *    -  => maggiore tolleranza al modello proposto / priorità ad altri problemi (es. correntismo) rispetto al rischio “cattura”
 */
export type ScoreVector = Record<Axis, number>;

export type Module =
    | "A_PesoRiforma"
    | "B_Carriere"
    | "C_CSM_Sorteggio"
    | "D_Disciplina"
    | "E_Transizione"
    | "F_Scenari";

export type QuestionKind = "likert5" | "single_choice";

export interface BaseQuestion {
    id: string;
    module: Module;
    text: string;
    help: string; // contenuto popover "?"
    legalRef?: string;
    required?: boolean;
    kind: QuestionKind;
}

export interface Likert5Question extends BaseQuestion {
    kind: "likert5";
    /**
     * Likert: 1..5 -> step = (val - 3) => -2..+2
     * contribution = step * vectorPerStep
     */
    scoring: {
        vectorPerStep: ScoreVector;
        dkVector?: ScoreVector; // default 0
    };
}

export interface ChoiceOption {
    id: string;
    label: string;
    score: ScoreVector;
}

export interface SingleChoiceQuestion extends BaseQuestion {
    kind: "single_choice";
    options: ChoiceOption[]; // include "DK"
    scoring?: {
        dkVector?: ScoreVector;
    };
}

export type Question = Likert5Question | SingleChoiceQuestion;

const ZERO: ScoreVector = { yesNo: 0, accountability: 0 };

export const QUESTIONS: Question[] = [
    // =========================
    // A — PESO DELLA RIFORMA
    // =========================
    {
        id: "Q01",
        module: "A_PesoRiforma",
        kind: "likert5",
        text:
            "Per cambiare l’assetto della magistratura ha senso intervenire direttamente in Costituzione (e non solo con leggi ordinarie).",
        help:
            "Qui valuti il “peso” della scelta: una riforma costituzionale è più stabile e difficile da cambiare. Può dare una direzione chiara, ma è anche più complessa da correggere se emergono problemi.",
        required: true,
        scoring: { vectorPerStep: { yesNo: +0.9, accountability: -0.1 }, dkVector: ZERO },
    },
    {
        id: "Q02",
        module: "A_PesoRiforma",
        kind: "likert5",
        text:
            "Mi fido che un cambiamento costituzionale ampio possa migliorare il sistema nel lungo periodo senza creare effetti collaterali gravi.",
        help:
            "Questa domanda misura la fiducia “di fondo” nel pacchetto: le riforme grandi possono risolvere problemi strutturali, ma possono anche spostare equilibri delicati e produrre conseguenze impreviste.",
        required: true,
        scoring: { vectorPerStep: { yesNo: +1.0, accountability: -0.2 }, dkVector: ZERO },
    },
    {
        id: "Q03",
        module: "A_PesoRiforma",
        kind: "single_choice",
        text: "Quale problema ti sembra più urgente risolvere?",
        help:
            "Serve a capire da quale “preoccupazione principale” parti: (A) rischio di influenza politica sulla magistratura, oppure (B) correntismo/opacità nell’autogoverno. Non è una domanda ‘giusta/sbagliata’: misura la priorità.",
        required: true,
        options: [
            {
                id: "A",
                label: "Il rischio che la politica possa influenzare la magistratura.",
                score: { yesNo: -0.6, accountability: +1.0 },
            },
            {
                id: "B",
                label: "Il rischio che l’autogoverno resti opaco/correntizio.",
                score: { yesNo: +0.7, accountability: -0.7 },
            },
            { id: "DK", label: "Non so / dipende", score: ZERO },
        ],
    },

    // =========================
    // B — CARRIERE (GIUDICI/PM)
    // =========================
    {
        id: "Q04",
        module: "B_Carriere",
        kind: "likert5",
        text: "Separare le carriere di giudici e PM è una buona idea.",
        help:
            "Vuol dire che chi giudica e chi accusa seguono percorsi professionali distinti. Per alcuni aumenta chiarezza e distanza tra ruoli; per altri può creare due ‘blocchi’ più separati.",
        required: true,
        scoring: { vectorPerStep: { yesNo: +1.0, accountability: -0.1 }, dkVector: ZERO },
    },
    {
        id: "Q05",
        module: "B_Carriere",
        kind: "likert5",
        text:
            "Con carriere separate, il giudice appare più credibilmente “terzo” (imparziale) rispetto all’accusa.",
        help:
            "Qui misuri la fiducia/percezione di imparzialità: più distanza istituzionale tra giudice e PM potrebbe aumentare la sensazione di neutralità del giudice.",
        required: true,
        scoring: { vectorPerStep: { yesNo: +0.8, accountability: -0.1 }, dkVector: ZERO },
    },
    {
        id: "Q06",
        module: "B_Carriere",
        kind: "likert5",
        text:
            "Carriere separate aumentano il rischio che accusa e giudice diventino due “blocchi” contrapposti, con prassi più rigide.",
        help:
            "Questa domanda cattura un possibile effetto collaterale: maggiore separazione può portare a maggiore polarizzazione tra ruoli (anche solo come cultura organizzativa).",
        required: true,
        scoring: { vectorPerStep: { yesNo: -0.9, accountability: +0.2 }, dkVector: ZERO },
    },

    // =========================
    // C — DUE CSM / SORTEGGIO
    // =========================
    {
        id: "Q07",
        module: "C_CSM_Sorteggio",
        kind: "likert5",
        text:
            "Avere due CSM (uno per giudici e uno per PM) rende il sistema più ordinato e coerente.",
        help:
            "Pro: ogni carriera avrebbe regole e governo più “specializzati”. Contro: due organi possono divergere e creare disomogeneità o attriti istituzionali.",
        required: true,
        scoring: { vectorPerStep: { yesNo: +0.8, accountability: +0.1 }, dkVector: ZERO },
    },
    {
        id: "Q08",
        module: "C_CSM_Sorteggio",
        kind: "likert5",
        text:
            "Mi preoccupa che due CSM possano applicare criteri diversi su valutazioni e carriere, creando disomogeneità.",
        help:
            "Qui valuti quanto ti pesa la possibilità che due organi distinti adottino prassi diverse (anche se entrambe ‘legittime’), con effetti di incoerenza.",
        required: true,
        scoring: { vectorPerStep: { yesNo: -0.7, accountability: +0.2 }, dkVector: ZERO },
    },
    {
        id: "Q09",
        module: "C_CSM_Sorteggio",
        kind: "likert5",
        text:
            "Usare il sorteggio per scegliere parte dei membri dei CSM è un modo accettabile per ridurre correnti e accordi.",
        help:
            "Il sorteggio può ridurre campagne e cordate, ma può anche ridurre la selezione “per mandato” (chi è scelto per un programma o una reputazione specifica).",
        required: true,
        scoring: { vectorPerStep: { yesNo: +0.7, accountability: -0.2 }, dkVector: ZERO },
    },
    {
        id: "Q10",
        module: "C_CSM_Sorteggio",
        kind: "likert5",
        text:
            "Il sorteggio rende più difficile capire chi “risponde” delle decisioni (meno accountability).",
        help:
            "Con elezione/nomina è spesso più chiaro chi ha sostenuto chi e perché. Con il sorteggio, attribuire responsabilità per le scelte può diventare più difficile.",
        required: true,
        scoring: { vectorPerStep: { yesNo: -0.6, accountability: +0.6 }, dkVector: ZERO },
    },
    {
        id: "Q11",
        module: "C_CSM_Sorteggio",
        kind: "likert5",
        text:
            "È un problema che parte dei membri non-magistrati venga estratta da una lista formata dal Parlamento (anche se poi c’è il sorteggio).",
        help:
            "Questo è un punto dove la politica entra materialmente: il Parlamento forma un elenco. Per alcuni è un bilanciamento ‘democratico’; per altri è un canale di possibile influenza politica sull’autogoverno.",
        required: true,
        scoring: { vectorPerStep: { yesNo: -1.0, accountability: +1.0 }, dkVector: ZERO },
    },

    // =========================
    // D — DISCIPLINA (ALTA CORTE)
    // =========================
    {
        id: "Q12",
        module: "D_Disciplina",
        kind: "likert5",
        text:
            "Spostare la disciplina dei magistrati su un organo separato (Alta Corte) è un miglioramento.",
        help:
            "Pro: un organo dedicato può essere più specializzato e meno legato a dinamiche interne. Contro: se viene percepito come influenzabile, può diventare una leva indiretta sulle decisioni dei magistrati.",
        required: true,
        scoring: { vectorPerStep: { yesNo: +0.7, accountability: +0.4 }, dkVector: ZERO },
    },
    {
        id: "Q13",
        module: "D_Disciplina",
        kind: "likert5",
        text:
            "Se un organo disciplinare è percepito come influenzabile dalla politica, aumenta il rischio che i magistrati “si autocensurino” nei casi sensibili.",
        help:
            "Questo è il rischio di “pressione indiretta” (chilling effect): non serve un ordine esplicito. Può bastare il timore di conseguenze su carriera o disciplina per rendere più prudenti inchieste/decisioni scomode.",
        required: true,
        scoring: { vectorPerStep: { yesNo: -1.1, accountability: +1.0 }, dkVector: ZERO },
    },
    {
        id: "Q14",
        module: "D_Disciplina",
        kind: "likert5",
        text:
            "Incompatibilità molto rigide (niente incarichi politici, conflitti d’interesse) sono una garanzia sufficiente contro la politicizzazione.",
        help:
            "Qui valuti se regole di incompatibilità e requisiti stringenti bastano a schermare gli organi (CSM/Alta Corte) da pressioni esterne e conflitti d’interesse.",
        required: true,
        scoring: { vectorPerStep: { yesNo: +0.5, accountability: -0.3 }, dkVector: ZERO },
    },
    {
        id: "Q15",
        module: "D_Disciplina",
        kind: "single_choice",
        text:
            "Per aumentare la fiducia nel sistema disciplinare preferisci…",
        help:
            "Punto di architettura: (A) un secondo livello ‘esterno’ distinto può aumentare la fiducia per chi teme autocontrollo; (B) restare nello stesso organo (ma con collegio diverso) privilegia continuità e specializzazione.",
        required: true,
        options: [
            {
                id: "A",
                label: "Appello davanti a un organo diverso/esterno.",
                score: { yesNo: -0.7, accountability: +0.6 },
            },
            {
                id: "B",
                label: "Appello nello stesso organo, ma con collegio diverso.",
                score: { yesNo: +0.6, accountability: -0.2 },
            },
            { id: "DK", label: "Non so / dipende", score: ZERO },
        ],
    },

    // =========================
    // E — TRANSIZIONE / ATTUAZIONE
    // =========================
    {
        id: "Q16",
        module: "E_Transizione",
        kind: "likert5",
        text:
            "Accetto che dopo un eventuale Sì serva un periodo di attuazione con nuove leggi e assestamento.",
        help:
            "Le riforme grandi richiedono norme attuative. Beneficio: definire meglio i dettagli. Rischio: fase di incertezza e scontri su come applicare le nuove regole.",
        required: true,
        scoring: { vectorPerStep: { yesNo: +0.6, accountability: -0.1 }, dkVector: ZERO },
    },
    {
        id: "Q17",
        module: "E_Transizione",
        kind: "likert5",
        text:
            "Mi preoccupa che ritardi o conflitti sull’attuazione possano creare un periodo lungo di regole poco chiare.",
        help:
            "Qui misuri quanto ti pesa una transizione “a metà”: nuove regole costituzionali, ma dettagli operativi che arrivano tardi o in modo contestato.",
        required: true,
        scoring: { vectorPerStep: { yesNo: -0.6, accountability: +0.2 }, dkVector: ZERO },
    },

    // =========================
    // F — SCENARI FUTURI (HARD)
    // =========================
    {
        id: "Q18",
        module: "F_Scenari",
        kind: "single_choice",
        text:
            "Scenario: una maggioranza politica forte, per anni, influenza indirettamente canali di selezione (liste/nomine/ruoli). Tu lo valuti come…",
        help:
            "Scenario di “cattura progressiva”: non un colpo di stato, ma un accumulo di leve che può indebolire i contrappesi nel tempo. Misura quanto ti sembra rischioso questo tipo di dinamica.",
        required: true,
        options: [
            {
                id: "A",
                label: "Rischio serio per l’equilibrio democratico.",
                score: { yesNo: -1.2, accountability: +1.2 },
            },
            {
                id: "B",
                label: "Rischio limitato: i contrappesi sono sufficienti.",
                score: { yesNo: +1.0, accountability: -0.8 },
            },
            { id: "DK", label: "Non so / dipende", score: ZERO },
        ],
    },
    {
        id: "Q19",
        module: "F_Scenari",
        kind: "single_choice",
        text:
            "Scenario: anche senza ordini diretti, la disciplina diventa una minaccia percepita contro chi indaga su poteri forti. Per te…",
        help:
            "Scenario ‘pressione indiretta’: può bastare rendere rischioso colpire il potere per indebolire la funzione di controllo della giustizia. Misura la tua soglia di tolleranza a questo rischio.",
        required: true,
        options: [
            {
                id: "A",
                label: "È un rischio intollerabile (anche se raro).",
                score: { yesNo: -1.2, accountability: +1.3 },
            },
            {
                id: "B",
                label: "È un rischio gestibile con regole chiare e trasparenza.",
                score: { yesNo: +0.9, accountability: -0.6 },
            },
            { id: "DK", label: "Non so / dipende", score: ZERO },
        ],
    },
    {
        id: "Q20",
        module: "F_Scenari",
        kind: "single_choice",
        text:
            "Scenario: vince il No e per anni non cambia davvero nulla (correntismo/opacità restano simili). Tu lo valuti come…",
        help:
            "Questo scenario pesa l’altra faccia: se temi molto lo status quo, potresti accettare più rischi di riforma; se temi di più la cattura politica, potresti preferire lo status quo.",
        required: true,
        options: [
            {
                id: "A",
                label: "È un problema grave: serve cambiare.",
                score: { yesNo: +1.0, accountability: -0.5 },
            },
            {
                id: "B",
                label: "È preferibile: meglio lo status quo che rischi di politicizzazione.",
                score: { yesNo: -0.9, accountability: +0.6 },
            },
            { id: "DK", label: "Non so / dipende", score: ZERO },
        ],
    },
];