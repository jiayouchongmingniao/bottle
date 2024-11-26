import { NextResponse } from 'next/server';
import { getPresetMoods } from '@/db';
import { PresetMood } from '@/types';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type') as PresetMood['type'] || 'neutral';
    
    const moods = await getPresetMoods(type);
    
    if (!moods.length) {
      return NextResponse.json(
        { error: 'No preset moods found' },
        { status: 404 }
      );
    }
    
    // Randomly select 3 moods from the available ones
    const selectedMoods = moods
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    return NextResponse.json(selectedMoods);
  } catch (error) {
    console.error('Error getting preset moods:', error);
    return NextResponse.json(
      { error: 'Failed to get preset moods' },
      { status: 500 }
    );
  }
}
