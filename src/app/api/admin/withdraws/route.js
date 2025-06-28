// app/api/withdraws/route.js
import { NextRequest, NextResponse } from 'next/server';
import { fetchWithdraws, getWithdrawStats } from './helpers';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Extract all query parameters
    const timeFilter = searchParams.get('timeFilter');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');
    const methodId = searchParams.get('methodId');
    const groupId = searchParams.get('groupId');
    const minAmount = searchParams.get('minAmount');
    const maxAmount = searchParams.get('maxAmount');
    const userId = searchParams.get('userId');
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');
    const includeStats = searchParams.get('includeStats');

    // Validate limit to prevent abuse
    const validatedLimit = limit ? Math.min(parseInt(limit), 100) : 50;

    const filters = {
      timeFilter,
      startDate,
      endDate,
      status,
      methodId,
      groupId,
      minAmount,
      maxAmount,
      userId,
      page: page ? parseInt(page) : 1,
      limit: validatedLimit,
      sortBy: sortBy || 'created_at',
      sortOrder: sortOrder || 'desc'
    };

    // Fetch withdraws with filters
    const result = await fetchWithdraws(filters);

    // Optionally include stats
    let stats = null;
    if (includeStats === 'true') {
      stats = await getWithdrawStats(filters);
    }

    return NextResponse.json({
      success: true,
      ...result,
      stats
    });

  } catch (error) {
    console.error('Error fetching withdraws:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch withdraws',
        message: error.message
      },
      { status: 500 }
    );
  }
}