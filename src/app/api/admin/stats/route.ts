import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    const token = req.headers.get('x-admin-token');
    if (!token || token !== process.env.ADMIN_TOKEN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const totalCount = await prisma.response.count();

        const leanCounts = await prisma.response.groupBy({
            by: ['lean'],
            _count: { lean: true },
        });

        const sexBreakdown = await prisma.response.groupBy({
            by: ['sex'],
            _count: { sex: true },
        });

        const ageBreakdown = await prisma.response.groupBy({
            by: ['ageBand'],
            _count: { ageBand: true },
        });

        const responses = await prisma.response.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100,
        });

        // Advanced Analytics: Question-level breakdown
        const allResponses = await prisma.response.findMany({
            select: { answersJson: true }
        });

        const questionStats: Record<string, { avg: number, dist: Record<string, number>, count: number }> = {};

        allResponses.forEach((r: { answersJson: string }) => {
            try {
                const answers = JSON.parse(r.answersJson);
                Object.entries(answers).forEach(([qId, val]) => {
                    if (!questionStats[qId]) {
                        questionStats[qId] = { avg: 0, dist: {}, count: 0 };
                    }

                    const numericVal = Number(val);
                    if (!isNaN(numericVal)) {
                        questionStats[qId].count++;
                        questionStats[qId].avg += numericVal;
                    }

                    const key = String(val);
                    questionStats[qId].dist[key] = (questionStats[qId].dist[key] || 0) + 1;
                });
            } catch {
                // ignore malformed JSON
            }
        });

        // Finalize averages
        Object.keys(questionStats).forEach(qId => {
            if (questionStats[qId].count > 0) {
                questionStats[qId].avg = Number((questionStats[qId].avg / questionStats[qId].count).toFixed(2));
            }
        });

        return NextResponse.json({
            totalCount,
            leanCounts,
            sexBreakdown,
            ageBreakdown,
            responses,
            questionStats,
        });
    } catch (error) {
        console.error('Error in /api/admin/stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
