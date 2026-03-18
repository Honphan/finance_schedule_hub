import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TaskStatus } from '../types';
import type { TaskEvent } from '../types';
import { toast } from 'sonner';

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskEvent[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDeadline, setFormDeadline] = useState('');
  const [formType, setFormType] = useState('Academic');

  useEffect(() => {
    setTasks([
      { id: 1, title: 'Database Design', description: 'Design ERD for project', deadline: '2026-03-20', status: TaskStatus.PENDING, type: 'Academic' },
      { id: 2, title: 'Pay Rent', description: 'Transfer rent to landlord', deadline: '2026-03-31', status: TaskStatus.IN_PROGRESS, type: 'Finance' },
      { id: 3, title: 'Midterm Prep', description: 'Review chapters 1-5', deadline: '2026-03-18', status: TaskStatus.DONE, type: 'Academic' },
      { id: 4, title: 'Team Meeting', description: 'Discuss milestone 1', deadline: '2026-03-14', status: TaskStatus.MISSED, type: 'Other' },
    ]);
  }, []);

  const moveTask = (id: number, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const resetForm = () => {
    setFormTitle('');
    setFormDescription('');
    setFormDeadline('');
    setFormType('Academic');
  };

  const handleSaveTask = () => {
    if (!formTitle || !formDeadline) {
      toast.error('Vui lòng điền tiêu đề và deadline.');
      return;
    }
    const newTask: TaskEvent = {
      id: Date.now(),
      title: formTitle,
      description: formDescription,
      deadline: formDeadline,
      status: TaskStatus.PENDING,
      type: formType,
    };
    setTasks(prev => [newTask, ...prev]);
    toast.success(`Task "${formTitle}" added!`);
    setDialogOpen(false);
    resetForm();
  };

  const columns = [
    { title: 'Pending', status: TaskStatus.PENDING, color: 'border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-900/20' },
    { title: 'In Progress', status: TaskStatus.IN_PROGRESS, color: 'border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-900/20' },
    { title: 'Done', status: TaskStatus.DONE, color: 'border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-900/20' },
    { title: 'Missed', status: TaskStatus.MISSED, color: 'border-rose-200 bg-rose-50/50 dark:border-rose-900 dark:bg-rose-900/20' },
  ];

  const getTasksByStatus = (status: TaskStatus) => tasks.filter(t => t.status === status);

  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Tasks & Events</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>Add Task</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Task</DialogTitle>
              <DialogDescription>Create a new task or event.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="task-title">Title</Label>
                <Input
                  id="task-title"
                  placeholder="e.g. Database Design"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="task-desc">Description</Label>
                <Textarea
                  id="task-desc"
                  placeholder="Describe the task..."
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="task-deadline">Deadline</Label>
                  <Input
                    id="task-deadline"
                    type="date"
                    value={formDeadline}
                    onChange={e => setFormDeadline(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select value={formType} onValueChange={setFormType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Academic">Academic</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => { setDialogOpen(false); resetForm(); }}>Cancel</Button>
              <Button onClick={handleSaveTask}>Save Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-start">
        {columns.map(col => (
          <div key={col.status} className={`flex flex-col rounded-lg border ${col.color} p-4 min-h-[500px] h-full`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{col.title}</h3>
              <span className="bg-background/80 text-foreground text-xs font-semibold px-2 py-1 rounded-full border">
                {getTasksByStatus(col.status).length}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {getTasksByStatus(col.status).map(task => (
                <Card key={task.id} className="shadow-sm border-muted-foreground/20 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-colors">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-base font-semibold leading-tight">{task.title}</CardTitle>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {task.type}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 pb-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                    <div className="mt-2 text-xs font-medium text-foreground/80 flex items-center gap-1">
                      <span>Due:</span>
                      <span className={new Date(task.deadline) < new Date() && task.status !== TaskStatus.DONE ? 'text-rose-500' : ''}>
                        {task.deadline}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-2 pt-0 flex flex-wrap gap-1 border-t bg-muted/20">
                    {task.status !== TaskStatus.PENDING && (
                      <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={() => moveTask(task.id, TaskStatus.PENDING)}>To Pending</Button>
                    )}
                    {task.status !== TaskStatus.IN_PROGRESS && (
                      <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={() => moveTask(task.id, TaskStatus.IN_PROGRESS)}>To In Progress</Button>
                    )}
                    {task.status !== TaskStatus.DONE && (
                      <Button variant="ghost" size="sm" className="h-7 text-xs px-2 text-emerald-600 dark:text-emerald-400" onClick={() => moveTask(task.id, TaskStatus.DONE)}>Done</Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
              
              {getTasksByStatus(col.status).length === 0 && (
                <div className="text-center p-4 border border-dashed rounded-lg text-muted-foreground text-sm opacity-60">
                  No tasks
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
