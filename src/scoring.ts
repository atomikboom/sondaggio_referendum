import { QUESTIONS, Question, Axis, ScoreVector } from "./questions";

export type LikertValue = 1 | 2 | 3 | 4 | 5;
export type AnswerValue = LikertValue | string; // string = optionId per single_choice

export type Answers = Record<string, AnswerValue | "DK" | undefined>;

export interface ScoreResult {
    totals: ScoreVector;
    maxAbs: ScoreVector; // massimo assoluto teorico (serve per soglie %)
    byModule: Record<string, ScoreVector>;
    completion: number;  // 0..1
}

const ZERO: ScoreVector = { yesNo: 0, accountability: 0 };

function add(a: ScoreVector, b: ScoreVector): ScoreVector {
    return { yesNo: a.yesNo + b.yesNo, accountability: a.accountability + b.accountability };
}
function scale(v: ScoreVector, k: number): ScoreVector {
    return { yesNo: v.yesNo * k, accountability: v.accountability * k };
}

/** Likert step: 1..5 -> -2..+2 */
function likertStep(v: LikertValue): number {
    return (v - 3) as number;
}

function maxAbsForQuestion(q: Question): ScoreVector {
    if (q.kind === "likert5") {
        // max step = 2
        return {
            yesNo: Math.abs(q.scoring.vectorPerStep.yesNo) * 2,
            accountability: Math.abs(q.scoring.vectorPerStep.accountability) * 2
        };
    }
    // single_choice: max assoluto tra opzioni
    let maxYes = 0;
    let maxAcc = 0;
    for (const opt of q.options) {
        maxYes = Math.max(maxYes, Math.abs(opt.score.yesNo));
        maxAcc = Math.max(maxAcc, Math.abs(opt.score.accountability));
    }
    return { yesNo: maxYes, accountability: maxAcc };
}

export function scoreAnswers(questions: Question[], answers: Answers): ScoreResult {
    let totals: ScoreVector = { ...ZERO };
    let maxAbs: ScoreVector = { ...ZERO };
    const byModule: Record<string, ScoreVector> = {};
    let answered = 0;
    let required = 0;

    for (const q of questions) {
        const isReq = q.required ?? false;
        if (isReq) required += 1;

        // max teorico
        maxAbs = add(maxAbs, maxAbsForQuestion(q));

        if (!byModule[q.module]) byModule[q.module] = { ...ZERO };

        const a = answers[q.id];
        if (a === undefined) continue;

        // conteggio completion (solo sulle required)
        if (isReq) answered += 1;

        let contrib: ScoreVector = { ...ZERO };

        if (q.kind === "likert5") {
            if (a === "DK") {
                contrib = q.scoring.dkVector ?? ZERO;
            } else {
                const step = likertStep(a as LikertValue);
                contrib = scale(q.scoring.vectorPerStep, step);
            }
        } else if (q.kind === "single_choice") {
            if (a === "DK") {
                contrib = q.scoring?.dkVector ?? ZERO;
            } else {
                const opt = q.options.find(o => o.id === a);
                contrib = opt ? opt.score : ZERO;
            }
        }

        totals = add(totals, contrib);
        byModule[q.module] = add(byModule[q.module], contrib);
    }

    const completion = required === 0 ? 1 : answered / required;
    return { totals, maxAbs, byModule, completion };
}

export type Lean = "SÌ" | "NO" | "INCERTO";
export type Motive = "Accountability/Controllo" | "Autogoverno/Indipendenza" | "Bilanciato";
export type Strength = "debole" | "media" | "forte";

export interface Interpretation {
    lean: Lean;
    motive: Motive;
    quadrantLabel: string;
    strength: Strength;
}

function strengthFromRatio(r: number): Strength {
    if (r >= 0.55) return "forte";
    if (r >= 0.35) return "media";
    return "debole";
}

export function interpretScore(res: ScoreResult): Interpretation {
    // soglie percentuali sul massimo teorico (robuste anche se aggiungi domande)
    const yesRatio = res.maxAbs.yesNo === 0 ? 0 : Math.abs(res.totals.yesNo) / res.maxAbs.yesNo;
    const accRatio = res.maxAbs.accountability === 0 ? 0 : res.totals.accountability / res.maxAbs.accountability;

    const lean: Lean =
        yesRatio < 0.20 ? "INCERTO" : (res.totals.yesNo > 0 ? "SÌ" : "NO");

    const motive: Motive =
        Math.abs(accRatio) < 0.20 ? "Bilanciato"
            : (accRatio > 0 ? "Accountability/Controllo" : "Autogoverno/Indipendenza");

    const strength = strengthFromRatio(yesRatio);

    // Quadranti “narrativi”
    let quadrantLabel = "";
    if (lean === "SÌ" && motive === "Accountability/Controllo")
        quadrantLabel = "SÌ: riforma come leva di accountability e riequilibrio";
    else if (lean === "SÌ" && motive === "Autogoverno/Indipendenza")
        quadrantLabel = "SÌ: favore al cambio, ma attenzione alle garanzie interne";
    else if (lean === "NO" && motive === "Autogoverno/Indipendenza")
        quadrantLabel = "NO: priorità a indipendenza/autogoverno e prudenza istituzionale";
    else if (lean === "NO" && motive === "Accountability/Controllo")
        quadrantLabel = "NO: obiettivo accountability, ma sfiducia nel design proposto";
    else
        quadrantLabel = "Area mista: servono chiarimenti sui trade-off chiave";

    return { lean, motive, quadrantLabel, strength };
}
