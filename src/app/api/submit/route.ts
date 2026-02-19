import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { scoreAnswers, interpretScore } from '@/scoring';
import { QUESTIONS } from '@/questions';

const ageToBand = (age: number): string => {
    if (age < 14) return "Under 14";
    if (age <= 17) return "14-17";
    if (age <= 24) return "18-24";
    if (age <= 34) return "25-34";
    if (age <= 44) return "35-44";
    if (age <= 54) return "45-54";
    if (age <= 64) return "55-64";
    return "65+";
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sex, age, answers } = body;

        const ageBand = ageToBand(Number(age));
        const scoreResult = scoreAnswers(QUESTIONS, answers);
        const interpretation = interpretScore(scoreResult);

        await prisma.response.create({
            data: {
                sex,
                ageBand,
                answersJson: JSON.stringify(answers),
                scoreYesNo: scoreResult.totals.yesNo,
                scoreAccountability: scoreResult.totals.accountability,
                lean: interpretation.lean,
                strength: interpretation.strength,
            },
        });

        return NextResponse.json({
            lean: interpretation.lean,
            strength: interpretation.strength,
            motive: interpretation.motive,
            quadrantLabel: interpretation.quadrantLabel,
            totals: scoreResult.totals,
            byModule: scoreResult.byModule,
        });
    } catch (error) {
        console.error('Error in /api/submit:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
