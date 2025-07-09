// app/api/revenue/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/service';

export async function GET(req) {
  const { searchParams } = new URL(req.url);

  const period = searchParams.get('period') || 'today';
  const start_date = searchParams.get('start_date'); // optional
  const end_date = searchParams.get('end_date');     // optional

  try {
    const { data, error } = await supabaseAdmin.rpc('calculate_revenue_summary', {
      period,
      start_date,
      end_date,
    });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const result = {
        ...data[0],
        final_revenue: data[0].total_revenue - data[0].pending_revenue
    }

    return NextResponse.json({ revenue: result }, { status: 200 });

  } catch (err) {
    console.error('Server error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
