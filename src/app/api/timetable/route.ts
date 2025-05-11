import { NextResponse } from "next/server";
import { parseCSV } from "@/utils/csvParser";
// import { TimetableOverviewResponse } from "@/types/timetable";
import path from "path";
import fs from "fs";

/**
 * API route handler for general timetable information
 * Route: /api/timetable
 */
export async function GET() {
  // Check if timetable file exists
  const filePath = path.join(process.cwd(), 'public', 'timetables', 'mocking.csv');
  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: "Timetable data not found" }, 
      { status: 404 }
    );
  }

  // Parse CSV to get all data
  const timetableData = parseCSV(filePath);
  
  // Extract unique grade-class combinations
  const gradeClassMap: Record<string, number[]> = {};
  
  timetableData.data.forEach(entry => {
    const grade = parseInt(entry.grade, 10);
    const classNum = parseInt(entry.class, 10);
    
    if (!isNaN(grade) && !isNaN(classNum)) {
      if (!gradeClassMap[grade]) {
        gradeClassMap[grade] = [];
      }
      
      if (!gradeClassMap[grade].includes(classNum)) {
        gradeClassMap[grade].push(classNum);
      }
    }
  });
  
  // Sort the classes in each grade
  Object.keys(gradeClassMap).forEach(grade => {
    gradeClassMap[grade].sort((a, b) => a - b);
  });
  
  // Structure for response
  const response = {
    availableGrades: Object.keys(gradeClassMap).map(g => parseInt(g, 10)).sort(),
    gradeClassMap: gradeClassMap,
    juniorHighSchool: {
      grades: [1, 2, 3],
      classesPerGrade: 17
    },
    seniorHighSchool: {
      grades: [4, 5, 6],
      classesPerGrade: 16
    }
  };
  
  return NextResponse.json(response);
}
