import { NextRequest, NextResponse } from "next/server";
import { getTimetableForClass } from "@/utils/csvParser";
import { validateTimetableParams } from "@/utils/validation";
import path from "path";
import fs from "fs";

/**
 * API route handler for fetching timetables by grade and class number
 * Route: /api/timetable/[grade]/[classNumber]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { grade: string; classNumber: string } }
) {
  // Parse and validate parameters
  const grade = parseInt(params.grade, 10);
  const classNumber = parseInt(params.classNumber, 10);
  
  // Validate parameters
  const validation = validateTimetableParams(grade, classNumber);
  if (!validation.isValid) {
    return NextResponse.json(
      { error: validation.errorMessage },
      { status: 400 }
    );
  }

  // Check if timetable file exists
  const filePath = path.join(process.cwd(), 'public', 'timetables', 'mocking.csv');
  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: "Timetable data not found" }, 
      { status: 404 }
    );
  }

  // Get timetable data
  const timetableData = getTimetableForClass(grade, classNumber);
  
  if (!timetableData || timetableData.data.length === 0) {
    return NextResponse.json(
      { 
        message: `No timetable found for grade ${grade}, class ${classNumber}`,
        data: []
      }, 
      { status: 404 }
    );
  }

  // Format timetable data for response
  const formattedData = formatTimetableResponse(timetableData.data);

  return NextResponse.json({
    grade,
    classNumber,
    timetable: formattedData
  });
}

/**
 * Type for a timetable entry
 */
interface TimetableEntry {
  period: number;
  subject: string;
  teacher: string;
  room: string;
}

/**
 * Format the timetable data into a more structured response
 */
function formatTimetableResponse(data: Record<string, string>[]) {
  // Group by day
  const groupedByDay: Record<string, TimetableEntry[]> = {};
  
  data.forEach(entry => {
    const day = entry.day;
    
    if (!groupedByDay[day]) {
      groupedByDay[day] = [];
    }
    
    groupedByDay[day].push({
      period: parseInt(entry.period, 10),
      subject: entry.subject,
      teacher: entry.teacher,
      room: entry.room
    });
  });
  
  // Sort periods for each day
  Object.keys(groupedByDay).forEach(day => {
    groupedByDay[day].sort((a: TimetableEntry, b: TimetableEntry) => a.period - b.period);
  });
  
  return groupedByDay;
}
