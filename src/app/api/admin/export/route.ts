import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
    const token = req.headers.get('x-admin-token');
    if (!token || token !== process.env.ADMIN_TOKEN) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const responses = await prisma.response.findMany({
            orderBy: { createdAt: 'desc' },
        });

        // Create CSV header
        const headers = [
            'ID',
            'Data',
            'Sesso',
            'Fascia Età',
            'Incline',
            'Forza',
            'Punteggio S/N',
            'Punteggio Acc',
            'Risposte JSON'
        ];

        let csv = headers.join(',') + '\n';

        responses.forEach((resp: any) => {
            const row = [
                resp.id,
                resp.createdAt.toISOString(),
                `"${resp.sex}"`,
                `"${resp.ageBand}"`,
                `"${resp.lean}"`,
                `"${resp.strength}"`,
                resp.scoreYesNo,
                resp.scoreAccountability,
                `"${resp.answersJson.replace(/"/g, '""')}"`
            ];
            csv += row.join(',') + '\n';
        });

        return new Response(csv, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename=risposte_referendum.csv',
            },
        });
    } catch (error) {
        console.error('Error in /api/admin/export:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
