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

        return NextResponse.json({
            totalCount,
            leanCounts,
            sexBreakdown,
            ageBreakdown,
            responses,
        });
    } catch (error) {
        console.error('Error in /api/admin/stats:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
