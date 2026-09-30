import { NextRequest, NextResponse } from 'next/server';
import { getUserId } from "@/lib/session";
import { queryOpenJobs } from "@/lib/jobs";

// Any signed-in user may browse. Clients included — the nav links here for everyone.
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const p = req.nextUrl.searchParams;
    const result = await queryOpenJobs({
      search: p.get('search'),
      category: p.get('category'),
      min: p.get('min'),
      max: p.get('max'),
      budgetType: p.get('budgetType'),
      sort: p.get('sort'),
      page: p.get('page'),
    });

    return NextResponse.json({ success: true, ...result, count: result.data.length });
  } catch (error) {
    console.error('Open jobs fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
