import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Pencil, Trash2, Plus } from 'lucide-react';
import type { Course, Timetable } from '../types';
import { api } from '@/services/api';

export default function AcademicPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [timetables, setTimetables] = useState<Timetable[]>([]);

  // Course dialog
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [courseCredits, setCourseCredits] = useState('');
  const [courseLecturer, setCourseLecturer] = useState('');

  // Timetable dialog
  const [ttDialogOpen, setTtDialogOpen] = useState(false);
  const [ttCourseId, setTtCourseId] = useState('');
  const [ttDay, setTtDay] = useState('');
  const [ttPeriod, setTtPeriod] = useState('');
  const [ttRoom, setTtRoom] = useState('');
  const [editingTtId, setEditingTtId] = useState<number | null>(null);

  useEffect(() => {
    fetchAcademicData();
  }, []);

  const fetchAcademicData = async () => {
    try {
      const { data } = await api.get('/courses');
      setCourses(data);
      const res = await api.get('/timetables');
      console.log(res);
    } catch (err) {
      console.error(err);
    }
  };

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const periods = [1, 2, 3, 4];

  const getTimetableForSlot = (day: string, period: number) => {
    return timetables.find(t => t.dayOfWeek === day && t.period === period);
  };

  // ---- Course Dialog Handlers ----
  const resetCourseForm = () => {
    setCourseName('');
    setCourseCredits('');
    setCourseLecturer('');
  };

  const handleSaveCourse = async () => {
    if (!courseName || !courseCredits) {
      toast.error('Vui lòng điền tên và số tín chỉ.');
      return;
    }

    try {
      await api.post('/courses', {
        name: courseName,
        credits: parseInt(courseCredits),
        lecturer: courseLecturer,
      });

      toast.success(`Course "${courseName}" added!`);
      setCourseDialogOpen(false);
      resetCourseForm();
      fetchAcademicData();
    } catch (err) {
      console.error(err);
      toast.error('Failed to add course.');
    }

  };

  // ---- Timetable Dialog Handlers ----
  const resetTtForm = () => {
    setTtCourseId('');
    setTtDay('');
    setTtPeriod('');
    setTtRoom('');
    setEditingTtId(null);
  };

  const openTtDialogForSlot = (day: string, period: number) => {
    resetTtForm();
    setTtDay(day);
    setTtPeriod(String(period));
    setTtDialogOpen(true);
  };

  const openTtDialogForEdit = (tt: Timetable) => {
    setEditingTtId(tt.id);
    setTtCourseId(String(tt.course.id));
    setTtDay(tt.dayOfWeek);
    setTtPeriod(String(tt.period));
    setTtRoom(tt.room);
    setTtDialogOpen(true);
  };

  const handleDeleteTimetable = (id: number) => {
    setTimetables(prev => prev.filter(t => t.id !== id));
    toast.success('Timetable entry deleted!');
  };

  const handleSaveTimetable = () => {
    if (!ttCourseId || !ttDay || !ttPeriod || !ttRoom) {
      toast.error('Vui lòng điền đầy đủ thông tin.');
      return;
    }
    const selectedCourse = courses.find(c => c.id === parseInt(ttCourseId));
    if (!selectedCourse) {
      toast.error('Course not found.');
      return;
    }

    // Check for conflict (different entry at same slot)
    const conflict = timetables.find(t => t.dayOfWeek === ttDay && t.period === parseInt(ttPeriod) && t.id !== editingTtId);
    if (conflict) {
      toast.error(`Slot ${ttDay} P${ttPeriod} is already taken by "${conflict.course.name}".`);
      return;
    }

    const entry: Timetable = {
      id: editingTtId || Date.now(),
      dayOfWeek: ttDay,
      period: parseInt(ttPeriod),
      room: ttRoom,
      course: selectedCourse,
    };

    if (editingTtId) {
      setTimetables(prev => prev.map(t => t.id === editingTtId ? entry : t));
      toast.success('Timetable entry updated!');
    } else {
      setTimetables(prev => [...prev, entry]);
      toast.success('Timetable entry added!');
    }
    setTtDialogOpen(false);
    resetTtForm();
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Academic</h2>
        <div className="flex gap-2">
          {/* Add Course Dialog */}
          <Dialog open={courseDialogOpen} onOpenChange={(open) => { setCourseDialogOpen(open); if (!open) resetCourseForm(); }}>
            <DialogTrigger asChild>
              <Button variant="outline">Add Course</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Course</DialogTitle>
                <DialogDescription>Enter course details.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="course-name">Course Name</Label>
                  <Input id="course-name" placeholder="e.g. Data Structures" value={courseName} onChange={e => setCourseName(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="course-credits">Credits</Label>
                    <Input id="course-credits" type="number" placeholder="3" value={courseCredits} onChange={e => setCourseCredits(e.target.value)} />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="course-lecturer">Lecturer</Label>
                    <Input id="course-lecturer" placeholder="Dr. Smith" value={courseLecturer} onChange={e => setCourseLecturer(e.target.value)} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setCourseDialogOpen(false); resetCourseForm(); }}>Cancel</Button>
                <Button onClick={handleSaveCourse}>Save Course</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Timetable Dialog */}
          <Dialog open={ttDialogOpen} onOpenChange={(open) => { setTtDialogOpen(open); if (!open) resetTtForm(); }}>
            <DialogTrigger asChild>
              <Button>Add Timetable</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{editingTtId ? 'Edit Timetable Entry' : 'Add Timetable Entry'}</DialogTitle>
                <DialogDescription>Select a course and assign it to a time slot.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Course</Label>
                  <Select value={ttCourseId} onValueChange={setTtCourseId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(c => (
                        <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Day of Week</Label>
                    <Select value={ttDay} onValueChange={setTtDay}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map(d => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Period</Label>
                    <Select value={ttPeriod} onValueChange={setTtPeriod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        {periods.map(p => (
                          <SelectItem key={p} value={String(p)}>P{p}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tt-room">Room</Label>
                  <Input id="tt-room" placeholder="e.g. A1-201" value={ttRoom} onChange={e => setTtRoom(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => { setTtDialogOpen(false); resetTtForm(); }}>Cancel</Button>
                <Button onClick={handleSaveTimetable}>{editingTtId ? 'Update' : 'Save'}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                          <div className="group relative flex flex-col h-full w-full justify-center bg-primary/10 rounded-md p-2 border border-primary/20 text-left">
                            <span className="font-semibold text-primary block truncate">{slot.course.name}</span>
                            <span className="text-xs text-muted-foreground mt-1">Room: {slot.room}</span>
                            {/* Edit / Delete hover actions */}
                            <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
                              <button
                                onClick={() => openTtDialogForEdit(slot)}
                                className="p-1 rounded hover:bg-primary/20 text-primary transition-colors"
                                title="Edit"
                              >
                                <Pencil className="size-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteTimetable(slot.id)}
                                className="p-1 rounded hover:bg-destructive/20 text-destructive transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => openTtDialogForSlot(day, period)}
                            className="w-full h-full min-h-[60px] flex items-center justify-center rounded-md border border-dashed border-transparent hover:border-primary/30 hover:bg-primary/5 transition-colors group/empty"
                            title="Add entry here"
                          >
                            <Plus className="size-4 text-muted-foreground/30 group-hover/empty:text-primary/50 transition-colors" />
                          </button>
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
