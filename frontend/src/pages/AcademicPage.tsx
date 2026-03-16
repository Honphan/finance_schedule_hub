import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Course, Timetable } from '../types';

export default function AcademicPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [timetables, setTimetables] = useState<Timetable[]>([]);

  useEffect(() => {
    fetchAcademicData();
  }, []);

  const fetchAcademicData = async () => {
    try {
      // In a real scenario, we might do Promise.all
      // const [courseRes, timetableRes] = await Promise.all([api.get('/courses'), api.get('/timetables')]);
      
      // Using dummy data for immediate visuals
      setCourses([
        { id: 1, name: 'Data Structures', credits: 4, lecturer: 'Dr. Jane Smith', semester: { id: 1, name: 'Spring 2026', startDate: '', endDate: '' } },
        { id: 2, name: 'Calculus III', credits: 3, lecturer: 'Prof. John Doe', semester: { id: 1, name: 'Spring 2026', startDate: '', endDate: '' } },
        { id: 3, name: 'Artificial Intelligence', credits: 4, lecturer: 'Dr. Alan Turing', semester: { id: 1, name: 'Spring 2026', startDate: '', endDate: '' } },
      ]);
      setTimetables([
        { id: 1, dayOfWeek: 'MONDAY', period: 1, room: 'A1-201', course: { id: 1, name: 'Data Structures', credits: 4, lecturer: '', semester: { id: 1, name: '', startDate: '', endDate: '' } } },
        { id: 2, dayOfWeek: 'WEDNESDAY', period: 2, room: 'A1-201', course: { id: 1, name: 'Data Structures', credits: 4, lecturer: '', semester: { id: 1, name: '', startDate: '', endDate: '' } } },
        { id: 3, dayOfWeek: 'TUESDAY', period: 1, room: 'B2-104', course: { id: 2, name: 'Calculus III', credits: 3, lecturer: '', semester: { id: 1, name: '', startDate: '', endDate: '' } } },
        { id: 4, dayOfWeek: 'THURSDAY', period: 3, room: 'C1-305', course: { id: 3, name: 'Artificial Intelligence', credits: 4, lecturer: '', semester: { id: 1, name: '', startDate: '', endDate: '' } } },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const periods = [1, 2, 3, 4, 5]; // e.g. 1: 08:00, 2: 10:00, 3: 13:00, 4: 15:00, 5: 17:00

  // Helper to find a specific course by time and day
  const getTimetableForSlot = (day: string, period: number) => {
    return timetables.find(t => t.dayOfWeek === day && t.period === period);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Academic</h2>
        <div className="flex gap-2">
          <Button variant="outline">Add Course</Button>
          <Button>Add Timetable</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Timetable</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm text-center border-collapse">
            <thead>
              <tr className="bg-muted">
                <th className="border p-3 font-semibold text-muted-foreground w-20">Period</th>
                {days.map(day => (
                  <th key={day} className="border p-3 font-semibold text-muted-foreground min-w-[140px]">{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map(period => (
                <tr key={period} className="even:bg-muted/30">
                  <td className="border p-3 font-medium text-muted-foreground bg-muted/50">
                    P{period}
                  </td>
                  {days.map(day => {
                    const slot = getTimetableForSlot(day, period);
                    return (
                      <td key={`${day}-${period}`} className="border p-2 min-h-[80px]">
                        {slot ? (
                          <div className="flex flex-col h-full w-full justify-center bg-primary/10 rounded-md p-2 border border-primary/20 text-left">
                            <span className="font-semibold text-primary block truncate">{slot.course.name}</span>
                            <span className="text-xs text-muted-foreground mt-1">Room: {slot.room}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground/30 text-xs">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>My Courses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Course Name</th>
                  <th className="px-4 py-3 font-medium">Credits</th>
                  <th className="px-4 py-3 font-medium">Lecturer</th>
                </tr>
              </thead>
              <tbody>
                {courses.map(course => (
                  <tr key={course.id} className="border-t hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 font-medium">{course.name}</td>
                    <td className="px-4 py-3">{course.credits}</td>
                    <td className="px-4 py-3 text-muted-foreground">{course.lecturer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
